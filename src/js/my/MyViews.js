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
    "esri/widgets/Legend",
    "esri/layers/ImageryLayer",
    "esri/layers/support/RasterFunction",
    "esri/renderers/UniqueValueRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/layers/support/MosaicRule",
    "esri/widgets/Search",
    "esri/symbols/TextSymbol",
    "esri/layers/support/LabelClass",
    "esri/widgets/BasemapToggle",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/dom-style",
    "dojo/domReady!"
  ],
  function (declare, MyMap, MyWidgets, Map, MyUtils, dom, MapView, Legend, ImageryLayer, RasterFunction, UniqueValueRenderer, SimpleFillSymbol, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, MosaicRule, Search, TextSymbol, LabelClass, BasemapToggle, QueryTask, Query, domConstruct, domClass, on, domStyle) {
    return declare(null, {
      myView: null,
      constructor: function () {
        // TODO sort the table of result for land cover(% county) and land management(% rangeland)
        // TODO no zoom, search for county for the new layer, display everything for now, display the legend
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

        var myWidgets = new MyWidgets(this.myView);

        var basemapToggle = new BasemapToggle({
          view: view, // view that provides access to the map's 'topo' basemap
          nextBasemap: "satellite" // allows for toggling to the 'hybrid' basemap
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
          renderer: hid,
          popupTemplate: {
            title: '{NAME}',
            content: 'display info here'
          }
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
          /******************************************************/
          /* BEAR LAKE, POWER, ONEIDA*/
          /* recently added need standard colors and names */
          "NWR": {
            color: "#d9d000",
            type: "National Wildlife Refuge"
          },
          "LU_USDA": {
            color: "#a62cd9",
            type: "LU_USDA"
          },
          "LU_DOI": {
            color: "#d93629",
            type: "LU_DOI"
          },
          "FAA": {
            color: "#808080",
            type: "FAA"
          },
          "COE": {
            color: "#808080",
            type: "Corps of Engineers"
          },
          /********************************************************/
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
            color: [255, 165, 0]
          },
          "Wetlands": {
            color: [128, 0, 128]
          },
          "Water": {
            color: [0, 44, 205]
          },
          "Forest": {
            color: [34, 139, 34],
            totalCountyPerc: 0,
            totalAcr: 0
          },
          "Developed": {
            color: [128, 128, 128]
          },
          "Cultivated Crops": {
            color: [255, 192, 203]
          },
          "Pasture/Hay": {
            color: [255, 255, 0]
          }
        };

        var landTypes = ["Rangeland", "Wetlands", "Water", "Forest", "Developed", "Cultivated Crops", "Pasture/Hay"];

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

        // var imgUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_201701/ImageServer";
        var imgUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_201702/ImageServer";

        var imgLayer = new ImageryLayer({
          url: imgUrl
        });

        var featureLayerUrl = "http://services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/Kenyon_AgCensus_2012/FeatureServer/0";
        var cowLyr = new FeatureLayer({
          url: featureLayerUrl,
          id: "cows",
          outFields: ['*'],
          popupTemplate: {
            title: "{NAME}",
            content: '<b>USDA Census Year:</b> {census_yea} <br />' +
            '<b>Number of Ranches:</b> {Ranches_11} <br />' +
            '<b>Cattle Farms:</b> {cattle_far} <br />' +
            '<b>Number of Cattle:</b> {cattle_num} <br />' +
            '<b>Beef Farms:</b> {beef_farms} <br />' +
            '<b>Number of Beef:</b> {beef_numbe} <br />'
          }
        });

        var legend = new Legend({
          view: view,
          layerInfos: [{
            layer: cowLyr,
            title: "Legend"
          }]
        });


        var countyNameLayer = new FeatureLayer({
          url: featureLayerUrl,
          minScale: 0,
          maxScale: 0
        });

        var countyMarkerLayer = new FeatureLayer({
          url: featureLayerUrl
        });

        var resetZoom = function(){
          view.goTo({
            center: [-115, 45.6],
            zoom: 7
          });
        };

        var setZoom = function(value, mapPoint){
          view.goTo({
            target: mapPoint,
            zoom: value
          })
        };

        var getCowResults = function (countyName) {
          var results = "";
          var cowAttributes;
          var cowFields;

          results += '<h4 class="text-center">' + countyName + '</h4><table class="table table-bordered table-condensed text-center table-responsive table-fixed tablesorter" cellspacing="0"><tbody>';

          var countyMarkerRenderer = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol({
              size: 10,
              color: "#2e47ff",
              outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 64, 0, 0.4], // autocasts as new Color()
                width: 7
              }
            })
          });

          var countyNameRenderer = new SimpleRenderer({
            symbol: new TextSymbol({
              color: "blue",
              haloColor: "black",
              haloSize: "1px",
              text: countyName,
              xoffset: 3,
              yoffset: 3,
              font: {  // autocast as esri/symbols/Font
                size: 12,
                family: "sans-serif",
                weight: "bolder"
              }
            })
          });

          cowLyr.then(function () {
            cowLyr.queryFeatures().then(function (cowData) {
              cowFields = cowData.features.filter(function (item) {
                return (item.attributes.NAME === countyName);
              });
            }).then(function () {
              countyMarkerLayer.renderer = countyMarkerRenderer;
              countyNameLayer.renderer = countyNameRenderer;
              countyMarkerLayer.definitionExpression = "NAME = '" + countyName + "'";
              countyNameLayer.definitionExpression = "NAME = '" + countyName + "'";
              myMap.map.add(countyNameLayer);
              myMap.map.add(countyMarkerLayer);

              cowAttributes = cowFields[0].attributes;
              results += '<tr><th style="font-weight: normal;">USDA Census Year</th><td>' + cowFields[0].attributes.census_yea + '</td></tr>';
              results += '<tr><th style="font-weight: normal;">Ranches</th><td>' + cowFields[0].attributes.Ranches_11 + '</td></tr>';
              results += '<tr><th style="font-weight: normal;">Cattle Farms</th><td>' + cowAttributes.cattle_far + '</td></tr>';
              results += '<tr><th style="font-weight: normal;">Number of Cattle</th><td>' + cowAttributes.cattle_num + '</td></tr>';
              results += '<tr><th style="font-weight: normal;">Beef Farms</th><td>' + cowAttributes.beef_farms + '</td></tr>';
              results += '<tr><th style="font-weight: normal;">Number of Beef</th><td>' + cowAttributes.beef_numbe + '</td></tr>';
              results += '</tbody></table>';
              dom.byId("table-div").innerHTML = results;
            });
          });

        };

        var getLandResults = function (feature, choice) {
          var results = "";
          var rasterAttributes;
          var fields;
          var tbManagementHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";
          var tbCoverHead = "<thead><tr><th class='header legend'></th><th class='header'>Type of Land</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";

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

                  if (fields[j].attributes.nlcd_name !== "Rangeland") {
                    mask[i] = 1;
                    rBand[i] = landTypeColors[fields[j].attributes.nlcd_name].color[0];
                    gBand[i] = landTypeColors[fields[j].attributes.nlcd_name].color[1];
                    bBand[i] = landTypeColors[fields[j].attributes.nlcd_name].color[2];
                  }
                  else {
                    if (choice === "cover") {
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
                  }
                  break;
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

          imgLayer.then(function () {
            var totId = 0;
            rasterAttributes = imgLayer.rasterAttributeTable.features;
            for (var i = 0; i < rasterAttributes.length; i++) {
              totId += rasterAttributes[i].attributes.area_ac;
            }
            fields = (choice === "management") ? rasterAttributes.filter(function (item, i) {
                return (item.attributes.cnty_name === feature.attributes.NAME && item.attributes.nlcd_name === "Rangeland");
              }) :
              rasterAttributes.filter(function (item, i) {
                return (item.attributes.cnty_name === feature.attributes.NAME);
              });
          }).then(function(){
            if (choice === "management") {
              fields.forEach(function (item, i) {
                var res = item.attributes;
                var sma = colorTypes[res.sma_name].type;
                var clrs = [res.red, res.green, res.blue];
                var clr = "rgb(" + clrs[0] + "," + clrs[1] + "," + clrs[2] + ")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + sma + "</td><td>" + res.per_nlcd.toFixed(2) + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
              });
              dom.byId("table-div").innerHTML = "<h4 class='text-center'>" + feature.attributes.NAME + "</h4><table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed tablesorter' cellspacing='0'>" + tbManagementHead + "<tbody>" + results + "</tbody></table>";
            }
            else if (choice === "cover") {
              var coverValue;
              var covers = [];
              for (var k = 0; k < landTypes.length; k++) {
                coverValue = fields.filter(function (item) {
                  return (item.attributes.nlcd_name === landTypes[k]);
                });
                covers.push(coverValue);
              }
              covers.forEach(function (item, i) {
                var totalAc = item.reduce(function (prev, curr) {
                  return prev + curr.attributes.area_ac;
                }, 0);
                var totalPer = item.reduce(function (prev, curr) {
                  return prev + curr.attributes.per_cnty;
                }, 0);
                var nlcd_name = landTypes[i];
                var clrs = landTypeColors[nlcd_name].color;
                var clr = "rgb(" + clrs[0] + "," + clrs[1] + "," + clrs[2] + ")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + nlcd_name.toString() + "</td><td>" + totalPer.toFixed(2) + "</td><td>" + totalAc.toFixed(2) + "</td></tr>";
              });
              dom.byId("table-div").innerHTML = "<h4 class='text-center'>" + feature.attributes.NAME + "</h4><table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed tablesorter' cellspacing='0'>" + tbCoverHead + "<tbody>" + results + "</tbody></table>";
            }

          });
        };

        myMap.map.add(countyLyr);

        var searchWidget = myWidgets.searchWidget({view: view});
        var selectWidget = domConstruct.toDom('<div id="select-county"><select class="select-counties" id="select"><option value=""></option></select></div>');

        var full = false;

        var choice = "";
        var landCover = dom.byId('land-cover');
        var landManagement = dom.byId('land-management');
        var cowManagement = dom.byId('cow-management');
        on(landCover, 'click', function () {
          resetZoom();
          choice = "cover";
        });
        on(landManagement, 'click', function () {
          resetZoom();
          choice = "management";
        });
        on(cowManagement, 'click', function () {
          resetZoom();
          choice = "cow";
          myMap.map.add(cowLyr);
          view.ui.add(legend, "bottom-right");
        });

        var backBtn = dom.byId('back-button');
        on(backBtn, 'click', function () {
          resetZoom();
          map.remove(imgLayer);
          map.remove(cowLyr);
          map.remove(countyNameLayer);
          map.remove(countyMarkerLayer);
          dom.byId("table-div").innerHTML = "";
          view.ui.remove(legend);
        });

        view.then(function () {

          view.ui.add(basemapToggle, "top-right");

          view.on('click', function (event) {
            var params = new Query({
              returnGeometry: true,
              outFields: ["NAME"],
              geometry: event.mapPoint
            });
            myMap.map.remove(imgLayer);
            countyLyr.queryFeatures(params).then(function (results) {
              var selectionOnMap = results.features[0];
              if(choice === "cow"){
                getCowResults(selectionOnMap.attributes.NAME);
                setZoom(7, event.mapPoint);
              }
              else if(choice === "management"){
                getLandResults(selectionOnMap, "management");
                setZoom(9, event.mapPoint);
              }
              else if(choice === "cover"){
                getLandResults(selectionOnMap, "cover");
                setZoom(9, event.mapPoint);
              }
            });


          });

          view.ui.add(searchWidget, {
            position: "top-right",
            index: 0
          });

          // domConstruct.place(selectWidget, dom.byId('esri_widgets_Search_0'), "first");
          view.ui.add(selectWidget, {
            position: "top-left",
            index: 0
          });

          $(".select-counties").select2({
            placeholder: "Select a county",
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

          $('#select').on('select2:select', function (event) {
            var selectedText = event.target.selectedOptions["0"].text;
            if (choice === "cow") {
              getCowResults(selectedText + ' COUNTY');
            }
            else {
              searchWidget.search(selectedText).then(
                function (success) {
                  myMap.map.remove(imgLayer);
                  var feature = success[0].results[0].feature;

                  if (choice === "management") {
                    getLandResults(feature, "management");
                  }
                  else if (choice === "cover") {
                    getLandResults(feature, "cover");
                  }
                },
                function (error) {
                  console.log(error);
                }
              );

            }
          });

        });
      }
    })
  })
;