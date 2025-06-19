import { filtrarCaminho, nDias, mostrarDetalhes, carregarCaminhos } from '../models/CaminhoModel.js';
import {changePath} from '../models/userModel.js';

const localPartida = document.getElementById('localPartida');
const destino = document.getElementById('destino');
document.addEventListener("DOMContentLoaded", async function () {
            const loginButton = document.getElementById("loginButton");
            const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
            if (user) {
                
                loginButton.outerHTML = `
                    <a id="profileIcon" class="nav-link" href="perfil.html">
                        <i style="width: 60px; height: 35px; border-radius: 50%;" loading="lazy" class="fab">&#xf368 Perfil</i>
                    </a>
                `;
            }
            await carregarLocaisPartida()
          });
let carregarLocaisPartida = async () => {
  const caminhos = await carregarCaminhos();
  for(let i = 0; i < caminhos.length; i++){
    caminhos[i].localPartida;
    console.log(caminhos[i].localPartida)
    let row = `
    <option value="${caminhos[i].localPartida}">${caminhos[i].localPartida}</option>
    `
    localPartida.innerHTML += row;
  }
}
            
localPartida.addEventListener('change', async (e) => {
  destino.innerHTML = '';
  const selectedValue = await e.target.value;
  if(selectedValue == 'Santiago de Compostela'){
    let rows = `
    <option value="">Selecione...</option>
    <option value="Fisterra">Fisterra</option>
    `
    destino.innerHTML = rows
  } else if(selectedValue == '') {
    let rows =`
    <option value="">Selecione...</option>
    <option value="Santiago de Compostela" >Santiago Compostela</option>
    <option value="Fisterra">Fisterra</option>
    `
    localPartida.innerHTML = rows
  } else {
    let rows = `
    <option value="">Selecione...</option>
    <option value="Santiago de Compostela">Santiago de Compostela</option>
    `
    destino.innerHTML = rows
  }
})

document.getElementById('formCaminho').addEventListener('submit', async function(event) {
  event.preventDefault();

  const preferencias = {
    partida: document.getElementById("localPartida").value,
    destino: document.getElementById("destino").value,
    data: document.getElementById("dataViagem").value,
    alojamento: document.getElementById("alojamento").value || "Não especificado",
    dificuldade: document.getElementById("nivelDificuldade").value,
    transporte: document.querySelector('input[name="transporte"]:checked').value
  };

  try {
    const melhoresCaminhos = await filtrarCaminho(preferencias);

    if (!melhoresCaminhos || melhoresCaminhos.length === 0) {
      document.getElementById("melhoresCaminhos").innerHTML = `<p class="alert alert-warning">Nenhum caminho encontrado.</p>`;
      return;
    }

    const caminhoHTML = melhoresCaminhos.map(caminho => {
      const Ndias = nDias(preferencias.transporte, caminho.distancia);
      return `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${caminho.nome}</h5>
            <p><strong>Numero de dias:</strong> ${Ndias}</p>
            <p><strong>Distância:</strong> ${caminho.distancia}</p>
            <p><strong>Descrição:</strong> ${caminho.descricao[0]}</p>
            <a href="#" class="btn btn-primary" onclick="mostrarDetalhesView(${caminho.id})">Detalhes</a>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById("melhoresCaminhos").innerHTML = caminhoHTML;

  } catch (err) {
    console.error("Erro ao obter caminhos:", err);
  }
});

window.mostrarDetalhesView = async (id) => {
  try {
    const caminho = await mostrarDetalhes(id);
    if (!caminho) return;

    let conteudoHTML = `
      <h5>${caminho.nome}</h5>
      <p><strong>Distância:</strong> ${caminho.distancia}</p>
      <p><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
      <p><strong>Descrição:</strong> ${caminho.descricao[1]}</p>
    `;

    if (caminho.variantes?.length) {
      caminho.variantes.forEach(variacao => {
        conteudoHTML += `
          <div class="card mb-2 p-2 border-secondary">
            <h6 class="m-0">${variacao.nome}</h6>
            <p class="m-0 text-muted"><small>${variacao.distancia}</small></p>
            <button class="btn btn-sm btn-outline-primary mt-1" onclick="percorrerCaminho('${variacao.nome}', true)">Percorrer</button>
          </div>
        `;
      });
    } else {
      conteudoHTML += `<p class='text-muted'>Nenhuma variante disponível.</p>`;
    }

    conteudoHTML += `
      <button class="btn btn-success mt-3 w-100" onclick="percorrerCaminho('${caminho.nome}', false)">Percorrer o Caminho Completo</button>
    `;

    document.getElementById("modalDetalhesBody").innerHTML = conteudoHTML;

    initLeafletMap(caminho.latitude, caminho.longitude);

    new bootstrap.Modal(document.getElementById('modalDetalhes')).show();
  } catch (err) {
    console.error("Erro ao carregar os detalhes do caminho:", err);
  }
};

let leafletMap = null;

function initLeafletMap(lat, lng) {
  const mapDiv = document.getElementById("mapa");

  // Remove o mapa anterior, se existir
  if (leafletMap !== null) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = L.map(mapDiv).setView([lat, lng], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(leafletMap);

  L.marker([lat, lng]).addTo(leafletMap);
}

function percorrerCaminho(nome, isVariante) {
  const tipo = isVariante ? "Variante" : "Caminho principal";
  alert(`A iniciar percurso: ${nome} (${tipo})`);
  changePath(nome)
}

window.percorrerCaminho = percorrerCaminho;