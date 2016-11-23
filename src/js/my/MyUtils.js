/**
 * Created by kande on 11/14/2016.
 */
define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/domReady!"
  ],
  function (declare) {
    return declare(null, {
      constructor: function () {
        // this.loading = dom.byId("loadingImg");
      },
      getLandResults: function (imgLayer, attributes, choice) {
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
        var results = "";
        imgLayer.then(function () {
          var totA = 0;
          var totPC = 0;
          var totId = 0;
          var perCty = 0;
          var total;
          var fields;
          var rasterAttributes = imgLyr.rasterAttributeTable.features;
          for (var i = 0; i < rasterAttributes.length; i++) {
            totId += rasterAttributes[i].attributes.area_ac;
          }
          fields = rasterAttributes.filter(function (item, i) {
            return item.attributes.cnty_name === attributes.NAME;
          });

          if(choice === "cover"){
            for (i = 0; i < rasterAttributes.length; i++) {
              totId += rasterAttributes[i].attributes.area_ac;
            }
            for (i = 0; i < fields.length; i++) {
              var g = fields[i].attributes;
              totA += g.area_ac;
              totPC += g.per_cnty
            }
            perCty = totPC.toFixed(2);
            total = totA.toFixed(2);
            results += "<tr><td>Total County Rangeland (acres)</td><td>" + total + "</td></tr><tr><td>Percent of County Acreage</td><td>" + perCty + "</td></tr>";
          }
          else if(choice === "management") {
            fields.forEach(function (item) {
              var res = item.attributes;
              var clr = colorTypes[res.sma_name].color;
              var sma = colorTypes[res.sma_name].type;
              results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + sma + "</td><td>" + res.per_rng.toFixed(2) + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
            });
          }
        });
        return results;
      }
    });
  });