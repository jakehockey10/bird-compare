/**
 * Created by jake on 4/25/15.
 */

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

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
        circle: {},
        /**
         * region will hold abbreviations for selected region that eBird API region-type endpoints expect.
         */
        region: '',
        /**
         * species will hold the chosen species to pass into eBird API endpoints that require a particular species.
         */
        species: '',
        radius: 10,
        /**
         * Results from the eBird API call
         */
        results: [],
        /**
         * Initialize the map
         */
        initializeMap: function () {
            this.addMapClickedListener();
            this.addClearButton();
        },
        /**
         * Add the clear button to the map
         */
        addClearButton: function () {
            var instance = this;
            L.easyButton(
                this.map,
                'fa-times',
                function () { instance.removeResults(); },
                'clear results')
        },
        /**
         * addResults adds the eBird API call response to the results property
         */
        addResults: function (results) {
            this.results = results;
        },
        /**
         * remove all results
         */
        removeResults: function () {
            removeAllMarkers();
            this.removeCircle();
        },
        /**
         * Remove circle
         */
        removeCircle: function () {
            if (this.circle) {
                this.map.removeLayer(this.circle);
                this.circle = {}
            }
        },
        /**
         * Render the observations that comes from the "Recent Nearby Observations" endpoint of the eBird API.
         * @param observations
         */
        addRecentNearbyObservationsAsMarkers: function (observations) {
            $.get('/views/observationMarker.jade', function (template) {
                constructMarkersForEBirdResults(observations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds();
                map.spin(false);
            });
        },
        /**
         * Render the locations that comes from the "Nearest Locations With Observations Of A Species" endpoint of the eBird API.
         * @param locations
         */
        addRecentNearbyObservationsOfASpecies: function (locations) {
            $.get('/views/observationMarker.jade', function (template) {
                constructMarkersForEBirdResults(locations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds();
                map.spin(false);
            })
        },

        addRecentObservationsOfASpeciesInARegion: function (locations) {
            $.get('/views/observationMarker.jade', function (template) {
                constructMarkersForEBirdResults(locations, template);
            }).success(function () {
                fitBoundsOfMapToMarkerGroupBounds();
                map.spin(false)
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
         * Remove the click listener on the map
         */
        removeMapClickedListener: function () {
            this.map.off('click');  // clear any click handlers so that the one we add is the only one.
        },
        /**
         * Adds a click listener to the map that adds a circle of varying size to the map.
         * @param latLng
         * @param radius
         * @param color
         * @param fillColor
         * @param fillOpacity
         */
        addMapClickedListener: function (color, fillColor, fillOpacity) {
            this.removeMapClickedListener();
            var instance = this;
            function onMapClick(e) {
                if (!isEmpty(instance.circle)) {
                    map.removeLayer(instance.circle);
                }
                var latLng = e.latlng;
                var radius = instance.radius * 1000;
                color = color || 'red';
                fillColor = fillColor || '#f03';
                fillOpacity = fillOpacity || 0.5;
                var circle = L.circle(latLng, radius, {
                    color: color,
                    fillColor: fillColor,
                    fillOpacity: fillOpacity
                }).addTo(map);

                instance.circle = circle;
            }
              
            this.map.on('click', onMapClick);
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

