/**
 * Created by jake on 4/8/15.
 */

/**
 * Map class to accept results from eBird API calls and display on the DOM element maps
 * @param map
 * @returns {{map: *, addRecentNearbyObservationsAsMarkers: Function, addMarker: Function, addCircle: Function, addPolygon: Function, addPopup: Function, addPopupWithClickListener: Function}}
 * @constructor
 */

//var statesJeo = require('/data/statesJeo.json');
var statesJeo =
[
  {
    "FIELD1":"state",
    "FIELD2":"latitude",
    "FIELD3":"longitude"
  },
  {
    "FIELD1":"AK",
    "FIELD2":"61.3850",
    "FIELD3":"-152.2683"
  },
  {
    "FIELD1":"AL",
    "FIELD2":"32.7990",
    "FIELD3":"-86.8073"
  },
  {
    "FIELD1":"AR",
    "FIELD2":"34.9513",
    "FIELD3":"-92.3809"
  },
  {
    "FIELD1":"AS",
    "FIELD2":"14.2417",
    "FIELD3":"-170.7197"
  },
  {
    "FIELD1":"AZ",
    "FIELD2":"33.7712",
    "FIELD3":"-111.3877"
  },
  {
    "FIELD1":"CA",
    "FIELD2":"36.1700",
    "FIELD3":"-119.7462"
  },
  {
    "FIELD1":"CO",
    "FIELD2":"39.0646",
    "FIELD3":"-105.3272"
  },
  {
    "FIELD1":"CT",
    "FIELD2":"41.5834",
    "FIELD3":"-72.7622"
  },
  {
    "FIELD1":"DC",
    "FIELD2":"38.8964",
    "FIELD3":"-77.0262"
  },
  {
    "FIELD1":"DE",
    "FIELD2":"39.3498",
    "FIELD3":"-75.5148"
  },
  {
    "FIELD1":"FL",
    "FIELD2":"27.8333",
    "FIELD3":"-81.7170"
  },
  {
    "FIELD1":"GA",
    "FIELD2":"32.9866",
    "FIELD3":"-83.6487"
  },
  {
    "FIELD1":"HI",
    "FIELD2":"21.1098",
    "FIELD3":"-157.5311"
  },
  {
    "FIELD1":"IA",
    "FIELD2":"42.0046",
    "FIELD3":"-93.2140"
  },
  {
    "FIELD1":"ID",
    "FIELD2":"44.2394",
    "FIELD3":"-114.5103"
  },
  {
    "FIELD1":"IL",
    "FIELD2":"40.3363",
    "FIELD3":"-89.0022"
  },
  {
    "FIELD1":"IN",
    "FIELD2":"39.8647",
    "FIELD3":"-86.2604"
  },
  {
    "FIELD1":"KS",
    "FIELD2":"38.5111",
    "FIELD3":"-96.8005"
  },
  {
    "FIELD1":"KY",
    "FIELD2":"37.6690",
    "FIELD3":"-84.6514"
  },
  {
    "FIELD1":"LA",
    "FIELD2":"31.1801",
    "FIELD3":"-91.8749"
  },
  {
    "FIELD1":"MA",
    "FIELD2":"42.2373",
    "FIELD3":"-71.5314"
  },
  {
    "FIELD1":"MD",
    "FIELD2":"39.0724",
    "FIELD3":"-76.7902"
  },
  {
    "FIELD1":"ME",
    "FIELD2":"44.6074",
    "FIELD3":"-69.3977"
  },
  {
    "FIELD1":"MI",
    "FIELD2":"43.3504",
    "FIELD3":"-84.5603"
  },
  {
    "FIELD1":"MN",
    "FIELD2":"45.7326",
    "FIELD3":"-93.9196"
  },
  {
    "FIELD1":"MO",
    "FIELD2":"38.4623",
    "FIELD3":"-92.3020"
  },
  {
    "FIELD1":"MP",
    "FIELD2":"14.8058",
    "FIELD3":"145.5505"
  },
  {
    "FIELD1":"MS",
    "FIELD2":"32.7673",
    "FIELD3":"-89.6812"
  },
  {
    "FIELD1":"MT",
    "FIELD2":"46.9048",
    "FIELD3":"-110.3261"
  },
  {
    "FIELD1":"NC",
    "FIELD2":"35.6411",
    "FIELD3":"-79.8431"
  },
  {
    "FIELD1":"ND",
    "FIELD2":"47.5362",
    "FIELD3":"-99.7930"
  },
  {
    "FIELD1":"NE",
    "FIELD2":"41.1289",
    "FIELD3":"-98.2883"
  },
  {
    "FIELD1":"NH",
    "FIELD2":"43.4108",
    "FIELD3":"-71.5653"
  },
  {
    "FIELD1":"NJ",
    "FIELD2":"40.3140",
    "FIELD3":"-74.5089"
  },
  {
    "FIELD1":"NM",
    "FIELD2":"34.8375",
    "FIELD3":"-106.2371"
  },
  {
    "FIELD1":"NV",
    "FIELD2":"38.4199",
    "FIELD3":"-117.1219"
  },
  {
    "FIELD1":"NY",
    "FIELD2":"42.1497",
    "FIELD3":"-74.9384"
  },
  {
    "FIELD1":"OH",
    "FIELD2":"40.3736",
    "FIELD3":"-82.7755"
  },
  {
    "FIELD1":"OK",
    "FIELD2":"35.5376",
    "FIELD3":"-96.9247"
  },
  {
    "FIELD1":"OR",
    "FIELD2":"44.5672",
    "FIELD3":"-122.1269"
  },
  {
    "FIELD1":"PA",
    "FIELD2":"40.5773",
    "FIELD3":"-77.2640"
  },
  {
    "FIELD1":"PR",
    "FIELD2":"18.2766",
    "FIELD3":"-66.3350"
  },
  {
    "FIELD1":"RI",
    "FIELD2":"41.6772",
    "FIELD3":"-71.5101"
  },
  {
    "FIELD1":"SC",
    "FIELD2":"33.8191",
    "FIELD3":"-80.9066"
  },
  {
    "FIELD1":"SD",
    "FIELD2":"44.2853",
    "FIELD3":"-99.4632"
  },
  {
    "FIELD1":"TN",
    "FIELD2":"35.7449",
    "FIELD3":"-86.7489"
  },
  {
    "FIELD1":"TX",
    "FIELD2":"31.1060",
    "FIELD3":"-97.6475"
  },
  {
    "FIELD1":"UT",
    "FIELD2":"40.1135",
    "FIELD3":"-111.8535"
  },
  {
    "FIELD1":"VA",
    "FIELD2":"37.7680",
    "FIELD3":"-78.2057"
  },
  {
    "FIELD1":"VI",
    "FIELD2":"18.0001",
    "FIELD3":"-64.8199"
  },
  {
    "FIELD1":"VT",
    "FIELD2":"44.0407",
    "FIELD3":"-72.7093"
  },
  {
    "FIELD1":"WA",
    "FIELD2":"47.3917",
    "FIELD3":"-121.5708"
  },
  {
    "FIELD1":"WI",
    "FIELD2":"44.2563",
    "FIELD3":"-89.6385"
  },
  {
    "FIELD1":"WV",
    "FIELD2":"38.4680",
    "FIELD3":"-80.9696"
  },
  {
    "FIELD1":"WY",
    "FIELD2":"42.7475",
    "FIELD3":"-107.2085"
  }
];


