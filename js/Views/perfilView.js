import { hitRate } from '../models/gamingModel.js';

const historicoList = document.getElementById("caminhadasHistorico");

document.addEventListener("DOMContentLoaded", async function () {
  const user = await JSON.parse(localStorage.getItem("loggedInUser"));
  historicoList.innerHTML = '';
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const loginButton = document.getElementById("loginButton");    
    if (user) {
      loginButton.outerHTML = `
        <a id="profileIcon" class="nav-link" href="perfil.html">
            <i style="width: 60px; height: 35px; border-radius: 50%;" loading="lazy" class="fab">&#xf368 Perfil</i>
        </a>
      `;
    }

  
  document.getElementById("userName").innerText = user.nome;
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userRate").innerText = `Taxa de acerto: ${await hitRate()}`;

  const historico = user.historico;
  if(historico.length == 0 || !historico){
    let row = '<li>Sem caminhadas registadas.</li>'
    historicoList.innerHTML = row;
  } else {
    for(let caminho of historico){
      let row = `<li>${caminho}</li>`
      historicoList.innerHTML += row
    }
  }

  
  const conquistasContainer = document.getElementById("conquistasContainer");
  conquistasContainer.innerHTML = "";

   const conquistas = gerarConquistas(user.pontos, user.total);
    conquistas.forEach(conquista => {
    const span = document.createElement("span");
    span.classList.add("achievements-badge");
    span.innerHTML = `<i class="${conquista.icone} me-1"></i>${conquista.nome}`;
    span.addEventListener('mouseenter', (e) => {
      const p = document.createElement('p');
      p.textContent = conquista.msg;
      p.classList.add('getMyParagraph');
      p.style.background = '#c3c4c7';
      p.style.color = 'black';
      p.style.fontSize = '.8em';
      p.style.textAlign = 'center';
      p.style.width = '10vw';
      p.style.borderRadius = '20px';
      p.style.padding = '.5vh .5vw';
      p.style.pointerEvents = 'none';
      conquistasContainer.appendChild(p);
    });
    span.addEventListener('mouseleave', () => {
      const p = conquistasContainer.querySelector('.getMyParagraph');
      if (p) {
        conquistasContainer.removeChild(p);
      } 
    })
    conquistasContainer.appendChild(span);
  });

 
  document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "home.html";
  });
});

function gerarConquistas(pontos, total) {
  const conquistas = [];

  if (total >= 1) conquistas.push({ nome: "Primeira Caminhada", icone: "fas fa-shoe-prints", msg: "Jogar pela primeira vez!" });
  if (pontos >= 3) conquistas.push({ nome: "3 Pontos!", icone: "fas fa-star", msg: "Acertar 3 perguntas!" });
  if (pontos >= 5) conquistas.push({ nome: "Explorador", icone: "fas fa-map-marked-alt", msg: "Acertar 5 perguntas!" });
  if (total >= 10) conquistas.push({ nome: "Veterano", icone: "fas fa-medal", msg: "Acertar 10 perguntas!" });

  return conquistas;
}

