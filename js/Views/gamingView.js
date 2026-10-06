import {hitRateLeaderBoard, calculateImages, getTheObjGame, calculateMyAltAnswers, shuffleArray} from '../models/gamingModel.js'
import {countPoints, getPoints} from '../models/userModel.js'
import {obterUtilizadores} from '../models/gerirUserModel.js'
import {getGifs} from '../models/gifsModels.js'

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user && loginButton) {
        loginButton.outerHTML = `
            <a id="profileIcon" class="nav-link" href="perfil.html">
                <i class="fas fa-user-circle me-1"></i> Perfil
            </a>
        `;
    }
});

const initBtn = document.querySelector('#initBtn');
const mybackground = document.getElementById('mybackground');

initBtn.addEventListener('click', async () => {
    containerGaming.style.display = 'none';
    mybackground.style.display = 'none';
    await carregarImagens();
});
 
const gamificacaoContainer = document.getElementById('gamificacaoContainer');
const carregarImagens = async () => {
    gamificacaoContainer.style.display = 'flex';
    try {
        const myImg = await calculateImages();
        if (!myImg) return;
        const id = myImg.id;
        const myAltAnswers = await calculateMyAltAnswers(id);
        myAltAnswers.push(myImg);
        await shuffleArray(myAltAnswers);
        
        const card = `
        <div id="newDiv" class="d-flex align-items-center justify-content-center p-3 w-100 h-100">
            <div id="myPopup" class="card border-0 shadow-lg p-4 bg-white" style="max-width: 900px; width: 95vw; border-radius: 20px;">
                <div id="myClosePopUpContainer" class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-primary px-3 py-2 rounded-pill"><i class="fas fa-camera me-1"></i> Pergunta</span>
                        <h4 class="mb-0 fw-bold" style="color: var(--primary);">Adivinha o local desta imagem!</h4>
                    </div>
                    <button id="myCloseBtn" onclick="closeMyPopUp()" class="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">✕</button>
                </div>
                <div id="MyPopUpContainer" class="row g-4 align-items-center">   
                    <div class="col-md-6 text-center">
                        <img src="${myImg.url}" class="img-fluid rounded-4 shadow-sm" style="max-height: 380px; width: 100%; object-fit: cover;">
                    </div>
                    <div class="col-md-6 d-flex flex-column gap-2">  
                        <button class="btn btn-outline-primary text-start fw-bold p-3 rounded-3 myOptions" onclick="closePopUp(${myAltAnswers[0].id}, ${id})">A. ${myAltAnswers[0].nome}</button>
                        <button class="btn btn-outline-primary text-start fw-bold p-3 rounded-3 myOptions" onclick="closePopUp(${myAltAnswers[1].id}, ${id})">B. ${myAltAnswers[1].nome}</button>
                        <button class="btn btn-outline-primary text-start fw-bold p-3 rounded-3 myOptions" onclick="closePopUp(${myAltAnswers[2].id}, ${id})">C. ${myAltAnswers[2].nome}</button>
                        <button class="btn btn-outline-primary text-start fw-bold p-3 rounded-3 myOptions" onclick="closePopUp(${myAltAnswers[3].id}, ${id})">D. ${myAltAnswers[3].nome}</button>
                    </div>
                </div>
            </div>
        </div> 
        `;
        gamificacaoContainer.innerHTML = card;
    } catch (err) {
        console.error("Erro ao carregar o quiz:", err);
    }
};

let myCOC = document.getElementById('containerOfContainer');
let containerGaming = document.getElementById('containerGaming');
let closePopUp = async (id, rightId) =>  {
    gamificacaoContainer.innerHTML = '';
    gamificacaoContainer.style.display = 'none';
    const myObj = await getTheObjGame(rightId);
    let acertou = true;
    let urGuessObj = await getTheObjGame(id);
    let urGuess = urGuessObj ? urGuessObj.nome : '';
    myCOC.style.display = 'flex';
    
    if( urGuess.toLowerCase() === myObj.nome.toLowerCase() ){
      const url = await getGifs(acertou);
      const pontos = await getPoints();
      const total = parseInt(pontos || 0) + 1;
      myCOC.innerHTML = `
        <div id="myIdDiv" class="card border-0 shadow-lg p-4 p-md-5 text-center bg-white" style="max-width: 520px; width: 92vw; border-radius: 24px;">
            <div class="d-flex justify-content-center mb-3">
                <img src="${url}" alt="comemoração" class="img-fluid rounded-4 shadow-sm" style="max-height: 220px; object-fit: contain;">
            </div>
            <h2 class="fw-bold text-success mb-2"><i class="fas fa-check-circle me-2"></i>Correto!</h2>
            <div class="my-3 p-3 bg-light rounded-3">
                <span class="badge bg-success px-3 py-2 rounded-pill fw-semibold mb-2">+ 1 Ponto</span>
                <h5 class="text-muted mb-0">Pontuação total: <strong class="text-dark">${total}</strong></h5>
            </div>
            <div class="d-flex justify-content-center gap-2 mt-2">
                <button onclick="closeMyPopUp()" class="btn btn-outline-secondary px-4 py-2">Sair</button>
                <button class="btn btn-primary px-4 py-2" onclick="NextQuestion()">Próxima Pergunta <i class="fas fa-arrow-right ms-1"></i></button> 
            </div>
        </div>
      `;
      countPoints(acertou);
    } else {
        acertou = !acertou;
        const url = await getGifs(acertou);
        const pontos = await getPoints();
        const total = parseInt(pontos || 0);
        myCOC.innerHTML = `
        <div id="myIdDiv" class="card border-0 shadow-lg p-4 p-md-5 text-center bg-white" style="max-width: 520px; width: 92vw; border-radius: 24px;">
            <div class="d-flex justify-content-center mb-3">
                <img src="${url}" alt="erro" class="img-fluid rounded-4 shadow-sm" style="max-height: 220px; object-fit: contain;">
            </div>
            <h2 class="fw-bold text-danger mb-2"><i class="fas fa-times-circle me-2"></i>Incorreto!</h2>
            <div class="my-3 p-3 bg-light rounded-3">
                <p class="text-muted small mb-1">A resposta correta era: <strong class="text-dark">${myObj.nome}</strong></p>
                <h5 class="text-muted mb-0">Pontuação total: <strong class="text-dark">${total}</strong></h5>
            </div>
            <div class="d-flex justify-content-center gap-2 mt-2">
                <button onclick="closeMyPopUp()" class="btn btn-outline-secondary px-4 py-2">Sair</button>
                <button class="btn btn-primary px-4 py-2" onclick="NextQuestion()">Tentar Novamente <i class="fas fa-arrow-right ms-1"></i></button> 
            </div>
        </div>
        `;
        countPoints(acertou);
    }
};

