$(function(){
    // Initialize global variables.
    var nextPageToken, previousPageToken;

    // Setup the lightbox when the thumbnail image is clicked.
    $('#search-results').on('click', 'a.video', function(e) {
        e.preventDefault();
        var id = $(this).attr('id');
        var html =
        $('#lightbox-overlay').show();
        $('#lightbox').show();
        $('#lightbox').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>');
    });

    // Hide the lightbox components when the overlay is clicked.
    $('#lightbox-overlay').on('click', function(e) {
        e.preventDefault();
        $('#lightbox-overlay').hide();
        $('#lightbox').empty();
        $('#lightbox').hide();
    });

    // Get the search term for the api request.
    $('#search-term').submit(function(e){
        e.preventDefault();
        var searchTerm = $('#query').val();
        getResults(searchTerm);
    });

    // Go to the next page of the results.
    $('#next').on('click', 'a', function(e) {
        e.preventDefault();
        getResults(searchTerm, nextPageToken);
    });

    // Go to the previous page of results.
    $('#previous').on('click', 'a', function(e) {
        e.preventDefault();
        getResults(searchTerm, previousPageToken);
    });

    // Use the getJSON function to access and return the data.
    function getResults(searchTerm, token){
        var params = {
            part: 'snippet',
            key: secretKey.key,
            q: searchTerm,
            pageToken: token
        }
        var url = 'https://www.googleapis.com/youtube/v3/search';
        $.getJSON(url, params, function(data) {
            setNextPage(data.nextPageToken);
            setPreviousPage(data.prevPageToken);
            showResults(data.items);
        });
    }

    // Grab the next page token and store it to use later.
    function setNextPage(token) {
        if (token) {
            nextPageToken = token;
            $('#next').show();
        } else {
            $('#next').hide();
        }
    }

    // Grab the previous page token and store it to use later.
    function setPreviousPage(token) {
        previousPageToken = token;
        if (token) {
            previousPageToken = token;
            $('#previous').show();
        } else {
            $('#previous').hide();
        }
    }

    // Cobble the HTML to display the request results.
    function showResults(results) {
        var html = "";
        var src = "";
        var id = "";
        var viewUrl = "https://www.youtube.com/watch?v=";
        var channelUrl = "https://www.youtube.com/channel/";
        $.each(results, function(index, value){
            src = value.snippet.thumbnails.medium.url;
            id = value.id.videoId;
            channel = value.snippet.channelId;
            html_img = '<div class="thumbnail"><a class="video" id="' + id + '" href="' + viewUrl + id + '"><img src="' + src + '" /></a></div>';
            html_channel = '<div class="channel"><a target="_blank" href="' + channelUrl + channel + '"><button class="btn" type="button" name="channel" value="Go To Channel">Go To Channel</button></a></div>';
            html += '<li><div class="results-wrapper">' + html_img + html_channel + '</div></li>';
        });
        $('#search-results').html(html);
    }
});