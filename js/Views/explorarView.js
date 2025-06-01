import {carregarCaminhos, mostrarDetalhes} from '../models/CaminhoModel.js'
import { initLeafletMap } from '../models/mapModel.js';
import {changePath} from '../models/userModel.js'

document.addEventListener("DOMContentLoaded", function () {
    CarregarCaminhosView();
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

let CarregarCaminhosView = async () => {
    const Caminhos  = await carregarCaminhos()
    const container = document.getElementById("caminhosContainer");
    container.innerHTML = "";
    Caminhos.forEach(c => {
        try {
            const card = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card p-3 border-primary shadow">
                            <div class="card-body">
                                <h5 class="card-title">${c.nome}</h5>
                                <p class="card-text"><strong>Distância:</strong> ${c.distancia}</p>
                                <p class="card-text"><strong>Dificuldade:</strong> ${c.dificuldade}</p>
                                <p class="card-text">${c.descricao}</p>
                                <a href="#" class="btn btn-primary" onclick="mostrarDetalhesView(${c.id})">Detalhes</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
        } catch (err){
            console.error('Caminhos nao listados', err)
        }
    })
}
let mostrarDetalhesView = async (id) => {
    try {
        let caminho = await mostrarDetalhes(id);

        // Título do modal
        document.getElementById("detalhesModalLabel").innerText = caminho.nome;

        // Descrição do caminho
        const descricaoEl = document.getElementById("detalhesDescricao");
        descricaoEl.innerHTML = `
            <p><strong>Distância:</strong> ${caminho.distancia}</p>
            <p><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
            <p><strong>Descrição:</strong> ${caminho.descricao}</p>
        `;

        // Variantes
        const variantesEl = document.getElementById("variantesContainer");
        variantesEl.innerHTML = "";

        if (caminho.variantes?.length) {
            caminho.variantes.forEach(variacao => {
                variantesEl.innerHTML += `
                    <div class="card mb-2 p-2 border-secondary">
                        <h6 class="m-0">${variacao.nome}</h6>
                        <p class="m-0 text-muted"><small>${variacao.distancia}</small></p>
                        <button class="btn btn-sm btn-outline-primary mt-1" onclick="percorrerCaminho('${variacao.nome}', true)">Percorrer</button>
                    </div>
                `;
            });
        } else {
            variantesEl.innerHTML = "<p class='text-muted'>Nenhuma variante disponível.</p>";
        }

        variantesEl.innerHTML += `
            <button class="btn btn-success mt-3 w-100" onclick="percorrerCaminho('${caminho.nome}', '${caminho.id}', false)">Percorrer o Caminho Completo</button>
        `;

        const modalEl = document.getElementById('detalhesModal');
        const modal = new bootstrap.Modal(modalEl);

        modalEl.addEventListener('shown.bs.modal', () => {
            initLeafletMap(caminho.latitude, caminho.longitude);
        }, { once: true });

        modal.show();
    } catch (err) {
        console.error("Erro ao carregar os detalhes do caminho:", err);
    }
};

function percorrerCaminho(nome, variante) {
    changePath(nome);
    let modal = bootstrap.Modal.getInstance(document.getElementById('detalhesModal'));
    modal.hide();

    let novoModal = new bootstrap.Modal(document.getElementById('caminhoModal'));
    document.getElementById("caminhoModalLabel").innerText = variante
        ? `Percorrendo a variante: ${nome}`
        : `Percorrendo o Caminho Completo: ${nome}`;
    document.getElementById("caminhoDescricao").innerText = `Você iniciou o percurso do caminho: ${nome}. Boa jornada!`;

    novoModal.show();
}

window.mostrarDetalhesView = mostrarDetalhesView
window.percorrerCaminho = percorrerCaminho