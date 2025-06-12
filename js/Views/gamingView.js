import {hitRateLeaderBoard, CalculateImages, getTheObjGame, calculateMyAltAnswers, shuffleArray} from '../models/gamingModel.js'
import {countPoints, getPoints} from '../models/userModel.js'
import {obterUtilizadores} from '../models/gerirUserModel.js'
import {getGifs} from '../models/gifsModels.js'

document.addEventListener("DOMContentLoaded", function () {
            const loginButton = document.getElementById("loginButton");
            const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
            if (user) {
                
                loginButton.outerHTML = `
                    <a id="profileIcon" class="nav-link" href="perfil.html">
                        <i style="width: 60px; height: 35px; border-radius: 50%;" loading="lazy" class="fab">&#xf368 Perfil</i>
                    </a>
                `;
            }
        });

const initBtn = document.querySelector('#initBtn');
const mybackground = document.getElementById('mybackground');

initBtn.addEventListener('click', async () => {
    containerGaming.style.display = 'none'
    mybackground.style.display = 'none'
    carregarImagens()
 })
 
 const gamificacaoContainer = document.getElementById('gamificacaoContainer')
 const carregarImagens = async () => {
    gamificacaoContainer.style.display = 'flex'
    try {
        const myImg = await CalculateImages()
        const myAltAnswers = await calculateMyAltAnswers(myImg.id)
        myAltAnswers.push(myImg)
        shuffleArray(myAltAnswers)
        const card = `
        <div id="newDiv" style="z-index: 1000; width: 100vw; left: 50%; transform(-50%); height: 90vh; background-color: #f2f2f2; display:flex; justify-content: center; align-items: center;">
            <div id="myPopup" style="display: flex; flex-direction: column; justify-content: center; width:98vw; height: 85vh; border: 0px solid black; padding:0; background-color:u7.u white;">
                <div id="myClosePopUpContainer" style="display:flex; justify-content: space-between; align-items: center; width:98vw; height: 15vh; padding: 0vh .5vw 2vh 0vw; border:0px; background-color: white; text-align:center;">
                    <div style="display:flex; justify-content: flex-start; align-items:center; background-color: white;">
                        <div style="background-color: #007BFF; width: 5vw; height: 8vh; border-top-right-radius: 20px; border-bottom-right-radius:20px;"></div>
                        <h1 style="color:black; padding: 0vh 0vw 0vh 1vw; margin:0; text-align:center;">Adivinha o que está na imagem!</h1>
                    </div>
                    <button id="myCloseBtn" onclick="closeMyPopUp()" style="background-color:#007BFF; color:#FFD700; font-size: .7em; text-align:center; padding: 1vh 1vw; border-radius: 50%; cursor: pointer;">X</button>
                </div>
                <div id="MyPopUpContainer" style="display:flex; flex-direction: flex; align-items:center; justify-content: space-around; width:98vw; padding: 2vh 2vw 10vh 6vw;  background-color: white;">   
                    <div>
                        <img src="${myImg.url}" style= "width:36vw; height:60vh;">
                    </div>
                    <div style="display:flex; padding: 2vh 2vw; flex-direction: column; justify-content: space-around; width: 50vw; height: 50vh">  
                        <button class="myOptions" style="text-align: start; width: 45vw; height: 6vh; font-weight: bold; border-radius:10px; padding: .3vh 1vw;" onclick="closePopUp(${myAltAnswers[0].id}, ${myImg.id})">${myAltAnswers[0].nome}</button>
                        <button class="myOptions" style="text-align: start; width: 45vw; height: 6vh; font-weight: bold; border-radius:10px; padding: .3vh 1vw" onclick="closePopUp(${myAltAnswers[1].id} , ${myImg.id})">${myAltAnswers[1].nome}</button>
                        <button class="myOptions" style="text-align: start; width: 45vw; height: 6vh; font-weight: bold; border-radius:10px; padding: .3vh 1vw" onclick="closePopUp(${myAltAnswers[2].id}, ${myImg.id})">${myAltAnswers[2].nome}</button>
                        <button class="myOptions" style="text-align: start; width: 45vw; height: 6vh; font-weight: bold; border-radius:10px; padding: .3vh 1vw" onclick="closePopUp(${myAltAnswers[3].id}, ${myImg.id})">${myAltAnswers[3].nome}</button>
                    </div>
                </div>
            </div>
        </div> 
        `;
        gamificacaoContainer.innerHTML = card;
        const myCloseBtn = document.querySelector('#myCloseBtn');
    
        myCloseBtn.addEventListener('mouseenter', () =>{
            myCloseBtn.style.backgroundColor = '#e32717';
            myCloseBtn.style.color = 'white';
        })
    
        myCloseBtn.addEventListener('mouseleave', () =>{
            myCloseBtn.style.backgroundColor = '#007BFF';
             myCloseBtn.style.color = '#FFD700';
        });
    } catch (err) {
        console.error("Erro ao carregar os caminhos:", err)
    }
}



