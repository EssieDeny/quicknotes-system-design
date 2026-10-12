# QuickNotes — Data Model

## 1. Overview

QuickNotes represents each note as a JavaScript object. The application uses the data returned by JSONPlaceholder and allows users to submit new note objects through the API.

## 2. Note Structure

A note contains the following fields:

| Field    | Data type | Description                                                          |
| -------- | --------- | -------------------------------------------------------------------- |
| `userId` | Number    | Identifies the user associated with the post in JSONPlaceholder.     |
| `id`     | Number    | Identifies the post. The API provides this field for existing posts. |
| `title`  | String    | Contains the note title.                                             |
| `body`   | String    | Contains the note text.                                              |

## 3. Example Note

```json id="m2zq8c"
{
  "userId": 1,
  "id": 1,
  "title": "My first note",
  "body": "This is an example note."
}
```

This example illustrates the structure of a post returned by JSONPlaceholder. The actual values depend on the request.

## 4. Creating a Note

When a user submits the form, the application reads the title and body fields.

Before sending the request, it removes leading and trailing whitespace from both values. It also checks that the title is not empty and does not exceed 100 characters.

The application sends the following fields in its POST request:

- `title`: the title entered by the user.
- `body`: the optional note text.
- `userId`: set to `1` in the current implementation.

JSONPlaceholder returns a response containing the submitted data and an ID for the simulated post.

## 5. Displaying Notes

The `renderNote()` function creates a list item for each note. It displays the title and body and adds a Delete button.

If a note has no title, the interface displays `(Untitled note)`. If it has no body, the interface displays `No body provided.`

The note ID is stored in the list item's `data-id` attribute and is also used when sending a DELETE request.

The application uses `textContent` to display note titles and bodies as text instead of interpreting them as HTML.

## 6. Data Persistence

The application does not maintain its own database. Notes are retrieved from JSONPlaceholder, and create and delete operations are simulated by the service.

Changes made during a session are reflected in the page, but they are not permanently stored by the API.

## 7. Possible Improvements

A future version could introduce a dedicated database, user-specific note ownership, persistent storage, and additional validation for note content.
