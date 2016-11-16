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
        var popup = {
          title: "<h4>{NAME}</h4>",
          overwriteActions: true,
          content: [],
          actions: [
            {
              id: "land-cover",
              className: "glyphicon glyphicon-leaf",
              title: "Land Cover"
            },
            {
              id: "land-management",
              className: "glyphicon glyphicon-user",
              title: "Land Management"
            }
          ]
        };

        this.myView = new MapView({
          container: "mapCanvas",
          map: myMap.map,
          center: [-115, 45.6],
          zoom: 7
        });

        var myWigets = new MyWidgets(this.myView, popup);

        var searchWidget = myWigets.search();

        this.myView.ui.add(searchWidget, {
          position: "top-left",
          index: 0
        });

        var view = this.myView;

        this.myView.popup.on("trigger-action", function(event){
          var attributes = view.popup.selectedFeature.attributes;
          if(event.action.id === "land-cover"){
            console.log("attributes: ", attributes);
          }
          if(event.action.id === "land-management"){
            console.log("attributes: ", attributes);
          }
        });
      }
    });
  });