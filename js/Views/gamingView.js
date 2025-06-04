import {hitRateLeaderBoard, CalculateImages, getTheObjGame} from '../models/gamingModel.js'
import {countPoints} from '../models/userModel.js'
import {obterUtilizadores} from '../models/gerirUserModel.js'
import {getGifs} from '../models/gifsModels.js'

document.addEventListener("DOMContentLoaded", function () {
            const loginButton = document.getElementById("loginButton");
            const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
            if (user) {
                
                loginButton.outerHTML = `
                    <a id="profileIcon" class="nav-link" href="perfil.html">
                        <img src="user-icon.png" alt="Perfil" style="width: 35px; height: 35px; border-radius: 50%;">
                    </a>
                `;
            }
        });
const initBtn = document.querySelector('#initBtn');

initBtn.addEventListener('click', () => {
     carregarImagens()
 })

 const carregarImagens = async () => {
    const gamificacaoContainer = document.getElementById('gamificacaoContainer')

    const existingPopup = document.getElementById('myPopup');
    if (existingPopup) existingPopup.remove();

    try {
        const myImg = await CalculateImages()
        const card = `
        <div id="myPopup" style="display: block; position: fixed; width:80vw; height: 80vh; top: 20%; left: 50%; transform: translate(-50%, -20%); padding: 20px; border: 0px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000; padding:0">
            <div id="myClosePopUpContainer" style="display:flex; justify-content: flex-end; background-color: white; width:80vw; border:0px;">
                <button id="myCloseBtn" onclick="closeMyPopUp()" style="background-color:white; color:black; font-size: .7em; text-align:center; width: 2.7vw; height: 2.5vh; border:0px; border-radius: 5px; cursor: pointer;">X</button>
            </div>
            <div id="MyPopUpContainer" style="display:flex; flex-direction: column; align-items:center; justify-content: space-around; width:80vw; background-color: white; border:0px;">   
                <h1 style="color:black; border:0px;">Adivinha o que está na imagem!</h1>
                <img src="${myImg.url}" style= "width:60vw; height:60vh; loading="lazy">
                <div style="display:flex; padding: 50px; flex-direction: row; justify-content: space-around; width: 80vw;">  
                    <input id='myAnswer' type= 'text' placeholder="Escreve aqui a tua resposta" style="height: 3vh; width: 15vw; font-size:1rem">
                    <button class="btn-iniciar" onclick="closePopUp('${myImg.id}')">Adivinhar</button>
                </div>  
            </div>
        </div> 
        `;
        gamificacaoContainer.innerHTML += card;
        const myCloseBtn = document.querySelector('#myCloseBtn');
    
        myCloseBtn.addEventListener('mouseenter', () =>{
            myCloseBtn.style.backgroundColor = '#e32717';
            myCloseBtn.style.color = 'white';
        })
    
        myCloseBtn.addEventListener('mouseleave', () =>{
            myCloseBtn.style.backgroundColor = 'white';
             myCloseBtn.style.color = 'black';
        })
    } catch (err) {
        console.error("Erro ao carregar os caminhos:", err)
    }
}
let myCOC = document.getElementById('containerOfContainer')
let gameContainer = document.getElementById('myPopUpContainer')
let containerGaming = document.getElementById('containerGaming')
let closePopUp = async (id) =>  {
    const myObj = await getTheObjGame(id)
    let urGuess = document.querySelector('#myAnswer').value;
    let acertou = true
    containerGaming.style.display = 'none'
    myLeaderboardBtn.style.display = 'none'
   if( urGuess.toLowerCase() === myObj.nome.toLowerCase() ){
      const url = await getGifs(acertou)
      console.log(url)
      myCOC.style.display = 'flex'
      myCOC.style.justifyContent = 'center'
      myCOC.style.alignItems = 'center'
      myCOC.style.backgroundColor = '#92f266'
      gameContainer.style.backgroundColor = '#92f266'
      gameContainer.innerHTML = `<h1>A sua resposta: ${urGuess}</h1>
        <p style="background-color: #11f720; font-size: 2em">ESTÁ CORRETAA</p>
        <div style="height : 25vh display: flex; justify-content: center">
            <img src=${url} alt="dancing gif">
        </div>
        <div>
        <button onclick="closeGameContainer()" style="background-color: #007BFF; color: white; width: 5vw; height: 3vh; border-radius:50px;">Ok</button>
        </div>`
      countPoints(acertou)
      closeMyPopUp();
   } else if (myObj.nome2){
    if(urGuess.toLowerCase() === myObj.nome2.toLowerCase()){
        const url = await getGifs(acertou)
        myCOC.style.display = 'flex'
        myCOC.style.justifyContent = 'center'
        myCOC.style.alignItems = 'center'
        myCOC.style.backgroundColor = '#92f266'
        gameContainer.style.backgroundColor = '#92f266'
        gameContainer.innerHTML = `<h1>A sua resposta: ${urGuess}</h1>
                                 <p style="background-color: #11f720; font-size: 2em">ESTÁ CORRETAA</p>
                                 <div style="height : 25vh display: flex; justify-content: center">
                                    <img style="width: 50%; height: 100%" src=${url} alt="dancing gif">
                                </div>
                                <div>
                                <button onclick="closeGameContainer()" style="background-color: #007BFF; color: white; width: 5vw; height: 3vh; border-radius:50px;">Ok</button>
                                </div>`
        countPoints(acertou)
        closeMyPopUp();
    } else {
      acertou = !acertou;
      const url = await getGifs(acertou)
      myCOC.style.display = 'flex'
      myCOC.style.justifyContent = 'center'
      myCOC.style.alignItems = 'center'
      myCOC.style.backgroundColor = '#f77c7c'
      gameContainer.style.backgroundColor = '#f77c7c'
      gameContainer.style.backgroundColor = '#f77c7c'
      gameContainer.innerHTML = `<h1>A sua resposta: ${urGuess}</h1>
                                <p style="background-color: #f71111; font-size: 2em">ESTÁ ERRADAAAAAA</p>
                                <div style="height : 25vh display: flex; justify-content: center">
                                    <img style="width: 50%; height: 100%" src=${url} alt="sad gif">
                                </div>
                                <p style="font-size: 2em; font-weigh: bold">A resposta correta é ${myObj.nome}</p>
                                <div>
                                <button onclick="closeGameContainer()" style="background-color: #007BFF; color: white; width: 5vw; height: 3vh; border-radius:50px;">Ok</button>
                                </div>`
                                countPoints(acertou)
                                closeMyPopUp();
                            }
                            
    }else if (urGuess === '') {
    myCOC.style.display = 'block'
    gameContainer.innerHTML = `<p style="background-color: #cce5ff; font-size: 2em">Só porque não sabes a resposta, nao quer dizer que nao possas adivinhar :p</p>
            <div>
            <button onclick="closeGameContainer()" style="background-color: #007BFF; color: white; width: 5vw; height: 3vh; border-radius:50px;">Ok</button>
            </div>`
    } else {
        acertou = !acertou;
        const url = await getGifs(acertou)
        myCOC.style.display = 'flex'
        myCOC.style.justifyContent = 'center'
        myCOC.style.alignItems = 'center'
        myCOC.style.backgroundColor = '#f77c7c'
        gameContainer.style.backgroundColor = '#f77c7c'
        gameContainer.innerHTML = `<h1>A sua resposta: ${urGuess}</h1>
            <p style="background-color: #f71111; font-size: 2em">ESTÁ ERRADAAAAAA</p>
            <div style="height : 25vh display: flex; justify-content: center">
                <img style="width: 50%; height: 100%" src=${url} alt="sad gif">
            </div>
            <p style="font-size: 2em; font-weigh: bold">A resposta correta é ${myObj.nome}</p>
            <div>
                <button onclick="closeGameContainer()" style="background-color: #007BFF; color: white; width: 5vw; height: 3vh; border-radius:50px;">Ok</button>
            </div>`
      countPoints(acertou)
      closeMyPopUp();
   }
}

