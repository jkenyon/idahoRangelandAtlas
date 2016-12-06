/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "esri/Graphic",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/geometry/Polyline",
    "dojo/domReady!"
  ],
  function (declare, Search, FeatureLayer, Graphic, UniqueValueRenderer, SimpleFillSymbol, SimpleRenderer, SimpleMarkerSymbol, Polyline) {
    return declare(null, {
      searchWidget: null,
      constructor: function (view, popup) {
        var url ="https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer";

        this.searchWidget = new Search({
          view: view,
          allPlaceholder: "Search for a county",
          popupOpenOnSelect: true,
          sources: [
            {
              featureLayer: new FeatureLayer({
                url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_2014/MapServer/0",
                popupTemplate: popup
              }),
              placeholder: "Search for a county",
              searchFields: ["NAME"],
              displayField: "NAME",
              suggestionEnabled: true,
              suggestionTemplate: "{NAME}",
              exactMatch: false,
              outFields: ["*"],
              name: "Land Cover",
              zoomScale: 500000,
              resultGraphicEnabled: false
            },
            {
              featureLayer: new FeatureLayer({
                url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_2014/MapServer/1",
                popupTemplate: popup
              }),
              placeholder: "Search for a county",
              suggestionEnabled: true,
              searchFields: ["NAME"],
              displayField: "NAME",
              suggestionTemplate: "{NAME}",
              exactMatch: false,
              outFields: ["*"],
              name: "Land Management",
              zoomScale: 500000,
              resultGraphicEnabled: true
            }
          ]
        });
        this.searchWidget.startup();
      },
      search: function () {
        return this.searchWidget;
      }
    });
  });