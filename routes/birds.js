/**
 * Created by jake on 4/8/15.
 */
var request = require('request');
var Qs = require('qs');
var jade = require('jade');

var nodemw = require('nodemw');
var client = new nodemw({
    server: 'en.wikipedia.org', // host name of MediaWiki-powered site
    path: '/w',                 // path to api.php script
    debug: false                // is more verbose when set to true
});

var express = require('express');
var router = express.Router();

/* Returns recent nearby observations. */
router.get('/data/obs/geo/recent', function(req, res, next) {
    console.log(req.query);

    var url = 'http://ebird.org/ws1.1/data/obs/geo/recent?' +
        Qs.stringify(req.query) + '&fmt=json';
    request(url, function (err, resp, body) {
        data = {
            err: err,
            resp: resp,
            body: body
        };
        console.log(data.body);

        var bodyParsed = JSON.parse(data.body);
        var imageArray = [];

        //function getBatch(start) {
        //    client.getImages(start, function(err, data, next) {
        //        imageArray = imageArray.concat(data);
        //        if (next) {
        //            console.log('Getting next batch (starting from ' + next + ')...');
        //            getBatch(next);
        //        }
        //        else {
        //            console.log(JSON.stringify(imageArray, null, '\t'));
        //            console.log('Image count: ' + imageArray.length);
        //        }
        //    });
        //}
        //
        //getBatch(0);
        for (var i = 0; i < 1; i++) {
            console.log(bodyParsed[i].comName);

            client.getArticle(bodyParsed[i].comName, function (err, data) {
                if (err) { console.error(err) }
                console.log('article: ');
                console.log(typeof data);
            });

            client.getImagesFromArticle(bodyParsed[i].comName, function (err, data) {
                if (err) { console.error(err) }
                console.log('images: ');
                console.log(data);
            })
        }

        res.send(data);
    })
});

module.exports = router;
