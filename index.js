require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app=express()
const Note = require('./models/note')
const note = require('./models/note')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

let notes = []

app.get('/',(request,response) => {
    response.send('<h1>API REST FROM NOTES</H1>')
})

app.get('/api/notes',(request,response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id',(request,response) => {
    Note.findById(request.params.id)
        .then( note => {
            if (note) {
                response.json(note)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error);
            response.status(400).send({error: 'malformated id'})
        })
})

app.delete('/api/notes/:id',(request,response) => {
    const id = Number(request.params.id)
    console.log('Delete id:', id);
    notes=notes.filter(n=> n.id !== id)
    response.status(204).end()
})

app.post('/api/notes',(request,response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const note = new Note( {
        content: body.content,
        important: body.important || false
    })
    note.save().then(result => response.json(result))
})

app.put('/api/notes/:id',(request,response) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(request.params.id,note,{new:true})
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

const PORT= process.env.PORT
app.listen(PORT, () => {
    console.log(`Server express running on port ${PORT}`);
})