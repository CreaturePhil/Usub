$(function() {

  var $searchSub = $('#searchSub');

  if ($searchSub.length >= 1) {
    $.get('subscriptions.json', function(data){
      $searchSub.typeahead({ source: data });
    }, 'json');
  }

});
