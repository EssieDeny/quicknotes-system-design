# QuickNotes — Database Data Model

## 1. Overview

QuickNotes uses a relational SQL database to store users, notes, tags and the relationships between notes and tags. The design supports multiple users, private notes, reusable tags and efficient retrieval of a user's notes.

PostgreSQL is proposed as the production database. The schema below uses PostgreSQL-compatible SQL.

## 2. Entities and relationships

The database contains four entities:

- **users:** Stores account details for registered users.
- **notes:** Stores note content and identifies the user who owns each note.
- **tags:** Stores labels that users can apply to their notes.
- **note_tags:** Connects notes to tags through a junction table.

### Relationships

**Users to notes — one-to-many**

One user can own many notes, but each note belongs to one user. The `notes.user_id` foreign key references `users.id`.

**Users to tags — one-to-many**

One user can create many tags, but each tag belongs to one user. The `tags.user_id` foreign key references `users.id`.

**Notes to tags — many-to-many**

One note can have many tags, and one tag can be associated with many notes. The `note_tags` junction table implements this relationship using the `note_id` and `tag_id` foreign keys.

A composite primary key on `note_tags` prevents the same tag from being associated with the same note more than once.

## 3. Tables and columns

### 3.1 users

| Column        | Type                                | Constraints and purpose                                       |
| ------------- | ----------------------------------- | ------------------------------------------------------------- |
| id            | BIGINT GENERATED ALWAYS AS IDENTITY | Primary key                                                   |
| email         | VARCHAR(255)                        | Required; unique                                              |
| password_hash | VARCHAR(255)                        | Required; stores a password hash, never a plain-text password |
| created_at    | TIMESTAMPTZ                         | Required; account creation time                               |

### 3.2 notes

| Column     | Type                                | Constraints and purpose             |
| ---------- | ----------------------------------- | ----------------------------------- |
| id         | BIGINT GENERATED ALWAYS AS IDENTITY | Primary key                         |
| user_id    | BIGINT                              | Required; foreign key to `users.id` |
| title      | VARCHAR(100)                        | Required; cannot be blank           |
| body       | TEXT                                | Optional note content               |
| created_at | TIMESTAMPTZ                         | Required; creation time             |
| updated_at | TIMESTAMPTZ                         | Required; last update time          |

### 3.3 tags

| Column     | Type                                | Constraints and purpose             |
| ---------- | ----------------------------------- | ----------------------------------- |
| id         | BIGINT GENERATED ALWAYS AS IDENTITY | Primary key                         |
| user_id    | BIGINT                              | Required; foreign key to `users.id` |
| name       | VARCHAR(50)                         | Required; tag name                  |
| created_at | TIMESTAMPTZ                         | Required; creation time             |

A unique constraint on `(user_id, name)` prevents a user from creating duplicate tags with the same name.

### 3.4 note_tags

| Column      | Type        | Constraints and purpose                          |
| ----------- | ----------- | ------------------------------------------------ |
| note_id     | BIGINT      | Primary key component; foreign key to `notes.id` |
| tag_id      | BIGINT      | Primary key component; foreign key to `tags.id`  |
| assigned_at | TIMESTAMPTZ | Required; time the tag was assigned              |

The composite primary key is `(note_id, tag_id)`.

## 4. CREATE TABLE statements

The tables are created in dependency order so that referenced tables exist before their foreign keys are declared.

CREATE TABLE users (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id)
ON DELETE CASCADE,
title VARCHAR(100) NOT NULL
CHECK (LENGTH(TRIM(title)) > 0),
body TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id)
ON DELETE CASCADE,
name VARCHAR(50) NOT NULL
CHECK (LENGTH(TRIM(name)) > 0),
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT uq_tags_user_name UNIQUE (user_id, name)
);

