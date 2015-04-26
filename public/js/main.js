/**
 * Created by jake on 4/8/15.
 */

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
// TODO: Move the addCircleClickHandlers to the top of Map
Map1.addCircle();
Map2.addCircle();

/**
 * This method finds the recent nearby observations for the map passed in.  This
 * was made a method to avoid having to duplicate this code for Map1 and Map2.
 * Our Map function up above has a center property that we can use for the
 * location parameter.
 * @param map
 * @param callback
 */
function findRecentNearbyObservationsForMap(map, callback) {
    var location = {
        lat: map.center.lat,
        lng: map.center.lng
    };

    $.get('/birds/data/obs/geo/recent', location, function (data) {
        var response = JSON.parse(data.body);
        if (data.err) {
            $('#response').html(JSON.stringify(data.err));
        } else if (response.length == 0) {
            $('#response').html("No results found");
        } else if (data.template) {
            $('#response').html(data.template);
        } else if (data.body) {
            //$.get('/views/observationResponse.jade', function (template) {
            //    var html = jade.render(template, {items: response});
            //    $('#response').html(html);

                map.addResults(response);
                map.addRecentNearbyObservationsAsMarkers(response);

                if (typeof (callback) === 'function') {
                    callback();
                }
            //});
        } else {
            $('#response').html('something went wrong.');
        }
    })
}

/**
 * This method finds the nearest locations with observations of a species for the map passed in.
 * This method was extracted (like the one above) to avoid code duplication.
 */
function findNearestLocationsWithObservationsOfASpeciesForMap(map, callback) {
    var parameters = {
        lat: map.center.lat,
        lng: map.center.lng,
        sci: map.species
    };

    $.get('/birds/data/nearest/geo_spp/recent', parameters, function (data) {
        var response = JSON.parse(data.body);
        if (data.err) {
            $('#response').html(JSON.stringify(data.err));
        } else if (response.length == 0) {
            $('#response').html("No results found");
        } else if (response[0].errorCode) {
            $('#response').html(JSON.stringify(response[0].errorMsg));
        } else if (data.template) {
            $('#response').html(data.template);
        } else if (data.body) {
            //$.get('/views/observationResponse.jade', function (template) {
            //    var html = jade.render(template, {items: response});
            //    $('#response').html(html);

                map.addResults(response);
                map.addNearestLocationsWithObservationsOfASpecies(response);

                if (typeof (callback) === 'function') {
                    callback();
                }
            //});
        } else {
            $('#response').html('something went wrong.');
        }
    })
}

function findRecentObservationsOfASpeciesInARegionForMap(map, callback) {
    var parameters = {
        rtype: 'subnational1',
        r: map.region,
        sci: map.species
    };

    $.get('/birds/data/obs/region_spp/recent', parameters, function (data) {
        var response = JSON.parse(data.body);
        if (data.err) {
            $('#response').html(JSON.stringify(data.err));
        } else if (response.length == 0) {
            $('#response').html("No results found");
        } else if (response[0].errorCode) {
            $('#response').html(JSON.stringify(response[0].errorMsg));
        } else if (data.template) {
            $('#response').html(data.template);
        } else if (data.body) {
            //$.get('/views/observationResponse.jade', function (template) {
            //    var html = jade.render(template, {items: response});
            //    $('#response').html(html);

                map.addResults(response);
                map.addRecentObservationsOfASpeciesInARegion(response);

                if (typeof (callback) === 'function') {
                    callback();
                }
            //});
        } else {
            $('#response').html('something went wrong.');
        }
    })
}

function renderResultsComparison() {
    var comparison = new Comparison(Map1.results, Map2.results);
    $.get('/views/result.jade', function (template) {
        var left = jade.render(template, {result: comparison.left});
        var right = jade.render(template, {result: comparison.right});
        $('#left').html(left);
        $('#right').html(right);
    });
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setRecentNearbyObservationsClickListener() {
    $('#recent_nearby_observations').on('click', function () {
        async.parallel([
            function (callback) { findRecentNearbyObservationsForMap(Map1, callback) },
            function (callback) { findRecentNearbyObservationsForMap(Map2, callback) }
        ], function () {
            renderResultsComparison();
        });
    })
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setNearestLocationsWithObservationsOfASpeciesClickListener() {
    $('#nearest_locations_of_species').on('click', function () {
        async.parallel([
            function (callback) { findNearestLocationsWithObservationsOfASpeciesForMap(Map1, callback) },
            function (callback) { findNearestLocationsWithObservationsOfASpeciesForMap(Map2, callback) }
        ], function () {
            renderResultsComparison();
        });
    })
}

/**
 * Set the click listener for the "Recent Observations Of A Species In A Region" button.
 */
function setRecentObservationsOfASpeciesInARegionClickListener() {
    $('#recent_Observations_OfASpecies_InARegion').on('click', function () {
        async.parallel([
            function (callback) { findRecentObservationsOfASpeciesInARegionForMap(Map1, callback) },
            function (callback) { findRecentObservationsOfASpeciesInARegionForMap(Map2, callback) }
        ], function () {
            renderResultsComparison();
        });
    })
}

function changeComparisonMode(select) {
    var m1 = $("#m1");
    var m2 = $("#m2");
    var option = $('#' + select.id + ' option:selected');
    if (option.attr('value') == 'R') {
        m1.show();
        m2.hide();
    } else {
        m1.hide();
        m2.show();
    }
}

function SetSpeciesForBothMaps(select) {
    var option = $('#' + select.id + ' option:selected');
    [Map1, Map2].forEach(function (map) {
        map.species = option.attr('value');
    });
}

function initView() {
    changeComparisonMode($('#c')[0]);
}

/**
 * When the DOM is ready...
 */
$(document).ready(function() {
    setRecentNearbyObservationsClickListener();
    setNearestLocationsWithObservationsOfASpeciesClickListener();
    setRecentObservationsOfASpeciesInARegionClickListener();

    initView();
});