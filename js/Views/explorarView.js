import {carregarCaminhos} from '../models/CaminhoModel.js'

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
                                <a href="#" class="btn btn-primary" onclick="mostrarDetalhes(${c.id})">Detalhes</a>
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