var map1 = L.map('map1').setView([51.505, -0.09], 13);
// We can also use this 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' without the need of my token. It gives OpenStreetMap tile layer
L.tileLayer('http://api.tiles.mapbox.com/v4/examples.map-zr0njcqy/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoidGFoYW5pIiwiYSI6ImkzZzlHaE0ifQ.oUpKTblIElF_hDsUKN6Lqw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map1);

Map1 = {
    map: map1,
    addRecentNearbyObservationsAsMarkers: function (observations) {
        // make markers
        var markers = [];
        var latLngs = [];

        $.get('/views/marker.jade', function (template) {
            for (var i = 0; i < observations.length; i++) {
                var html = jade.render(template, { observation: observations[i] });
                latLngs.push(L.latLng(observations[i].lat, observations[i].lng));
                var marker = L.marker([observations[i].lat, observations[i].lng]).addTo(map1);
                marker.bindPopup(html);
                markers.push(marker);
            }
        }).success(function () {
            var group = new L.featureGroup(markers);
            map1.fitBounds(group.getBounds());
        });
    }
};

//
var marker = L.marker([51.5, -0.09]).addTo(map1);
//
var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(map1);
//
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map1);
//
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");
//
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map1);
/*
function onMapClick(e) {
    alert("You clicked the map1 at " + e.latlng);
}
map1.on('click', onMapClick);
*/
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map1 at " + e.latlng.toString())
        .openOn(map1);
}

map1.on('click', onMapClick);

