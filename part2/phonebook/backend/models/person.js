const mongoose = require('mongoose')

const url = process.env.DB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log("connected succesfully")
    })
    .catch(error => {
        console.log("Error connecting to the database", error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person