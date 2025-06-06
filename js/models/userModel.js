import {obterUtilizadores, salvarUtilizadores} from '../models/gerirUserModel.js'
const ADMIN_USER = {
  id: 1,
  nome: "admin",
  email: "admin@gmail.com",
  password: "admin123", 
  tipo: "admin"
};


export function initAdminUser() {
  let users = JSON.parse(localStorage.getItem('users')) || [];

  const adminExists = users.some(user => user.id === ADMIN_USER.id);

  if (!adminExists) {
    users.push(ADMIN_USER);
    localStorage.setItem('users', JSON.stringify(users));
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

export function findUser(email, password) {
  return getUsers().find(user => user.email === email && user.password === password);
}

export let getLoggedInTotal = async () => {
  const user = await JSON.parse(localStorage.getItem("loggedInUser"))
  const total = user.total
  return total
} 

export let getLoggedInPoints = async () => {
  const user = await JSON.parse(localStorage.getItem("loggedInUser"))
  return user.pontos
}

export let changePath = async (nome) => {
   const user = JSON.parse(localStorage.getItem("loggedInUser"))
   const id = user.id
   const name = user.nome
   const email = user.email
   const password = user.password
   const tipo = user.tipo
   const pontos = user.pontos
   const total = user.total
   let utilizadores = obterUtilizadores().filter(u => u.id !== id);
    const editedUser = {
        id : id,
        nome: name,
        email: email,
        password: password,
        tipo : tipo,
        percurso: nome,
        pontos: pontos,
        total : total
    }
    utilizadores.push(editedUser);
    salvarUtilizadores(utilizadores);
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
}

export let countPoints = async (acertou) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"))
   const id = user.id
   const name = user.nome
   const email = user.email
   const password = user.password
   const percurso = user.percurso
   const tipo = user.tipo
   const pontos = user.pontos
   const total = user.total
   let utilizadores = obterUtilizadores().filter(u => u.id !== id);
    if(acertou){
      const editedUser = {
        id : id,
        nome: name,
        email: email,
        password: password,
        tipo : tipo,
        percurso: percurso,
        pontos: parseInt(pontos) + 1,
        total : parseInt(total) + 1
    }
    utilizadores.push(editedUser);
    salvarUtilizadores(utilizadores);
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
    } else {
      const editedUser = {
        id : id,
        nome: name,
        email: email,
        password: password,
        tipo : tipo,
        percurso: percurso,
        pontos: parseInt(pontos),
        total : parseInt(total) + 1
    }
    utilizadores.push(editedUser);
    salvarUtilizadores(utilizadores);
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
    }
}

