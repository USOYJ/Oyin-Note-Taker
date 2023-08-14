const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const { v4: uuidv4 } = require("uuid");

// Sets up the Express app to handle data parsing   
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================
// Basic route that sends the user first to the AJAX Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
    }
);  

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
    }
);

// Displays all notes   

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
}       
);

// Create New Notes - takes in JSON input   
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
}
);

// Delete Notes
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNotes = notes.filter((note) => note.id !== id);
        fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
            if (err) throw err;
            res.json(newNotes);
        });
    });
}   
);

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
}   
);

