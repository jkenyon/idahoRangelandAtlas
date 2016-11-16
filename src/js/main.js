require([
  "my/MyViews",
  "esri/config",

  "dojo/domReady!"
], function(MyViews, esriConfig) {
  // Fixes CORS problems.
  esriConfig.request.corsDetection = false;
  esriConfig.request.corsEnabledServers.push("gis-sandbox.northwestknowledge.net");
  var view = new MyViews();
});


// var dojoConfig = {
//   paths: { extras: location.pathname.replace(/\/[^/]+$/, "") + "/my" }
// };