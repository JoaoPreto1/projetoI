import {filtrarCaminho, nDias, mostrarDetalhes} from '../models/CaminhoModel.js'

document.getElementById('formCaminho').addEventListener('submit', async function(event) {
event.preventDefault();
            
let partida = document.getElementById("localPartida").value;
let destino = document.getElementById("destino").value;
let data = document.getElementById("dataViagem").value;
let alojamento = document.getElementById("alojamento").value || "Não especificado";
let dificuldade = document.getElementById("nivelDificuldade").value;
let transporte = document.querySelector('input[name="transporte"]:checked').value;


// Criar o objeto com as preferências do usuário
let preferencias = {
    partida: partida,
    destino: destino,
    data: data,
    alojamento: alojamento,
    dificuldade: dificuldade,
    transporte: transporte
};
try {
        let melhoresCaminhos = await filtrarCaminho(preferencias)
        let caminhoHTML = melhoresCaminhos.map(caminho => {
            let Ndias = nDias(preferencias.transporte, caminho.distancia)
            return `
                <div class="card mb-3">
                <div class="card-body">
                <h5 class="card-title">${caminho.nome}</h5>
                <p><strong>Numero de dias:</strong> ${Ndias}</p>
                <p><strong>Distância:</strong> ${caminho.distancia}</p>
                <p><strong>Descrição:</strong> ${caminho.descricao}</p>
                <a href="#" class="btn btn-primary" onclick="mostrarDetalhesView(${caminho.id})">Detalhes</a>
                </div>
                    `;
                }).join('');
                
                document.getElementById("melhoresCaminhos").innerHTML = caminhoHTML;
                document.getElementById("melhoresCaminhos").classList.remove("d-none");
            }catch(err) {
                console.error("Erro ao obter caminhos:", err);
    }
});

let mostrarDetalhesView = async (id) => {
    try {
        let caminho = await mostrarDetalhes(id)
        const myH1 = document.createElement("h1");
        myH1.innerText = caminho.nome;
        myH1.id = "myH1";
        const myPara = document.createElement("p");
        myPara.id = "myPara";
        myPara.innerHTML = `
            <p><strong>Distância:</strong> ${caminho.distancia}</p>
            <p><strong>Dificuldade:</strong> ${caminho.dificuldade}</p>
            <p><strong>Descrição:</strong> ${caminho.descricao}</p>
        `;

        const variantesContainer = document.createElement("div");
        variantesContainer.innerHTML = "";

        if (caminho.variantes?.length) {
            caminho.variantes.forEach(variacao => {
                variantesContainer.innerHTML += `
                    <div class="card mb-2 p-2 border-secondary">
                        <h6 class="m-0">${variacao.nome}</h6>
                        <p class="m-0 text-muted"><small>${variacao.distancia}</small></p>
                        <button class="btn btn-sm btn-outline-primary mt-1" onclick="percorrerCaminho('${variacao.nome}', true)">Percorrer</button>
                    </div>
                `;
            });
        } else {
            variantesContainer.innerHTML = "<p class='text-muted'>Nenhuma variante disponível.</p>";
        }

        variantesContainer.innerHTML += `
            <button class="btn btn-success mt-3 w-100" onclick="percorrerCaminho('${caminho.nome}', false)">Percorrer o Caminho Completo</button>
        `;

        // CORRIGIDO: chamava initMap, agora chama initLeafletMap
        initLeafletMap(caminho.latitude, caminho.longitude);

        let modal = new bootstrap.Modal(document.createElement('div'));
        modal.show();
        }catch (err) {
            console.error("Erro ao carregar os detalhes do caminho:", err)
        }
}
window.mostrarDetalhesView = mostrarDetalhesView