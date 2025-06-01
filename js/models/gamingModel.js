import {getLoggedInTotal, getLoggedInPoints} from '../models/userModel.js'

let randomNumb = () => {
   let min = 0;
   let max = 2;
   let i = Math.floor(Math.random() * (max- min + 1) + min);
   return i 
}

export let hitRate = async () => {
    const pontos = await getLoggedInPoints()
    const total = await getLoggedInTotal()
    const hitRate = 100 * parseInt(pontos) / parseInt(total);
    return parseInt(hitRate)
}

export let getImage = async () => {
    let res = await fetch("http://localhost:3000/gamificacao")
    let images = await res.json();
    let decider = randomNumb();
    const myImg = images.find(img => parseInt(img.id) == decider)
    return myImg
}