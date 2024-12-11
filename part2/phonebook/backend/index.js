const express = require("express")
const morgan = require("morgan")
const Person = require("./models/person")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.static("dist"))
app.use(express.json())

morgan.token("body", (req, res) => JSON.stringify(req["body"]))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted id"})
    } else if(error.name === "ValidationError") {
        return response.status(400).json({ error: error.message})
    }
    next(error)
}

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

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({ error: "Name or number missing" })
    }
    let newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get("/info", (request, response) => {
    Person.find({})
        .then(res => {
            const resp = `
            <p>Phonebook has info for ${res.length} people</p>
            <p>${new Date().toString()}</p>
            `
            response.send(resp)
        })
})

app.use(errorHandler)

const PORT = process.env.port || 3001

app.listen(PORT)