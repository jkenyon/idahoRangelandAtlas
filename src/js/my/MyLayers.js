/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyRenderers",
    "esri/layers/support/RasterFunction",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"
  ],
  function (declare, MyRenderers, FeatureLayer) {
    return declare(null, {
      countyLayer: null,
      imgLyr: null,
      constructor: function () {
        var myRenderers = new MyRenderers();
        this.countyLayer = new FeatureLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
          id: "counties",
          outFields: ['*'],
          opacity: 0.7,
          renderer: myRenderers.hid
        });

      }
    });
  });