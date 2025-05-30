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
                     <div id="myPopup" style="display: block; position: fixed; width:80vw; height: 80vh; top: 20%; left: 50%; transform: translate(-50%, -20%); padding: 20px; border: 0px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000; padding:0">
                        <div id="myClosePopUpContainer" style="display:flex; justify-content: flex-end; background-color: white; width:80vw; border:0px;">
                           <button id="myCloseBtn" onclick="closeMyPopUp()" style="background-color:white; color:black; font-size: .7em; text-align:center; width: 2.7vw; height: 2.5vh; border:0px; border-radius: 5px; cursor: pointer;">X</button>
                        </div>
                        <div id= "MyPopUpContainer" style="display:flex; flex-direction: column; align-items:center; justify-content: space-around; width:80vw; background-color: white;">   
                           <h1 style= "color : black";>Adivinha o que está na imagem!</h1>
                           <img src=${imagem.url} style= "width:60vw; height:60vh; loading="lazy";">
                           <div style="display: flex; padding: 50px; display:flex; flex-direction: row; justify-content: space-around; width: 80vw;">  
                              <input id='myAnswer' type= 'text' placeholder="Escreve aqui a tua resposta" style="height: 3vh; width: 15vw; font-size:1rem">
                              <button class="btn-iniciar" onclick="closePopUp('${imagem.nome}')">Adivinhar</button>
                           </div>  
                        </div>
                     </div> 
                `;
                container.innerHTML += card;
               const myCloseBtn = document.querySelector('#myCloseBtn');

               myCloseBtn.addEventListener('mouseenter', () =>{
                  myCloseBtn.style.backgroundColor = '#e32717';
                  myCloseBtn.style.color = 'white';
               })

               myCloseBtn.addEventListener('mouseleave', () =>{
                  myCloseBtn.style.backgroundColor = 'white';
                  myCloseBtn.style.color = 'black';
               })
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
   let urGuess = document.querySelector('#myAnswer').value.toLowerCase();
   if( urGuess === name.toLowerCase() ){
      alert('ACERTASTE');
      closeMyPopUp();
   } else if (urGuess === '') {
      alert('Tens de escrever a resposta Burrooooo');
   } else {
      alert('Errouuuuuuuu');
      closeMyPopUp();
   }
}

let closeMyPopUp = () => {
   document.getElementById('myPopup').style.display = 'none';
}

 