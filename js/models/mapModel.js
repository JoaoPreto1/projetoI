// mapModel.js

export function initLeafletMap(destLat, destLng) {
    const mapElement = document.getElementById('map'); // ID correto do container

    if (!mapElement) {
        console.error("Elemento #map não encontrado no DOM.");
        return;
    }

    
    mapElement.innerHTML = "";

    // Cria o mapa
    const map = L.map('map').setView([destLat, destLng], 10);

    // Adiciona o tile layer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    
    L.marker([destLat, destLng]).addTo(map)
        .bindPopup("Destino: Caminho de Santiago")
        .openPopup();

   
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Adiciona marcador do utilizador
            L.marker([userLat, userLng]).addTo(map)
                .bindPopup("Você está aqui").openPopup();

            // Linha entre a posição atual e o destino
            const linha = L.polyline([[userLat, userLng], [destLat, destLng]], {
                color: 'blue',
                weight: 4,
                opacity: 0.7,
            }).addTo(map);

            
            map.fitBounds(linha.getBounds());
        }, () => {
            alert("Não foi possível obter a sua localização.");
        });
    } else {
        alert("Geolocalização não suportada no seu navegador.");
    }
}
