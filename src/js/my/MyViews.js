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

        var popup = {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: true,
            breakpoint: true,
            position: "top-right"
          }
        };

        this.myView = new MapView({
          container: "mapCanvas",
          map: myMap.map,
          center: [-115, 45.6],
          zoom: 7
        });
        var view = this.myView;

        var myWigets = new MyWidgets(this.myView, popup);

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
          imgLayer.then(function () {
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
          });
          return results;
        };

        myMap.map.add(countyLyr);

        var searchWidget = myWigets.search();

        var data = [
          'ADA', 'ADAMS', 'BANNOCK', 'BEAR LAKE', 'BENEWAH', 'BINGHAM', 'BLAINE', 'BOISE', 'BONNER', 'BONNEVILLE', 'BOUNDARY', 'BUTTE', 'CAMAS', 'CANYON', 'CARIBOU', 'CASSIA', 'CLARK', 'CLEARWATER', 'CUSTER', 'ELMORE', 'FRANKLIN', 'FREMONT', 'GEM', 'GOODING', 'IDAHO', 'JEFFERSON', 'JEROME', 'KOOTENAI', 'LATAH', 'LEMHI', 'LEWIS', 'LINCOLN', 'MADISON', 'MINIDOKA', 'NEZ PERCE', 'ONEIDA', 'OWYHEE', 'PAYETTE', 'POWER', 'SHOSHONE', 'TETON', 'TWIN FALLS', 'VALLEY', 'WASHINGTON'
        ];

        var dropdownButton = function (data) {
          var i;
          var button = '<div id="search-dropdown"><button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            '<span class="glyphicon glyphicon-triangle-bottom"></span></button>' +
            '<ul class="dropdown-menu">';
          for (i = 0; i < data.length; i++) {
            button += '<li><a href="#"> ' + data[i] + '</a></li>';
          }
          button += '</ul></div>';
          return button;
        };

        var dropdown = domConstruct.toDom(dropdownButton(data));

        var full = false;


        view.then(function () {

          view.ui.add(searchWidget, {
            position: "top-right",
            index: 0
          });

          domConstruct.place(dropdown, dom.byId('esri_widgets_Search_0'), "first");

          domClass.add('esri_widgets_Search_0', "hidden");

          var fullscreenBtn = domConstruct.toDom('<button type="button" id="fullscreen-btn" class="btn btn-info"><span class="glyphicon glyphicon-fullscreen"></span></button>');

          view.ui.add(fullscreenBtn, {position: "top-left", index:0});

          var mapStyle = domStyle.getComputedStyle(mapCanvas);
          var mainDiv = dom.byId('main');
          var mainStyle = domStyle.getComputedStyle(mainDiv);
          on(fullscreenBtn, 'click', function (evt) {
            var map = dom.byId('map');
            var mapCanvas = dom.byId('mapCanvas');
            if(full === true){
              dom.byId('header').style.display = 'block';
              dom.byId('main-content').style.display = 'block';
              // domStyle.set(mapCanvas, {
              //   height: mapStyle.height,
              //   width: mapStyle.width,
              // });
              domStyle.set(mainDiv, {
                height: mainStyle.height,
                width: mainStyle.width,
              });
              domClass.remove(mapCanvas, "fullscreen");
              domClass.remove(map, "fullscreen");
              domClass.add(mainDiv, "container-fluid");
              domClass.add(mainDiv, "padding-top");
              full = false;
            }
            else {
              dom.byId('header').style.display = 'none';
              dom.byId('main-content').style.display = 'none';
              // domStyle.set(map, {
              //   height: "100%",
              //   width: '100%',
              //   marginTop: '0px',
              //   marginBottom: '0px'
              // });
              // domStyle.set(mapCanvas, {
              //   height: "100%",
              //   width: '100%',
              //   marginTop: '0px',
              //   marginBottom: '0px'
              // });
              domClass.add(mapCanvas, "fullscreen");
              domClass.add(map, "fullscreen");
              domClass.remove(mainDiv, "container-fluid");
              domClass.remove(mainDiv, "padding-top");
              full = true;
            }
          });



          searchWidget.on("search-complete", function (event) {
            if (event.numResults !== 0) {
              var name = event.results[0].results[0].name;
              view.popup.open({
                title: "<h3> " + name + " </h3><strong>Select a topic below</strong>",
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
                ],
                location: event.results[0].results[0].extent.center
              });
            }

            view.popup.on("trigger-action", function (event) {
              var feature = view.popup.features[0];
              // var feature = searchEvent.result.feature;
              if (event.action.id === "land-management") {
                myMap.map.basemap = "streets";
                var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";

                var managementResults = getLandResults(imgLyr, feature, "management");
                dom.byId("tableDiv").innerHTML = "<table id='table' class='table table-bordered text-center' cellspacing='0'>" + tbHead + "<tbody>" + managementResults + "</tbody></table>";
              }
              else if (event.action.id === "land-cover") {
                myMap.map.basemap = "streets";
                var coverResults = getLandResults(imgLyr, feature, "cover");

                dom.byId("tableDiv").innerHTML = "<br /><table id='table'  class='table table-bordered text-center' cellspacing='0'><tbody>" + coverResults + "</tbody></table>";
              }
            });
          });
        });
      },

      fixHeading: function (head, divID) {
        var h = head.toLowerCase();
        var hE = h.toTitleCase();
        $(divID).html("<h3>" + hE + "</h3>");
      }

    })
  });