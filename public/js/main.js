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
    /**
     * A little description of what this is:
     *
     * Inside this function, we create a Map object.  These first few assignments
     * and function declarations ('this.[...]' or 'var ...') are considered "private"
     * and are things that cannot be called on the object after it is instantiated.
     * The object that is instantiated when using a statement like 'var Map1 = new
     * Map(...)' executes this function.  This function first sets 'this.map = map'
     * ('map' is the map passed in), then it declares a few functions that get used
     * inside of the returned object.  Everything inside the object being returned
     * is "front-facing," or in other words, able to be called on the object after
     * it is instantiated (returned into a variable that we call upon later).  The
     * real reason for having anything private here is really just to help with the
     * organization and readability of this large object.
     */

    /**
     * Set the private instance of the map's DOM element
     */
    this.map = map;

    /**
     * Center and zoom the map around the set of markers that are on the map.
     * @type {function(this:Map)}
     */
    var fitBoundsOfMapToMarkerGroupBounds = function () {
        console.log("fitBounds: this is " + this);
        this.map.fitBounds(this.markers.getBounds());
    }.bind(this);   // See below...

    /**
     * Remove all the markers on the map.
     * @type {function(this:Map)}
     */
    var removeAllMarkers = function () {
        if (this.markers) {
            this.markers.clearLayers();
        }
    }.bind(this);
    // ---------------------------------------------------------------
    // About .bind(this)
    // ---------------------------------------------------------------
    // .bind(this) makes it so that the 'this' inside the method above
    // refers to the same 'this' outside the function above.  This is important.
    // Outside this function, 'this' refers to the instance of Map we are
    // creating when this gets executed.  Inside the function, and without
    // .bind(this), 'this' refers to the window in the browser because
    // that's the default when it doesn't know what you are referring to.
    // And it doesn't know what you are referring to because inside the
    // function body, the scope is different that outside the function
    // and 'this' is directly tied to the scope of execution.

    /**
     * Create the markers for the results that come back from a call to the eBird API.
     * @type {function(this:Map)}
     */
    var constructMarkersForEBirdResults = function (objects, template) {
        var latLngs = [];
        var markers = [];
        var object, html, marker;
        removeAllMarkers();
        for (var i = 0; i < objects.length; i++) {
            object = objects[i];
            html = jade.render(template, {observation: object});
            latLngs.push(L.latLng(object.lat, object.lng));
            marker = L.marker([object.lat, object.lng]);
            marker.bindPopup(html);
            markers.push(marker);
        }

        this.markers = new L.featureGroup(markers);
        map.addLayer(this.markers);
    }.bind(this);

    // This is what we are actually returning in a statement like 'var Map1 = new Map(...)':
    return {
        map: map,
        /**
         * center will hold the current center of the map view.
         */
        center: {},
        /**
         * region will hold abbreviations for selected region that eBird API region-type endpoints expect.
         */
        region: '',
        /**
         * species will hold the chosen species to pass into eBird API endpoints that require a particular species.
         */
        species: '',
        /**
         * Render the observations that comes from the "Recent Nearby Observations" endpoint of the eBird API.
         * @param observations
         */
        addRecentNearbyObservationsAsMarkers: function (observations) {
            $.get('/views/observationMarker.jade', function (template) {
                constructMarkersForEBirdResults(observations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds();
            });
        },
        /**
         * Render the locations that comes from the "Nearest Locations With Observations Of A Species" endpoint of the eBird API.
         * @param locations
         */
        addNearestLocationsWithObservationsOfASpecies: function (locations) {
            $.get('/views/observationMarker.jade', function (template) {
                constructMarkersForEBirdResults(locations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds();
            })
        },

        addRecentObservationsOfASpeciesInARegion: function (locations) {
            $.get('/views/observationMarker.jade', function (template) {
                constructMarkersForEBirdResults(locations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds();
            })
        },
        /**
         * Adds a marker at the location of latLng.  Also binds a popup to it, but it is a silly little popup.
         * This method should change before being heavily used.
         * @param latLng
         */
        addMarker: function (latLng) {
            latLng = latLng || [51.5, -0.09];
            var marker = L.marker(latLng).addTo(this.map);
            // TODO: Make the binding of a popup more dynamic (i.e. opt-in/opt-out, customize message, etc.)
            marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
            // TODO: Add to this object's markers collection?
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
            }).addTo(this.map);
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
            var polygon = L.polygon(latLngs).addTo(this.map);
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
                .openOn(this.map);
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

            this.map.on('click', onMapClick);
        },

        changeView: function (select) {
            var option = $('#' + select.id + ' option:selected');
            var lat = option.data('lat');
            var lng = option.data('lng');
            var region = option.attr('value');
            this.map.setView(new L.LatLng(lat, lng), 6);
            this.center = {lat: lat, lng: lng};
            this.region = region;
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

// TODO: We need to figure out what we want the maps to default to...
/**
 * Create Map objects that point to the DOM element maps via the map property (i.e. Map1.map)
 * as well as adding markers, circles, polygons, popups, popups with click listeners, etc.  This Map
 * "Class" also responds to requests sent to the eBird API and will display that information in the map
 * when the request comes back successfully.
 * @type {*}
 */
var Map1 = new Map(setThenGetDOMMapView('map1', [39.91, -77.02], 3));
var Map2 = new Map(setThenGetDOMMapView('map2', [39.91, -77.02], 3));

/**
 * This method finds the recent nearby observations for the map passed in.  This
 * was made a method to avoid having to duplicate this code for Map1 and Map2.
 * Our Map function up above has a center property that we can use for the
 * location parameter.
 * @param map
 */
function findRecentNearbyObservationsForMap(map) {
    var location = {
        lat: map.center.lat,
        lng: map.center.lng
    };

    $.get('/birds/data/obs/geo/recent', location, function (data) {
        if (data.err) {
            $('#response').html(JSON.stringify(data.err))
        } else if (data.template) {
            $('#response').html(data.template);
        } else if (data.body) {
            $.get('/views/observationResponse.jade', function (template) {
                var response = JSON.parse(data.body);
                var html = jade.render(template, {items: response});
                $('#response').html(html);

                map.addRecentNearbyObservationsAsMarkers(response);
            });
        } else {
            $('#response').html('something went wrong.');
        }
    })
}

/**
 * This method finds the nearest locations with observations of a species for the map passed in.
 * This method was extracted (like the one above) to avoid code duplication.
 */
function findNearestLocationsWithObservationsOfASpeciesForMap(map) {
    var parameters = {
        lat: map.center.lat,
        lng: map.center.lng,
        sci: map.species
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
            $.get('/views/observationResponse.jade', function (template) {
                var html = jade.render(template, {items: response});
                $('#response').html(html);

                map.addNearestLocationsWithObservationsOfASpecies(response);
            });
        } else {
            $('#response').html('something went wrong.');
        }
    })
}

function findRecentObservationsOfASpeciesInARegionForMap(map) {
    var parameters = {
        rtype: 'subnational1',
        r: map.region,
        sci: map.species
    };

    $.get('/birds/data/obs/region_spp/recent', parameters, function (data) {
        var response = JSON.parse(data.body);
        if (data.err) {
            $('#response').html(JSON.stringify(data.err));
        } else if (response[0].errorCode) {
            $('#response').html(JSON.stringify(response[0].errorMsg));
        } else if (data.template) {
            $('#response').html(data.template);
        } else if (data.body) {
            $.get('/views/observationResponse.jade', function (template) {
                var html = jade.render(template, {items: response});
                $('#response').html(html);

                map.addRecentObservationsOfASpeciesInARegion(response);
            });
        } else {
            $('#response').html('something went wrong.');
        }
    })
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setRecentNearbyObservationsClickListener() {
    $('#recent_nearby_observations').on('click', function () {
        [Map1, Map2].forEach(function (map) {findRecentNearbyObservationsForMap(map)});
    })
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setNearestLocationsWithObservationsOfASpeciesClickListener() {
    $('#nearest_locations_of_species').on('click', function () {
        [Map1, Map2].forEach(function (map) {findNearestLocationsWithObservationsOfASpeciesForMap(map)});
    })
}

/**
 * Set the click listener for the "Recent Observations Of A Species In A Region" button.
 */
function setRecentObservationsOfASpeciesInARegionClickListener() {
    $('#recent_Observations_OfASpecies_InARegion').on('click', function () {
        [Map1, Map2].forEach(function (map) {findRecentObservationsOfASpeciesInARegionForMap(map)});
    })
}

function SetSpeciesForBothMaps(select) {
    var option = $('#' + select.id + ' option:selected');
    [Map1, Map2].forEach(function (map) {
        map.species = option.attr('value');
    });
}

/**
 * When the DOM is ready...
 */
$(document).ready(function() {
    setRecentNearbyObservationsClickListener();
    setNearestLocationsWithObservationsOfASpeciesClickListener();
    setRecentObservationsOfASpeciesInARegionClickListener();
});