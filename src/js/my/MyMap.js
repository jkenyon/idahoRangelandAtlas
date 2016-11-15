define([
    "dojo/_base/declare",
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
  ],
  function (declare, Map, MapView) {
    return declare(null, {
      constructor: function () {
        console.log("hello");
      },
      createMap: function () {
        var map = new Map({
          basemap: "streets"
        });

        var view = new MapView({
          container: "mapCanvas",
          map: map,
          zoom: 4,
          center: [15, 65]
        });
        console.log("map created");
      }
    });
  });