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
      searchConfig: null,
      constructor: function (view) {
        this.view = view;
        this.searchConfig = new Object({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_2014/MapServer/0"
        });
      },
      searchWidget: function (config) {
        this.searchConfig.url = (config.FeatureLayerUrl) ? config.FeatureLayerUrl : this.searchConfig.url;
        this.searchConfig.zoomScale = (config.zoomScale) ? config.zoomScale : 5000;
        this.searchConfig.resultGraphicEnabled = (config.resultGraphicEnabled) ? config.resultGraphicEnabled : false;
        this.searchWidget = new Search({
          view: this.view,
          popupEnabled: false,
          sources: [
            {
              featureLayer: new FeatureLayer({
                url: this.searchConfig.url
              }),
              searchFields: ["NAME"],
              suggestionTemplate: '{NAME}',
              displayField: "NAME",
              suggestionEnabled: true,
              exactMatch: false,
              outFields: ["*"],
              name: "Land Cover",
              zoomScale: this.searchConfig.zoomScale,
              resultGraphicEnabled: this.searchConfig.resultGraphicEnabled
            }
          ]
        });
        this.searchWidget.startup();
        return this.searchWidget;
      },
      searchWidgetSetup: function(config){
        this.searchConfig = (config) ? config : this.searchConfig;
      }
    });
  });