let myCOC = document.getElementById('containerOfContainer')
let containerGaming = document.getElementById('containerGaming')
let closePopUp = async (id, rightId) =>  {
    gamificacaoContainer.innerHTML = '';
    gamificacaoContainer.style.display= 'none';
    const myObj = await getTheObjGame(rightId)
    let acertou = true
    let urGuessObj = await getTheObjGame(id)
    let urGuess = urGuessObj.nome
    myCOC.style.display = 'flex'
   if( urGuess.toLowerCase() === myObj.nome.toLowerCase() ){
      const url = await getGifs(acertou)
      const pontos = getPoints()
      const total = parseInt(pontos) + 1
      myCOC.innerHTML = `
        <div id="myIdDiv">
            <div style="height: 40vh; display: flex; justify-content: center">
                <img src=${url} alt="dancing gif">
            </div>
            <div style="display:flex; flex-direction: column; justify-content: flex-start; align-items:center; color:black;font-weight: bold; height: 40vh; padding: 0vh 5vw 0vh 0vw">
                <h1 style="color: #FFD700; font-size: 5em">Correto!</h1>
                <div>   
                    <div>
                        <h2>Pontos:</h2>
                        <h3 style="color: #FFD700;"> + 1</h3>
                    </div>
                    <div>
                    <h2>Pontuação atual:<br>
                        ${total}
                    </h2>
                    </div>
                </div>
                <div style="display:flex; justify-content: space-around; width: 6vw;">
                <button onclick="closeMyPopUp()" style="background-color: red; color: white; border-radius: 50%; padding: .5vh .5vw;">❌</button>
                <button class="myOptions" onclick="NextQuestion()" style="border-radius: 50%; text-decoration: none; padding: .5vh .5vw; text-align: center"><span>&#10148;</span></button> 
                </div>
            </div>
        </div>
      
      `
      countPoints(acertou)
   }else if (urGuess === '') {
    myCOC.style.display = 'block'
    myCOC.innerHTML = `<p style="background-color: #cce5ff; font-size: 2em">Só porque não sabes a resposta, nao quer dizer que nao possas adivinhar :p</p>
            <div>
            <button onclick="closeGameContainer()" style="background-color: #007BFF; color: white; width: 5vw; height: 3vh; border-radius:50px;">Ok</button>
            </div>`
    } else {
        acertou = !acertou;
        const url = await getGifs(acertou)
        const pontos = getPoints()
        const total = parseInt(pontos)
        myCOC.innerHTML = `
        <div id="myIdDiv">
            <div style="height: 40vh; display: flex; justify-content: center">
                <img src=${url} alt="dancing gif">
            </div>
            <div style="display:flex; flex-direction: column; justify-content: flex-start; align-items:center; color:black;font-weight: bold; height: 40vh; padding: 0vh 5vw 0vh 0vw">
                <h1 style="color: #FFD700; font-size: 5em">Errado!</h1>
                <div>   
                    <div>
                        <h2>Pontos:</h2>
                        <h3 style="color: #FFD700;"> + 0</h3>
                    </div>
                    <div>
                    <h2>Pontuação atual:<br>
                        ${total}
                    </h2>
                    </div>
                </div>
                <div style="display:flex; justify-content: space-around; width: 6vw;">
                <button onclick="closeMyPopUp()" style="background-color: red; color: white; border-radius: 50%; padding: .5vh .5vw;">❌</button>
                <button class="myOptions" onclick="NextQuestion()" style="border-radius: 50%; text-decoration: none; padding: .5vh .5vw; text-align: center"><span>&#10148;</span></button> 
                </div>
            </div>
        </div>
      
            `
      countPoints(acertou)
   }
}

let NextQuestion = () => {
    myCOC.style.display = 'none'
    gamificacaoContainer.style.display = 'block'
    carregarImagens()
}

let closeMyPopUp = () => {
   myCOC.style.display = 'none';
   gamificacaoContainer.style.display = 'none'
   mybackground.style.display = 'block'
   containerGaming.style.display = 'flex';
}
const myLeaderboardBtn = document.getElementById('myLeaderboardBtn')
myLeaderboardBtn.addEventListener('click', async () => {
    containerGaming.style.display = 'none';
    const myDiv = document.getElementById('myleaderboardContainerP')
    myDiv.style.display = 'flex';
    const users = obterUtilizadores()
    users.shift()
    users.sort((a, b) => b.pontos - a.pontos);
    const myTBody = document.getElementById('myTableBody')
    myTBody.style.color = 'black';
    let rows = "";
    for(let i = 0; i < users.length; i++){
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
    users.shift()
    users.sort((a, b) => a.nome.localeCompare(b.nome));
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 0; i < users.length; i++){
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
    users.shift()
    users.sort((a, b) => b.total - a.total);
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 0; i < users.length; i++){
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
    users.shift()
    users.sort((a, b) => b.pontos - a.pontos);
    const myTBody = document.getElementById('myTableBody')
    let rows = "";
    for(let i = 0; i < users.length; i++){
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
    users.shift()

    const usersWithRate = [];

    for (let i = 0; i < users.length; i++) {
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
    const myDiv = document.getElementById('myleaderboardContainerP')
    myDiv.style.display = 'none';
    containerGaming.style.display = 'flex';
})

window.closePopUp = closePopUp
window.closeMyPopUp = closeMyPopUp
window.NextQuestion = NextQuestion