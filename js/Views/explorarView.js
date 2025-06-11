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
            <i style="width: 60px; height: 35px; border-radius: 50%;" loading="lazy" class="fab">&#xf368 Perfil</i>
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
                            <p class="card-text">${c.descricao}</p>
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