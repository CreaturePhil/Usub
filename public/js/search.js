function redirect() {
  var value = document.getElementById('search').value;

  if (value) {
    // slugify value
    value = value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '+');

    location = "https://www.youtube.com/results?search_query=" + value;
  }

  return false;
}
