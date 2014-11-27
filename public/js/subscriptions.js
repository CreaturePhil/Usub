$(function() {
  if ($('#subscriptions').length >= 1) {
    var addSub = $('#addSub')
    var subsList = $('#subsList');

    $.getJSON('/api/users/' + addSub.data('id'), function(res) {
      $.each(res.subscriptions, function(index, sub) {
        var display = '<tr class="removeSub" data-sub="' + sub + '">' +
                      '<td>' + sub + '</td>' +
                      '<td><span class="glyphicon glyphicon-remove"></span></td>' +
                      '</tr>';
        subsList.append(display); 
      });
    });

    var watch = { loading: false };
    
    addSub.on('submit', function(e) {
      e.preventDefault();
      if (watch.loading) return;
      if (!$('#searchSub').val()) {
        return $('.top-right').notify({
          type: 'danger',
          message: { text: 'Cannot be blank!' }
        }).show();
      }
      watch.loading = true;
      $.ajax($(this).attr('action'), { 
        type: 'PUT',
        dataType: 'json',
        context: watch,
        data: { 'addSub': $('#searchSub').val() },
        success: function(res) {
          var searchSub = $('#searchSub');
          var display = '<tr class="removeSub" data-sub="' + searchSub.val() + '">' +
                        '<td class="highlight">' + searchSub.val() + '</td>' +
                        '<td class="highlight"><span class="glyphicon glyphicon-remove"></span></td>' +
                        '</tr>';

          $('#subsList').prepend(display);
          setTimeout(function() {
            $('.highlight').removeClass('highlight');
          }, 1000);
          searchSub.val('');
          this.loading = false;
        },
        error: function(err, status, msg) {
          console.log(status + msg);
        }
      });
    }); 

    $('#subsList').on('click', '.glyphicon-remove', function() {
      var removeSub = this;
      var data = $(this).closest('.removeSub').data('sub');
      $.ajax('/api/users/' + addSub.data('id'), { 
        type: 'PUT',
        dataType: 'json',
        context: removeSub,
        data: { 'removeSub': data },
        success: function(res) {
          $(this).closest('.removeSub').remove();
        },
        error: function(err, status, msg) {
          console.log(status + msg);
        }
      });
    });
  }
});
