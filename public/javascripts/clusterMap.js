const map = L.map('map', {
    minZoom: 1,
    zoom: 4
}).setView([39, -94]);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const campgrounds = (campgroundData.features);

const markers = L.markerClusterGroup();
for (let campground of campgrounds) {
    const newMarker = L.marker(new L.latLng(campground.lat, campground.lon));    
    popupContent = 
        `
        <a class="popUpLink" href="campgrounds/${campground._id}"> ${campground.title} </a>
        <p class="popUpLocation"> ${campground.location} </p>
        <img class="popUpImg" src = ${campground.images[0].url.replace('/upload', '/upload/w_200') }>
        `;

    newMarker.bindPopup(popupContent);
    popupContent.onload = function () {
        newMarker.openPopup();
    };
    markers.addLayer(newMarker);
}
map.addLayer(markers);

map.on('popupopen', function (e) {
    $('img.popUpImg').on('load', function () {
        e.popup.update()
    })
})
