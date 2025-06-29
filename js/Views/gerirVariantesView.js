import { carregarCaminhos, mostrarDetalhes, guardarVariante, deleteVariante, editarVariante } from "../models/CaminhoModel.js";

// Declaração de variáveis
const etapasBody = document.getElementById('variantesBody');
const addVarianteBtn = document.getElementById('addVarianteBtn');
const formularioVariantes = document.getElementById('formularioVariantes');
const formularioVarianteEdit = document.getElementById('formularioVarianteEdit');
const guardarAddVarianteBtn = document.getElementById('guardarAddVarianteBtn');

let carregarVariantes = async () => {
    etapasBody.innerHTML = '';
    const caminhos = await carregarCaminhos();
    for(let caminho of caminhos){
        if(caminho.variantes){
        caminho.variantes.forEach(v => {
            let row = `
            <tr>
            <td>${v.id}</td>
            <td>${v.nome}</td>
            <td>${v.descricao}</td>
            <td>${v.distancia}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="abrirformulárioEdit(${v.id}, '${v.nome}', '${v.descricao}', '${v.distancia}')">✏️</button>
                <button class="btn btn-danger btn-sm" id="deleteVarianteBtn" onclick="deleteVarianteView(${v.id}, '${v.nome}')">❌</button>
            </td>
            </tr>
            `
            
            etapasBody.innerHTML += row;
        }); 
        }
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    await carregarVariantes();
})

let abrirformulárioEdit = (id, nome, descricao, distancia) => {
    fecharFormulário()
    formularioVarianteEdit.style.display = 'block';
    document.getElementById('formTitle').innerText = 'Editar Variante';
    document.getElementById('VarianteIdE').value = `${id}`;
    document.getElementById('nomeE').value = `${nome}`;
    document.getElementById('descricaoE').value = `${descricao}`;
    document.getElementById('distanciaE').value = `${distancia}`;
}

let fecharEditFormulario = async () => {
    formularioVarianteEdit.style.display = 'none';
}
let fecharFormulário = () => {
    formularioVariantes.style.display = 'none';
}

addVarianteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const varianteId = document.getElementById('varianteId');
    fecharEditFormulario();
    formularioVariantes.style.display = 'block';
    document.getElementById('formTitle').innerText = 'Adicionar Variante';
    varianteId.value = '';
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('distancia').value = '';

    const caminhos = await carregarCaminhos();
    await caminhos.forEach(caminho => {
        let option = `
        <option value="${caminho.id}">${caminho.nome}</option>
        `
        varianteId.innerHTML += option;

    })
})

class Variante {
    constructor(id, nome, descricao, distancia){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.distancia = distancia;
    }
}
guardarAddVarianteBtn.addEventListener('click', async () => {
    const id = document.getElementById('varianteId').value;
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const distancia = document.getElementById('distancia').value.trim();
    try{
        const caminhoSelected = await mostrarDetalhes(id);
        const novoId = parseFloat(`${caminhoSelected.id}.${caminhoSelected.variantes.length + 1}`);
        let novaVariante = new Variante(novoId, nome, descricao, distancia)
    await guardarVariante(caminhoSelected, novaVariante);
    fecharFormulário();
    await carregarVariantes();
    }catch(err){
        console.error(err);
    }  
})

let deleteVarianteView = async (id, nome) => {
    if(confirm('Quer mesmo apagar esta variante?')){
        await deleteVariante(id);
        alert(`Variante ${nome} apagada com sucesso!`)
    }
}

let editarVarianteView = async () => {
    const VarianteIdE = document.getElementById('VarianteIdE').value;
    const nomeE = document.getElementById('nomeE').value;
    const descricaoE = document.getElementById('descricaoE').value;
    const distanciaE = document.getElementById('distanciaE').value;
    let obj = new Variante(VarianteIdE, nomeE, descricaoE, distanciaE);
    let idInt = Math.floor(VarianteIdE) 
    await editarVariante(idInt, obj);
    await carregarVariantes();
}

window.abrirformulárioEdit = abrirformulárioEdit;
window.fecharEditFormulario = fecharEditFormulario;
window.deleteVarianteView = deleteVarianteView;
window.editarVarianteView = editarVarianteView;