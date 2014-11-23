(function() {

  // settings.js
  $(function() {
    var bio = $('.bio');
    var count = $('.count');
    if (count.length >= 1) {
      count.text((160 - bio.val().length));
    }
    bio.on('keyup', function(){
      count.text((160 - $(this).val().length));
    });
  });

  // subscriptions.js
  $(function() {
    if ($('#subscriptions').length >= 1) {
      var addSub = $('#addSub')
      var subsList = $('#subsList');

      $.getJSON('/api/users/' + addSub.data('id'), function(res) {
        $.each(res.subscriptions, function(index, sub) {
          subsList.append('<li>'+sub+'</li>'); 
        });
      });
      
      addSub.on('click', function() {
        $.ajax('/api/users/' + $(this).data('id'), { 
          type: 'PUT',
          dataType: 'json',
          data: { 'addSub': $('#searchSub').val() },
          success: function(res) {
            var searchSub = $('#searchSub');

            $('#subsList').append('<li>'+searchSub.val()+'</li>');  // TEMP
            searchSub.val('');
          },
          error: function(err, status, msg) {
            console.log(status + msg);
          }
        });
      }); 
    }
  });

  if (InstantClick) {
    InstantClick.init();
  }
})();
