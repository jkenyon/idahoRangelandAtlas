/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyMap",
    "my/MyWidgets",
    "esri/Map",
    "my/MyUtils",
    "dojo/dom",
    "esri/views/MapView",
    "esri/layers/ImageryLayer",
    "esri/layers/support/RasterFunction",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/widgets/Search",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/dom-style",
    "dojo/domReady!"
  ],
  function (declare, MyMap, MyWidgets, Map, MyUtils, dom, MapView, ImageryLayer, RasterFunction, UniqueValueRenderer, SimpleFillSymbol, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, Search, domConstruct, domClass, on, domStyle) {
    return declare(null, {
      myView: null,
      constructor: function () {
        var myMap = new MyMap();
        var map = myMap.map;

        // var myUtils = new MyUtils();

        this.myView = new MapView({
          container: "mapCanvas",
          map: myMap.map,
          center: [-115, 45.6],
          zoom: 7
        });
        var view = this.myView;

        var myWigets = new MyWidgets(this.myView);

        var colorize = function (pixelData) {
          var pixelBlock = pixelData.pixelBlock;
          var numPixels = pixelBlock.width * pixelBlock.height;
          var rBand = [];
          var gBand = [];
          var bBand = [];
          var i;
          for (i = 0; i < numPixels; i++) {
            // Sets a color between blue (coldest) and red (warmest) in each band
            rBand[i] = 0;
            gBand[i] = 0;
            bBand[i] = 0;
          }
          pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
        }; // end colorize

        var imgLyr = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
          opacity: 0.7,
          pixelFilter: colorize
        });

        // Creates the style for the county boundary layer
        var hid = new UniqueValueRenderer({
          field: "NAME",
          defaultSymbol: new SimpleFillSymbol({
            color: [255, 255, 255, 0]
          })
        });

        //Creates county boundaries layer
        var countyLyr = new FeatureLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
          id: "counties",
          outFields: ['*'],
          opacity: 0.7,
          renderer: hid
        });

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
        var getLandResults = function (imgLayer, feature, choice) {
          var results = "";
          var clipCRF = new RasterFunction({
            functionName: "Clip",
            functionArguments: {
              ClippingGeometry: feature.geometry, //a polygon or envelope
              ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
              raster: "$$"
            }
          });

          // Clips the image to only the county geometry
          var clipRF = new RasterFunction({
            functionName: "Clip",
            functionArguments: {
              ClippingGeometry: feature.geometry, //a polygon or envelope
              ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
              raster: "$$"
            }
          });


          imgLayer.renderingRule = (choice === "cover") ? clipCRF : clipRF;
          imgLayer.pixelFilter = (choice === "cover") ? colorize : null;

          myMap.map.add(imgLayer);
          return imgLayer.then(function () {
            var totA = 0;
            var totPC = 0;
            var totId = 0;
            var perCty = 0;
            var total;
            var fields;
            var rasterAttributes = imgLayer.rasterAttributeTable.features;
            for (var i = 0; i < rasterAttributes.length; i++) {
              totId += rasterAttributes[i].attributes.area_ac;
            }
            fields = rasterAttributes.filter(function (item, i) {
              return item.attributes.cnty_name === feature.attributes.NAME;
            });

            if (choice === "cover") {
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
            else if (choice === "management") {
              fields.forEach(function (item) {
                var res = item.attributes;
                var clr = colorTypes[res.sma_name].color;
                var sma = colorTypes[res.sma_name].type;
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + sma + "</td><td>" + res.per_rng.toFixed(2) + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
              });
            }
            return new Promise(
              function(resolve, reject){
                resolve(results);
                reject("an error occured");
              }
            );
          });
        };

        myMap.map.add(countyLyr);

        var searchWidget = myWigets.search();

        var selectWidget = domConstruct.toDom('<div id="select-county"><select class="select-counties" id="select"></select></div>');

        var full = false;

        var choice = "";
        var landCover = dom.byId('land-cover');
        var landManagement = dom.byId('land-management');
        on(landCover, 'click', function (evt) {
          choice = "cover";
        });
        on(landManagement, 'click', function () {
          choice = "management";
        });
        var backBtn = dom.byId('back-button');
        on(backBtn, 'click', function () {
          map.remove(imgLyr);
        });

        view.then(function () {

          view.ui.add(searchWidget, {
            position: "top-right",
            index: 0
          });

          // domConstruct.place(selectWidget, dom.byId('esri_widgets_Search_0'), "first");
          view.ui.add(selectWidget, {
            position: "top-left",
            index: 0
          });
          var counties = [
            {
              id: 0,
              text: 'ADA'
            },
            {
              id: 1,
              text: 'ADAMS'
            },
            {
              id: 2,
              text: 'BANNOCK'
            },
            {
              id: 3,
              text: 'BEAR LAKE'
            },
            {
              id: 4,
              text: 'BENEWAH'
            },
            {
              id: 5,
              text: 'BINGHAM'
            },
            {
              id: 6,
              text: 'BLAINE'
            },
            {
              id: 7,
              text: 'BOISE'
            },
            {
              id: 8,
              text: 'BONNER'
            },
            {
              id: 9,
              text: 'BONNEVILLE'
            },
            {
              id: 10,
              text: 'BOUNDARY'
            },
            {
              id: 11,
              text: 'BUTTE'
            },
            {
              id: 12,
              text: 'CAMAS'
            },
            {
              id: 13,
              text: 'CANYON'
            },
            {
              id: 14,
              text: 'CARIBOU'
            },
            {
              id: 15,
              text: 'CASSIA'
            },
            {
              id: 16,
              text: 'CLARK'
            },
            {
              id: 17,
              text: 'CLEARWATER'
            },
            {
              id: 18,
              text: 'CUSTER'
            },
            {
              id: 19,
              text: 'ELMORE'
            },
            {
              id: 20,
              text: 'FRANKLIN'
            },
            {
              id: 21,
              text: 'FREMONT'
            },
            {
              id: 22,
              text: 'GEM'
            },
            {
              id: 23,
              text: 'GOODING'
            },
            {
              id: 24,
              text: 'IDAHO'
            },
            {
              id: 25,
              text: 'JEFFERSON'
            },
            {
              id: 26,
              text: 'JEROME'
            },
            {
              id: 27,
              text: 'KOOTENAI'
            },
            {
              id: 28,
              text: 'LATAH'
            },
            {
              id: 29,
              text: 'LEMHI'
            },
            {
              id: 30,
              text: 'LEWIS'
            },
            {
              id: 31,
              text: 'LINCOLN'
            },
            {
              id: 32,
              text: 'MADISON'
            },
            {
              id: 33,
              text: 'MINIDOKA'
            },
            {
              id: 34,
              text: 'NEZ PERCE'
            },
            {
              id: 35,
              text: 'ONEIDA'
            },
            {
              id: 36,
              text: 'OWYHEE'
            },
            {
              id: 37,
              text: 'PAYETTE'
            },
            {
              id: 38,
              text: 'POWER'
            },
            {
              id: 39,
              text: 'SHOSHONE'
            },
            {
              id: 40,
              text: 'TETON'
            },
            {
              id: 41,
              text: 'TWIN FALLS'
            },
            {
              id: 42,
              text: 'VALLEY'
            },
            {
              id: 43,
              text: 'WASHINGTON'
            }
          ];
          $(".select-counties").select2({
            placeholder: "Select",
            data: counties
          });

          domClass.add('select-county', "hidden");
          dom.byId('esri_widgets_Search_0').style.display = 'none';

          var fullscreenBtn = domConstruct.toDom('<button type="button" id="fullscreen-btn" class="btn btn-info"><span class="glyphicon glyphicon-fullscreen"></span></button>');

          view.ui.add(fullscreenBtn, {position: "top-right", index: 0});

          var mainDiv = dom.byId('main');
          var mapCanvas = dom.byId('mapCanvas');
          var table = dom.byId('table-div');
          var mapStyle = domStyle.getComputedStyle(mapCanvas);
          var mapDiv = dom.byId('map');
          var mapDivStyle = domStyle.getComputedStyle(mapDiv);
          on(fullscreenBtn, 'click', function (evt) {
            if (full === true) {
              dom.byId('header').style.display = 'block';
              dom.byId('main-content').style.display = 'block';
              domClass.add(mapCanvas, "map-display");
              domClass.remove(mapCanvas, "fullscreen");
              domClass.add(mainDiv, "container-fluid");
              domClass.add(mainDiv, "margin-top-55");
              domClass.add(mapDiv, "container-fluid");
              domClass.add(mapDiv, "padding-top");
              view.ui.remove(table);
              domClass.remove(table, "table-dark-bg");
              domConstruct.place(table, dom.byId('map-menu'), "last");
              full = false;
            }
            else {
              dom.byId('header').style.display = 'none';
              dom.byId('main-content').style.display = 'none';
              domClass.add(mapCanvas, "fullscreen");
              domClass.remove(mainDiv, "container-fluid");
              domClass.remove(mainDiv, "margin-top-55");
              domClass.remove(mapDiv, "container-fluid");
              domClass.remove(mapDiv, "padding-top");
              view.ui.add(table, {position: "bottom-left", index: 0});
              domClass.add(table, "table-dark-bg");
              full = true;
            }
          });


          $('#select').on('change', function (event) {
            var selectedText = event.target.selectedOptions["0"].text;
            searchWidget.search(selectedText).then(
              function (success) {

                var feature = success[0].results[0].feature;
                if (choice === "management") {
                  var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";

                  var managementResults;
                  getLandResults(imgLyr, feature, "management").then(function(searchResults){
                    managementResults = searchResults;
                  }).then(function(tableResults){
                    dom.byId("table-div").innerHTML = "<table id='table' class='table table-bordered text-center table-responsive' cellspacing='0'>" + tbHead + "<tbody>" + managementResults + "</tbody></table>";
                  });

                }
                else if (choice === "cover") {
                  var coverResults;
                  getLandResults(imgLyr, feature, "cover").then(function (searchResults) {
                    coverResults = searchResults;

                  }).then(function(tableResults){
                    dom.byId("table-div").innerHTML = "<br /><table id='table'  class='table table-bordered text-center table-responsive' cellspacing='0'><tbody>" + coverResults + "</tbody></table>";
                  });

                }

              },

              function (error) {
                console.log(error);
              }
            );
          });

        });
      },

      fixHeading: function (head, divID) {
        var h = head.toLowerCase();
        var hE = h.toTitleCase();
        $(divID).html("<h3>" + hE + "</h3>");
      }

    })
  })
;