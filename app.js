var express = require('express');
var app = express();

var birds = require('./routes/birds');
var states = require('./data/states.json');
var species= require('./data/taxa_eBird.json');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index.jade', { states: states, species: species})
});

app.use('/birds', birds);

var server = app.listen(3000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port)
});
