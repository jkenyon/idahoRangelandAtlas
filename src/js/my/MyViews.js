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
    "esri/config",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/dom-style",
    "dojo/domReady!"
  ],
  function (declare, MyMap, MyWidgets, Map, dom, MapView, Legend, ImageryLayer, RasterFunction, UniqueValueRenderer, SimpleFillSymbol, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, MosaicRule, Search, TextSymbol, LabelClass, BasemapToggle, QueryTask, Query, esriConfig, domConstruct, domClass, on, domStyle) {
    return declare(null, {
      myView: null,
      constructor: function () {

        // esriConfig.request.proxyUrl = "http://webpages.uidaho.edu";

        var myMap = new MyMap();
        var map = myMap.map;

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
          renderer: hid
        });
        myMap.map.add(countyLyr);

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
          },
          "GSA": {
            type: "GSA"
          },
          "DOI": {
            type: "DOI"
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

        var agencyTypes = [
          "PRIVATE",
          "USFS",
          "BLM",
          "STATEPR",
          "STATE",
          "STATEOTH",
          "STATEFG",
          "HSTRCWTR",
          "BIA",
          "IR",
          "NPS",
          "NWR",
          "LU_USDA",
          "LU_DOI",
          "FAA",
          "COE",
          "DOE",
          "MIL",
          "BOR",
          "GSA",
          "DOI"
        ];

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

        // var imgLyrUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_201701/ImageServer";
        // var imgLyrUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_201702/ImageServer";
        var imgLyrUrl = "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_20170409/ImageServer";

        var imgLayer = new ImageryLayer({
          url: imgLyrUrl,
          format: "jpgpng"
        });

        var countyLyrUrl = "http://services.arcgis.com/WLhB60Nqwp4NnHz3/arcgis/rest/services/Kenyon_AgCensus_2012/FeatureServer/0";
        var cowLyr = new FeatureLayer({
          url: countyLyrUrl,
          id: "cows",
          outFields: ['*']
        });

        var legend = new Legend({
          view: view,
          layerInfos: [{
            layer: cowLyr,
            title: "Legend"
          }]
        });


        var countyNameLayer = new FeatureLayer({
          url: countyLyrUrl,
          minScale: 0,
          maxScale: 0
        });

        var countyMarkerLayer = new FeatureLayer({
          url: countyLyrUrl
        });


        var resetZoom = function () {
          view.goTo({
            center: [-115, 45.6],
            zoom: 7
          });
        };

        var setZoom = function (value, mapPoint) {
          view.goTo({
            target: mapPoint,
            zoom: value
          })
        };


        var pdf = "<button class=\"btn btn-success export-pdf-btn\" onclick=\"exportPDF()\"><span class=\"glyphicon glyphicon-export\"></span>Export as PDF</button>";
        var csv = "<button class=\"btn btn-success export-pdf-btn\" onclick=\"exportCSV()\"><span class=\"glyphicon glyphicon-export\"></span>Export as CSV</button>";

        var exportBtn = pdf + csv;

        var printBtn = domConstruct.toDom('<button type="button" class="btn btn-success print-btn" onclick="exportResults(\'pdf\')"><span class="glyphicon glyphicon-print"></span></button>');

        var tbManagementHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th data-sort='float' data-sort-default='desc' class='header default-sort text-center'>% of Rangeland</th><th class='header default-sort text-center' data-sort='float' data-sort-default='desc'>% of County</th><th class='header default-sort text-center' data-sort='float' data-sort-default='desc'>Acreage (acres)</th></tr></thead>";
        var tbCoverHead = "<thead><tr><th class='header legend'></th><th class='header text-center'>Type of Land</th><th class='header default-sort text-center' data-sort='float' data-sort-default='desc'>% of County</th><th class='header default-sort text-center' data-sort='float' data-sort-default='desc'>Acreage (acres)</th></tr></thead>";

        var delaySort = function(){
          setTimeout(function () {
            var $table = $("table.sortable").stupidtable();
            var $th_to_sort = $table.find(".default-sort");
            $th_to_sort.stupidsort('desc');
          }, 1500);
        };

        /// TODO change the display of the results of ranches
        /// by county and put year at the top of table
        /// put headers at the top which will facilitate
        /// the export as csv
        var getCowResults = function (feature) {
          var results = "";
          var cowAttributes;
          var cowFields;
          var countyName = feature.attributes.NAME;
          printBtn.style.display = 'block';

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
              font: { // autocast as esri/symbols/Font
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
              results += '<h4 class="text-center result-title">' + countyName + '</h4><table class="table table-bordered table-condensed text-center table-responsive table-result" cellspacing="0">';
              results += '<thead>';
              results +=
                '<tr><th style="font-weight: normal;"  class="text-center">Ranches</th>' +
                '<th style="font-weight: normal;" class="text-center">Cattle Farms</th>' +
                '<th style="font-weight: normal;" class="text-center">Number of Cattle</th>' +
                '<th style="font-weight: normal;" class="text-center">Beef Farms</th>' +
                '<th style="font-weight: normal;" class="text-center">Number of Beef</th></tr>';
              results += '</thead><tbody>';
              results += '<tr><td>' + cowFields[0].attributes.Ranches_11 + '</td>';
              results += '<td>' + cowAttributes.cattle_far + '</td>';
              results += '<td>' + cowAttributes.cattle_num + '</td>';
              results += '<td>' + cowAttributes.beef_farms + '</td>';
              results += '<td>' + cowAttributes.beef_numb + '</td></tr>';
              results += '</tbody></table>';
              results += exportBtn;
              dom.byId("table-div").innerHTML = results;
            }).then(function(){

            });
          });

        };

        var getLandResults = function (feature, choice) {
          var results = "";
          var rasterAttributes;
          var fields;
          printBtn.style.display = 'block';

          // apply a colormap for land cover types
          var coverRF = new RasterFunction({
            functionName: "Land Cover Type",
            variableName: "Raster"
          });

          // apply a colormap for land cover types
          var managementRF = new RasterFunction({
            functionName: "Land Management Agency For Rangeland",
            variableName: "Raster"
          });

          var rf = (choice === "cover") ? coverRF : managementRF;

          // Clips the image to only the county geometry
          var clipRF = new RasterFunction({
            functionName: "Clip",
            functionArguments: {
              ClippingGeometry: feature.geometry, //a polygon or envelope
              ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
              raster: rf
            },
            outputPixelType: "U8",
            variableName: "Raster"
          });


          imgLayer.renderingRule = clipRF;
          // imgLayer.renderingRule = clipCRF;

          // imgLayer.pixelFilter = colorize;

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
          }).then(function () {
            var countyLandTypes = [];
            landTypes.forEach(function (landType) {
              // countyLandTypes[landType] = fields.filter(function(field){
              //   return field.attributes.nlcd_name === landType;
              // });
              countyLandTypes.push(fields.filter(function (field) {
                return field.attributes.nlcd_name === landType;
              }));
            });
            if (choice === "management") {
              fields.forEach(function (item, i) {
                var res = item.attributes;
                var sma = colorTypes[res.sma_name].type;
                var clrs = [res.red, res.green, res.blue];
                var clr = "rgb(" + clrs[0] + "," + clrs[1] + "," + clrs[2] + ")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'></td><td>" + sma + "</td><td>" + res.per_nlcd.toFixed(2) + "</td><td>" + res.per_cnty.toFixed(2) + "</td><td>" + res.area_ac.toFixed(2) + "</td></tr>";
              });
              dom.byId("table-div").innerHTML = "<h4 class='text-center result-title'>" + feature.attributes.NAME + "</h4><table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed sortable table-result' cellspacing='0'>" + tbManagementHead + "<tbody>" + results + "</tbody></table>" + exportBtn;
            } else if (choice === "cover") {
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
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'></td><td>" + nlcd_name.toString() + "</td><td>" + totalPer.toFixed(2) + "</td><td>" + totalAc.toFixed(2) + "</td></tr>";
              });
              dom.byId("table-div").innerHTML = "<h4 class='text-center result-title'>" + feature.attributes.NAME + "</h4><table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed sortable table-result' cellspacing='0'>" + tbCoverHead + "<tbody>" + results + "</tbody></table>" + exportBtn;
            }

          });
        };

        /// TODO use the total per_acr to calculate the %county
        var stateWideLandResults = function (choice) {
          var results = "";
          var rasterAttributes;
          var fields;
          printBtn.style.display = 'block';


          // apply a colormap for land cover types
          var coverRF = new RasterFunction({
            functionName: "Land Cover Type",
            variableName: "Raster"
          });

          // apply a colormap for land cover types
          var managementRF = new RasterFunction({
            functionName: "Land Management Agency For Rangeland",
            variableName: "Raster"
          });

          var rf = (choice === "cover") ? coverRF : managementRF;

          imgLayer.renderingRule = rf;

          myMap.map.add(imgLayer);

          imgLayer.then(function () {
            var totId = 0;
            rasterAttributes = imgLayer.rasterAttributeTable.features;
            for (var i = 0; i < rasterAttributes.length; i++) {
              totId += rasterAttributes[i].attributes.area_ac;
            }
            fields = (choice === "management") ? rasterAttributes.filter(function (item, i) {
              return (item.attributes.cnty_name && item.attributes.nlcd_name === "Rangeland");
            }) : rasterAttributes;
          }).then(function () {
            var totalStatePer = fields
              .reduce(function (prev, curr) {
                return prev + curr.attributes.per_cnty;
              }, 0);
            if (choice === "management") {
              var managementValue;
              var managements = [];
              for (var m = 0; m < agencyTypes.length; m++) {
                managementValue = fields.filter(function (item) {
                  return (item.attributes.sma_name === agencyTypes[m]);
                });
                managements.push(managementValue);
              }


              var totalStateRng = fields
                .reduce(function (prev, curr) {
                  return prev + curr.attributes.per_nlcd;
                }, 0);
              managements.forEach(function (item, i) {
                var res = item[0].attributes;
                var totalAc = item.reduce(function (prev, curr) {
                  return prev + curr.attributes.area_ac;
                }, 0);
                var totalPer = (item.reduce(function (prev, curr) {
                    return prev + curr.attributes.per_cnty;
                  }, 0) / totalStatePer) * 100.0;
                var totalRng = (item.reduce(function (prev, curr) {
                    return prev + curr.attributes.per_nlcd;
                  }, 0) / totalStateRng) * 100.0;
                var sma = colorTypes[res.sma_name].type;
                var clrs = [res.red, res.green, res.blue];
                var clr = "rgb(" + clrs[0] + "," + clrs[1] + "," + clrs[2] + ")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'></td><td>" + sma + "</td><td>" + totalRng.toFixed(2) + "</td><td>" + totalPer.toFixed(2) + "</td><td>" + totalAc.toFixed(2) + "</td></tr>";
              });
              dom.byId("table-statewide-div").innerHTML = "<h4 class='text-center result-title'> STATEWIDE LAND MANAGEMENT</h4><table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed sortable table-result' cellspacing='0'>" + tbManagementHead + "<tbody>" + results + "</tbody></table>" + exportBtn;

            } else if (choice === "cover") {

              var coverValue;
              var covers = [];
              for (var k = 0; k < landTypes.length; k++) {
                coverValue = fields.filter(function (item) {
                  return (item.attributes.nlcd_name === landTypes[k]);
                });
                covers.push(coverValue);
              }
              // console.log("fields: ", fields);
              covers.forEach(function (item, i) {
                var totalAc = item.reduce(function (prev, curr) {
                  return prev + curr.attributes.area_ac;
                }, 0);
                var totalPer = (item.reduce(function (prev, curr) {
                    return prev + curr.attributes.per_cnty;
                  }, 0) / totalStatePer) * 100.0;
                var nlcd_name = landTypes[i];
                var clrs = landTypeColors[nlcd_name].color;
                var clr = "rgb(" + clrs[0] + "," + clrs[1] + "," + clrs[2] + ")";
                results += "<tr><td class='dlegend' style='background-color:" + clr + ";'></td><td>" + nlcd_name.toString() + "</td><td>" + totalPer.toFixed(2) + "</td><td>" + totalAc.toFixed(2) + "</td></tr>";
              });
              dom.byId("table-statewide-div").innerHTML = "<h4 class='text-center result-title'>STATEWIDE LAND COVER</h4><table id='table' class='table table-bordered table-condensed text-center table-responsive table-fixed sortable table-result' cellspacing='0'>" + tbCoverHead + "<tbody>" + results + "</tbody></table>" + exportBtn;
            }

          }).then(delaySort());
        };

        var stateWideCowResults = function () {
          var results = "";
          var cowFields;
          printBtn.style.display = 'block';

          cowLyr.then(function () {
            cowLyr.queryFeatures().then(function (cowData) {
              cowFields = cowData.features;
              console.log("cowFields: ", cowFields);
              var totalRanges = cowFields.reduce(function (prev, curr) {
                return prev + curr.attributes.Ranches_11;
              }, 0);
              var totalCattleFar = cowFields.reduce(function (prev, curr) {
                return prev + curr.attributes.cattle_far;
              }, 0);

              var totalCattleNum = cowFields.reduce(function (prev, curr) {
                return prev + curr.attributes.cattle_num;
              }, 0);

              var totalBeefFar = cowFields.reduce(function (prev, curr) {
                return prev + curr.attributes.beef_farms;
              }, 0);

              var totalBeefNum = cowFields.reduce(function (prev, curr) {
                return prev + curr.attributes.beef_numbe;
              }, 0);
              results += '<div><h4 class="text-center result-title">STATEWIDE RANCHES DATA</h4>' +
                '<h5> USDA Census Year: ' + cowFields[0].attributes.census_yea + '</h5>' +
                '</div><table class="table table-bordered text-center table-responsive table-fixed table-result sortable" cellspacing="0">';

              results += '</thead>';
              results +=
                '<tr><th style="font-weight: normal;" class="header text-center">Ranches</th>' +
                '<th style="font-weight: normal;" class="header text-center">Cattle Farms</th>' +
                '<th style="font-weight: normal;" class="header text-center">Number of Cattle</th>' +
                '<th style="font-weight: normal;" class="header text-center">Beef Farms</th>' +
                '<th style="font-weight: normal;" class="header text-center">Number of Beef</th></tr>';
              results += '</thead><tbody>';
              results += '<tr><td>' + totalRanges + '</td>';
              results += '<td>' + totalCattleFar + '</td>';
              results += '<td>' + totalCattleNum + '</td>';
              results += '<td>' + totalBeefFar + '</td>';
              results += '<td>' + totalBeefNum + '</td></tr>';
              results += '</tbody></table>';
              results += exportBtn;


              // print a result table for counties
              var countyResults = "";
              countyResults += '<div><h4 class="text-center result-title">STATEWIDE RANCHES DATA FOR COUNTIES</h4>' +
                '<h5> USDA Census Year: ' + cowFields[0].attributes.census_yea + '</h5>' +
                '</div><table class="table table-bordered text-center table-responsive table-fixed table-result sortable" cellspacing="0">';
              countyResults += '<thead>';
              countyResults +=
                '<tr><th class="header default-sort text-center" data-sort="string" data-sort-default="desc">Counties</th>' +
                '<th style="font-weight: normal;" class="header default-sort text-center" data-sort="int" data-sort-default="desc">Ranches</th>' +
                '<th style="font-weight: normal;" class="header default-sort text-center" data-sort="int" data-sort-default="desc">Cattle Farms</th>' +
                '<th style="font-weight: normal;" class="header default-sort text-center" data-sort="int" data-sort-default="desc">Number of Cattle</th>' +
                '<th style="font-weight: normal;" class="header default-sort text-center" data-sort="int" data-sort-default="desc">Beef Farms</th>' +
                '<th style="font-weight: normal;" class="header default-sort text-center" data-sort="int" data-sort-default="desc">Number of Beef</th></tr>';
              countyResults += '</thead><tbody>';
              cowFields.forEach(function(field){
                countyResults += '<tr><td>' + field.attributes.NAME + '</td>';
                countyResults += '<td>' + field.attributes.Ranches_11 + '</td>';
                countyResults += '<td>' + field.attributes.cattle_far + '</td>';
                countyResults += '<td>' + field.attributes.cattle_num + '</td>';
                countyResults += '<td>' + field.attributes.beef_farms + '</td>';
                countyResults += '<td>' + field.attributes.beef_numbe + '</td></tr>';
              });
              countyResults += '</tbody></table>';
              countyResults += exportBtn;
              dom.byId("table-statewide-div").innerHTML = results.concat(countyResults);
            });
          }).then(delaySort());
        };

        var searchWidget = myWidgets.searchWidget({
          view: view
        });
        var selectWidget = domConstruct.toDom('<div id="select-county"><select class="select-counties" id="select"><option value=""></option></select></div>');

        var full = false;

        var landCover = dom.byId('land-cover');
        var landManagement = dom.byId('land-management');
        var cowManagement = dom.byId('cow-management');
        on(landCover, 'click', function () {
          resetZoom();
          choice = "cover";
          view.popup.visible = false;
          stateWideLandResults(choice);
          // view.popup.visible = !view.popup.visible;
        });
        on(landManagement, 'click', function () {
          resetZoom();
          choice = "management";
          view.popup.visible = false;
          stateWideLandResults(choice);
          // view.popup.visible = !view.popup.visible;
        });
        on(cowManagement, 'click', function () {
          resetZoom();
          choice = "cow";
          myMap.map.add(cowLyr);
          stateWideCowResults();
          view.ui.add(legend, "bottom-right");
          // view.popup.visible = !view.popup.visible;
          view.popup.visible = false;
        });

        var backBtn = dom.byId('back-button');
        on(backBtn, 'click', function () {
          printBtn.style.display = 'none';
          resetZoom();
          choice = "";
          map.remove(imgLayer);
          map.remove(cowLyr);
          map.remove(countyNameLayer);
          map.remove(countyMarkerLayer);
          dom.byId("table-div").innerHTML = "";
          dom.byId("table-statewide-div").innerHTML = "";
          view.ui.remove(legend);
          // view.popup.visible = !view.popup.visible;
          view.popup.visible = false;
        });

        view.then(function () {

          view.ui.add(basemapToggle, "top-right");

          view.on('click', function (event) {
            var params = new Query({
              returnGeometry: true,
              outFields: ["NAME"],
              geometry: event.mapPoint
            });
            // myMap.map.remove(imgLayer);
            countyLyr.queryFeatures(params).then(function (results) {
              var selectionOnMap = results.features[0];
              if (choice === "cow") {
                getCowResults(selectionOnMap);
                // setZoom(7, event.mapPoint);
              } else if (choice === "management") {
                getLandResults(selectionOnMap, "management");
                setZoom(9, event.mapPoint);
              } else if (choice === "cover") {
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

          view.ui.add(fullscreenBtn, {
            position: "top-right",
            index: 0
          });

          view.ui.add(printBtn, {
            position: "top-right",
            index: 1
          });
          printBtn.style.display = 'none';

          var mainDiv = dom.byId('main');
          var mapCanvas = dom.byId('mapCanvas');
          var table = dom.byId('table-div');
          var mapStyle = domStyle.getComputedStyle(mapCanvas);
          var mapDiv = dom.byId('map');
          var mapDivStyle = domStyle.getComputedStyle(mapDiv);
          on(fullscreenBtn, 'click', function () {
            if (full === true) {
              dom.byId('header').style.display = 'block';
              dom.byId('main-content').style.display = 'block';
              dom.byId('select-county-hint').style.display = 'block';
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
            } else {
              dom.byId('header').style.display = 'none';
              dom.byId('main-content').style.display = 'none';
              dom.byId('select-county-hint').style.display = 'none';
              domClass.add(mapCanvas, "fullscreen");
              domClass.remove(mainDiv, "container-fluid");
              domClass.remove(mainDiv, "margin-top-55");
              domClass.remove(mapDiv, "container-fluid");
              domClass.remove(mapDiv, "padding-top");
              view.ui.add(table, {
                position: "bottom-left",
                index: 0
              });
              domClass.add(table, "table-dark-bg");
              full = true;
            }
          });

          $('#select').on('select2:select', function (event) {
            var selectedText = event.target.selectedOptions["0"].text;
            searchWidget.search(selectedText).then(
              function (success) {
                myMap.map.remove(imgLayer);
                var feature = success[0].results[0].feature;
                if (choice === "cow") {
                  getCowResults(feature);
                } else if (choice === "management") {
                  getLandResults(feature, "management");
                } else if (choice === "cover") {
                  getLandResults(feature, "cover");
                }
              },
              function (error) {
                console.log(error);
              }
            );

          });

        });
      }
    })
  });

var choice = "";