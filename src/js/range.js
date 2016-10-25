/* For ESRI Javascript API 4.0

Query and draw results based on data from ArcGIS Server, both on
a map and in the various visualizations.

Written by Bruce Godfrey and Jeremy Kenyon, Univ. of Idaho, 2016
	
*/
  require([
    "esri/Map",
    "esri/config",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/layers/ImageryLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/symbols/SimpleFillSymbol",
    "esri/renderers/UniqueValueRenderer",
    "esri/layers/support/RasterFunction",
    "esri/Graphic",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/on",
    "dojo/_base/html",
    "dojo/_base/lang",
    "dojo/domReady!"
  ], function (Map, esriConfig, MapView, FeatureLayer, GraphicsLayer, ImageryLayer, QueryTask, Query, SimpleFillSymbol, UniqueValueRenderer, RasterFunction, Graphic, arrayUtils, dom, on, html, lang) {
    // Fixes CORS problems.
    esriConfig.request.corsDetection = false;
    esriConfig.request.corsEnabledServers.push("gis-sandbox.northwestknowledge.net");
	  
    // Creates the style for the county boundary layer
    var hid = new UniqueValueRenderer({
      field: "NAME",
      defaultSymbol: new SimpleFillSymbol({
        color: [255,255,255,0]
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

    //Sets up graphics layer to be drawn in response to queries
    var foo = new Graphic;

    // Establish query based on county geometry
    var qTask = new QueryTask({
      url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
    });

    // General parameters for the query
    var params = new Query({
      returnGeometry: true,
      outFields: ["*"]
    });

    // Performs a general query resolving county name and some data
    function doQuery(name, choice) {
      var clbk = null;
      map.removeAll();
      map.add(countyLyr); //need to keep the county layer available
      params.where = "NAME=" + "'" + name +"'";
      
      //Enables same query, different topics
      if (choice === "Land Management") {
        var clbk = getLMResults; 
      } else if (choice === "Land Cover") {
        var clbk = getLCResults;
      }
      qTask.execute(params).then(clbk).otherwise(promiseRejected);
    }

    // Enables querying a county/data by map click
    function getCounty(evt, selection) {
      var qCnty = new Query();
      qCnty.returnGeometry = true;
      qCnty.outFields = ["NAME"];
      qCnty.geometry = evt;
      countyLyr.queryFeatures(qCnty).then(function(results){
        doQuery(results.features[0].attributes.NAME, selection);
	$('#valSelect').val('Choose a County...');
      }).otherwise(promiseRejected);
    }

    // County Names are in caps.  Converts them to Title Case for display.
    function fixHeading(head) {
      var h = head.toLowerCase();
      var hE = h.toTitleCase();
      $(".resultHead").html("<h3>"+ hE +"</h3>");
    }

    //This returns and renders Land management data
    function getLMResults(response) {
      var featureResults = arrayUtils.map(response.features, function(feature) {
        foo = feature;
        return feature;
      });
     
      view.goTo(featureResults);

      // Clips the image to only the county geometry
      var clipRF = new RasterFunction({
        functionName: "Clip",
        functionArguments: {
          ClippingGeometry : foo.geometry,  //a polygon or envelope
	  ClippingType : 1,  //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
          raster: "$$"
        }
      });

     // Creates image layer with the clip
     var imgMLyr = new ImageryLayer({
       url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
       opacity: 0.8,
       renderingRule: clipRF,
       pixelFilter: null
     });
	    
     map.add(imgMLyr);
	    
     var rasterAttributes = null;
     imgMLyr.then(function() {
       rasterAttributes = imgMLyr.rasterAttributeTable.features;
       fields = rasterAttributes.filter(function(item, i){
         var className = item.attributes.cnty_name;
	 return className === foo.attributes.NAME;
       });
				
      var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (acres)</th></tr></thead>";
      var results = "";
				
      var county = foo.attributes.NAME;
      fixHeading(county);
      for (i=0;i<fields.length;i++) {
        var g = fields[i].attributes;
	var perRng = g.per_rng.toFixed(2);
	var perCty = g.per_cnty.toFixed(2);
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
						results += "<tr><td class='dlegend' style='background-color:"+ clr +";'>&nbsp;</td><td>" + sma + "</td><td>" + perRng + "</td><td>" + perCty + "</td><td>" + g.area_ac.toFixed(2) + "</td></tr>";
				    } else {
						continue;
				    }
				}

				$(".tableDiv").html("<table id='table' class='table' cellspacing='0'>" + tbHead + "<tbody>" + results + "</tbody></table>");
				
				$(function(){
					$('#table').tablesorter({
						sortList: [[2,1]]
					}); 
				});	
			});
		} //close getLMResults

		function getLCResults(response){
			var featureLCResults = arrayUtils.map(response.features, function(feature) {
				foo = feature;
				return feature;
			});
				
			view.goTo(featureLCResults);
			
			function colorize(pixelData) {
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
			} // end colorize
			
			
			var clipCRF = new RasterFunction({
				functionName: "Clip",
				functionArguments: {
					ClippingGeometry : foo.geometry,		//a polygon or envelope
					ClippingType : 1,								//int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
					raster: "$$"
				}
			});
			
			var imgLyr = new ImageryLayer({
			    url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test8/ImageServer",
				opacity: 0.7,
                renderingRule: clipCRF,
				pixelFilter: colorize
			});
			map.add(imgLyr);

			var rasterAttributes = null;
			imgLyr.then(function() {
				rasterAttributes = imgLyr.rasterAttributeTable.features;
				
				fields = rasterAttributes.filter(function(item, i){
					var className = item.attributes.cnty_name;
					return className === foo.attributes.NAME;
				});
				
				console.log(rasterAttributes);
				var totId = 0;
				for (i=0;i<rasterAttributes.length;i++) {
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
				for (i=0;i<fields.length;i++) {
					var g = fields[i].attributes;
					totA += g.area_ac;
					totPC += g.per_cnty
				}
				var perCty = totPC.toFixed(2);
				var total = totA.toFixed(2);
				results += "<tr><td>Total County Rangeland (acres)</td><td>" + total + "</td></tr><tr><td>Percent of County Acreage</td><td>" + perCty + "</td></tr>";
				$(".tableDiv").html("<br /><table id='table' class='table' cellspacing='0'><tbody>" + results + "</tbody></table>");
				
				$(function(){
					$('#table').tablesorter({
						sortList: [[2,1]]
					}); 
				});	
			});
		} //close getLCResults
		
		
		// Basic map with above layers
		var map = new Map({
			basemap: "streets",
			layers: [countyLyr]
		});
				
		// Basic view parameters for the map
		var view = new MapView({
			container: "mapCanvas",
			map: map,
			center: [-115, 45.6],
			zoom: 7
		});
		
		// General response to query failures
		function promiseRejected(err) {
			console.error("Promise rejected: ", err.message);
		}
				
		// Turns on querying by drop-down and by map click
		function activateOptions(choice) {
			$('#valSelect').change(function() {
				doQuery(this.value, choice);
			});
			var mapClick = view.on("click", function(evt){getCounty(evt.mapPoint, choice)});
		}
		
		// Based on nav menu, load a corresponding results page
		function loadResultsPage(selection) {	
			fetch('./resultsPages.json').then(function(response) {
				return response.json();
			}).then(function(sheep) {
				for (var i = 0; i < sheep.pages.length; i++) {
					if (selection == sheep.pages[i].heading){
						$('.left-region').children('.heading').text(sheep.pages[i].heading);
						$('.left-region').children('.description').text(sheep.pages[i].intro);
						$('.left-region').children('#descMore').text(sheep.pages[i].appendix).addClass('collapse');
					} else {
						continue;
					}
				}
			}).catch(function(error) {
				console.log(error.message);
			});
			activateOptions(selection);
		}
		
		// Selects a menu option and loads results pages
		$('.butn').click(function() {
			var choice = $(this).children('span').text();
			loadResultsPage(choice);
		});
		
		function reset() {
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
		}
		
		function reload() {
			location.reload();
		}
		
		// Reset the results page and map and return to the menu page
		$(".back-btn").click(reload);
		
		// Create the dropdown menu for the map		
		var cts = ['ADA', 'ADAMS', 'BANNOCK', 'BEAR LAKE', 'BENEWAH', 'BINGHAM', 'BLAINE', 'BOISE', 'BONNER', 'BONNEVILLE', 'BOUNDARY', 'BUTTE', 'CAMAS', 'CANYON', 'CARIBOU', 'CASSIA', 'CLARK', 'CLEARWATER', 'CUSTER', 'ELMORE', 'FRANKLIN', 'FREMONT', 'GEM', 'GOODING', 'IDAHO', 'JEFFERSON', 'JEROME', 'KOOTENAI', 'LATAH', 'LEMHI', 'LEWIS', 'LINCOLN', 'MADISON', 'MINIDOKA', 'NEZ PERCE', 'ONEIDA', 'OWYHEE', 'PAYETTE', 'POWER', 'SHOSHONE', 'TETON', 'TWIN FALLS', 'VALLEY', 'WASHINGTON'];

		var sct = "<option>Choose a County...</option>";
		for (i=0;i<cts.length;i++) {
			sct += "<option value='" + cts[i] + " COUNTY'>" + cts[i] + "</option>";
		}
		$('#valSelect').html(sct);

		function init() {
			var loading = dom.byId("loadingImg");
			if (view.ready == false){
				on(view, "update-start", showLoading);
			} else {
				on(view, "update-end", hideLoading);
			}
		}
		
		function showLoading() {
			esri.show(loading);
			map.disableMapNavigation();
			map.hideZoomSlider();
		}

		function hideLoading(error) {
			esri.hide(loading);
			map.enableMapNavigation();
			map.showZoomSlider();
		}

		$().ready(init);
		
	}); //all map function in ESRI require
