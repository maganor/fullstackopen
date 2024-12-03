import { useState, useEffect } from 'react'

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

const Persons = ({ persons }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number:'3434-34565456'}
  ])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/persons')
      .then(response => response.json())
      .then(json => setPersons(json))
  }, [])

  let newPersons = filter.length > 0 
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  const handleFilterChange = (event) => setFilter(event.target.value)
  
  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    let isAdded = false;
    const newPerson = {
      name: newName,
      number: newNumber
    }
    persons.forEach(person => {
      if(newPerson.name.toLowerCase() == person.name.toLowerCase()){
        isAdded = true
      }
    })

    if(isAdded) { alert(`${newPerson.name} is already added to phonebook`) } 
    else { setPersons(persons.concat(newPerson)) }
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilterChange}/>
      <PersonForm 
        onSubmit={addPerson} 
        nameChange={handleNameChange} numberChange={handleNumberChange} 
        name={newName} number={newNumber}/>
      <Persons persons={newPersons}/>
    </div>
  )
}

export default App