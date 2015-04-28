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
    map.id = id;

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

function renderAlert(alertClass, alertStrong, alertMessage) {
    var alert = {
        class: alertClass, strong: alertStrong, message: alertMessage
    };
    $.get('/views/alert.jade', function (template) {
        var html = jade.render(template, {alert: alert});
        $('#alerts').html(html)
    })
}

/**
 * handleEBirdAPIResponse parses the response for errors and if it can't find any
 * will attempt to render markers and comparison data based on the endpoint that
 * was requested.
 * @param map
 * @param data
 * @param endpoint
 */
function handleEBirdAPIResponse (map, data, endpoint) {
    $('#alert').html('');
    var response = JSON.parse(data.body);
    if (data.err) {
        renderAlert('danger', 'Error', JSON.stringify(data.err));
    } else if (response.errorCode) {
        renderAlert('danger', 'Error', response.errorMsg);
    } else if (response[0] && response[0].errorCode) {
        renderAlert('danger', 'Error', response[0].errorMsg);
    } else if (response.length == 0) {
        renderAlert('info', 'Heads up!', 'No results found for '+ map.map.id +'.');
    } else if (data.template) {
        $('#response').html(data.template);
    } else if (data.body) {
        map.addResults(response);
        if (endpoint == 'recentNearbyObservations')
            map.addRecentNearbyObservationsAsMarkers(response);
        else if (endpoint == 'recentNearbyObservationsOfASpecies')
            map.addRecentNearbyObservationsOfASpecies(response);
        else if (endpoint == 'recentObservationsOfASpeciesInARegion')
            map.addRecentObservationsOfASpeciesInARegion(response);
        else
            renderAlert('warning', 'Uh oh...', 'Something went wrong.');
    } else {
        renderAlert('warning', 'Uh oh...', 'Something went wrong.');
    }
}

/**
 * This method finds the recent nearby observations for the map passed in.  This
 * was made a method to avoid having to duplicate this code for Map1 and Map2.
 * Our Map function up above has a center property that we can use for the
 * location parameter.
 * @param map
 * @param callback
 */
function findRecentNearbyObservationsForMap(map, callback) {
    var parameters = {
        lat: map.circle._latlng.lat,
        lng: map.circle._latlng.lng,
        dist: map.radius,
        sci: map.species
    };

    $.get('/birds/data/obs/geo/recent', parameters, function (data) {
        handleEBirdAPIResponse(map, data, 'recentNearbyObservations');
        if (typeof (callback) === 'function') {
            callback();
        }
    })
}

/**
 * This method finds the nearest locations with observations of a species for the map passed in.
 * This method was extracted (like the one above) to avoid code duplication.
 */
