# QuickNotes — System Design Project

## 1. Overview

QuickNotes is a simple web application for viewing and managing notes through a REST API. Users can load existing notes, create a note with a title and optional body, and delete notes from the displayed list.

The project demonstrates how a browser-based application communicates with an API using JavaScript and HTTP requests.

## 2. Features

- **Load notes:** Retrieves up to 10 notes from the API using GET.
- **Create a note:** Sends the note title and body using POST.
- **Delete a note:** Sends a DELETE request and removes the note from the page when the request succeeds.
- **Input validation:** Requires a title and limits it to 100 characters.
- **Status messages:** Displays loading, success, and error messages to the user.
- **Reusable request function:** Handles API requests and checks HTTP response status codes.

## 3. Technologies

- HTML5 for the page structure
- CSS3 for styling
- JavaScript for application behaviour and API communication
- Fetch API for HTTP requests
- JSONPlaceholder for test data
- Git and GitHub for version control

## 4. API Endpoints

The application uses JSONPlaceholder as a test API.

Base URL: https://jsonplaceholder.typicode.com/posts

| Operation           | Method | Endpoint           |
| ------------------- | ------ | ------------------ |
| Load up to 10 notes | GET    | `/posts?_limit=10` |
| Create a note       | POST   | `/posts`           |
| Delete a note       | DELETE | `/posts/{id}`      |

The application checks the response status and displays a message to indicate whether an operation succeeded or failed.

**Data persistence:** JSONPlaceholder is a testing service. It simulates creating and deleting posts but does not permanently save these changes.

## 5. Project Structure

quicknotes-system-design/
├── index.html
├── style.css
├── api.js
├── README.md
└── docs/
├── api-design.md
├── architecture.md
└── data-model.md

## 6. System Design Documents

The `docs/` folder contains three supporting documents:

- `api-design.md` describes the API operations and their expected behaviour.
- `architecture.md` explains the main application components and how they interact.
- `data-model.md` describes the fields used to represent a note.

## 7. How to Run

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` through a local development server, such as the Live Server extension.
4. Click **Load notes** to retrieve notes from the API.
5. Use the form to create a note or the Delete button to remove a note from the displayed list.

An internet connection is required to access the API.

## 8. Limitations

- The application uses a public test API rather than a dedicated backend.
- Created and deleted posts are not permanently stored by JSONPlaceholder.
- The application does not implement user accounts or authentication.

## 9. Repository

GitHub: https://github.com/EssieDeny/quicknotes-system-design
