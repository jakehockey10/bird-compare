var express = require('express');
var _ = require('lodash');
var app = express();

var birds = require('./routes/birds');
var states = require('./data/states.json');
var statesJeo = require('./data/statesJeo.json');
var species = require('./data/taxa_eBird.json');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

// TODO: we should see what the easiest way to hide this from the app.js file (or just make this happen without the double for loops...)
/**
 * This combines our state data from two separate files into one array
 * so that we can persist the lat and lng values on the dom itself and
 * refer to the data-lat and data-lng attributes of the <select>'s <option>s.
 * This provides a way to easily send the lat and lng values along with
 * the call to the Leaflet map :)
 * @returns {Array}
 */
function combineStatesJSONWithStatesJeoJSON() {
    var statesWithGeo = [];
    for (var i = 0; i < statesJeo.length; i++) {
        var stateJeo = statesJeo[i];
        var abbreviation = stateJeo['FIELD1'];
        var lat = parseFloat(stateJeo['FIELD2']);
        var lng = parseFloat(stateJeo['FIELD3']);
        for (var j = 0; j < states.length; j++) {
            var state = states[j];
            if (state.abbreviation == abbreviation) {
                statesWithGeo.push({
                    name: state.name,
                    abbreviation: state.abbreviation,
                    location: {lat: lat, lng: lng}
                });
                break;
            }
        }
    }
    return statesWithGeo;
}

app.get('/', function (req, res) {
    var statesWithGeo = combineStatesJSONWithStatesJeoJSON();
    res.render('index.jade', {states: statesWithGeo, species: species})
});

app.use('/birds', birds);

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port)
});
