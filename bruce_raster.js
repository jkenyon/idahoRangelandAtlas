function fasterFunc(tmp){ 
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/GraphicsLayer",
      "esri/symbols/SimpleFillSymbol",
      "esri/tasks/QueryTask",
      "esri/tasks/support/Query",
      "dojo/_base/array",
      "dojo/dom",
      "dojo/on",
      "esri/Graphic",
      "esri/layers/ImageryLayer",
      "esri/layers/support/RasterFunction",
      "dojo/_base/array",
      "dojo/_base/html",
      "dojo/_base/lang",
      "dojo/domReady!"
    ], function(
      Map, MapView, GraphicsLayer, SimpleFillSymbol,
      QueryTask, Query, arrayUtils, dom, on, Graphic, ImageryLayer, RasterFunction, arrayUtil, html, lang
    ) {

      // URL to counties 
      var countiesUrl =
    "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0";

      // Define the popup content for each result    
      var popupTemplate = { // autocasts as new PopupTemplate()
        title: "{NAME}",
        fieldInfos: [{
          fieldName: "NAME",
          label: "County Name",
          format: {
            places: 0,
            digitSeperator: true
          }
        }],
      };

      // Create graphics layer and symbol to use for displaying the results of query  
      var resultsLyr = new GraphicsLayer();
      var foo = new Graphic(); // Foo?

      
      /*****************************************************************
       *  Point QueryTask to URL of feature service  
       *****************************************************************/
      var qTask = new QueryTask({
        url: countiesUrl
      });

      /******************************************************************    
       * Set the query parameters to always return geometry and all fields.
       * Returning geometry allows us to display results on the map/view
       ******************************************************************/
      var params = new Query({
        returnGeometry: true,
        outFields: ["*"]
      });
    
      var attributeName = dom.byId("attSelect");
      var expressionSign = dom.byId("signSelect");
      var value = dom.byId("valSelect");

      // Executes each time the button is clicked    
      function doQuery() {
        /*********************************************
         *
         * Set the where clause for the query. If "Name", "is", and "LATAH COUNTY" 
         * are selected, then the following SQL where clause is built here:
         * 
         * params.where = "CNTY_NAME = 'LATAH COUNTY";  
         *
         **********************************************/
        //params.where = attributeName.value + expressionSign.value + "'" + value.value + "'";
        params.where = tmp;
        console.log(params);

        // executes the query and calls getResults() once the promise is resolved
        // promiseRejected() is called if the promise is rejected
        qTask.execute(params)
          .then(getResults)
          .otherwise(promiseRejected);

        }  //End do query
        doQuery();
      // Called each time the promise is resolved    
      function getResults(response) {

        // Loop through each of the results and assign a symbol and PopupTemplate
        // to each so they may be visualized on the map
        var featureResults = arrayUtils.map(response.features, function(
          feature) {
          foo = feature;
          return feature;
        });
        
         // animate to the results after they are added to the map  
        view.goTo(featureResults);
          
        var clipRF = new RasterFunction({
          functionName: "Clip",
          functionArguments: {
            ClippingGeometry : foo.geometry,    //a polygon or envelope
            ClippingType : 1,                           //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
            raster: "$$"
          }
        });
  
        var layer = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test6/ImageServer",
          renderingRule: clipRF,
        });
      
        map.layers.add(layer);
      
        var rasterAttributes;
        layer.then(function() {
          rasterAttributes = layer.rasterAttributeTable.features;
          
          var tbl = html.byId("raTable");
          arrayUtil.map(rasterAttributes, lang.hitch(this, function(item, i){
              
            
            //var countyName = item.attributes.cnty_name;
            //if (countyName === "LATAH COUNTY") {
            if (item.attributes.cnty_name === value.value) {
            
              var row = tbl.insertRow(tbl.rows.length);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
              cell1.innerHTML = item.attributes.sma_name;
              cell2.innerHTML = item.attributes.per_rng.toFixed(2);
              cell3.innerHTML = item.attributes.per_cnty.toFixed(2);
              cell4.innerHTML = item.attributes.area_ac.toFixed(2);
          
            }
          }));  
        });
      }   //End getResults

      // Called each time the promise is rejected    
      function promiseRejected(err) {
        console.error("Promise rejected: ", err.message);
      }

      // Call doQuery() each time the button is clicked    
      //on(dom.byId("doBtn"), "click", doQuery);
    
      var map = new Map({
        basemap: "topo",
        layers: [resultsLyr] // add graphics layer to the map
      });

      var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-114, 45],
        zoom: 6
      });
    
    });
}