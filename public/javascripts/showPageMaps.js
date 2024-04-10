const map = L.map('map').setView([lat, lon], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([lat, lon]).addTo(map);
marker.bindPopup(popupContent).openPopup();