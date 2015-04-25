var express = require('express');
var _ = require('lodash');
var app = express();

var birds = require('./routes/birds');
var states = require('./data/states.json');
var species = require('./data/taxa_eBird.json');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.set('view engine', 'jade');

// This function to sort the species list based on the scientific_name 
function sortByProperty(property) {
    'use strict';
    return function (a, b) {
        var sortStatus = 0;
        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
 
        return sortStatus;
    };
}
species.sort(sortByProperty('common_name'));

app.get('/', function (req, res) {
    res.render('index.jade', {states: states, species: species})
});

app.use('/birds', birds);

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port)
});
