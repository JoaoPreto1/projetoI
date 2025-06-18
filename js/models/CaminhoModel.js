export let filtrarCaminho = async (preferencias) => {
  let response = await fetch('http://localhost:3000/caminhos');
  let caminhos = await response.json();

  return caminhos.filter(caminho =>
    caminho.dificuldade.toLowerCase() === preferencias.dificuldade.toLowerCase()
  );
};

export let nDias = (transporte, distancia) => {
  const d1 = parseFloat(distancia.replace('km', '').trim());

  const passo = transporte === 'A pé' ? 25 : 50;
  const dias = Math.ceil(d1 / passo);
  return `${dias} dias`;
};

export async function mostrarDetalhes(caminhoId) {
  try {
    const res = await fetch(`http://localhost:3000/caminhos/${parseInt(caminhoId)}`);

    if (!res.ok) {
      console.error(`ID não encontrado: ${caminhoId}`);
      throw new Error("Caminho não encontrado");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar caminho:", error);
    return null;
  }
}

export async function carregarCaminhos() {
  try {
    const res = await fetch("http://localhost:3000/caminhos");
    if (!res.ok) throw new Error("Caminhos não encontrados!");
    return await res.json();
  } catch (err) {
    console.error("Erro ao buscar os caminhos", err);
  }
}

export let guardarVariante = async (id, novoId, nome, descricao, distancia) => {
  class CaminhoNew{
    constructor(id, nome, distancia, dificuldade, descricao, latitude, longitude, variantes){
      this.id = id,
      this.nome = nome,
      this.distancia = distancia,
      this.dificuldade = dificuldade,
      this.descricao = descricao,
      this.latitude = latitude,
      this.longitude = longitude,
      this.variantes = variantes
    }
  }
  const varianteN = {id : novoId, nome, descricao, distancia}
  try{
    let caminho = await mostrarDetalhes(id)
    console.log(caminho)
    caminho.variantes.push(varianteN);
    const caminhoE = new CaminhoNew(caminho.id, caminho.nome, caminho.distancia, caminho.dificuldade, caminho.descricao, caminho.latitude, caminho.longitude, caminho.variantes)
    console.log(caminhoE)
    await fetch(`http://localhost:3000/caminhos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(caminhoE)
    }); 
  } catch(err){
    console.error(err)
  }
}

export let deleteVariante = async (id) => {
  const stId = Math.floor(id)
  try {
    const caminho = await mostrarDetalhes(stId);
    if (!caminho) {
      console.error("Caminho não encontrado");
      return;
    }

    const variantesAtualizadas = caminho.variantes.filter(v => v.id != id);

    const caminhoAtualizado = {
      ...caminho,
      variantes: variantesAtualizadas
    };

    
    await fetch(`http://localhost:3000/caminhos/${stId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caminhoAtualizado)
    });

  } catch (error) {
    console.error("Erro ao remover variante:", error);
  }
}