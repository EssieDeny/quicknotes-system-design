# QuickNotes — API Design

## 1. Overview

QuickNotes is a note-taking service designed for users to create, view, update, organise and delete their notes. This document specifies the REST API that the production backend should implement.

The production API described here is a proposed design. The current browser application uses JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`) as a practice API; it does not yet connect to this production API.

### General conventions

- Base URL: `https://api.quicknotes.example/v1`
- Data format: JSON
- Authentication: Bearer token for protected endpoints
- Resource names: plural nouns
- HTTPS is required in production.
- Dates and times use ISO 8601 format in UTC.

## 2. Endpoint summary

| Method | Path                       | Description                           | Success status |
| ------ | -------------------------- | ------------------------------------- | -------------- |
| POST   | `/auth/register`           | Register a new user                   | 201 Created    |
| POST   | `/auth/login`              | Authenticate a user and issue a token | 200 OK         |
| GET    | `/notes`                   | List the authenticated user's notes   | 200 OK         |
| GET    | `/notes/{id}`              | Retrieve one note                     | 200 OK         |
| POST   | `/notes`                   | Create a note                         | 201 Created    |
| PATCH  | `/notes/{id}`              | Update selected fields of a note      | 200 OK         |
| DELETE | `/notes/{id}`              | Delete a note                         | 204 No Content |
| GET    | `/tags`                    | List the authenticated user's tags    | 200 OK         |
| PUT    | `/notes/{id}/tags/{tagId}` | Associate a tag with a note           | 200 OK         |

All endpoints except registration and login require a valid authentication token. A user may access only resources they are authorised to use.

## 3. Authentication

Protected requests include the following header:

`Authorization: Bearer <access_token>`

The backend validates the token and identifies the user. The server must not trust a client-supplied user ID to determine ownership of a note.

## 4. List notes

**Method:** `GET`

**Path:** `/notes`

**Purpose:** Returns notes belonging to the authenticated user. Pagination and search parameters allow the client to retrieve manageable result sets.

Example request:

`GET /v1/notes?limit=20&offset=0`

Example successful response — `200 OK`:

{
"data": [
{
"id": 42,
"title": "Shopping list",
"body": "Buy oats and lentils.",
"createdAt": "2026-10-12T09:00:00Z",
"updatedAt": "2026-10-12T09:00:00Z",
"tags": [
{
"id": 3,
"name": "Personal"
}
]
}
],
"pagination": {
"limit": 20,
"offset": 0,
"total": 1
}
}

An empty collection returns `200 OK` with an empty `data` array and a total of zero.

## 5. Retrieve one note

**Method:** `GET`

**Path:** `/notes/{id}`

**Purpose:** Returns one note owned by the authenticated user.

Example request:

`GET /v1/notes/42`

Example successful response — `200 OK`:

{
"id": 42,
"title": "Shopping list",
"body": "Buy oats and lentils.",
"createdAt": "2026-10-12T09:00:00Z",
"updatedAt": "2026-10-12T09:00:00Z"
}

If the note does not exist or is not accessible to the user, the API returns `404 Not Found`.

## 6. Create a note

**Method:** `POST`

**Path:** `/notes`

**Purpose:** Creates a note for the authenticated user.

Request header:

`Content-Type: application/json`

Example request body:

{
"title": "My first note",
"body": "This is a test note."
}

The title is required, must contain non-whitespace characters and must not exceed 100 characters. The body is optional. The backend derives the owner from the authenticated user rather than accepting `userId` from the request body.

Example successful response — `201 Created`:

{
"id": 101,
"title": "My first note",
"body": "This is a test note.",
"createdAt": "2026-10-12T10:00:00Z",
"updatedAt": "2026-10-12T10:00:00Z"
}

The response includes the new resource ID and a `Location: /v1/notes/101` header.

## 7. Update a note

**Method:** `PATCH`

**Path:** `/notes/{id}`

**Purpose:** Updates one or more fields of an existing note.

Example request body:

{
"title": "Updated shopping list"
}

Example successful response — `200 OK`:

{
"id": 101,
"title": "Updated shopping list",
"body": "This is a test note.",
"createdAt": "2026-10-12T10:00:00Z",
"updatedAt": "2026-10-12T10:30:00Z"
}

The backend checks ownership and validates any supplied fields before saving the update.

## 8. Delete a note

