import { hitRate } from '../models/gamingModel.js';

document.addEventListener("DOMContentLoaded", async function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  
  document.getElementById("userName").innerText = user.nome;
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userRate").innerText = `Taxa de acerto: ${await hitRate()}`;

  
  const historico = JSON.parse(localStorage.getItem("historicoCaminhadas")) || [];

  const userHistorico = historico.filter(c => c.userId === user.id);
  const historicoList = document.getElementById("caminhadasHistorico");
  historicoList.innerHTML = userHistorico.length > 0 ? "" : "<li>Sem caminhadas registadas.</li>";

  userHistorico.forEach(caminho => {
    const li = document.createElement("li");
    li.textContent = `${caminho.nome} - ${caminho.data}`;
    historicoList.appendChild(li);
  });

  
  const conquistasContainer = document.getElementById("conquistasContainer");
  conquistasContainer.innerHTML = "";

  const conquistas = gerarConquistas(user.pontos, user.total);
  conquistas.forEach(conquista => {
    const span = document.createElement("span");
    span.classList.add("achievements-badge");
    span.innerHTML = `<i class="${conquista.icone} me-1"></i>${conquista.nome}`;
    conquistasContainer.appendChild(span);
  });

 
  document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "home.html";
  });
});

function gerarConquistas(pontos, total) {
  const conquistas = [];

  if (total >= 1) conquistas.push({ nome: "Primeira Caminhada", icone: "fas fa-shoe-prints" });
  if (pontos >= 3) conquistas.push({ nome: "3 Pontos!", icone: "fas fa-star" });
  if (pontos >= 5) conquistas.push({ nome: "Explorador", icone: "fas fa-map-marked-alt" });
  if (total >= 10) conquistas.push({ nome: "Veterano", icone: "fas fa-medal" });

  return conquistas;
}

