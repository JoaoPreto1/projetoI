// Função para carregar os caminhos a partir do JSON Server
function carregarCaminhos() {
    fetch("http://localhost:3000/caminhos")
        .then(response => response.json())
        .then(caminhos => {
            const container = document.getElementById("caminhosContainer");
            container.innerHTML = "";

            caminhos.forEach(caminho => {
                const card = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card p-3">
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


function mostrarDetalhes(caminhoId) {
    console.log("Buscando detalhes do caminho com ID:", caminhoId); // Adicione esta linha para depuração

    fetch(`http://localhost:3000/caminhos/${caminhoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Caminho não encontrado");
            }
            return response.json();
        })
        .then(caminho => {
            console.log("Caminho carregado:", caminho); // Outra linha para depuração
            document.getElementById("detalhesModalLabel").innerText = caminho.nome;
            document.getElementById("detalhesDescricao").innerHTML = `
                <p><strong>Distância:</strong> ${caminho.distancia}</p>
                <p><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
                <p><strong>Descrição:</strong> ${caminho.descricao}</p>
            `;

            
            initMap(caminho.latitude, caminho.longitude);

            let modal = new bootstrap.Modal(document.getElementById('detalhesModal'));
            modal.show();
        })
        .catch(error => console.error("Erro ao carregar os detalhes do caminho:", error));
}




function initMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 10,
        center: { lat: lat, lng: lng }
    });

    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: "Localização do Caminho"
    });
}




document.addEventListener("DOMContentLoaded", carregarCaminhos);
