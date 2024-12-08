const baseUrl = '/api/persons'

const getAll = () => {
    return fetch(baseUrl)
        .then(response => response.json())
}

const create = (newPerson) => {
    return fetch(baseUrl, {method: 'POST', headers: {"content-type": 'application/json'}, body: JSON.stringify(newPerson)})
        .then(response => response.json())
}

const update = (id, newPerson) => {
    return fetch(`${baseUrl}/${id}`, {method: "PUT", headers: {"content-type": 'application/json'}, body: JSON.stringify(newPerson)})
        .then(response => response.json())
}

const remove = (id) => {
    return fetch(`${baseUrl}/${id}`, {method: "DELETE"})
        .then(response => {
            if(response.ok){
                return response.json()
            }

            throw response.status
        })
}

export default {
    getAll, create, remove, update
}