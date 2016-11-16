define([
    "dojo/_base/declare",
    "my/MyLayers",
    "esri/Map",
    "dojo/domReady!"
  ],
  function (declare, MyLayers, Map) {
    return declare(null, {
      map: null,
      constructor: function () {
        var myLayers = new MyLayers();
        this.map = new Map({
          basemap: "streets",
        });
      },
      getMap: function () {
        return this.map;
      }
    });
  });