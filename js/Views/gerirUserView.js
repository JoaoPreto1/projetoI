import {voltar, obterUtilizadores, guardarUtilizador, editarUtilizador, removerUtilizador} from '../models/gerirUserModel.js'
import { hitRate } from '../models/gamingModel.js';

document.addEventListener('DOMContentLoaded', async () => {
  await carregarUtilizadoresView(); 
});

let carregarUtilizadoresView = async () => {
    const tbody = document.getElementById('utilizadoresBody');
    tbody.innerHTML = '';
    const utilizadores = obterUtilizadores()
    utilizadores.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${u.id}</td>
    <td>${u.nome}</td>
    <td>${u.email}</td>
    <td>${u.password}</td>
        <td><span class="badge ${u.tipo === 'admin' ? 'bg-danger' : 'bg-secondary'}">${u.tipo}</span></td>
        <td>${u.percurso}</td>
        <td>${u.pontos}</td>
        <td>${u.total}</td>
        <td>
        <button class="btn btn-warning btn-sm me-2" onclick="abrirformulárioEdit(${u.id}, '${u.nome}', '${u.email}','${u.password}', '${u.tipo}', '${u.percurso}', '${u.pontos}', '${u.total}')">✏️</button>
        <button class="btn btn-danger btn-sm" id="deleteUserBtn" onclick="deleteUser(${u.id})">❌</button>
        </td>
        `;
        tbody.appendChild(tr);
    });
}

let deleteUser = (id) => {
    removerUtilizador(id)
    carregarUtilizadoresView();
}
const guardarAddUserBtn = document.getElementById('guardarAddUserBtn');
guardarAddUserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    guardarUtilizadorView()
});

let editarUtilizadorView = () => {
    const id = parseInt(document.getElementById('utilizadorIdE').value);
    const nome = document.getElementById('nomeE').value.trim();
    const email = document.getElementById('emailE').value.trim();
    const password = document.getElementById('passwordE').value.trim();
    const tipo = document.getElementById('tipoE').value;
    const percurso = document.getElementById('percursoE').value;
    const pontos = document.getElementById('pontosE').value;
    const total = document.getElementById('pontosE').value;
    editarUtilizador(id, nome, email, password, tipo, percurso, pontos, total);
    fecharEditFormulario();
    carregarUtilizadoresView();
};

let guardarUtilizadorView = () => {
    const id = document.getElementById('utilizadorId').value;
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const tipo = document.getElementById('tipo').value;
    guardarUtilizador(id, nome, email, password, tipo);
    document.getElementById('formularioUtilizador').style.display = 'none';
    carregarUtilizadoresView();

}
const addUserBtn = document.getElementById('addUserBtn')
addUserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fecharEditFormulario();
    document.getElementById('formularioUtilizador').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Adicionar Utilizador';
    document.getElementById('utilizadorId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('tipo').value = 'user';
})
const closeAddUserBtn = document.getElementById('closeAddUserBtn');
closeAddUserBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('formularioUtilizador').style.display = 'none';
})

let abrirformulárioEdit = (id, nome, email, password, tipo, percurso) => {
    document.getElementById('formularioUtilizador').style.display = 'none';
    document.getElementById('formularioUtilizadorEdit').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Editar Utilizador';
    document.getElementById('utilizadorIdE').value = `${id}`;
    document.getElementById('nomeE').value = `${nome}`;
    document.getElementById('emailE').value = `${email}`;
    document.getElementById('passwordE').value = `${password}`;
    document.getElementById('tipoE').value = `${tipo}`;
    document.getElementById('percursoE').value = `${percurso}`;
}
let fecharEditFormulario = async () => {
    document.getElementById('formularioUtilizadorEdit').style.display = 'none';
}

window.deleteUser = deleteUser;
window.abrirformulárioEdit = abrirformulárioEdit;
window.fecharEditFormulario = fecharEditFormulario;
window.editarUtilizadorView = editarUtilizadorView;