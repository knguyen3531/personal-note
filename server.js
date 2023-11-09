const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve the 'public' directory directly

const PORT = process.env.PORT || 3000;

// Define the path to the db.json file
const dbPath = path.join(__dirname, './db/db.json');

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  // Read the db.json file and return all saved notes as JSON
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  // Implementation for adding a new note to db.json
  // Read the db.json file
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }
    const notes = JSON.parse(data);
    // Add new note to the array of notes
    const newNote = { ...req.body, id: Date.now().toString() }; // Using Date.now() as a simple ID generator (not recommended for production)
    notes.push(newNote);

    // Write the new notes array back to db.json
    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).end();
      }
      res.json(newNote);
    });
  });
});

// Bonus: DELETE route for a note by id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).end();
    }
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).end();
      }
      res.status(204).end();
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
