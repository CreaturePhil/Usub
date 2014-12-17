$(function() {
  var $loadMore = $('#load-more');

  if ($loadMore.length) {

    var $spinner = $('#spinner');

    $spinner.hide();

    $loadMore.on('click', function() {
      $(this).hide();
      $spinner.show();
//      $.ajax({
//        url: '/api/videos',
//        type: 'POST',
//        dataType: 'json',
//        complete: function() {
//          $('#spinner').hide();
//        }
//      });
    });

  }
});
