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
                <i class="fas fa-user-circle me-1"></i> Perfil
            </a>
        `;
    }
});

let CarregarCaminhosView = async () => {
    const Caminhos = await carregarCaminhos();
    const container = document.getElementById("caminhosContainer");
    if (!container || !Caminhos) return;
    container.innerHTML = "";

    Caminhos.forEach(c => {
        const descPreview = Array.isArray(c.descricao) ? c.descricao[0] : c.descricao;
        const diffStr = (c.dificuldade || '').toLowerCase();
        const diffClass = diffStr.includes('fácil') ? 'badge-facil' 
                        : (diffStr.includes('médio') || diffStr.includes('moderado')) ? 'badge-moderado' 
                        : 'badge-dificil';

        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="card caminho-card h-100 d-flex flex-column justify-content-between shadow-sm border-0" style="border-radius: 18px;">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
                            <h5 class="card-title fw-bold m-0" style="color: var(--primary);">${c.nome}</h5>
                            <span class="camino-badge ${diffClass} text-nowrap">${c.dificuldade || 'Normal'}</span>
                        </div>
                        <div class="mb-3 text-muted small fw-semibold">
                            <i class="fas fa-map-marker-alt text-danger me-1"></i> ${c.distancia}
                        </div>
                        <p class="card-text text-muted" style="line-height: 1.6; font-size: 0.93rem;">${descPreview}</p>
                    </div>
                    <div class="card-footer bg-light bg-opacity-50 border-top p-3 text-center">
                        <a href="javascript:void(0)" class="btn btn-outline-primary w-100 fw-semibold" onclick="mostrarDetalhesView(${c.id})">
                            <i class="fas fa-info-circle me-1"></i> Ver detalhes
                        </a>
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
        if (!caminho) return;

        document.getElementById("detalhesModalLabel").innerText = caminho.nome;

        const fullDesc = Array.isArray(caminho.descricao) ? (caminho.descricao[1] || caminho.descricao[0] || "") : caminho.descricao;
        let textinho = fullDesc.indexOf('.');
        let textinhoPequeno = textinho !== -1 ? fullDesc.substring(0, textinho + 1) : fullDesc;
        
        document.getElementById("detalhesDescricao").innerHTML = `
            <p style="color: #212529"><strong>Distância:</strong> ${caminho.distancia}</p>
            <p style="color: #212529"><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
            <p style="color:black" id="antesVerMais"><strong>Descrição:</strong> ${textinhoPequeno} ${textinho !== -1 ? '<span style="color:blue; text-decoration:none; cursor: pointer;" id="verMais">ver mais...</span>' : ''}</p>
        `;
        const antesVerMais = document.getElementById('antesVerMais');
        const verMais = document.getElementById('verMais');

        if (verMais) {
            verMais.addEventListener('click', async () => {
                verMais.style.display = 'none';
                antesVerMais.innerHTML = `<strong>Descrição:</strong> ${fullDesc}`;
            });
        }

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
