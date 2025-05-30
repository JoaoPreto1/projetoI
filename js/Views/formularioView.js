document.getElementById('formCaminho').addEventListener('submit', function(event) {
            event.preventDefault();
            
            let partida = document.getElementById("localPartida").value;
            let destino = document.getElementById("destino").value;
            let data = document.getElementById("dataViagem").value;
            let dias = document.getElementById("diasViagem").value;
            let alojamento = document.getElementById("alojamento").value || "Não especificado";
            let dificuldade = document.getElementById("nivelDificuldade").value;
            let transporte = document.querySelector('input[name="transporte"]:checked').value;


            if (transporte == 'a pé'){
                
            }

            // Criar o objeto com as preferências do usuário
            let preferencias = {
                partida: partida,
                destino: destino,
                data: data,
                dias: dias,
                alojamento: alojamento,
                dificuldade: dificuldade,
                transporte: transporte
            };
            
            
            fetch('http://localhost:3000/caminhos') 
                .then(response => response.json())
                .then(caminhos => {
                    let melhoresCaminhos = caminhos.filter(caminho => {
                       
                        return caminho.dificuldade.toLowerCase() === dificuldade.toLowerCase();
                    });

                    
                    let caminhoHTML = melhoresCaminhos.map(caminho => {
                        return `
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">${caminho.nome}</h5>
                                    <p><strong>Distância:</strong> ${caminho.distancia}</p>
                                    <p><strong>Descrição:</strong> ${caminho.descricao}</p>
                                <a href="#" class="btn btn-primary" onclick="mostrarDetalhes(${caminho.id})">Detalhes</a>
                                </div>
                        `;
                    }).join('');

                    document.getElementById("melhoresCaminhos").innerHTML = caminhoHTML;
                    document.getElementById("melhoresCaminhos").classList.remove("d-none");
                })
                .catch(error => {
                    console.error("Erro ao obter caminhos:", error);
                });
        });