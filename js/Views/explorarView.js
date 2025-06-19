// explorarView.js

import { carregarCaminhos, mostrarDetalhes } from '../models/CaminhoModel.js';
import { initLeafletMap } from '../models/mapModel.js';
import { changePath } from '../models/userModel.js';

document.addEventListener("DOMContentLoaded", function () {
    CarregarCaminhosView();
    const loginButton = document.getElementById("loginButton");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
        loginButton.outerHTML = `
            <a id="profileIcon" class="nav-link" href="perfil.html">
                <i style="width: 60px; height: 35px; border-radius: 50%;" class="fab">&#xf368 Perfil</i>
            </a>
        `;
    }
});

let CarregarCaminhosView = async () => {
    const Caminhos = await carregarCaminhos();
    const container = document.getElementById("caminhosContainer");
    container.innerHTML = "";

    Caminhos.forEach(c => {
        try {
            const card = `
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
                <div class="col-md-6 col-lg-4">
                    <div class="card caminho-card h-100 d-flex flex-column justify-content-between">
                        <div class="card-body">
                            <h5 class="card-title">${c.nome}</h5>
                            <ul class="list-unstyled card-info">
                                <li><i class="bi bi-signpost-2"></i> <strong>Distância:</strong> ${c.distancia}</li>
                                <li><i class="bi bi-activity"></i> <strong>Dificuldade:</strong> ${c.dificuldade}</li>
                            </ul>
                            <p class="card-text">${c.descricao[0]}</p>
                        </div>
                        <div class="card-footer bg-white border-top-0 text-center">
                            <a href="#" class="btn btn-outline-primary w-100" onclick="mostrarDetalhesView(${c.id})">Ver detalhes</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        } catch (err) {
            console.error('Erro ao listar caminhos:', err);
        }
    });
};

let mostrarDetalhesView = async (id) => {
    try {
        let caminho = await mostrarDetalhes(id);

        document.getElementById("detalhesModalLabel").innerText = caminho.nome;

        const descricaoEl = document.getElementById("detalhesDescricao");
        descricaoEl.innerHTML = `
            <p style="color:black"><strong>Distância:</strong> ${caminho.distancia}</p>
            <p style="color:black"><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
            <p style="color:black"><strong>Descrição:</strong> ${caminho.descricao[1]}</p>
        `;

        const variantesEl = document.getElementById("variantesContainer");
        variantesEl.innerHTML = `
            <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-success w-50 me-1" onclick="iniciarCaminho('${caminho.nome}', '${caminho.latitude}', '${caminho.longitude}')">Iniciar Caminho</button>
                <button class="btn btn-outline-primary w-50 ms-1" onclick="abrirVariantesModal(${id})">Ver Variantes</button>
            </div>
        `;

        const modalEl = document.getElementById('detalhesModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    } catch (err) {
        console.error("Erro ao carregar os detalhes do caminho:", err);
    }
};

function abrirVariantesModal(id) {
    mostrarDetalhes(id).then(caminho => {
        const variantesModal = new bootstrap.Modal(document.getElementById('caminhoModal'));
        document.getElementById("caminhoModalLabel").innerText = "Variantes de " + caminho.nome;
        const caminhoDescricao = document.getElementById("caminhoDescricao");
        caminhoDescricao.innerHTML = caminho.variantes?.length ? caminho.variantes.map(v => `
            <div class="card mb-2 p-2 border">
                <h6 class="m-0">${v.nome}</h6>
                <p class="m-0 text-muted"><small>${v.distancia}</small></p>
                <p>${v.descricao}</p>
                <button class="btn btn-sm btn-outline-success mt-1" onclick="percorrerCaminho('${v.nome}', true)">Iniciar Variante</button>
            </div>
        `).join('') : `<p class='text-muted'>Nenhuma variante disponível.</p>`;

        variantesModal.show();
    });
}

function iniciarCaminho(nome, lat, lng) {
    changePath(nome);

    const caminhoModal = new bootstrap.Modal(document.getElementById('caminhoModal'));
    caminhoModal.show();

    
    const modalEl = document.getElementById('caminhoModal');
    modalEl.addEventListener('shown.bs.modal', () => {
        const mapaContainer = document.getElementById("map");
        if (mapaContainer) {
            mapaContainer.innerHTML = ""; 
        }
        initLeafletMap(parseFloat(lat), parseFloat(lng));
    }, { once: true }); 
}


function percorrerCaminho(nome, variante) {
    changePath(nome);
    const modal = bootstrap.Modal.getInstance(document.getElementById('caminhoModal'));
    modal.hide();

    let novoModal = new bootstrap.Modal(document.getElementById('detalhesModal'));
    document.getElementById("detalhesDescricao").innerHTML = `
        <p>Você iniciou o percurso da ${variante ? 'variante' : 'rota principal'}: <strong>${nome}</strong>. Boa jornada!</p>
    `;
    document.getElementById("variantesContainer").innerHTML = "";
    initLeafletMapFromStorage(nome);
    novoModal.show();
}

function initLeafletMapFromStorage(nome) {
    mostrarDetalhes().then(caminhos => {
        const caminho = caminhos.find(c => c.nome === nome);
        if (caminho) {
            initLeafletMap(caminho.latitude, caminho.longitude);
        }
    });
}

window.mostrarDetalhesView = mostrarDetalhesView;
window.percorrerCaminho = percorrerCaminho;
window.iniciarCaminho = iniciarCaminho;
window.abrirVariantesModal = abrirVariantesModal;