const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const statusEl = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

function setStatus(message, type = "loading") {
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
}

async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response.status === 204) {
            return { status: 204 };
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function renderNotes(notes) {
    notesList.innerHTML = "";
    if (!notes || notes.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "No notes available.";
        notesList.appendChild(emptyLi);
        return;
    }

    notes.forEach(note => {
        const li = document.createElement("li");
        li.className = "note-item";
        li.dataset.id = note.id;

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";

        const h3 = document.createElement("h3");
        h3.textContent = note.title;

        const p = document.createElement("p");
        p.textContent = note.body;

        contentDiv.appendChild(h3);
        contentDiv.appendChild(p);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteNote(note.id, li));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

async function loadNotes() {
    loadBtn.disabled = true;
    setStatus("Loading notes...", "loading");

    try {
        const data = await request(`${API_URL}?_limit=10`);
        renderNotes(data);
        setStatus(`Loaded ${data.length} notes from the server.`, "success");
    } catch (error) {
        setStatus("Failed to load notes. Please check your connection and try again.", "error");
    } finally {
        loadBtn.disabled = false;
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
        setStatus("Title is required.", "error");
        return;
    }
    if (title.length > 100) {
        setStatus("Title must not exceed 100 characters.", "error");
        return;
    }

    submitBtn.disabled = true;
    setStatus("Creating note...", "loading");

    try {
        const newPost = {
            title,
            body,
            userId: 1
        };

        const result = await request(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(newPost)
        });

        const existingNotes = Array.from(notesList.children)
            .filter(li => li.dataset.id)
            .map(li => ({
                id: li.dataset.id,
                title: li.querySelector("h3").textContent,
                body: li.querySelector("p").textContent
            }));

        renderNotes([result, ...existingNotes]);
        setStatus(`Note created (status 201, id ${result.id || 101}).`, "success");
        
        noteForm.reset();
    } catch (error) {
        setStatus("Failed to create note. Please try again.", "error");
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteNote(id, listItemElement) {
    const deleteBtn = listItemElement.querySelector(".delete-btn");
    deleteBtn.disabled = true;
    setStatus("Deleting note...", "loading");

    try {
        /* 
          Note on JSONPlaceholder: 
          JSONPlaceholder simulates deletion successfully (returning status 200/204), 
          but it does not persistently modify or delete records on their remote server. 
          We handle this gracefully by removing the element instantly from the local DOM.
        */
        await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        listItemElement.remove();
        
        if (notesList.children.length === 0) {
            renderNotes([]);
        }
        
        setStatus(`Note ${id} deleted successfully.`, "success");
    } catch (error) {
        setStatus("Failed to delete note from server.", "error");
        deleteBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", handleFormSubmit);