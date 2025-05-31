function carregarCaminhos() {
    fetch("http://localhost:3000/caminhos")
        .then(response => response.json())
        .then(caminhos => {
            const container = document.getElementById("caminhosContainer");
            container.innerHTML = "";

            caminhos.forEach(caminho => {
                const card = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card p-3 border-primary shadow">
                            <div class="card-body">
                                <h5 class="card-title">${caminho.nome}</h5>
                                <p class="card-text"><strong>Distância:</strong> ${caminho.distancia}</p>
                                <p class="card-text"><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
                                <p class="card-text">${caminho.descricao}</p>
                                <a href="#" class="btn btn-primary" onclick="mostrarDetalhes(${caminho.id})">Detalhes</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        })
        .catch(error => console.error("Erro ao carregar os caminhos:", error));
}

function percorrerCaminho(nome, variante) {
    let modal = bootstrap.Modal.getInstance(document.getElementById('detalhesModal'));
    modal.hide();

    let novoModal = new bootstrap.Modal(document.getElementById('caminhoModal'));
    document.getElementById("caminhoModalLabel").innerText = variante
        ? `Percorrendo a variante: ${nome}`
        : `Percorrendo o Caminho Completo: ${nome}`;
    document.getElementById("caminhoDescricao").innerText = `Você iniciou o percurso do caminho: ${nome}. Boa jornada!`;

    novoModal.show();
}

document.addEventListener("DOMContentLoaded", carregarCaminhos);
