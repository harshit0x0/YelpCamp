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
        `<a href="campgrounds/${campground._id}"> 
        <h5> ${campground.title} </h5> </a>
        <p> ${campground.location} </p>`;

    newMarker.bindPopup(popupContent).openPopup();
    markers.addLayer(newMarker);
}
map.addLayer(markers);
