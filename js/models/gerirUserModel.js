export function voltar() {
      window.history.back();
}

export function obterUtilizadores() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

export function salvarUtilizadores(utilizadores) {
    localStorage.setItem('users', JSON.stringify(utilizadores));
}
    
let isGmail = (email) => {
    if(email.trim().toLowerCase().endsWith("@gmail.com")){
    return true  
    } else {
      return false
    }
}
export function guardarUtilizador(id, nome, email, password, tipo) {
    if(isGmail(email)){
        let utilizadores = obterUtilizadores();
      
        const novoId = utilizadores.length ? Math.max(...utilizadores.map(u => u.id)) + 1 : 1;
        const novoUser = {
            id : novoId,
            nome: nome,
            email: email,
            password: password,
            tipo : tipo
        }
        utilizadores.push(novoUser);
      
        salvarUtilizadores(utilizadores);
    } else {
        alert('Ao menos tenta usar um email que possa existir!')
    } 
}
export let editarUtilizador = (id, nome, email, password, tipo) => {
    if(isGmail(email)){
    let utilizadores = obterUtilizadores().filter(u => u.id !== id);
    console.log(utilizadores)
    const editedUser = {
        id : id,
        nome: nome,
        email: email,
        password: password,
        tipo : tipo
    }
        utilizadores.push(editedUser);
  
        salvarUtilizadores(utilizadores);
    } else {
    alert('Ao menos usa um email que possa existir!')
    }
}

export function removerUtilizador(id) {
    if (confirm('Deseja remover este utilizador?')) {
        let utilizadores = obterUtilizadores().filter(u => u.id !== id);
        salvarUtilizadores(utilizadores);
    }
}