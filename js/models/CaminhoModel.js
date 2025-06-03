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