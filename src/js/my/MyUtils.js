/**
 * Created by kande on 11/14/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyLayers",
    "my/MyMap",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "dojo/domReady!"
  ],
  function (declare, QueryTask, Query) {
    return declare(null, {
      constructor: function () {
      },

      // Enables querying a county/data by map click
      getCounty: function (evt, selection) {
        var qCnty = new Query();
        qCnty.returnGeometry = true;
        qCnty.outFields = ["NAME"];
        qCnty.geometry = evt;
        countyLyr.queryFeatures(qCnty).then(function (results) {
          doQuery(results.features[0].attributes.NAME, selection);
          $('#valSelect').val('Choose a County...');
        }).otherwise(this.promiseRejected);
      },

      fixHeading: function (head) {
        var h = head.toLowerCase();
        var hE = h.toTitleCase();
        $(".resultHead").html("<h3>" + hE + "</h3>");
      },

      colorize: function (pixelData) {
        pixelBlock = pixelData.pixelBlock;
        var numPixels = pixelBlock.width * pixelBlock.height;
        var rBand = [];
        var gBand = [];
        var bBand = [];
        for (i = 0; i < numPixels; i++) {
          // Sets a color between blue (coldest) and red (warmest) in each band
          rBand[i] = 0;
          gBand[i] = 0;
          bBand[i] = 0;
        }
        pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
      },

      // This returns and renders Land management data
      getLMResults: function (response) {
        var map = MyMap.myMap();
        var featureResults = arrayUtils.map(response.features, function (feature) {
          foo = feature;
          return feature;
        });

        view.goTo(featureResults);

        // Clips the image to only the county geometry
        var clipRF = new RasterFunction({
          functionName: "Clip",
          functionArguments: {
            ClippingGeometry: foo.geometry, //a polygon or envelope
            ClippingType: 1, //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
            raster: "$$"
          }
        });

        // Creates image layer with the clip
        var imgMLyr = MyLayers.imageLayer();

        map.add(imgMLyr);

        var rasterAttributes = null;
        imgMLyr.then(function () {
          rasterAttributes = imgMLyr.rasterAttributeTable.features;
          fields = rasterAttributes.filter(function (item, i) {
            var className = item.attributes.cnty_name;
            return className === foo.attributes.NAME;
          });

          var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";
          var results = "";

          var county = foo.attributes.NAME;
          fixHeading(county);
          for (i = 0; i < fields.length; i++) {
            var g = fields[i].attributes;
            var perRng = g.per_rng.toFixed(2);
            var perCty = g.per_cnty.toFixed(2);

            // TODO remove repeating variable declaration and change if statements to switch statement.
            if (perRng > 0) {
              if (g.sma_name == "PRIVATE") {
                var clr = "#ffffff";
                var sma = "Private";
              } else if (g.sma_name == "USFS") {
                var clr = "#DDF8DE";
                var sma = "US Forest Service";
              } else if (g.sma_name == "BLM") {
                var clr = "#ffe49c";
                var sma = "Bureau of Land Management";
              } else if (g.sma_name == "STATEPR") {
                var clr = "#c4e5f5";
                var sma = "State Parks & Rec";
              } else if (g.sma_name == "STATE") {
                var clr = "#A4C2D2";
                var sma = "State Dept. of Lands";
              } else if (g.sma_name == "STATEOTH") {
                var clr = "#c4e5f5";
                var sma = "State, Other";
              } else if (g.sma_name == "STATEFG") {
                var clr = "#A4C2D2";
                var sma = "State Fish & Game";
              } else if (g.sma_name == "HSTRCWTR") {
                var clr = "#006CB2";
                var sma = "Unsurveyed Water";
              } else if (g.sma_name == "BIA") {
                var clr = "#E9D0B7";
                var sma = "Bureau of Indian Affairs";
              } else if (g.sma_name == "IR") {
                var clr = "#ffc68e";
                var sma = "American Indian Reservation";
              } else if (g.sma_name == "NPS") {
                var clr = "#d9d3f4";
                var sma = "National Park Service";
              } else if (g.sma_name == "DOE") {
                var clr = "#E9D0B7";
                var sma = "Dept. of Energy";
              } else if (g.sma_name == "MIL") {
                var clr = "#FBCCFE";
                var sma = "US Military";
              } else if (g.sma_name == "BOR") {
                var clr = "#FFF7C9";
                var sma = "Bureau of Reclamation";
              } else {
                var clr = "#000000";
                var sma = g.sma_name;
              }
              results += "<tr><td class='dlegend' style='background-color:" + clr + ";'>&nbsp;</td><td>" + sma + "</td><td>" + perRng + "</td><td>" + perCty + "</td><td>" + g.area_ac.toFixed(2) + "</td></tr>";
            } else {
              continue;
            }
          }

          $(".tableDiv").html("<table id='table' class='table' cellspacing='0'>" + tbHead + "<tbody>" + results + "</tbody></table>");

          $(function () {
            $('#table').tablesorter({
              sortList: [
                [2, 1]
              ]
            });
          });
        });
      }, //close getLMResults

      getLCResults: function (response) {
        var featureLCResults = arrayUtils.map(response.features, function (feature) {
          foo = feature;
          return feature;
        });

        view.goTo(featureLCResults);

        var rasterAttributes = null;
        imgLyr.then(function () {
          rasterAttributes = imgLyr.rasterAttributeTable.features;

          fields = rasterAttributes.filter(function (item, i) {
            var className = item.attributes.cnty_name;
            return className === foo.attributes.NAME;
          });

          console.log(rasterAttributes);
          var totId = 0;
          for (i = 0; i < rasterAttributes.length; i++) {
            totId += rasterAttributes[i].attributes.area_ac;
          }
          console.log(rasterAttributes.length);
          console.log(totId);
          console.log(totId / 44);

          var tbHead = "<thead><tr><th class='header'>Total Rangeland (acres)</th><th class='header' >% of County</th><th class='header' ></th></tr></thead>";
          var results = "";

          var county = foo.attributes.NAME;
          fixHeading(county);
          console.log(fields);
          var totA = 0;
          var totPC = 0;
          for (i = 0; i < fields.length; i++) {
            var g = fields[i].attributes;
            totA += g.area_ac;
            totPC += g.per_cnty
          }
          var perCty = totPC.toFixed(2);
          var total = totA.toFixed(2);
          results += "<tr><td>Total County Rangeland (acres)</td><td>" + total + "</td></tr><tr><td>Percent of County Acreage</td><td>" + perCty + "</td></tr>";
          $(".tableDiv").html("<br /><table id='table' class='table' cellspacing='0'><tbody>" + results + "</tbody></table>");

          $(function () {
            $('#table').tablesorter({
              sortList: [
                [2, 1]
              ]
            });
          });
        });
      }, //close getLCResults

      // General response to query failures
      promiseRejected: function (err) {
        console.error("Promise rejected: ", err.message);
      },

      // Turns on querying by drop-down and by map click
      activateOptions: function (choice) {
        $('#valSelect').change(function () {
          doQuery(this.value, choice);
        });
        var mapClick = view.on("click", function (evt) {
          getCounty(evt.mapPoint, choice)
        });
      },

      // Based on nav menu, load a corresponding results page
      loadResultsPage: function (selection) {
        request.get('resultsPages.json')
          .then(function (response) {
            return response.json();
          }).then(function (sheep) {
          for (var i = 0; i < sheep.pages.length; i++) {
            if (selection == sheep.pages[i].heading) {
              $('.left-region').children('.heading').text(sheep.pages[i].heading);
              $('.left-region').children('.description').text(sheep.pages[i].intro);
              $('.left-region').children('#descMore').text(sheep.pages[i].appendix).addClass('collapse');
            } else {
              continue;
            }
          }
        }).catch(function (error) {
          console.log(error.message);
        });
        activateOptions(selection);
      },

      reset: function () {
        $('.left-region').children('#descMore').addClass('collapse');
        map.removeAll();
        map.add(countyLyr);
        view.goTo({
          center: [-115, 45.6],
          zoom: 7
        });
        $('#valSelect').val('Choose a County...');
        $('.resultHead').text("");
        $(".tableDiv").html('<div class="instruct"><p>Select a county on the right</p></div>');
        if ($('.left-region').hasClass('show')) {
          $('.nav-main').removeClass('hide').addClass('show');
          $('.left-region').removeClass('show').addClass('hide');
        }
      },

      reload: function () {
        location.reload();
      },

      init: function () {
        var loading = dom.byId("loadingImg");
        if (view.ready == false) {
          on(view, "update-start", showLoading);
        } else {
          on(view, "update-end", hideLoading);
        }
      },

      showLoading: function () {
        esri.show(loading);
        map.disableMapNavigation();
        map.hideZoomSlider();
      },

      hideLoading: function (error) {
        esri.hide(loading);
        map.enableMapNavigation();
        map.showZoomSlider();
      },

      // Selects a menu option and loads results pages
      selectMenuOption: function () {
        $('.butn').click(function () {
          console.log('button clicked');
          var choice = $(this).children('span').text();
          this.loadResultsPage(choice);
        });
      },

      // Reset the results page and map and return to the menu page
      resetResultPage: function () {
        $(".back-btn").click(this.reload);
      },


    });
  });