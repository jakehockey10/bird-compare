var express = require('express');
var app = express();

var states = require('./data/states.json')

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index.jade', { states: states })
})


var server = app.listen(3000, function() {

    var host = server.address().address
    var port = server.address().port

    console.log('App listening at http://%s:%s', host, port)
})
