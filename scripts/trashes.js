window.addEventListener('DOMContentLoaded', function () {
  new getItemsDataFromJSON('codepen.json');
  var loading = document.getElementsByClassName('loading')[0];

  loading.classList.add('loaded');
});
