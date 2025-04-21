const initBtn = document.querySelector('#initBtn');

initBtn.addEventListener('click', () => {
     carregarImagens()
 })

 const carregarImagens = () => {
   fetch("http://localhost:3000/gamificacao")
        .then(response => response.json())
        .then(gamificacao => {
            const container = document.getElementById("gamificacaoContainer");
            container.innerHTML = "";
            let decider = randomNumb()
            gamificacao.forEach(imagem =>{
               if(Number(imagem.id) === decider){
                  const card = `
                     <div id="myPopup" style="display: block; position: fixed; width:80vw; height: 80vh; top: 20%; left: 50%; transform: translate(-50%, -20%); padding: 20px; background: white; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000;">
                        <h1 style= "color : black";>Adivinha o que está na imagem!</h1>
                        <img src=${imagem.url} style= "width:60vw; height:60vh;">
                        <input id='myAnswer'type= 'text'>
                        <button class="btn-iniciar" onclick="closePopUp('${imagem.nome}')">Adivinhar</button>
                     </div>
                `;
                container.innerHTML += card;
               }
            });
        })
        .catch(error => console.error("Erro ao carregar os caminhos:", error));
}

let randomNumb = () => {
   let min = 0;
   let max = 2;
   let i = Math.floor(Math.random() * (max- min + 1) + min);
   return i 
}
 
let closePopUp = (name) =>  {
   document.getElementById('myPopup').style.display = 'none';
   let urGuess = document.getElementById('myAnswer').value.toLowerCase()
   if( urGuess === name.toLowerCase() ){
      alert('ACERTASTE')
   } else {
      alert('Errouuuuuuuuuuuuuuuuuuuuuuu')
   }
 }

 