let closeGameContainer = () => {
    myCOC.style.display = 'none'
    containerGaming.style.display = 'flex'
    containerGaming.style.flexDirection = 'column'
    myLeaderboardBtn.style.display = 'flex'
    myLeaderboardBtn.style.justifyContent = 'flex-end'
}

let closeMyPopUp = () => {
   document.getElementById('myPopup').style.display = 'none';
}
const myLeaderboardBtn = document.getElementById('myLeaderboardBtn')
myLeaderboardBtn.addEventListener('click', async () => {
    const myDiv = document.getElementById('myLeaderboardContainer')
    myDiv.style.display = 'block'
    const users = obterUtilizadores()
    users.sort((a, b) => b.pontos - a.pontos);
    const myTBody = document.getElementById('myTableBody')
    myTBody.style.color = 'black';
    let rows = "";
    for(let i = 1; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total)
        rows += `<tr>
        <td>${users[i].nome}</td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>
        `
    }
    myTBody.innerHTML = rows
})

document.getElementById('NameOrder').addEventListener('click', async () => {
    const users = obterUtilizadores()
    users.sort((a, b) => a.nome.localeCompare(b.nome));
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 1; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total)
        rows += `<tr>
        <td>${users[i].nome}</td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>
        `
    }
    myTBody.innerHTML = rows
    })
document.getElementById('TotalOrder').addEventListener('click', async () => {
    const users = obterUtilizadores()
    users.sort((a, b) => b.total - a.total);
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 1; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total)
        rows += `<tr>
        <td>${users[i].nome}</td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>
        `
    }
    myTBody.innerHTML = rows
})
document.getElementById('PontosOrder').addEventListener('click', async () => {
    const users = obterUtilizadores()
    users.sort((a, b) => b.pontos - a.pontos);
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 1; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total)
        rows += `<tr>
        <td>${users[i].nome}</td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>
        `
    }
    myTBody.innerHTML = rows
})

document.getElementById('RateOrder').addEventListener('click', async () => {
    const users = obterUtilizadores()

    const usersWithRate = [];

    for (let i = 1; i < users.length; i++) {
    const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total);
    usersWithRate.push({
        ...users[i],
        rate: Number(rate.replace('%', ''))
    });
    }

    usersWithRate.sort((a, b) => b.rate - a.rate);
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 0; i < usersWithRate.length; i++){
        const rate = await hitRateLeaderBoard(usersWithRate[i].pontos, usersWithRate[i].total)
        rows += `<tr>
        <td>${usersWithRate[i].nome}</td>
        <td>${usersWithRate[i].pontos}</td>
        <td>${usersWithRate[i].total}</td>
        <td>${rate}</td>
        </tr>
        `
    }
    myTBody.innerHTML = rows
})

document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
    const myDiv = document.getElementById('myLeaderboardContainer')
    myDiv.style.display = 'none'
})

window.closePopUp = closePopUp
window.closeMyPopUp = closeMyPopUp
window.closeGameContainer = closeGameContainer