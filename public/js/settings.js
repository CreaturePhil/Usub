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
