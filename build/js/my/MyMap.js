define([
    "dojo/_base/declare",
    "esri/Map",
    "dojo/domReady!"
  ],
  function (declare, Map) {
    return declare(null, {
      map: null,
      constructor: function () {
        this.map = new Map({
          basemap: "streets"
        });
      },
      getMap: function () {
        return this.map;
      }
    });
  });