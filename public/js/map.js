mapboxgl.accessToken = accessToken;

if (!mapboxgl.supported()) {
    alert('Your browser does not support mapbox gl!')
}

const map = new mapboxgl.Map({
    container : 'map',
    style : 'mapbox://styles/mapbox/light-v10',
    center: trip.geometry.coordinates,
    zoom : 10
});

var marker = new mapboxgl.Marker()
    .setLngLat(trip.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset : 25})
        .setHTML(
            `<h6>${trip.title}</h6>
            <p>${trip.location}</p>`
        )
    )
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());