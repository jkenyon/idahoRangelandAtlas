/**
 * Created by kande on 11/14/2016.
 */
define([
    "dojo/_base/declare",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "dojo/domReady!"
  ],
  function (declare, UniqueValueRenderer, SimpleFillSymbol) {
    return declare(null, {
      hid: null,
      constructor: function () {
        this.hid = new UniqueValueRenderer({
          field: "NAME",
          defaultSymbol: new SimpleFillSymbol({
            color: [255, 255, 255, 0]
          })
        });
      }
    });
  });