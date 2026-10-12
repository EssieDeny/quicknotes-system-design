
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

function showStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function setRequestButtonsDisabled(disabled) {
    loadButton.disabled = disabled;
    submitButton.disabled = disabled;

    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.disabled = disabled;
    });
}

// Reusable helper for API requests.
async function request(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`The server returned status ${response.status}.`);
    }

    if (response.status === 204) {
        return { data: null, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
}

function renderNote(note, prepend = false) {
    const item = document.createElement("li");
    item.className = "note-item";
    item.dataset.id = String(note.id);

    const heading = document.createElement("h3");
    heading.textContent = note.title || "(Untitled note)";

    const body = document.createElement("p");
    body.textContent = note.body || "No body provided.";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(note.id, item));

    item.append(heading, body, deleteButton);

    if (prepend) {
        notesList.prepend(item);
    } else {
        notesList.append(item);
    }
}

function showEmptyState() {
    if (notesList.children.length === 0) {
        const item = document.createElement("li");
        item.className = "empty-state";
        item.textContent = "No notes yet. Load notes or create your first note.";
        notesList.append(item);
    }
}

function clearEmptyState() {
    const emptyState = notesList.querySelector(".empty-state");
    if (emptyState) {
        emptyState.remove();
    }
}

// TASK 1: GET notes.
async function loadNotes() {
    setRequestButtonsDisabled(true);
    showStatus("Loading notes...", "loading");

    try {
        const result = await request(`${API_URL}?_limit=10`);
        notesList.replaceChildren();

        if (result.data.length === 0) {
            showEmptyState();
            showStatus("No notes were found.", "success");
            return;
        }

        result.data.forEach((note) => renderNote(note));
        showStatus(
            `Loaded ${result.data.length} notes from the server.`,
            "success"
        );
    } catch (error) {
        showStatus(
            `Could not load notes. ${error.message} Please try again.`,
            "error"
        );

        if (notesList.children.length === 0) {
            showEmptyState();
        }
    } finally {
        setRequestButtonsDisabled(false);
    }
}

// TASK 2: POST a new note.
async function createNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        showStatus("Please enter a title for your note.", "error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        showStatus(
            "The title must be 100 characters or fewer.",
            "error"
        );
        titleInput.focus();
        return;
    }

    setRequestButtonsDisabled(true);
    showStatus("Creating note...", "loading");

    try {
        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        clearEmptyState();
        renderNote(result.data, true);

        showStatus(
            `Note created (status ${result.status}, id ${result.data.id}).`,
            "success"
        );

        noteForm.reset();
    } catch (error) {
        showStatus(
            `Could not create the note. ${error.message} Please try again.`,
            "error"
        );
    } finally {
        setRequestButtonsDisabled(false);
    }
}

// TASK 3: DELETE a note.
async function deleteNote(id, noteItem) {
    setRequestButtonsDisabled(true);
    showStatus("Deleting note...", "loading");

    try {
        const result = await request(
            `${API_URL}/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        // JSONPlaceholder simulates changes but does not persist them.
        // Remove the note from this page after a successful simulated DELETE.
        noteItem.remove();
        showEmptyState();

        showStatus(
            `Note deleted (status ${result.status}).`,
            "success"
        );
    } catch (error) {
        showStatus(
            `Could not delete the note. ${error.message} Please try again.`,
            "error"
        );
    } finally {
        setRequestButtonsDisabled(false);
    }
}

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);