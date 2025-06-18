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

export let guardarVariante = async (id, nome, descricao, distancia) => {
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
  const varianteN = {id, nome, descricao, distancia}
  console.log(varianteN)
  let intId = Math.floor(id)
  console.log(intId)
  let caminho = await mostrarDetalhes(intId)
  caminho.variantes.push(varianteN);
  const caminhoE = new CaminhoNew(caminho.id, caminho.nome, caminho.distancia, caminho.dificuldade, caminho.descricao, caminho.latitude, caminho.longitude, caminho.variantes)
  console.log(caminhoE)
  let caminhos = await carregarCaminhos()
  caminhos = caminhos.filter(c => c.id != intId)
  caminhos.push(caminhoE)
  caminhos.sort((a, b) => a.id - b.id);
  await fetch(`http://localhost:3000/caminhos/${intId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(caminhoE)
  }); 
}