let NextQuestion = async () => {
    myCOC.style.display = 'none';
    await carregarImagens();
};

let closeMyPopUp = () => {
   myCOC.style.display = 'none';
   gamificacaoContainer.style.display = 'none';
   mybackground.style.display = 'flex';
   containerGaming.style.display = 'flex';
};

const myLeaderboardBtn = document.getElementById('myLeaderboardBtn');
myLeaderboardBtn.addEventListener('click', async () => {
    containerGaming.style.display = 'none';
    const myDiv = document.getElementById('myleaderboardContainerP');
    myDiv.style.display = 'flex';
    let users = await obterUtilizadores();
    users = users.filter(u => u.tipo !== 'admin');
    users.sort((a, b) => b.pontos - a.pontos);
    const myTBody = document.getElementById('myTableBody');
    myTBody.style.color = 'black';
    let rows = "";
    for(let i = 0; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total);
        rows += `<tr>
        <td><strong>${users[i].nome}</strong></td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>`;
    }
    myTBody.innerHTML = rows;
});

document.getElementById('NameOrder').addEventListener('click', async () => {
    let users = await obterUtilizadores();
    users = users.filter(u => u.tipo !== 'admin');
    users.sort((a, b) => a.nome.localeCompare(b.nome));
    const myTBody = document.getElementById('myTableBody');
    let rows = "";
    for(let i = 0; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total);
        rows += `<tr>
        <td><strong>${users[i].nome}</strong></td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>`;
    }
    myTBody.innerHTML = rows;
});
document.getElementById('TotalOrder').addEventListener('click', async () => {
    let users = await obterUtilizadores();
    users = users.filter(u => u.tipo !== 'admin');
    users.sort((a, b) => b.total - a.total);
    const myTBody = document.getElementById('myTableBody');
    let rows = "";
    for(let i = 0; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total);
        rows += `<tr>
        <td><strong>${users[i].nome}</strong></td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>`;
    }
    myTBody.innerHTML = rows;
});

document.getElementById('PontosOrder').addEventListener('click', async () => {
    let users = await obterUtilizadores();
    users = users.filter(u => u.tipo !== 'admin');
    users.sort((a, b) => b.pontos - a.pontos);
    const myTBody = document.getElementById('myTableBody');
    let rows = "";
    for(let i = 0; i < users.length; i++){
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total);
        rows += `<tr>
        <td><strong>${users[i].nome}</strong></td>
        <td>${users[i].pontos}</td>
        <td>${users[i].total}</td>
        <td>${rate}</td>
        </tr>`;
    }
    myTBody.innerHTML = rows;
});

document.getElementById('RateOrder').addEventListener('click', async () => {
    let users = await obterUtilizadores();
    users = users.filter(u => u.tipo !== 'admin');

    const usersWithRate = [];
    for (let i = 0; i < users.length; i++) {
        const rate = await hitRateLeaderBoard(users[i].pontos, users[i].total);
        usersWithRate.push({
            ...users[i],
            rate: Number(rate.replace('%', ''))
        });
    }

    usersWithRate.sort((a, b) => b.rate - a.rate);
    const myTBody = document.getElementById('myTableBody');
    let rows = "";
    for(let i = 0; i < usersWithRate.length; i++){
        const rate = await hitRateLeaderBoard(usersWithRate[i].pontos, usersWithRate[i].total);
        rows += `<tr>
        <td><strong>${usersWithRate[i].nome}</strong></td>
        <td>${usersWithRate[i].pontos}</td>
        <td>${usersWithRate[i].total}</td>
        <td>${rate}</td>
        </tr>`;
    }
    myTBody.innerHTML = rows;
});

document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
    const myDiv = document.getElementById('myleaderboardContainerP');
    myDiv.style.display = 'none';
    containerGaming.style.display = 'flex';
});

window.closePopUp = closePopUp
window.closeMyPopUp = closeMyPopUp
window.NextQuestion = NextQuestion