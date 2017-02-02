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
    "esri/layers/support/MosaicRule",
    "esri/widgets/Search",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/dom-style",
    "dojo/domReady!"
  ],
  function (declare, MyMap, MyWidgets, Map, MyUtils, dom, MapView, ImageryLayer, RasterFunction, UniqueValueRenderer, SimpleFillSymbol, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, MosaicRule, Search, domConstruct, domClass, on, domStyle) {
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
            type: "US Forest Service"
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

        var landTypeColors = {
          "Rangeland": {
            color: [56, 36, 61]
          },
          "Wetlands": {
            color: [68, 147, 205]
          },
          "Water": {
            color: [0, 44, 205]
          },
          "Forest": {
            color: [0, 125, 3]
          },
          "Developed": {
            color: [127, 71, 120]
          },
          "Cultivated Crops": {
            color: [216, 217, 61]
          },
          "Pasture/Hay": {
            color: [216, 20, 61]
          }
        };

        // var imgUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_201701/ImageServer";
        var imgUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_201702/ImageServer";

        var imgLayer = new ImageryLayer({
          url: imgUrl
          /*pixelFilter: colorize*/ // Applies color to the layer
        });

        var getLandResults = function (feature, choice) {
          var results = "";

          var rasterAttributes;
          var fields;

          var colorize = function (pixelData) {
            if (pixelData === null || pixelData.pixelBlock === null ||
              pixelData.pixelBlock.pixels === null) {
              return;
            }

            // The pixelBlock stores the values of all pixels visible in the view
            var pixelBlock = pixelData.pixelBlock;

            // The pixels visible in the view
            var pixels = pixelBlock.pixels;

            // Get the pixels from the only band of the data
            var band1 = pixels[0];

            // Create empty arrays for each of the RGB bands to set on the pixelBlock
            var rBand = [];
            var gBand = [];
            var bBand = [];

            // the mask will be used to filter unwanted data
            var mask = [];

            // The number of pixels in the pixelBlock
            var numPixels = pixelBlock.width * pixelBlock.height;

            var j;
            var i;
            // for each pixel in the block
            for (i = 0; i < numPixels; i++) {
              var val = band1[i]; // get the current pixel value
              // if the pixel value matches the first field (Rangeland)
              // cycle through array fields
              // j = i % fields.length;

              for (j = 0; j < fields.length; j++) {
                // then assign it its preset RGB values
                if (val === fields[j].attributes.Value) {

                  if(fields[j].attributes.nlcd_name !== "Rangeland"){
                    mask[i] = 1;
                    rBand[i] = landTypeColors[fields[j].attributes.nlcd_name].color[0];
                    gBand[i] = landTypeColors[fields[j].attributes.nlcd_name].color[1];
                    bBand[i] = landTypeColors[fields[j].attributes.nlcd_name].color[2];
                  }
                  else {
                    mask[i] = 1;
                    rBand[i] = fields[j].attributes.red;
                    gBand[i] = fields[j].attributes.green;
                    bBand[i] = fields[j].attributes.blue;
                  }

                  break;
                  // rBand[i] = 255;
                  // gBand[i] = 0;
                  // bBand[i] = 255;

                  // if the pixel value matches the second field (LATAH COUNTY)
                  // then assign it its preset RGB values
                }
                else {
                  // if the pixel value does not match the desired values
                  // then exclude it from the mask so it doesn't display
                  mask[i] = 0;
                  rBand[i] = 0;
                  gBand[i] = 0;
                  bBand[i] = 0;
                }

              }

            }

            // Set the new pixel values on the pixelBlock
            pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
            pixelData.pixelBlock.statistics = null;
            pixelData.pixelBlock.pixelType = "U8"; // U8 is used for color
            pixelData.pixelBlock.mask = mask;
          };

          imgLayer.pixelFilter = colorize;

          myMap.map.add(imgLayer);

          // var clipCRF = new RasterFunction({
          //   functionName: "Clip",
          //   functionArguments: {
          //     ClippingGeometry: feature.geometry, //a polygon or envelope
          //     ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
          //     raster: "$$"
          //     // raster: colorRF
          //   }
          // });
          //
          // var clipRF = new RasterFunction({
          //   functionName: "Clip",
          //   functionArguments: {
          //     ClippingGeometry: feature.geometry, //a polygon or envelope
          //     ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
          //     raster: "$$"
          //   }
          // });


          return imgLayer.then(function () {
            var totA = 0;
            var totPC = 0;
            var totId = 0;
            var perCty = 0;
            var total;
            rasterAttributes = imgLayer.rasterAttributeTable.features;
            for (var i = 0; i < rasterAttributes.length; i++) {
              totId += rasterAttributes[i].attributes.area_ac;
            }
            fields = (choice === "management") ? rasterAttributes.filter(function (item, i) {
              return (item.attributes.cnty_name === feature.attributes.NAME && item.attributes.nlcd_name === "Rangeland");
            }) :
              rasterAttributes.filter(function (item, i) {
                return (item.attributes.cnty_name === feature.attributes.NAME);
              })
            ;
            // console.log(fields);

            fields.forEach(function (item) {
              var res = item.attributes;
              // var clr = colorTypes[res.sma_name].color;
              var clrs;
              var clr;
              var sma = colorTypes[res.sma_name].type;
              if (choice === "cover") {
                clrs = landTypeColors[res.nlcd_name].color;
                clr = "rgb("+clrs[0]+","+clrs[1]+","+clrs[2]+")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + res.nlcd_name.toString() + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
              }
              else if (choice === "management") {
                clrs = [res.red, res.green, res.blue];
                clr = "rgb("+clrs[0]+","+clrs[1]+","+clrs[2]+")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + sma + "</td><td>" + res.per_nlcd.toFixed(2) + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
              }
            });

            return new Promise(
              function (resolve, reject) {
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
          map.remove(imgLayer);
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
                myMap.map.remove(imgLayer);
                var feature = success[0].results[0].feature;
                var tbManagementHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";
                var tbCoverHead = "<thead><tr><th class='header legend'></th><th class='header'>Type of Land</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";

                if (choice === "management") {
                  var managementResults;
                  getLandResults(feature, "management").then(function (searchResults) {
                    managementResults = searchResults;
                  }).then(function () {
                    dom.byId("table-div").innerHTML = "<table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed' cellspacing='0'>" + tbManagementHead + "<tbody>" + managementResults + "</tbody></table>";
                  });

                }
                else if (choice === "cover") {
                  var coverResults;
                  getLandResults(feature, "cover").then(function (searchResults) {
                    coverResults = searchResults;

                  }).then(function () {
                    dom.byId("table-div").innerHTML = "<table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed' cellspacing='0'>" + tbCoverHead + "<tbody>" + coverResults + "</tbody></table>";
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