import {randomNumb} from '../models/gamingModel.js'

export let getGifs = async (acertou) => {
    const res = await fetch('http://localhost:3000/gifs')
    const myGifs = await res.json()
    try{
        if(acertou == true){
            const min = 1
            const max = 3
            let decider = await randomNumb(min, max)
            for (let i = 0; i < max; i++){
                if(parseInt(myGifs[i].id) == decider){
                    return myGifs[i].url
            }
        }
        } else {
            const min = 4
            const max = 6
            let decider = await randomNumb(min, max)
            for (let i = 3; i < max; i++){
                if(myGifs[i].id == decider){
                    return myGifs[i].url
                }
            }
        }
    } catch(err){
        console.error(err)
    }
}