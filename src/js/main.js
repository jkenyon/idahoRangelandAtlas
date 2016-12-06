require([
  "my/MyViews",
  "my/MySearchBox",
  "dojo/store/Memory",
  "dijit/form/FilteringSelect",
  "esri/config",

  "dojo/domReady!"
], function(MyViews,MySearchBox,  Memory, FilteringSelect, esriConfig) {
  // Fixes CORS problems.
  esriConfig.request.corsDetection = false;
  esriConfig.request.corsEnabledServers.push("gis-sandbox.northwestknowledge.net");
  var view = new MyViews();
  // var searchBox = new MySearchBox();
});


// var dojoConfig = {
//   paths: { extras: location.pathname.replace(/\/[^/]+$/, "") + "/my" }
// };