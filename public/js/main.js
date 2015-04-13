/**
 * Created by jake on 4/8/15.
 */
$(document).ready(function() {
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
                $.get('/views/response.jade', function (template) {
                    var response = JSON.parse(data.body);
                    var html = jade.render(template, { items: response });
                    console.log(data.resp);
                    $('#response').html(html);

                    Map1.addRecentNearbyObservationsAsMarkers(response);
                });
            } else {
                $('#response').html('something went wrong.');
            }
        })
    })
});