export let filtrarCaminho = async (preferencias) => {
    let response = await fetch('http://localhost:3000/caminhos');
    let caminhos = await response.json();
    let osCaminhos = [];
    caminhos.filter(caminho => {caminho.dificuldade.toLowerCase() == preferencias.dificuldade.toLowerCase();
        if(caminho.dificuldade.toLowerCase() == preferencias.dificuldade.toLowerCase()){
            osCaminhos.push(caminho)
        } 
        });
    return osCaminhos
}

export let nDias = (t, d) => {
    console.log(t)
    const d1 = d.split('km')[0]
    console.log(d1)
    if (t == 'A pé'){
        let nDias = d1 / 25
        if (d1 % 25 !== 0) {
            const [diasInteiros, partesDeDias] = nDias.toString().split('.');
            let diasInteirosTotal = parseInt(diasInteiros) + 1
            return diasInteirosTotal + ' dias'
        }else {
            return nDias + ' dias'
        }
    } else {
        let nDias = d1 / 50
        if (d1 % 50 !== 0) {
            const [diasInteiros, partesDeDias] = nDias.toString().split('.');
            let diasInteirosTotal = parseInt(diasInteiros) + 1
            return diasInteirosTotal + ' dias'
        }else {
            return nDias + ' dias'
        }
    }
}

export async function mostrarDetalhes(caminhoId) {
    try {
        const caminhoID = parseInt(caminhoId);
        const response = await fetch(`http://localhost:3000/caminhos/${caminhoID}`);

        if (!response.ok) {
            throw new Error("Caminho não encontrado");
        }
        const caminho = await response.json();
        return caminho;
    } catch (error) {
        console.error("Erro ao buscar caminho:", error);
        return null;
    }
}