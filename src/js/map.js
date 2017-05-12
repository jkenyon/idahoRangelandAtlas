/**
 * Created by kande on 1/19/2017.
 */
require([
  "my/MyViews",
  "esri/config",
  "dojo/domReady!"
], function (MyViews, esriConfig) {
  // Fixes CORS problems.
  esriConfig.request.corsDetection = false;
  // TODO add domains services host urls here
  esriConfig.request.corsEnabledServers.push(
    "gis-sandbox.northwestknowledge.net"
  );
  var view = new MyViews();

});
