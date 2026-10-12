# QuickNotes — Application Architecture

## 1. Overview

QuickNotes is a browser-based application that allows users to load, create, and delete notes. The application uses HTML, CSS, and JavaScript on the client side and communicates with JSONPlaceholder through HTTP requests.

## 2. Main Components

### User Interface (`index.html`)

The HTML file defines the page structure, including the notes list, Load Notes button, note creation form, and status message area.

### Styling (`style.css`)

The CSS file controls the appearance and layout of the application, including the notes list, form fields, buttons, and status messages.

### API Client (`api.js`)

The JavaScript file handles user interactions and communication with the API. It contains functions for loading, creating, and deleting notes, as well as handling errors and displaying status messages.

### External API

JSONPlaceholder provides sample posts that the application displays as notes. It accepts GET, POST, and DELETE requests for demonstration purposes.

## 3. How the Components Work Together

1. The user opens the application in a browser.
2. The HTML and CSS files provide the interface and its appearance.
3. When the user clicks Load Notes, JavaScript sends a GET request to JSONPlaceholder.
4. The API returns a response, which JavaScript processes and displays in the notes list.
5. When the user submits the form, JavaScript validates the input and sends a POST request.
6. When the user clicks Delete, JavaScript sends a DELETE request for the selected note.
7. The application displays a status message based on the result of the request.

## 4. Error Handling

The reusable request function checks whether the HTTP response was successful. If the response indicates a failure, the function throws an error that can be handled by the calling function.

The interface displays an appropriate error message when a request fails. Request buttons are temporarily disabled while an operation is in progress.

## 5. Architecture Limitations

The application does not have its own backend or database. It communicates directly with JSONPlaceholder, which is intended for testing.

Although the application can display newly created notes and remove deleted notes from the page, these changes are not permanently stored by JSONPlaceholder.

## 6. Possible Improvements

Future versions could use a dedicated backend and database for persistent storage. User authentication, automated tests, and improved handling of network failures could also be added.
