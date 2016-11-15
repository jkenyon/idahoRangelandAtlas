/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyMap",
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
  ],
  function (declare, MyMap, Map, MapView) {
    return declare(null, {
      view: null,
      constructor: function () {
        var myMap = new MyMap();
        this.view = new MapView({
          container: "mapCanvas",
          map: myMap.map,
          zoom: 4,
          center: [15, 65]
        });
      }
    });
  });