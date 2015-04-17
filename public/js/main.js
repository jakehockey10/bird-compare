/**
 * Created by jake on 4/8/15.
 */

/**
 * Map class to accept results from eBird API calls and display on the DOM element maps
 * @param map
 * @returns {{map: *, addRecentNearbyObservationsAsMarkers: Function, addMarker: Function, addCircle: Function, addPolygon: Function, addPopup: Function, addPopupWithClickListener: Function}}
 * @constructor
 */
var Map = function (map) {
    var fitBoundsOfMapToMarkerGroupBounds = function (markers) {
        var group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    };

    var constructMarkersForEBirdResults = function (objects, template) {
        var latLngs = [];
        var markers = [];
        var object, html, marker;
        for (var i = 0; i < objects.length; i++) {
            object = objects[i];
            html = jade.render(template, {observation: object});
            latLngs.push(L.latLng(object.lat, object.lng));
            marker = L.marker([object.lat, object.lng]).addTo(map);
            marker.bindPopup(html);
            markers.push(marker);
        }

        return markers;
    };

    return {
        /**
         * reference to DOM element
         */
        map: map,
        /**
         * Render the observations that comes from the "Recent Nearby Observations" endpoint of the eBird API.
         * @param observations
         */
        addRecentNearbyObservationsAsMarkers: function (observations) {
            $.get('/views/observationMarker.jade', function (template) {
                markers = constructMarkersForEBirdResults(observations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds(markers);
            });
        },
        /**
         * Render the locations that comes from the "Nearest Locations With Observations Of A Species" endpoint of the eBird API.
         * @param locations
         */
        addNearestLocationsWithObservationsOfASpecies: function (locations) {
            $.get('/views/locationMarker.jade', function (template) {
                markers = constructMarkersForEBirdResults(locations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds(markers);
            })
        },
        /**
         * Adds a marker at the location of latLng.  Also binds a popup to it, but it is a silly little popup.
         * This method should change before being heavily used.
         * @param latLng
         */
        addMarker: function (latLng) {
            latLng = latLng || [51.5, -0.09];
            var marker = L.marker(latLng).addTo(map);
            // TODO: Make the binding of a popup more dynamic (i.e. opt-in/opt-out, customize message, etc.)
            marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        },
        /**
         * Adds a circle at the location of latLng.  Also binds a popup to it, but it is a silly little popup.
         * This method should change before being heavily used.
         * @param latLng
         * @param radius
         * @param color
         * @param fillColor
         * @param fillOpacity
         */
        addCircle: function (latLng, radius, color, fillColor, fillOpacity) {
            latLng = latLng || [51.508, -0.11];
            radius = radius || 500;
            color = color || 'red';
            fillColor = fillColor || '#f03';
            fillOpacity = fillOpacity || 0.5;
            var circle = L.circle(latLng, radius, {
                color: color,
                fillColor: fillColor,
                fillOpacity: fillOpacity
            }).addTo(map);
            // TODO: make the binding of a popup more dynamic (i.e. opt-in/opt-out, customize message, etc.)
            circle.bindPopup("I am a circle.");
        },
        /**
         * Adds a polygon with vertices set by latLngs.  Also binds a popup to it, but it is a silly little popup.
         * This method should change before being heavily used.
         * @param latLngs
         */
        addPolygon: function (latLngs) {
            latLngs = latLngs || [
                [51.509, -0.08],
                [51.503, -0.06],
                [51.51, -0.047]
            ];
            var polygon = L.polygon(latLngs).addTo(map);
            polygon.bindPopup("I am a polygon.");
        },
        /**
         * Adds a popup at the location of latLng.
         * @param latLng
         */
        addPopup: function (latLng) {
            latLng = latLng || [51.5, -0.09];
            var popup = L.popup()
                .setLatLng(latLng)
                .setContent("I am a standalone popup.")
                .openOn(map);
        },
        /**
         * Adds a popup that appears where the user clicks on the map.
         */
        addPopupWithClickListener: function () {
            var popup = L.popup();
            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            }

            map.on('click', onMapClick);
        }
    };
};

/**
 * Sets the view for the DOM element of id @param id according to @param center of view and @param zoom level
 * @param id
 * @param center
 * @param zoom
 * @returns {*}
 */
function setThenGetDOMMapView(id, center, zoom) {
    // TODO: Find better defaults
    zoom = zoom || 13;
    center = center || [51.505, -0.09];
    id = id || 'map';
    var map = L.map(id).setView(center, zoom);
    // We can also use this 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' without the need of my token. It gives OpenStreetMap tile layer
    L.tileLayer('http://api.tiles.mapbox.com/v4/examples.map-zr0njcqy/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoidGFoYW5pIiwiYSI6ImkzZzlHaE0ifQ.oUpKTblIElF_hDsUKN6Lqw', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);
    return map;
}

/**
 * Create Map objects that point to the DOM element maps via the map property (i.e. Map1.map)
 * as well as adding markers, circles, polygons, popups, popups with click listeners, etc.  This Map
 * "Class" also responds to requests sent to the eBird API and will display that information in the map
 * when the request comes back successfully.
 * @type {*}
 */
var Map1 = new Map(setThenGetDOMMapView('map1', [51.505, -0.09], 13));
var Map2 = new Map(setThenGetDOMMapView('map2', [40.26276, -83.47412], 7));

/**
 * Keep the examples that were in map1.js and map2.js from before, for now.
 */
Map1.addMarker();
Map1.addCircle();
Map1.addPolygon();
Map1.addPopup();
Map2.addPopupWithClickListener();

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setRecentNearbyObservationsClickListener() {
    $('#recent_nearby_observations').on('click', function () {
        var parameters = {
            lat: 42.46,
            lng: -76.51
        };

        $.get('/birds/data/obs/geo/recent', parameters, function (data) {
            if (data.err) {
                $('#response').html(JSON.stringify(data.err))
            } else if (data.template) {
                $('#response').html(data.template);
            } else if (data.body) {
                $.get('/views/observationResponse.jade', function (template) {
                    var response = JSON.parse(data.body);
                    var html = jade.render(template, {items: response});
                    $('#response').html(html);

                    Map1.addRecentNearbyObservationsAsMarkers(response);
                });
            } else {
                $('#response').html('something went wrong.');
            }
        })
    })
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setNearestLocationsWithObservationsOfASpeciesClickListener() {
    $('#nearest_locations_of_species').on('click', function () {
        var parameters = {
            lat: 42.46,
            lng: -76.51,
            sci: 'Branta canadensis'
        };

        $.get('/birds/data/nearest/geo_spp/recent', parameters, function (data) {
            var response = JSON.parse(data.body);
            if (data.err) {
                $('#response').html(JSON.stringify(data.err));
            } else if (response[0].errorCode) {
                $('#response').html(JSON.stringify(response[0].errorMsg));
            } else if (data.template) {
                $('#response').html(data.template);
            } else if (data.body) {
                $.get('/views/locationResponse.jade', function (template) {
                    var html = jade.render(template, {items: response});
                    $('#response').html(html);
                    console.log(JSON.stringify(response, null, 2));

                    Map1.addNearestLocationsWithObservationsOfASpecies(response);
                });
            } else {
                $('#response').html('something went wrong.');
            }
        })
    })
}

/**
 * When the DOM is ready...
 */
$(document).ready(function() {
    setRecentNearbyObservationsClickListener();
    setNearestLocationsWithObservationsOfASpeciesClickListener();
});