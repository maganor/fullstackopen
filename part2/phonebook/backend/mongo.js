const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log("Password required")
    process.exit(1)
}
else {
    const url = process.env.DB_URI

    mongoose.set('strictQuery', false)

    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })

    const Person = mongoose.model('Person', personSchema)

    if(process.argv.length == 3) {
        Person.find({})
            .then(result => {
                result.forEach(person => {
                    console.log(person.name, person.number)
                })
                mongoose.connection.close()
            })
    } else {
        const name = process.argv[3]
        const number = process.argv[4]

        const person = new Person({
            name, number
        })

        person.save()
            .then(result => {
                console.log(`Added ${name} number ${number} to phonebook`)
                mongoose.connection.close()
            })
    }
}
