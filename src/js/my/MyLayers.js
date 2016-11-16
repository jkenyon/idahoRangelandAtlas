/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyRenderers",
    "esri/layers/support/RasterFunction",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/ImageryLayer",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/Graphic",
    "dojo/domReady!"
  ],
  function (declare, MyRenderers, SimpleFillSymbol, UniqueValueRenderer, RasterFunction, FeatureLayer, GraphicsLayer, ImageryLayer, Graphic) {
    return declare(null, {
      countyLyr: null,
      imgLyr: null,
      hid: null,
      foo: null,
      clipCRF: null,
      clipRF: null,
      constructor: function () {
        var myRenderers = new MyRenderers();
        this.countyLyr = new FeatureLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
          id: "counties",
          outFields: ['*'],
          opacity: 0.7,
          renderer: myRenderers.hid
        });

        this.foo = new Graphic;

        this.clipCRF = new RasterFunction({
          functionName: "Clip",
          functionArguments: {
            ClippingGeometry: this.foo.geometry, //a polygon or envelope
            ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
            raster: "$$"
          }
        });

        this.clipRF = new RasterFunction({
          functionName: "Clip",
          functionArguments: {
            ClippingGeometry: this.foo.geometry, //a polygon or envelope
            ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
            raster: "$$"
          }
        });

        this.imgLyr = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
          opacity: 0.8,
          renderingRule: this.clipRF,
          pixelFilter: null
        });

        // Creates the style for the county boundary layer
        this.hid = new UniqueValueRenderer({
          field: "NAME",
          defaultSymbol: new SimpleFillSymbol({
            color: [255, 255, 255, 0]
          })
        });
      },

      countyLayer: function () {
        return this.countyLyr();
      },
      imageLayer: function () {
        return this.imgLyr;
      }
    });
  });