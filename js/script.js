let map;

function initMap(latitude = 42.8782, longitude = -8.5448) {
    const center = { lat: latitude, lng: longitude };

  
    map = new google.maps.Map(document.getElementById("mapa"), {
        center: center,
        zoom: 12, 
    });

   
    new google.maps.Marker({
        position: center,
        map: map,
        title: "Caminho de Santiago",
    });
}

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

function mostrarDetalhes(caminhoId) {
    fetch(`http://localhost:3000/caminhos/${caminhoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Caminho não encontrado");
            }
            return response.json();
        })
        .then(caminho => {
            document.getElementById("detalhesModalLabel").innerText = caminho.nome;
            document.getElementById("detalhesDescricao").innerHTML = `
                <p><strong>Distância:</strong> ${caminho.distancia}</p>
                <p><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
                <p><strong>Descrição:</strong> ${caminho.descricao}</p>
            `;

            const variantesContainer = document.getElementById("variantesContainer");
            variantesContainer.innerHTML = ""; 

            if (caminho.variantes && caminho.variantes.length > 0) {
                caminho.variantes.forEach(variacao => {
                    const varianteCard = `
                        <div class="card mb-2 p-2 border-secondary">
                            <h6 class="m-0">${variacao.nome}</h6>
                            <p class="m-0 text-muted"><small>${variacao.distancia}</small></p>
                            <button class="btn btn-sm btn-outline-primary mt-1" onclick="percorrerCaminho('${variacao.nome}', true)">Percorrer</button>
                        </div>
                    `;
                    variantesContainer.innerHTML += varianteCard;
                });
            } else {
                variantesContainer.innerHTML = "<p class='text-muted'>Nenhuma variante disponível.</p>";
            }

            variantesContainer.innerHTML += `
                <button class="btn btn-success mt-3 w-100" onclick="percorrerCaminho('${caminho.nome}', false)">Percorrer o Caminho Completo</button>
            `;

          
            initMap(caminho.latitude, caminho.longitude);

            let modal = new bootstrap.Modal(document.getElementById('detalhesModal'));
            modal.show();
        })
        .catch(error => console.error("Erro ao carregar os detalhes do caminho:", error));
}

function percorrerCaminho(nome, variante) {
    let modal = bootstrap.Modal.getInstance(document.getElementById('detalhesModal'));
    modal.hide();

    let novoModal = new bootstrap.Modal(document.getElementById('caminhoModal'));
    document.getElementById("caminhoModalLabel").innerText = variante ? `Percorrendo a variante: ${nome}` : `Percorrendo o Caminho Completo: ${nome}`;
    document.getElementById("caminhoDescricao").innerText = `Você iniciou o percurso do caminho: ${nome}. Boa jornada!`;

    novoModal.show();
}


// let MyRandomNumber = () => {
//     const min = 0;
//     const max = 2;
//     let i = Math.floor(Math.random() * (max- min + 1) + min);
//     return i

// }

// const initBtn = document.querySelector('#initBtn')

// initBtn.addEventListener('click', (MyRandomNumber) => {
//     alert('MyRandomNumber')
// })
    



document.addEventListener("DOMContentLoaded", carregarCaminhos);
document.addEventListener("DOMContentLoaded", carregarCaminhos);