CREATE TABLE note_tags (
note_id BIGINT NOT NULL REFERENCES notes(id)
ON DELETE CASCADE,
tag_id BIGINT NOT NULL REFERENCES tags(id)
ON DELETE CASCADE,
assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (note_id, tag_id)
);

The cascade rules remove a user's notes and tags when their account is deleted, and remove tag associations when a note or tag is deleted. Production account deletion should be handled through an authorised application workflow.

The `updated_at` column must be maintained by the application or a database trigger whenever a note is updated; its default alone does not automatically update it on subsequent changes.

## 5. Example SQL queries

### Query 1 — Retrieve a user's notes

This query returns the notes owned by a particular user, newest first.

SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 7
ORDER BY updated_at DESC
LIMIT 20 OFFSET 0;

The `user_id` value should come from the authenticated server-side user context, not from an untrusted client request.

### Query 2 — Retrieve notes and their tags (JOIN)

This query uses joins to retrieve a user's notes and their associated tags. Notes without tags are also included.

SELECT
n.id AS note_id,
n.title,
n.body,
t.id AS tag_id,
t.name AS tag_name
FROM notes AS n
LEFT JOIN note_tags AS nt
ON n.id = nt.note_id
LEFT JOIN tags AS t
ON nt.tag_id = t.id
WHERE n.user_id = 7
ORDER BY n.id, t.name;

The `LEFT JOIN` keeps notes in the result even when they do not yet have any tags.

### Query 3 — Count notes for each user

This query reports the number of notes owned by each user, including users with no notes.

SELECT
u.id AS user_id,
u.email,
COUNT(n.id) AS note_count
FROM users AS u
LEFT JOIN notes AS n
ON u.id = n.user_id
GROUP BY u.id, u.email
ORDER BY note_count DESC;

### Query 4 — Assign a tag to a note

This query creates a relationship between an existing note and an existing tag.

INSERT INTO note_tags (note_id, tag_id)
VALUES (101, 3)
ON CONFLICT (note_id, tag_id) DO NOTHING;

The application must first verify that the note and tag belong to the authenticated user. The composite primary key prevents duplicate associations.

## 6. Indexes

Indexes improve retrieval speed but use additional storage and increase the cost of writes.

CREATE INDEX idx_notes_user_updated
ON notes (user_id, updated_at DESC);

CREATE INDEX idx_note_tags_tag
ON note_tags (tag_id);

- **`idx_notes_user_updated`:** Supports the common operation of listing a user's notes ordered by most recently updated. The `user_id` filter and `updated_at` sort align with the index columns.
- **`idx_note_tags_tag`:** Helps retrieve notes associated with a particular tag. The primary key on `(note_id, tag_id)` already supports lookups beginning with `note_id`, but not equally efficient lookups beginning with `tag_id`.

The unique constraints and primary keys also create indexes in PostgreSQL. Indexes should be reviewed against actual query patterns and database performance measurements.

## 7. Why choose SQL rather than NoSQL?

A relational SQL database such as PostgreSQL is appropriate because QuickNotes has clear relationships between users, notes and tags. Foreign keys help maintain referential integrity, while transactions can ensure that related operations succeed or fail consistently. SQL joins make it straightforward to retrieve notes with their tags and aggregate note counts.

A document-oriented NoSQL database could store a note and its tags together, potentially simplifying some individual reads. However, duplicated tag data and relationships across users and notes would require additional consistency management. For this application, the structured relationships and integrity requirements make PostgreSQL a suitable starting choice. If traffic grows substantially, read replicas, caching, connection pooling and carefully selected indexes can help scale the service.

## 8. Security and integrity considerations

- Store password hashes using a suitable password-hashing algorithm; never store plain-text passwords.
- Enforce ownership checks in the backend for all note and tag operations.
- Use parameterised SQL queries to prevent SQL injection.
- Validate input in the backend even when the browser already validates it.
- Use database transactions when multiple related changes must succeed together.
- Back up the database and test restoration procedures.
- Use least-privilege database credentials and protect connection secrets.
