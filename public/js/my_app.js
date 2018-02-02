
$(document).ready(function(){

    $.ajax({ 
      url: '/api/v1/updateToken',
      type: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      }
    });


    var bestPictures = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: '../data/locations/facebook_location.json',
      remote: {
      url: '../api/v1/getFacebookLocations?q=%QUERY',
      wildcard: '%QUERY'
      }
    });

    $('.typeahead').typeahead(null, {
      name: 'facebook-location',
      display: 'name',
      source: bestPictures,
      templates: {
        empty: [
          '<div class="empty-message">',
            'unable to find any location that match the current query',
          '</div>'
        ].join('\n'),
        pending: [
          '<div class="empty-message">',
            'Looking for results...',
          '</div>'
        ].join('\n'),
        suggestion: function(data) {
          if (data.location.city !== undefined && data.location.country !== undefined){
            return '<div><strong>' + data.name + '</strong> – ' + data.location.city + ', '+ data.location.country +'</div>';
          }else{
            return '<div><strong>' + data.name + '</strong></div>';
          }
        }
      }
    });

    $('.typeahead').bind('typeahead:select', function(ev, suggestion) {
      console.log('Selection: ', suggestion);
    });



});