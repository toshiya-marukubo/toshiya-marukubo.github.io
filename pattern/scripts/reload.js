/*
* File Name / reload.js
* Created Date / Jun 23, 2020
* Auther / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
* Referenced / https://qiita.com/shibe23/items/79f950061457ff1a7687
*/

(function() {
  'use strict';
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      window.location.reload();
    }
  });
})();
