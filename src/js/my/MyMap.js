define(["dojo/_base/declare", "esri/views/MapView", "esri/Map", "dojo/domReady!"],
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
          container: "viewDiv",
          map: map,
          zoom: 4,
          center: [15, 65]
        });
        view.then(
          function () {
            console.log("view created");
          },
          function (error) {
            console.log("error while creating view: ", error);
          }
        );
        console.log("map created");
      }
    });
  });