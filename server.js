// Dependencies
var express = require("express");
var fs = require("fs");
var path = require("path");
// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8080;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes - to display and edit notes
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

var dbData = fs.readFileSync('./db/db.json');
var notesData = JSON.parse(dbData);
//
app.get("/api/notes", function(req, res){
    return res.json(notesData);
});

// app.get("/api/notes/:note", function(req,res){
//     var chosen = req.params.note;
//   for (var i = 0; i < notesData.length; i++) {
//     if (chosen === notesData[i].title) {
//       return res.json(notesData[i]);
//     }
//   }
//   return res.json(false); 
// });

// Creating new note
app.post("/api/notes", function(req,res){
    var newNote = req.body;
    newNote.id = notesData.length + 5;
    notesData.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notesData));

    res.json(newNote);
});
// Deleting note
app.delete("/api/notes/:id", function(req,res){
    var chosen = req.params.id;
    for(var i=0; i< notesData.length; i++) {
        if(notesData[i].id == chosen){
           notesData.splice(i,1); 
        }
    };
    fs.writeFileSync('./db/db.json', JSON.stringify(notesData));
    res.json(notesData)
})
// Basic route to the home page
app.get("*", function(req,res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on: http://localhost:" + PORT);
});
  