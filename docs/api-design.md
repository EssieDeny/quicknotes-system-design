# QuickNotes — API Design

## 1. Overview

QuickNotes uses the JSONPlaceholder REST API to retrieve, create, and delete notes. The API client is implemented in `api.js` using JavaScript's Fetch API and async/await.

Base URL:

`https://jsonplaceholder.typicode.com/posts`

## 2. API Operations

### GET — Load Notes

**Endpoint:** `/posts?_limit=10`

**Purpose:** Retrieves up to 10 posts from the API for display in the notes list.

**Expected response:** HTTP 200 OK, with a JSON array of posts.

Each post includes fields such as `userId`, `id`, `title`, and `body`.

### POST — Create a Note

**Endpoint:** `/posts`

**Purpose:** Sends a new note to the API.

**Request headers:**

`Content-Type: application/json; charset=UTF-8`

**Request body example:**

```json
{
  "title": "My first note",
  "body": "This is a test note.",
  "userId": 1
}
```

**Expected response:** HTTP 201 Created, with a JSON object representing the submitted post and an assigned ID.

The application requires a title and limits it to 100 characters before sending the request.

### DELETE — Delete a Note

**Endpoint:** `/posts/{id}`

**Purpose:** Sends a request to delete the selected post, where `{id}` is replaced by the post's ID.

**Expected response:** JSONPlaceholder normally responds with HTTP 200 OK for this simulated deletion.

After a successful response, the application removes the note from the displayed list.

## 3. Request Handling

The `request()` function is shared by all three operations. It:

1. Sends the HTTP request using `fetch()`.
2. Checks the response's `ok` property.
3. Throws an error if the response indicates an unsuccessful HTTP status.
4. Returns the parsed JSON data and HTTP status, or `null` data for a 204 response.

The calling functions use `try...catch...finally` to handle errors and restore the request buttons after an operation finishes.

## 4. Error Handling

If a request fails, the application displays an error message rather than reporting success.

The application also displays loading messages while requests are in progress. The Load Notes and Create Note buttons, along with the visible Delete buttons, are disabled during a request.

## 5. Limitations

JSONPlaceholder is a testing API, not a permanent storage service. POST and DELETE requests simulate changes, so created or deleted posts are not permanently saved.

The application does not currently include authentication, authorization, or a custom backend.

## 6. Potential Improvements

Future improvements could include request timeouts, automated API tests, stronger validation, and integration with a backend that permanently stores notes.
