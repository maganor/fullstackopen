const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req['body']))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const found = persons.find(person => person.id === id)
    if(found) {
        response.json(found)
    } else {
        response.status(404).end()
    }
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    console.log(body)
    let found = persons.find(person => person.name === body.name)
    if(!body.name || !body.number) {
        return response.status(400).json({error: "Name or number missing"})
    } else if(found){
        return response.status(400).json({error: "That name already exists"})
    }
    let newPerson = {
        id: String(Math.floor(Math.random() * 10000)),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    response.status(200).json(newPerson)
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