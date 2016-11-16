/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "esri/symbols/PictureMarkerSymbol",
    "dojo/domReady!"
  ],
  function (declare, Search, FeatureLayer, PictureMarkerSymbol) {
    return declare(null, {
      searchWidget: null,
      constructor: function (view) {
        this.searchWidget = new Search({
          view: view,
          sources: [
            {
              featureLayer: new FeatureLayer({
                url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
                popupTemplate: {
                  title: "<h3>{NAME}</h3>",
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
                }
              }),
              placeholder: "County",
              searchFields: ["NAME"],
              displayField: "NAME",
              suggestionTemplate: "{NAME}",
              exactMatch: false,
              outFields: ["NAME"],
              name: "Counties",
              zoomScale: 500000
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