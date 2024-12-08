const express = require('express')
const morgan = require('morgan')
const Person = require("./models/person")
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req['body']))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get("/api/persons", (request, response) => {
    Person.find({})
    .then(res => {
        response.json(res)
    })
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findById(id)
        .then(res => {
            response.json(res)
        })
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({error: "Name or number missing"})
    }
    let newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedNote => {
            response.json(savedNote)
        })
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get("/info", (request, response) => {
    const res = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toString()}</p>
        `
    response.send(res)
})


const PORT = process.env.port || 3001

app.listen(PORT)