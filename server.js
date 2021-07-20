var PORT = process.env.PORT || 3001;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const notes = require('./db/db.json');
const path = require('path');
const {v4: uuidv4} = require("uuid")

//need fs
const fs = require('fs');

//set a root object to feed into express

var rootObj = { root: __dirname + '/public' };

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => res.sendFile('/index.html', rootObj));

app.get('/notes', (req, res) => res.sendFile('/notes.html', rootObj));

app.get("/", function(req, res) {
    res.json(path.join(__dirname, 'public/index.html'));
});

app.get('/api/notes', (req, res) => {
    console.log('/api/notespost')
    let json = getJson();
    console.log(json);
    res.json(json);
})

app.get('/api/notes', function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
        if (error) {
            return console.log(error)
        }
        console.log("This is Notes", data)
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res) => {
    console.log(req.body); console.log('-----')
    //let json = getJson();
    addNoteToJSON(req.body)
    res.json(getJson());
})

app.delete('/api/notes/:id', (req, res) => {
    console.log('api/notes/.iddelete')
    deleteNoteFromJSON(req.params.id);
    res.json(getJson());
})

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

function getJson() {
    let data = fs.readFileSync(__dirname + '/db/db.json');
    let json = JSON.parse(data);
    return json;
}
console.log('running');
function createNoteObject(data) {
    let obj = {
        title: data.title,
        text: data.text,
        complete: false,
        hidden: false
    }
    return obj
}

function addNoteToJSON(note) {
    let json = getJson();
    let newNote = createNoteObject(note);
    newNote.id = uuidv4()
    json.push(newNote);
    saveJSON(json);
}

function saveJSON(jsonData) {
    let data = JSON.stringify(jsonData);
    fs.writeFileSync(__dirname + '/db/db.json', data);
}

function deleteNoteFromJSON(id) {
    let json = getJson();
    json[id].hide = true
    saveJSON(json);
}

app.delete("/api/notes/:id", function (req, res) {
    const noteId = JSON.parse(req.params.id)
    console.log(noteId)
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
        if (error) {
            return console.log(error)
        }
        notes = JSON.parse(notes)

        notes = notes.filter(val => val.id !== noteId)

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
            if (error) {
                return error
            }
            res.json(notes)
        })
    })
})


app.put("/api/notes/:id", function (req, res) {
    const noteId = JSON.parse(req.params.id)
    console.log(noteId)
    fs.readFile(__dirname + "db/db.json", "utf8", function (error, notes) {
        if (error) {
            return console.log(error)
        }
        notes.JSONparse(notes)

        notes = notes.filter(val => val.id !== noteId)

        fs.writeFile(__dirname + "db/db.json", JSON.stringify(notes), function (error, data) {
            if (error) {
                return error
            }
            res.json(notes)
        })
    })
})