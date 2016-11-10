require([
  "my/MyMap",
  "dojo/domReady!"
], function(
  MyMap
) {
  var myMap = new MyMap();
  myMap.createMap();

});
var dojoConfig = {
  paths: { extras: location.pathname.replace(/\/[^/]+$/, "") + "/my" }
};