function findRecentNearbyObservationsOfASpeciesForMap(map, callback) {
    var parameters = {
        lat: map.circle._latlng.lat,
        lng: map.circle._latlng.lng,
        dist: map.radius,
        sci: map.species
    };

    $.get('/birds/data/nearest/geo_spp/recent', parameters, function (data) {
        handleEBirdAPIResponse(map, data, 'recentNearbyObservationsOfASpecies');
        if (typeof (callback) === 'function') {
            callback();
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
        handleEBirdAPIResponse(map, data,'recentObservationsOfASpeciesInARegion');
        if (typeof (callback) === 'function') {
            callback();
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

function loading() {
    $(this).prepend('<i id="waiting" class="fa fa-spinner fa-pulse"></i>');
}

function doneLoading() {
    $('#waiting').remove();
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setRecentNearbyObservationsClickListener() {
    $('#recent_nearby_observations').on('click', function () {
        loading.call(this);
        async.parallel([
            function (callback) { findRecentNearbyObservationsForMap(Map1, callback) },
            function (callback) { findRecentNearbyObservationsForMap(Map2, callback) }
        ], function () {
            renderResultsComparison();
            doneLoading();
        });
    });
}

/**
 * Set the click listener for the "Recent Nearby Observations" button.
 */
function setRecentNearbyObservationsOfASpeciesClickListener() {
    $('#recent_nearby_observations_of_species').on('click', function () {
        loading.call(this);
        async.parallel([
            function (callback) { findRecentNearbyObservationsOfASpeciesForMap(Map1, callback) },
            function (callback) { findRecentNearbyObservationsOfASpeciesForMap(Map2, callback) }
        ], function () {
            renderResultsComparison();
            doneLoading();
        });
    })
}

/**
 * Set the click listener for the "Recent Observations Of A Species In A Region" button.
 */
function setRecentObservationsOfASpeciesInARegionClickListener() {
    $('#recent_Observations_OfASpecies_InARegion').on('click', function () {
        loading.call(this);
        async.parallel([
            function (callback) { findRecentObservationsOfASpeciesInARegionForMap(Map1, callback) },
            function (callback) { findRecentObservationsOfASpeciesInARegionForMap(Map2, callback) }
        ], function () {
            renderResultsComparison();
            doneLoading();
        });
    })
}

/**
 * Set the controls for the spots comparison mode
 */
function loadSpotsView() {
    var m1 = $('#m1');
    var m2 = $('#m2');
    m1.hide();
    m2.show();

    if (getSpeciesValueFromInput()) {
        $('#recent_nearby_observations').hide();
        $('#recent_nearby_observations_of_species').show();
        $('#recent_Observations_OfASpecies_InARegion').hide();
    } else {
        $('#recent_nearby_observations').show();
        $('#recent_nearby_observations_of_species').hide();
        $('#recent_Observations_OfASpecies_InARegion').hide();
    }

    Map1.addMapClickedListener();
    Map2.addMapClickedListener();
}

/**
 * Set the controls for the regions comparison mode
 */
function loadRegionsView() {
    var m1 = $('#m1');
    var m2 = $('#m2');
    m1.show();
    m2.hide();

    $('#recent_nearby_observations').hide();
    $('#recent_nearby_observations_of_species').hide();
    $('#recent_Observations_OfASpecies_InARegion').show();

    Map1.removeMapClickedListener();
    Map2.removeMapClickedListener();
}

/**
 * Change the comparison mode from regions to spots or spots to regions
 * @param select
 */
function changeComparisonMode(select) {
    var option = $('#' + select.id + ' option:selected');
    if (option.attr('value') == 'R') {
        loadRegionsView();
    } else {
        loadSpotsView();
    }
}

/**
 * Get the species chosen from the autocomplete input.
 * @returns {*|jQuery}
 */
function getSpeciesValueFromInput() {
    return $('#speciesInput').next().children().data('value');
}

/**
 * Set the species for both maps from the current autocomplete input value.
 */
function setSpeciesForBothMaps() {
    var species = getSpeciesValueFromInput();
    species = decodeURIComponent(species);
    [Map1, Map2].forEach(function (map) {
        map.species = species;
    });

    loadSpotsView($('#m1'), $('#m2'));
}

/**
 * Change the radius of each map's search distance
 * @param select
 */
function changeRadius(select) {
    var option = $('#' + select.id + ' option:selected');
    [Map1, Map2].forEach(function (map) {
        map.radius = option.attr('value');
        //we need to clear circles after restiing the radius
        if(!isEmpty(map.circle))
        {
            map.map.removeLayer(map.circle1);
        }
    });
}

/**
 * Initialize the view in general.
 */
function initView() {
    changeComparisonMode($('#c')[0]);
    $.get('/data/taxa_eBird.json', function (data) {
        $('#speciesInput').autocomplete({
            source: [data],
            valueKey: 'common_name',
            titleKey: 'common_name',
            getTitle: function (item) {
                return item['common_name'] + ' (' + item['scientific_name'] + ')';
            },
            getValue: function (item) {
                return item['scientific_name'];
            },
            highlight: true,
            showHint: true,
            render: function (item, source, pid, query) {
                var value = this.getValue(item),
                    title = this.getTitle(item);
                return '<div ' + (value == query ? 'class="active"' : '') +
                    ' data-value="' +
                    encodeURIComponent(value) + '">' +
                    title +
                    '</div>meow';
            }
        }).on('selected.xdsoft', function (e, datum) {
            $('#speciesInput').parent().prev().text(datum.common_name);
            setSpeciesForBothMaps();
        })
    })
}

/**
 * When the DOM is ready...
 */
$(document).ready(function() {
    setRecentNearbyObservationsClickListener();
    setRecentNearbyObservationsOfASpeciesClickListener();
    setRecentObservationsOfASpeciesInARegionClickListener();

    Map1.initializeMap();
    Map2.initializeMap();

    initView();
});