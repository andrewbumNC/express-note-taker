const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
const notes = require("./db/db.json")
const uuid = require("./helper/uuid")
const util = require('util');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})


const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => 
  err ? console.error(err) : console.info(`\nData writtento ${destination}`)
  )

  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content)
        writeToFile(file, parsedData)
      }
    })
  };

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });


app.post('/api/notes', (req, res) => {

    console.info(`${req.method} request received to add notes`)

    const { title, text } = req.body

    console.log(title, text)

    if (title && text){

        const newNote = {
            title,
            text,
            id: uuid(),
            //might need to do a uuid()
        };
        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully') 
        
    } else {
        res.error('Error in adding note')
    }
})



//Render Existing Notes
//Why is this getitng ppushed to data and not err






app.listen(PORT, () => {
    console.log(`express app listening at http://localhost:${PORT} 🚀`)
});

