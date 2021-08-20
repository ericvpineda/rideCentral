$(function() {
    $(".date").each(function (idx, elem) {
        $(elem).text(DateFormat.format.prettyDate($(elem).text()));
    })
})