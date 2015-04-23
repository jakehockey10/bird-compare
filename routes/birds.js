/**
 * Created by jake on 4/8/15.
 */
var request = require('request');
var Qs = require('qs');
var jade = require('jade');

//var nodemw = require('nodemw');
//var client = new nodemw({
//    server: 'en.wikipedia.org', // host name of MediaWiki-powered site
//    path: '/w',                 // path to api.php script
//    debug: false                // is more verbose when set to true
//});

var express = require('express');
var router = express.Router();

/**
 * URL pieces
 * @type {string}
 */
const eBirdDataServices = 'http://ebird.org/ws1.1/data';
const recentNearbyObservations = '/obs/geo/recent?';
const recentNearbyObservationsOfASpecies = '/nearest/geo_spp/recent?';
const recentObservationsOfASpeciesInARegion = '/obs/region_spp/recent?';
const format = '&fmt=json';

/**
 * Make request to URL and send the response.
 * @param url
 * @param res
 */
function makeRequestToEBirdAPI(url, res) {
    request(url, function (err, resp, body) {
        var data = {
            err: err,
            resp: resp,
            body: body
        };
        res.send(data);
    })
}

/**
 * Construct the URL that will be used to make a request to the eBird API.
 * @param eBirdService (data, reference, etc.)
 * @param path (path within that service)
 * @param req (query parameters)
 * @param format (json, xml, etc.)
 * @returns {*}
 */
function constructURL(eBirdService, path, query, format) {
    return eBirdService + path + Qs.stringify(query) + format;
}

/**
 * Express route for "Recent Nearby Observations" endpoint of the eBird API.
 */
router.get('/data/obs/geo/recent', function(req, res, next) {
    var url = constructURL(eBirdDataServices, recentNearbyObservations, req.query, format);
    makeRequestToEBirdAPI(url, res);
});

/**
 * Express route for "Nearest Locations With Observations Of A Species" endpoint of the eBird API.
 */
router.get('/data/nearest/geo_spp/recent', function(req, res, next) {
    var url = constructURL(eBirdDataServices, recentNearbyObservationsOfASpecies, req.query, format);
    makeRequestToEBirdAPI(url, res);
});

/**
 * Express route for "Recent Observations Of A Species In A Region" endpoint of the eBird API.
 */
router.get('/data/obs/region_spp/recent', function(req, res, next) {
    var url = constructURL(eBirdDataServices, recentObservationsOfASpeciesInARegion, req.query, format);
    makeRequestToEBirdAPI(url, res);
});

module.exports = router;
