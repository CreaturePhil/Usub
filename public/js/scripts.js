(function() {

  var $bio = $('.bio');
  var $count = $('.count');
  if ($count.length >= 1) {
    $count.text((160 - $bio.val().length));
  }
  $bio.on('keyup', function(){
    $count.text((160 - $(this).val().length));
  });
  $('#addsub').on('click', function() {
    $.ajax('/api/users/' + $('#addsub').data('id'), {
      type: 'PUT',
      data: { 'sub': $('#searchSub').val() },
      success: function(res) {
        ul.append('<li>'+$('#searchSub').val()+'</li>'); 
        $('#searchSub').val('');
      },
      error: function(err, status, msg) {
        console.log(status + msg);
      }
    });
  });
  var ul = $('#subs');
  $.getJSON('/api/users/' + $('#addsub').data('id'), function(res) {
    $.each(res.subscriptions, function(index, sub) {
      ul.append('<li>'+sub+'</li>'); 
    });
  });

  if (InstantClick) {
    InstantClick.init();
  }
})();
