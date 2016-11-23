/**
 * Created by kande on 11/14/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyLayers",
    "my/MyMap",
    "esri/layers/ImageryLayer",
    "dojo/dom",
    "dojo/domReady!"
  ],
  function (declare, ImageryLayer) {
    return declare(null, {
      loading: null,
      map: null,
      foo: null,
      imgLyr: null,
      constructor: function (map) {
        // this.loading = dom.byId("loadingImg");
        this.map = map;
        this.imgLyr = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
          opacity: 0.7
        });
        this.map.add(this.imgLyr);
      },

      landCoverResults: function (attributes) {
        var fields;
        var tbHead;
        var results = "";
        var rasterAttributes = null;
        imgLyr = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
          opacity: 0.7
        });
        this.map.add(this.imgLyr);

        this.imgLyr.then(function () {
          rasterAttributes = imgLyr.rasterAttributeTable.features;
          fields = rasterAttributes.filter(function (item, i) {
            var className = item.attributes.cnty_name;
            return className === attributes.NAME;
          });
          fields.forEach(function(item){
            var res = item.attributes;
            // var clr = "rgb(" + res.red + ", " + res.green + ", " + res.blue + ")";
            var colorTypes = {
              "PRIVATE": {
                color: "#ffffff",
                type: "Private"
              },
              "USFS": {
                color: "#DDF8DE",
                type: "US Forest Service",
              },
              "BLM": {
                color: "#ffe49c",
                type: "Bureau of Land Management"
              },
              "STATEPR": {
                color: "#c4e5f5",
                type: "State Parks & Rec"
              },
              "STATE": {
                color: "#A4C2D2",
                type: "State Dept. of Lands"
              },
              "STATEOTH": {
                color: "#c4e5f5",
                type: "State, Other"
              },
              "STATEFG": {
                color: "#A4C2D2",
                type: "State Fish & Game"
              },
              "HSTRCWTR": {
                color: "#006CB2",
                type: "Unsurveyed Water"
              },
              "BIA": {
                color: "#E9D0B7",
                type: "Bureau of Indian Affairs"
              },
              "IR": {
                color: "#ffc68e",
                type: "American Indian Reservation"
              },
              "NPS": {
                color: "#d9d3f4",
                type: "National Park Service"
              },
              "DOE": {
                color: "#E9D0B7",
                type: "Dept. of Energy"
              },
              "MIL": {
                color: "#FBCCFE",
                type: "US Military"
              },
              "BOR": {
                color: "#FFF7C9",
                type: "Bureau of Reclamation"
              }
            };
            var clr = colorTypes[res.sma_name].color;
            var sma = colorTypes[res.sma_name].type;
            results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + sma + "</td><td>" + res.per_rng.toFixed(2) + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
          });
          var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";
        });
        return results;
      }

    });
  });