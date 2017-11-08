$(function () {
    FastClick.attach(document.body);
});
var myURL = Track.parseURL(location.href);
var origin = myURL.params.origin || 'direct';

function track(tracking) {
    _hmt && _hmt.push(
        ['_trackEvent', origin, 'mobile', tracking]
    )
}

$(document).on('click', '[data-name]', function (e) {
    e.stopPropagation();
    var text = $(this).data('name')
    track(text)
})