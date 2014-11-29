$(function() {
  if ($('#subscriptions').length >= 1) {
    var addSub = $('#addSub');
    var subsList = $('#subsList');
    var subs = [];

    var setCSRFToken = function(securityToken) {
      $.ajaxPrefilter(function(options, _, xhr) {
        if ( !xhr.crossDomain ) {
          xhr.setRequestHeader('X-CSRF-Token', securityToken);
        }
      });
    };

    setCSRFToken($('meta[name="csrf-token"]').attr('content'));

    $.getJSON('/api/users/' + addSub.data('id'), function(res) {
      $.each(res.subscriptions, function(index, sub) {
        var display = '<tr class="removeSub" data-sub="' + sub + '">' +
                      '<td>' + sub + '</td>' +
                      '<td><span class="glyphicon glyphicon-remove"></span></td>' +
                      '</tr>';
        subsList.append(display); 
        subs.push(sub.toLowerCase());
      });
    });

    var watch = { loading: false };
    var addSubFn = function(e) {
      e.preventDefault();
      if (watch.loading) return;
      var searchSub = $('#searchSub').val();
      if (subs.indexOf(searchSub) >= 0) {
        return $('.top-right').notify({
          type: 'danger',
          message: { text: 'You already added ' + searchSub + '.'  }
        }).show();
      }
      watch.loading = true;
      $.ajax($(this).attr('action'), { 
        type: 'PUT',
        dataType: 'json',
        context: watch,
        data: { 'addSub': searchSub },
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
          subs.push(searchSub.val());
          searchSub.val('');
          this.loading = false;
        },
        error: function(err, status, msg) {
          console.log(status + msg);
          this.loading = false;
        }
      });
    };
    

    var removeSubFn = function() {
      var removeSub = this;
      var data = $(this).closest('.removeSub').data('sub');
      $.ajax('/api/users/' + addSub.data('id'), { 
        type: 'PUT',
        dataType: 'json',
        context: removeSub,
        data: { 'removeSub': data },
        success: function(res) {
          var removeSub = $(this).closest('.removeSub');
          subs.splice(subs.indexOf(removeSub.data('sub')), 1);
          removeSub.remove();
        },
        error: function(err, status, msg) {
          console.log(status + msg);
        }
      });
    };

    addSub.on('submit', addSubFn); 
    $('#subsList').on('click', '.glyphicon-remove', removeSubFn);

  }
});
