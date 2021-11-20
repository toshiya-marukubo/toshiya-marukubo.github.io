window.addEventListener('load', function () {
  var getJSON = getItemsDataFromJSON;
  getJSON.initialize('codepen.json');

  var loading = document.getElementsByClassName('loading')[0];
  loading.classList.add('loaded');
});
