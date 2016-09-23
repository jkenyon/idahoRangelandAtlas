/* For ESRI Javascript API 4.0
	
	Query and draw results based on data from ArcGIS Server, both on
	a map and in the various visualizations.
	
	Written by Bruce Godfrey and Jeremy Kenyon, Univ. of Idaho, 2016
	
	Cached SMA/NLCD Join Layer: https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_2011_tiled/MapServer
*/
	require([
		"esri/Map",
		"esri/config",
		"esri/views/MapView",
		"esri/layers/FeatureLayer",
		"esri/layers/GraphicsLayer",
		"esri/layers/TileLayer",
		"esri/tasks/QueryTask",
		"esri/tasks/support/Query",
		"esri/symbols/SimpleFillSymbol",
		"esri/renderers/SimpleRenderer",
		"esri/renderers/UniqueValueRenderer",
		"esri/Graphic",
		"dojo/_base/array",
		"dojo/dom",
		"dojo/on",
		"dojo/domReady!"
	], function (Map, esriConfig, MapView, FeatureLayer, GraphicsLayer, TileLayer, QueryTask, Query, SimpleFillSymbol, SimpleRenderer, UniqueValueRenderer, Graphic, arrayUtils, dom, on, ready) {
		
		// Fixes CORS problems
		esriConfig.request.corsDetection = false;
	
		var hid = new UniqueValueRenderer({
			field: "NAME",
			defaultSymbol: new SimpleFillSymbol({
				color: [255,255,255,0]
			})
		});
				
		//Creates county boundaries layer
		var countyLayer = new FeatureLayer({
			url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
			id: "counties",
			outFields: ['*'],
			opacity: 0.7,
			renderer: hid
		});
		
		//Sets up graphics layer to be drawn in response to queries
		var resultsLyr = new GraphicsLayer({
			opacity: 0.7
		});
		
		var cacheLyr = new TileLayer({
			url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_2011_tiled/MapServer",
			opacity: 0.7
		});
		
		// Basic map with above layers
		var map = new Map({
			basemap: "topo",
			layers: [countyLayer, resultsLyr]
		});
		
		// Basic view parameters for the map
		var view = new MapView({
			container: "mapCanvas",
			map: map,
			center: [-115, 45.6],
			zoom: 7
		});
		
		var blm = new SimpleFillSymbol({
			color: [232, 16, 20, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var priv = new SimpleFillSymbol({
			color: [250, 141, 52, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var usfs = new SimpleFillSymbol({
			color: [252, 164, 63, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var bia = new SimpleFillSymbol({
			color: [231, 237, 111, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var bor = new SimpleFillSymbol({
			color: [71, 155, 191, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var coe = new SimpleFillSymbol({
			color: [177, 204, 145, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var doe = new SimpleFillSymbol({
			color: [215, 227, 125, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var doi = new SimpleFillSymbol({
			color: [247, 122, 45, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var faa = new SimpleFillSymbol({
			color: [140, 184, 164, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var gsa = new SimpleFillSymbol({
			color: [120, 173, 173, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var hstrcwtr = new SimpleFillSymbol({
			color: [40, 146, 199, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var ir = new SimpleFillSymbol({
			color: [252, 207, 81, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var lu_doi = new SimpleFillSymbol({
			color: [252, 186, 71, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var lu_usda = new SimpleFillSymbol({
			color: [198, 217, 134, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var mil = new SimpleFillSymbol({
			color: [245, 99, 37, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var nps = new SimpleFillSymbol({
			color: [242, 77, 31, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var nwr = new SimpleFillSymbol({
			color: [160, 194, 155, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var state = new SimpleFillSymbol({
			color: [237, 54, 26, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});		
		
		var statefg = new SimpleFillSymbol({
			color: [250, 250, 100, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var stateoth = new SimpleFillSymbol({
			color: [96, 163, 181, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var statepr = new SimpleFillSymbol({
			color: [252, 231, 91, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		// Land Management Web Service (also Land Cover)
/*		var qTask = new QueryTask({
				url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_2011/MapServer/0"
			});*/
		
		// General parameters for any query
		var params = new Query({
			returnGeometry: true,
			outFields: ["*"]
		});
	
		// Performs a general query resolving county name and some data
		function doQuery(name, choice) {
			var callback = null;
			resultsLyr.removeAll();
			params.where = "CNTY_NAME = " + "'" + name +"'";
			if (choice === "Land Management") {
				var callback = getLMResults;

			} else if (choice === "Land Cover") {
				console.log("Yep.  Land Cover.");
			}
			//qTask.execute(params).then(callback).otherwise(promiseRejected);
/*			var boss = new UniqueValueRenderer({
				uniqueValueInfos: [{ 
					value: name,
					symbol: new SimpleFillSymbol ({ color: [255,255,255,1]})
				}]
			}); 
			map.add(cacheLyr); */
		}
		
		function getCounty(evt, selection) {
			var qCnty = new Query();
			qCnty.returnGeometry = false;
			qCnty.outFields = ["NAME"];
			qCnty.geometry = evt;
			
			countyLayer.queryFeatures(qCnty).then(function(results){
				fasterFunc("CNTY_NAME = '" + results.features[0].attributes.NAME + "'", map);
				//doQuery(results.features[0].attributes.NAME, selection);
				//$('#valSelect').val('Choose a County...');
				console.log(results);
			}).otherwise(promiseRejected);
		}
		
		// County Names are in Caps.  This converts them to Title Case for display.
		function fixHeading(head) {
			var h = head.toLowerCase();
			var hE = h.toTitleCase();
			$(".resultHead").html("<h3>"+ hE +"</h3>");
		}

		
		//This returns and renders Land Management Results
		function getLMResults(response) {
			
			var peakResults = arrayUtils.map(response.features, function(feature) {
				if (feature.attributes.AGNCY_NAME === "BLM") {
					feature.symbol = blm;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "PRIVATE") {
					feature.symbol = priv;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "USFS") {
					feature.symbol = usfs;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "BIA") {
					feature.symbol = bia;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "BOR") {
					feature.symbol = bor;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "COE") {
					feature.symbol = coe;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "DOE") {
					feature.symbol = doe;
					return feature;					
				} else if (feature.attributes.AGNCY_NAME === "DOI") {
					feature.symbol = doi;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "FAA") {
					feature.symbol = faa;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "HSTRCWTR") {
					feature.symbol = hstrcwtr;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "IR") {
					feature.symbol = ir;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "LU_DOI") {
					feature.symbol = lu_doi;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "LU_USDA") {
					feature.symbol = lu_usda;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "MIL") {
					feature.symbol = mil;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "NPS") {
					feature.symbol = nps;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "NWR") {
					feature.symbol = nwr;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "STATE") {
					feature.symbol = state;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "STATEFG") {
					feature.symbol = statefg;
					return feature;		
				} else if (feature.attributes.AGNCY_NAME === "STATEOTH") {
					feature.symbol = stateoth;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "STATEPR") {
					feature.symbol = statepr;
					return feature;					
				} else {
					feature.symbol = new SimpleFillSymbol({
						color: [232, 16, 20, .9],
						style: "solid",
						outline: { 
							color: "gray",
							width: .1
						}			
					});
					return feature
				}
			});
			resultsLyr.addMany(peakResults); 
			view.goTo(peakResults);
			
			// Data Table
			
			var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (in acres)</th></tr></thead>";
			var results = "";
			console.log(peakResults);
			
			
			for (i=0;i<peakResults.length;i++) {
				var g = peakResults[i].attributes;
				var perRng = g.PEROFRNG.toFixed(2);
				var perCty = g.PEROFCNTY.toFixed(2);
				if (perRng > 0) {
					var clr = '';
					if (g.AGNCY_NAME == 'BIA') {
						var clr = '#ed6f60';
					} else if (g.AGNCY_NAME == 'BLM') {
						var clr = '#e81014';
					} else if (g.AGNCY_NAME == 'BOR') {
						var clr = '#b59bbf';
					} else if (g.AGNCY_NAME == 'COE') {
						var clr = '#B1CC91';
					} else if (g.AGNCY_NAME == 'DOE') {
						var clr = '#7DD7E3';
					} else if (g.AGNCY_NAME == 'DOI') {
						var clr = '#f77a2d';
					} else if (g.AGNCY_NAME == 'FAA') {
						var clr = '#8ca4b8';
					} else if (g.AGNCY_NAME == 'GSA') {
						var clr = '#78adad';
					} else if (g.AGNCY_NAME == 'HSTRCWTR') {
						var clr = '#2892c7';
					} else if (g.AGNCY_NAME == 'IR') {
						var clr = '#fccf51';
					} else if (g.AGNCY_NAME == 'LU_DOI') {
						var clr = '#fcba47';
					} else if (g.AGNCY_NAME == 'LU_USDA') {
						var clr = '#c6d986';
					} else if (g.AGNCY_NAME == 'MIL') {
						var clr = '#f56325';
					} else if (g.AGNCY_NAME == 'NPS') {
						var clr = '#f24d1f';
					} else if (g.AGNCY_NAME == 'NWR') {
						var clr = '#a0c29b';
					} else if (g.AGNCY_NAME == 'PRIVATE') {
						var clr = '#fa8d34';
					} else if (g.AGNCY_NAME == 'STATE') {
						var clr = '#ed361a';
					} else if (g.AGNCY_NAME == 'STATEFG') {
						var clr = '#fafa64';
					} else if (g.AGNCY_NAME == 'STATEOTH') {
						var clr = '#60a3b5';
					} else if (g.AGNCY_NAME == 'STATEPR') {
						var clr = '#fce75b';
					} else if (g.AGNCY_NAME == 'USFS') {
						var clr = '#fca43f';
					} else {
						var clr = '#E81014';
					}
					results += "<tr><td class='dlegend' style='background-color:"+ clr +";'>&nbsp;</td><td>" + g.AGNCY_NAME + "</td><td>" + perRng + "</td><td>" + perCty + "</td><td>" + g.GIS_ACRES + "</td></tr>";
				} else {
					continue;
				}
			}
			var county = g.CNTY_NAME;
			fixHeading(county);
			$(".tableDiv").html("<table id='table' class='table' cellspacing='0'>" + tbHead + "<tbody>" + results + "</tbody></table>");
			
			$(function(){
				$('#table').tablesorter({
					sortList: [[2,1]]
				}); 
			});
			
		} //close getLMResults
		
		// General response to query failures
		function promiseRejected(err) {
			console.error("Promise rejected: ", err.message);
		}
		
		// Turns on querying by drop-down and by map click
		function activateOptions(choice) {
				$('#valSelect').change(function() {
					doQuery(this.value, choice);
				});
				view.on("click", function(evt){getCounty(evt.mapPoint, choice)});
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
			resultsLyr.removeAll();
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
		
		// Reset the results page and map and return to the menu page
		$(".back-btn").click(reset);
		
		// Create the dropdown menu for the map		
		var cts = ['ADA', 'ADAMS', 'BANNOCK', 'BEAR LAKE', 'BENEWAH', 'BINGHAM', 'BLAINE', 'BONNER', 'BONNEVILLE', 'BOUNDARY', 'BUTTE', 'CAMAS', 'CANYON', 'CARIBOU', 'CASSIA', 'CLARK', 'CLEARWATER', 'CUSTER', 'ELMORE', 'FRANKLIN', 'FREMONT', 'GEM', 'GOODING', 'IDAHO', 'JEFFERSON', 'JEROME', 'KOOTENAI', 'LATAH', 'LEMHI', 'LEWIS', 'LINCOLN', 'MADISON', 'MINIDOKA', 'NEZ PERCE', 'ONEIDA', 'OWYHEE', 'PAYETTE', 'POWER', 'SHOSHONE', 'TETON', 'TWIN FALLS', 'VALLEY', 'WASHINGTON'];

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