var changeMapView = function(id) {
    if (id == 1 )
    {

        var e = document.getElementById("R1");
        var strUser= e.options[e.selectedIndex].value;
        console.log(strUser);
    }
    else
    {

        var e = document.getElementById("R2");
        var strUser= e.options[e.selectedIndex].value;
        console.log(strUser);
    }

    for (i in statesJeo) 
    {
        console.log(statesJeo[i].FIELD1);
        if (statesJeo[i].FIELD1 == strUser)
        {
            if (id == 1 ){
                Map1.changeView(statesJeo[i].FIELD2, statesJeo[i].FIELD3,6);
                break;
            }
            else
            {
                Map2.changeView(statesJeo[i].FIELD2, statesJeo[i].FIELD3,6);
                break;
            }
            
        }
    }
}

var AddBirdsToBothMaps = function() {
    console.log('Hi');
}

var Map = function (map) {
    this.map = map;

    var fitBoundsOfMapToMarkerGroupBounds = function () {
        console.log("fitBounds: this is " + this);
        this.map.fitBounds(this.markers.getBounds());
    }.bind(this);

    var removeAllMarkers = function () {
        if (this.markers) {
            this.markers.clearLayers();
        }
    }.bind(this);

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

    return {
        map: map,
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
            $.get('/views/locationMarker.jade', function (template) {
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

        changeView: function (x, y, zoom) {
            this.map.setView(new L.LatLng(x, y), zoom);
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
var Map2 = new Map(setThenGetDOMMapView('map2', [32.7990, -86.8073], 7));

/**
 * Keep the examples that were in map1.js and map2.js from before, for now.
 */
Map1.addMarker();
Map1.addCircle();
Map1.addPolygon();
Map1.addPopup();
Map2.addPopupWithClickListener();
//Map1.changeView(51.505, -0.09, 17);



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