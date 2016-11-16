/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyMap",
    "my/MyWidgets",
    "esri/Map",
    "esri/views/MapView",
    "dojo/domReady!"
  ],
  function (declare, MyMap, MyWidgets, Map, MapView) {
    return declare(null, {
      myView: null,
      constructor: function () {
        var myMap = new MyMap();
        this.myView = new MapView({
          container: "mapCanvas",
          map: myMap.map,
          center: [-115, 45.6],
          zoom: 7
        });
        var myWigets = new MyWidgets(this.myView);
        var searchWidget = myWigets.search();
        this.myView.ui.add(searchWidget, {
          position: "top-left",
          index: 0
        });
        this.myView.popup.on("trigger-action", function(event){
          if(event.action.id === "land-cover"){
            console.log("land cover action");
          }
          if(event.action.id === "land-management"){
            console.log("land management action");
          }
        });
      }
    });
  });