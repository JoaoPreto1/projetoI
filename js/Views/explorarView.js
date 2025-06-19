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
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card caminho-card h-100 d-flex flex-column justify-content-between">
                    <div class="card-body">
                        <h5 class="card-title">${c.nome}</h5>
                        <ul class="list-unstyled card-info">
                            <li><strong>Distância:</strong> ${c.distancia}</li>
                            <li><strong>Dificuldade:</strong> ${c.dificuldade}</li>
                        </ul>
                        <p class="card-text">${c.descricao[0]}</p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="#" class="btn btn-outline-primary w-100" onclick="mostrarDetalhesView(${c.id})">Ver detalhes</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
};

let mostrarDetalhesView = async (id) => {
    try {
        let caminho = await mostrarDetalhes(id);

        document.getElementById("detalhesModalLabel").innerText = caminho.nome;

        document.getElementById("detalhesDescricao").innerHTML = `
            <p style="color: #212529"><strong>Distância:</strong> ${caminho.distancia}</p>
            <p style="color: #212529"><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
            <p style="color: #212529"><strong>Descrição:</strong> ${caminho.descricao}</p>
        `;

        document.getElementById("variantesContainer").innerHTML = `
            <div class="d-flex justify-content-between mt-3">
                <button class="btn btn-success w-50 me-1" onclick="iniciarCaminho('${caminho.nome}', '${caminho.latitude}', '${caminho.longitude}')">Iniciar Caminho</button>
                <button class="btn btn-outline-primary w-50 ms-1" onclick="abrirVariantesModal(${id})">Ver Variantes</button>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('detalhesModal'));
        modal.show();
    } catch (err) {
        console.error("Erro ao carregar os detalhes do caminho:", err);
    }
};

function abrirVariantesModal(id) {
    mostrarDetalhes(id).then(caminho => {
        const variantesModal = new bootstrap.Modal(document.getElementById('caminhoModal'));
        document.getElementById("caminhoModalLabel").innerText = "Variantes de " + caminho.nome;

        document.getElementById("caminhoDescricao").innerHTML = caminho.variantes?.length
            ? caminho.variantes.map(v => `
                <div class="card mb-2 p-2 border">
                    <h6 class="m-0">${v.nome}</h6>
                    <p class="m-0 text-muted"><small>${v.distancia}</small></p>
                    <p>${v.descricao}</p>
                    <button class="btn btn-sm btn-outline-success mt-1" onclick="percorrerCaminho('${v.nome}', true)">Iniciar Variante</button>
                </div>
            `).join('')
            : `<p class='text-muted'>Nenhuma variante disponível.</p>`;

        variantesModal.show();
    });
}

function iniciarCaminho(nome, lat, lng) {
    changePath(nome);
    const modal = new bootstrap.Modal(document.getElementById('caminhoModal'));

    document.getElementById("caminhoModalLabel").innerText = nome;
    document.getElementById("caminhoDescricao").innerHTML = `
        <p style="color: #212529;">Você iniciou o percurso principal: <strong>${nome}</strong>. Boa jornada!</p>
        <div id="map" style="height: 400px;" class="mt-3"></div>
    `;

    modal.show();

    document.getElementById('caminhoModal').addEventListener('shown.bs.modal', () => {
        initLeafletMap(parseFloat(lat), parseFloat(lng));
    }, { once: true });
}

function percorrerCaminho(nome, variante) {
    changePath(nome);
    const modal = bootstrap.Modal.getInstance(document.getElementById('caminhoModal'));
    modal.hide();

    const modalDestino = new bootstrap.Modal(document.getElementById('caminhoModal'));

    document.getElementById("caminhoModalLabel").innerText = nome;
    document.getElementById("caminhoDescricao").innerHTML = `
        <p style="color: #212529;">Você iniciou o percurso da ${variante ? 'variante' : 'rota principal'}: <strong>${nome}</strong>. Boa jornada!</p>
        <div id="map" style="height: 400px;" class="mt-3"></div>
    `;

    modalDestino.show();

    document.getElementById('caminhoModal').addEventListener('shown.bs.modal', () => {
        const latPadrao = 42.8782;
        const lngPadrao = -8.5448;
        initLeafletMap(latPadrao, lngPadrao);
    }, { once: true });
}

window.mostrarDetalhesView = mostrarDetalhesView;
window.iniciarCaminho = iniciarCaminho;
window.abrirVariantesModal = abrirVariantesModal;
window.percorrerCaminho = percorrerCaminho;
