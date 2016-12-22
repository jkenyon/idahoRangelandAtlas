/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"
  ],
  function (declare, Search, FeatureLayer) {
    return declare(null, {
      searchWidget: null,
      constructor: function (view) {
        var url = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_2014/MapServer/0";

        this.searchWidget = new Search({
          view: view,
          allPlaceholder: "Search for a county",
          popupOpenOnSelect: true,
          autoSelect: true,
          popupEnabled: true,
          sources: [
            {
              featureLayer: new FeatureLayer({
                url: url
              }),
              placeholder: "Search for a county",
              searchFields: ["NAME"],
              suggestionTemplate: '{NAME}',
              displayField: "NAME",
              suggestionEnabled: true,
              exactMatch: false,
              outFields: ["*"],
              name: "Land Cover",
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