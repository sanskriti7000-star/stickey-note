// content.js - Whimsy Notes — Neo-Brutalist

const PAGE_KEY = "whimsy_" + location.href;

// ── Utilities ─────────────────────────────────────────────────────────────────

function saveNotes(notes) {
    chrome.storage.local.set({ [PAGE_KEY]: notes });
}

function loadNotes(callback) {
    chrome.storage.local.get([PAGE_KEY], (result) => {
        callback(result[PAGE_KEY] || []);
    });
}

// ── Note Deletion ─────────────────────────────────────────────────────────────

function deleteNote(note, index) {
    note.classList.add("whimsy-note-exiting");
    note.addEventListener("animationend", () => {
        note.remove();
        loadNotes((notes) => {
            notes.splice(index, 1);
            saveNotes(notes);
        });
    }, { once: true });
}

// ── Note Creation ─────────────────────────────────────────────────────────────

function createNoteElement(noteData, index, allNotes) {
    const note = document.createElement("div");
    note.className = "whimsy-note";
    note.style.left = noteData.x + "px";
    note.style.top = noteData.y + "px";

    // Black header
    const header = document.createElement("div");
    header.className = "whimsy-note-header";

    const title = document.createElement("span");
    title.className = "whimsy-note-title";
    title.textContent = "Sticky Note";

    const closeBtn = document.createElement("button");
    closeBtn.className = "whimsy-note-close";
    closeBtn.textContent = "×";
    closeBtn.title = "Delete note";
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteNote(note, index);
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Textarea
    const textarea = document.createElement("textarea");
    textarea.className = "whimsy-note-textarea";
    textarea.placeholder = "Type your note here…";
    textarea.value = noteData.text || "";
    textarea.addEventListener("input", () => {
        noteData.text = textarea.value;
        saveNotes(allNotes);
    });
    textarea.addEventListener("mousedown", (e) => e.stopPropagation());

    note.appendChild(header);
    note.appendChild(textarea);

    // Drag via header
    let isDragging = false, startX, startY, origLeft, origTop;

    header.addEventListener("mousedown", (e) => {
        if (e.target === closeBtn) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        origLeft = parseInt(note.style.left) || 0;
        origTop = parseInt(note.style.top) || 0;
        note.classList.add("whimsy-dragging");
        document.body.style.userSelect = "none";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        note.style.left = (origLeft + (e.clientX - startX)) + "px";
        note.style.top = (origTop + (e.clientY - startY)) + "px";
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        note.classList.remove("whimsy-dragging");
        noteData.x = parseInt(note.style.left);
        noteData.y = parseInt(note.style.top);
        saveNotes(allNotes);
        document.body.style.userSelect = "";
    });

    return note;
}

// ── Spawn a new note ──────────────────────────────────────────────────────────

function spawnNote() {
    loadNotes((notes) => {
        const offset = (notes.length % 8) * 30;
        const newNote = {
            text: "",
            x: 80 + offset,
            y: 80 + offset,
        };
        notes.push(newNote);
        saveNotes(notes);
        const el = createNoteElement(newNote, notes.length - 1, notes);
        document.body.appendChild(el);
        el.querySelector("textarea").focus();
    });
}

// ── Inject persistent floating add button ─────────────────────────────────────

(function injectFAB() {
    // Avoid injecting twice (e.g. on dynamic SPA navigation)
    if (document.getElementById("whimsy-fab")) return;

    const fab = document.createElement("button");
    fab.id = "whimsy-fab";
    fab.className = "whimsy-fab";
    fab.title = "Add a sticky note";
    fab.innerHTML = `<span class="whimsy-fab-icon">＋</span> New Note`;
    fab.addEventListener("click", spawnNote);
    document.body.appendChild(fab);
})();

// ── Load saved notes on page load ─────────────────────────────────────────────

loadNotes((notes) => {
    notes.forEach((noteData, i) => {
        document.body.appendChild(createNoteElement(noteData, i, notes));
    });
});

// ── Extension toolbar icon click (still works as a shortcut) ─────────────────

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "addNote") {
        spawnNote();
    }
});
