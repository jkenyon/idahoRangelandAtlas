require([
  "my/MyMap",
  "dojo/domReady!"
], function(MyMap) {
  var map = new MyMap();
  map.createMap();
});


// var dojoConfig = {
//   paths: { extras: location.pathname.replace(/\/[^/]+$/, "") + "/my" }
// };