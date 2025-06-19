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
      return null; // important!
    }
     let caminho;
    try {
      caminho = await res.json();
    } catch (jsonErr) {
      console.error("Erro ao converter JSON:", jsonErr);
      throw jsonErr;  // rethrow to catch below
    }
    return caminho;
  } catch (err) {
    console.error("Erro ao buscar caminho:", err);
    return null; // explicitly return null or false
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

export let guardarVariante = async (obj, novoId, nome, descricao, distancia) => {
  const varianteN = { id: novoId, nome, descricao, distancia };

  try {
    let variantesT = obj.variantes;
    variantesT.push(varianteN)

    const res = await fetch(`http://localhost:3000/caminhos/${obj.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantes: variantesT })
    });

    if (!res.ok) {
      const msg = await res.text();
      console.warn(`Resposta inesperada: ${res.status} - ${msg}`);
      return true;
    }

    // Verifica se a resposta tem conteúdo antes de tentar ler o JSON
    const contentType = res.headers.get("content-type");
    let dataAtualizada = null;

    if (contentType && contentType.includes("application/json")) {
      dataAtualizada = await res.json();
    } else {
      console.warn("Resposta sem JSON, mas aparentemente OK.");
      dataAtualizada = true;
    }

    return dataAtualizada;
  } catch (err) {
    console.error("Erro em guardarVariante:", err);
    return false;
  }
};



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