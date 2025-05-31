export function initLeafletMap(destLat, destLng) {
    const mapElement = document.getElementById('mapa');
    if (!mapElement) {
        console.error("Elemento #mapa não encontrado no DOM.");
        return;
    }

    const map = L.map('mapa').setView([destLat, destLng], 10);

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

            L.marker([userLat, userLng]).addTo(map)
                .bindPopup("Você está aqui").openPopup();

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