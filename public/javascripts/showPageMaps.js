// const map = L.map('map').setView([lat, lon], 13);
const map = L.map('map', {
    minZoom: 5,
    zoom: 13
}).setView([lat, lon]);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([lat, lon]).addTo(map);
marker.bindPopup(popupContent).openPopup();