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
    "dojo/domReady!"
  ],
  function (declare, Search, FeatureLayer, Graphic, UniqueValueRenderer, SimpleFillSymbol) {
    return declare(null, {
      searchWidget: null,
      constructor: function (view, popup) {
        this.searchWidget = new Search({
          view: view,
          allPlaceholder: "Search for a county",
          sources: [
            {
              featureLayer: new FeatureLayer({
                url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
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
              resultGraphicEnabled: true
            },
            {
              featureLayer: new FeatureLayer({
                url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
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
              resultGraphicEnabled: false
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