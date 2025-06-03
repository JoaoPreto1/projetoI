import {getLoggedInTotal, getLoggedInPoints} from '../models/userModel.js'

let randomNumb = (min, max) => {
   let i = Math.floor(Math.random() * (max- min + 1) + min);
   return i 
}

export let hitRate = async () => {
    const pontos = await getLoggedInPoints()
    const total = await getLoggedInTotal()
    const hitRate = 100 * parseInt(pontos) / parseInt(total);
    return parseInt(hitRate) + '%'
}

export let hitRateLeaderBoard = async (pontos, total) => {
    const hitRate = 100 * parseInt(pontos) / parseInt(total);
    return parseInt(hitRate) + '%'
}

export let getImage = async () => {
    let res = await fetch("http://localhost:3000/gamificacao")
    let images = await res.json();
    let decider = randomNumb(0,2);
    const myImg = images.find(img => parseInt(img.id) == decider)
    return myImg
}

export let CalculateImages = async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    let percurso = user.percurso
    let res = await fetch('http://localhost:3000/gamificacao')
    let images = await res.json();
    let decider;
    let myImg;
    switch(percurso){
        case "Ainda por escolher" : 
            const max = images.length- 1
            decider = randomNumb(0, max);
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Caminho Francês" : 
            decider = randomNumb(3, 14)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Rota de O Cebreiro" : 
            decider = randomNumb(3, 5)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Rota de León a Santiago":
            decider = randomNumb(6, 8)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Rota de Roncesvalles":
            decider = randomNumb(9, 11)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Rota de Sarria a Santiago":
            decider = randomNumb(12, 14)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "caminho Português":
            decider = randomNumb(15, 23)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Caminho Central": 
            decider = randomNumb(15, 17)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Caminho da Costa": 
            decider = randomNumb(18, 20)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Caminho Interior":
            decider = randomNumb(21, 23)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Caminho Primitivo" : 
            decider = randomNumb(24, 29)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Rota de Oviedo":
            decider = randomNumb(24, 26)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        case "Rota de Lugo":
            decider = randomNumb(27, 29)
            myImg = images.find(img => parseInt(img.id) == decider)
            return myImg || null;
        default: 
            return null
    }
}

export let getTheObjGame = async (id) => {
    const res = await fetch(`http://localhost:3000/gamificacao/${parseInt(id)}`)
    let obj = await res.json()
    return obj
}