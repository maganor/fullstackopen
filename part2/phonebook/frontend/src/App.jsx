import phonebook from "./services/phonebook"
import { useState, useEffect } from 'react'

const Notification  = ({ message, type }) => {
  if(message === null || type === null) {
    return null
  }
  return (
    <div className={type}>{message}</div>
  )
}

const Filter = ({handleFilter, filter}) => {
  return (
    <div>
    filter shown with: <input value={filter} onChange={handleFilter}/>
  </div>
  )
}

const PersonForm = ({onSubmit, nameChange, numberChange, name, number}) => {
  return (
    <div>
      <h1>Add a new</h1>
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={name} onChange={nameChange}/>
        </div>
        <div>
          number: <input value={number} onChange={numberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map(person =>
          <li key={person.name}>{person.name} {person.number}<button onClick={() => handleDelete(person.id)}>delete</button></li>
          
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [typeMessage, setTypeMessage] = useState(null)

  useEffect(() => {
    phonebook.getAll()
      .then(allPersons => setPersons(allPersons))
  }, [])

  let newPersons = filter.length > 0 
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  const handleFilterChange = (event) => setFilter(event.target.value)
  
  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleDelete = (id) => {
    let response = confirm(`you sure you want to remove this person?`)
    if(response) {
      phonebook.remove(id)
      .then(deletedPerson => setPersons(persons.filter(person => person.name != deletedPerson.name)))
      .catch(() => {
        setMessage("Error deleting that person")
        setTypeMessage("error")
        setTimeout(() => {setMessage(null); setTypeMessage(null)}, 1000)
      }) 
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    let found = persons.find(person => newPerson.name.toLowerCase() == person.name.toLowerCase())

    if(found) { 
      let conf = confirm(`${newPerson.name} is already added to phonebook, replace old number with new one?`)
      if(conf) {
        phonebook.update(found.id, {...found, number: newNumber})
          .then(updated => setPersons(persons.map(person => person.id == updated.id ? {...person, number: updated.number} : person)))
      } 
    } 
    else { 
      phonebook.create(newPerson)
        .then(response => {
          setPersons(persons.concat(response))
        })
      setMessage(`Added ${newPerson.name}`)
      setTypeMessage("success")
      setTimeout(() => {setMessage(null); setTypeMessage(null)}, 1000)
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={typeMessage}/>
      <Filter filter={filter} handleFilter={handleFilterChange}/>
      <PersonForm 
        onSubmit={addPerson} 
        nameChange={handleNameChange} numberChange={handleNumberChange} 
        name={newName} number={newNumber}/>
      <Persons persons={newPersons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App