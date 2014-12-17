$(function() {
  var $loadMore = $('#load-more');

  if ($loadMore.length) {

    var $spinner = $('#spinner');

    function init() {
      $spinner.hide();
      $.ajaxPrefilter(function(options, _, xhr) {
        if (!xhr.crossDomain) {
          xhr.setRequestHeader('X-CSRF-Token', securityToken);
        }
      });
    }

    function updateUI() {
      $(this).hide();
      $spinner.show();
    }

    $loadMore.on('click', function() {
      updateUI.call(this);
//      $.ajax({
//        url: '/api/videos',
//        type: 'POST',
//        dataType: 'json',
//        complete: function() {
//          $('#spinner').hide();
//        }
//      });
    });

    init();
  }
});
