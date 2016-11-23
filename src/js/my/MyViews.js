/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyMap",
    "my/MyWidgets",
    "esri/Map",
    "dojo/dom",
    "esri/views/MapView",
    "esri/layers/ImageryLayer",
    "dojo/domReady!"
  ],
  function (declare, MyMap, MyWidgets, Map, dom, MapView, ImageryLayer) {
    return declare(null, {
      myView: null,
      constructor: function () {
        var myMap = new MyMap();

        // var myUtils = new MyUtils();
        var popup = {
          title: "<h4>{NAME}</h4>",
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
        };

        this.myView = new MapView({
          container: "mapCanvas",
          map: myMap.map,
          center: [-115, 45.6],
          zoom: 7
        });

        var myWigets = new MyWidgets(this.myView, popup);

        var searchWidget = myWigets.search();

        this.myView.ui.add(searchWidget, {
          position: "top-left",
          index: 0
        });

        var imgLyr = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
          opacity: 0.7
        });

        myMap.map.add(imgLyr);

        var getLandResults = function (imgLayer, attributes, choice) {
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
          var totA
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
        };

        var view = this.myView;
        this.myView.popup.on("trigger-action", function (event) {

          if (event.action.id === "land-management") {
            var attributes = view.popup.selectedFeature.attributes;

            tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";

            var managementResults = getLandResults(imgLyr, attributes, "management");
            dom.byId("tableDiv").innerHTML = "<table id='table' class='table' cellspacing='0'>" + tbHead + "<tbody>" + managementResults + "</tbody></table>";
          }
          if (event.action.id === "land-cover") {
            var attributes = view.popup.selectedFeature.attributes;

            var coverResults = getLandResults(imgLyr, attributes, "cover");

            dom.byId("tableDiv").innerHTML = "<br /><table id='table' class='table' cellspacing='0'><tbody>" + coverResults + "</tbody></table>";
          }
        });
      },

      fixHeading: function (head, divID) {
        var h = head.toLowerCase();
        var hE = h.toTitleCase();
        $(divID).html("<h3>" + hE + "</h3>");
      }

    })
  });