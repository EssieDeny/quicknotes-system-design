# QuickNotes — System Design Project

## 1. Overview

QuickNotes is a simple web application for viewing and managing notes through a REST API. Users can load existing notes, create a note with a title and optional body, and delete notes from the displayed list.

This project demonstrates how a browser-based application communicates with an API using JavaScript and HTTP requests.

## 2. Features

- **Load notes:** Retrieves up to 10 notes from the API using GET.
- **Create a note:** Sends the note title and body using POST.
- **Delete a note:** Sends a DELETE request and removes the note from the page when the request succeeds.
- **Input validation:** Requires a title and limits it to 100 characters.
- **Status messages:** Displays loading, success, and error messages.
- **Reusable request function:** Handles API requests and checks HTTP response status codes.

## 3. Technologies

- HTML5 for page structure
- CSS3 for styling
- JavaScript for application behaviour and API communication
- Fetch API for HTTP requests
- JSONPlaceholder for test data
- Git and GitHub for version control

## 4. API Endpoints

The application uses JSONPlaceholder as a test API.

Base URL: [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)

| Operation           | Method | Endpoint           |
| ------------------- | ------ | ------------------ |
| Load up to 10 notes | GET    | `/posts?_limit=10` |
| Create a note       | POST   | `/posts`           |
| Delete a note       | DELETE | `/posts/{id}`      |

The application checks response status codes and displays messages indicating whether an operation succeeded or failed.

**Data persistence:** JSONPlaceholder is a testing service. It simulates creating and deleting posts, but these changes are not permanently saved.

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

- [API Design](docs/api-design.md) — describes the proposed REST API endpoints, request and response examples, and error handling.
- [System Architecture](docs/architecture.md) — explains the proposed architecture, scalability estimates, request flows, and reliability strategies.
- [Data Model](docs/data-model.md) — describes the database tables, relationships, SQL queries, indexes, and database design choices.

These documents describe a proposed production system. The current application uses JSONPlaceholder and does not implement the full production architecture.

## 7. How to Run

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using a local development server, such as the Live Server extension.
4. Click **Load notes** to retrieve notes from the API.
5. Use the form to create a note or the Delete button to remove a note from the displayed list.

An internet connection is required to access JSONPlaceholder.

## 8. Limitations

- The application uses a public test API rather than a dedicated backend.
- Created and deleted posts are not permanently stored by JSONPlaceholder.
- The application does not implement user accounts or authentication.
- The production architecture and database design are documentation exercises; their services are not implemented in the current application.

## 9. What I Learned

- **REST API communication:** How to use GET, POST, and DELETE requests with the JavaScript Fetch API.
- **Error handling:** How to check HTTP response status codes, handle failures, and provide clear feedback to users.
- **Input validation and safe rendering:** How to validate user input and use `textContent` to display text safely.
- **Database design:** How primary keys, foreign keys, relationships, and indexes support reliable data storage.
- **System architecture:** How caching, load balancing, read replicas, and background workers can help a system scale.
- **Version control:** How to use Git commits and GitHub to track and publish project changes.

## 10. Repository

[View QuickNotes on GitHub](https://github.com/EssieDeny/quicknotes-system-design)
