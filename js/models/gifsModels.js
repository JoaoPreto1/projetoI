import {randomNumb} from '../models/gamingModel.js'

export let getGifs = async (acertou) => {
    const res = await fetch('http://localhost:3000/gifs')
    const myGifs = await res.json()
    console.log(myGifs)
    try{
        if(acertou == true){
            const min = 1
            const max = 3
            let decider = randomNumb(min, max)
            for (let i = 0; i < max; i++){
                console.log(myGifs[i].id)
                console.log(decider)
                if(parseInt(myGifs[i].id) == decider){
                    console.log(myGifs[i].id)
                    return myGifs[i].url
            }
        }
        } else {
            const min = 4
            const max = 6
            let decider = randomNumb(min, max)
            for (let i = 3; i < max; i++){
                if(myGifs[i].id == decider){
                    console.log(myGifs[i].id)
                    return myGifs[i].url
                }
            }
        }
    } catch(err){
        console.error(err)
    }
}