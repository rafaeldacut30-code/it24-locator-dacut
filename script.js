
const map = L.map('map').setView([12.8797, 121.7740], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);

const form = document.getElementById('searchForm');
const input = document.getElementById('cityInput');
const status = document.getElementById('status');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const city = input.value.trim();

    markerLayer.clearLayers();

    status.textContent = 'Searching...';

    try {

        const url = 'https://geocoding-api.open-meteo.com/v1/search?name='
            + encodeURIComponent(city)
            + '&count=5&language=en&format=json';

        const response = await fetch(url);
        const data = await response.json();

        const locations = data.results || [];

        if (locations.length === 0) {
            status.textContent = 'No city found!';
            return;
        }

        locations.forEach((place) => {

            const coords = [place.latitude, place.longitude];

            L.marker(coords)
                .addTo(markerLayer)
                .bindPopup(place.name + ', ' + place.country);

        });

        status.textContent = 'Found ' + locations.length + ' location(s)!';

      if (locations.length === 1) {
    map.setView(
        [locations[0].latitude, locations[0].longitude], 11
    );
} else {
    const bounds = locations.map(place => [
        place.latitude,
        place.longitude
    ]);

    map.fitBounds(bounds);
}
  } catch (error) {
    status.textContent = 'Error: ' + error.message;
    console.error(error);
}

});
