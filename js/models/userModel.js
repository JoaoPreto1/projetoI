import {obterUtilizadores, salvarUtilizadores} from '../models/gerirUserModel.js'

class User {
  constructor(id, nome, email, password, tipo, percurso, pontos, total){
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.password = password;
    this.tipo = tipo;
    this.percurso = percurso;
    this.pontos = pontos;
    this.total = total;
  }
}

const ADMIN_USER = {
  id: 1,
  nome: "admin",
  email: "admin@gmail.com",
  password: "admin123", 
  tipo: "admin",
  percurso: "Ainda por escolher",
  pontos: 0,
  total: 0,
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
    const editedUser = new User (id, name, email, password, tipo, nome, pontos, total)

    utilizadores.push(editedUser);
    salvarUtilizadores(utilizadores);
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
}

export let countPoints = (acertou) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"))
   const id = user.id
   const name = user.nome
   const email = user.email
   const password = user.password
   const percurso = user.percurso
   const tipo = user.tipo
   const pontos = parseInt(user.pontos)
   const total = user.total
   let utilizadores = obterUtilizadores().filter(u => u.id != id);
   const pontosN = pontos + 1;
   const totalN = parseInt(total) +1;
    if(acertou){
      const editedUser = new User(id, name, email, password, tipo, percurso,pontosN,totalN)
    utilizadores.push(editedUser);
    salvarUtilizadores(utilizadores);
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
    } else {
      const editedUser = new User(id, name, email, password, tipo, percurso,pontos,totalN)
    utilizadores.push(editedUser);
    salvarUtilizadores(utilizadores);
    localStorage.setItem("loggedInUser", JSON.stringify(editedUser));
    }
}

export let getPoints = () => {
const user = JSON.parse(localStorage.getItem("loggedInUser"))
const total = user.pontos
return total
}

