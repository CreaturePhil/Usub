$(function() {
  if ($('#subscriptions').length >= 1) {
    var addSub = $('#addSub')
    var subsList = $('#subsList');

    $.getJSON('/api/users/' + addSub.data('id'), function(res) {
      $.each(res.subscriptions, function(index, sub) {
        subsList.append('<li class="removeSub" data-sub="'+sub+'">'+sub+'<button>x</button></li>'); 
      });
    });
    
    addSub.on('submit', function(e) {
      e.preventDefault();
      if (!$('#searchSub').val()) {
        return $('.top-right').notify({
          type: 'danger',
          message: { text: 'Cannot be blank!' }
        }).show();
      }
      $.ajax($(this).attr('action'), { 
        type: 'PUT',
        dataType: 'json',
        data: { 'addSub': $('#searchSub').val() },
        success: function(res) {
          var searchSub = $('#searchSub');

          $('#subsList').prepend('<li class="highlight removeSub" data-sub="'+searchSub.val()+'">'+searchSub.val()+'<button>x</button></li>');  // TEMP
          setTimeout(function() {
            $('.highlight').removeClass('highlight');
          }, 1000);
          searchSub.val('');
        },
        error: function(err, status, msg) {
          console.log(status + msg);
        }
      });
    }); 

    $('#subsList').on('click', 'button', function() {
      var removeSub = this;
      var data = $(this).closest('.removeSub').data('sub');
      $.ajax('/api/users/' + addSub.data('id'), { 
        type: 'PUT',
        dataType: 'json',
        context: removeSub,
        data: { 'removeSub': data },
        success: function(res) {
          $(this).closest('.removeSub').remove();
          console.log(res);
        },
        error: function(err, status, msg) {
          console.log(status + msg);
        }
      });
    });
  }
});