**Method:** `DELETE`

**Path:** `/notes/{id}`

**Purpose:** Permanently removes a note owned by the authenticated user.

Example request:

`DELETE /v1/notes/101`

Example successful response: `204 No Content`, with no response body.

A repeated deletion of a resource that no longer exists returns `404 Not Found` under this API's proposed convention.

## 9. Register a user

**Method:** `POST`

**Path:** `/auth/register`

**Purpose:** Creates a user account after validating the submitted details.

Example request body:

{
"email": "user@example.com",
"password": "a-strong-password"
}

Example successful response — `201 Created`:

{
"id": 7,
"email": "user@example.com"
}

Passwords must never be returned in API responses and must be stored using a suitable password-hashing algorithm. Production registration should also apply rate limits and appropriate account-verification controls.

## 10. Log in

**Method:** `POST`

**Path:** `/auth/login`

**Purpose:** Verifies credentials and issues an access token.

Example request body:

{
"email": "user@example.com",
"password": "a-strong-password"
}

Example successful response — `200 OK`:

{
"accessToken": "<access_token>",
"tokenType": "Bearer",
"expiresIn": 3600
}

Invalid credentials return `401 Unauthorized`. The API must not reveal whether a particular email address has an account.

## 11. List tags

**Method:** `GET`

**Path:** `/tags`

**Purpose:** Returns tags belonging to the authenticated user.

Example successful response — `200 OK`:

{
"data": [
{
"id": 3,
"name": "Personal"
},
{
"id": 4,
"name": "Research"
}
]
}

## 12. Assign a tag to a note

**Method:** `PUT`

**Path:** `/notes/{id}/tags/{tagId}`

**Purpose:** Associates an existing tag with an existing note owned by the authenticated user. Repeating the request does not create duplicate associations.

Example request:

`PUT /v1/notes/101/tags/3`

Example successful response — `200 OK`:

{
"noteId": 101,
"tagId": 3,
"message": "Tag associated with note."
}

The backend checks ownership of both resources before creating the association.

## 13. Error responses

The production API uses standard HTTP status codes to communicate failures.

| Status | Name                  | Meaning                                                                           |
| ------ | --------------------- | --------------------------------------------------------------------------------- |
| 400    | Bad Request           | Invalid JSON, missing title or invalid field values                               |
| 401    | Unauthorized          | Missing, invalid or expired authentication token                                  |
| 403    | Forbidden             | The authenticated user is not permitted to perform the operation                  |
| 404    | Not Found             | The requested resource does not exist or is not accessible                        |
| 409    | Conflict              | A resource conflicts with an existing resource, such as a duplicate account email |
| 422    | Unprocessable Content | The JSON is valid but fails a business validation rule                            |
| 429    | Too Many Requests     | The client has exceeded a rate limit                                              |
| 500    | Internal Server Error | An unexpected server-side failure                                                 |
| 503    | Service Unavailable   | The service is temporarily unavailable                                            |

Example error response — `400 Bad Request`:

{
"error": {
"code": "VALIDATION_ERROR",
"message": "The request contains invalid fields.",
"details": [
{
"field": "title",
"message": "Title is required and must be 100 characters or fewer."
}
],
"requestId": "req_example_123"
}
}

Error responses should use a consistent structure, avoid exposing stack traces or secrets, and include a request identifier where possible to support troubleshooting.

## 14. Design decisions

- **Resource-based URLs:** Notes and tags use plural nouns, and HTTP methods communicate the intended operation.
- **Appropriate status codes:** Creation uses `201 Created`, successful retrieval and updates use `200 OK`, and deletion uses `204 No Content`.
- **Pagination:** Listing notes supports `limit` and `offset` so clients do not need to load every note at once.
- **Authentication and ownership:** Protected resources are associated with the authenticated user, and ownership is checked on the server.
- **Validation:** Both client and server validate input; server-side validation is authoritative.
- **Consistent errors:** Clients receive structured errors that are useful without exposing internal implementation details.

## 15. Relationship to the current practice client

The current browser client uses JSONPlaceholder at `https://jsonplaceholder.typicode.com/posts` to demonstrate GET, POST and DELETE requests. JSONPlaceholder simulates writes and does not persist them as a production notes database would.

The proposed QuickNotes endpoints in this document describe the future backend contract. They are not implemented by the current JSONPlaceholder practice API.
