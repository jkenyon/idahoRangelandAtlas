/**
 * Created by kande on 11/14/2016.
 */
define([
    "dojo/_base/declare",
    "my/MyLayers",
    "dojo/domReady!"
  ],
  function (declare, MyLayers, Map) {
    return declare(null, {
      constructor: function () {
        var qTask = new QueryTask({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
        });

        // General parameters for the query
        var params = new Query({
          returnGeometry: true,
          outFields: ["*"]
        });
      },

      activateOtptions: function (choice) {
        $('#valSelect').change(function () {
          doQuery(this.value, choice);
        });
        var mapClick = view.on("click", function (evt) {
          getCounty(evt.mapPoint, choice)
        });
      },

      getCounty: function (evt, selection) {
        var qCnty = new Query();
        qCnty.returnGeometry = true;
        qCnty.outFields = ["NAME"];
        qCnty.geometry = evt;
        countyLyr.queryFeatures(qCnty).then(function (results) {
          doQuery(results.features[0].attributes.NAME, selection);
          $('#valSelect').val('Choose a County...');
        }).otherwise(promiseRejected);
      },

      // Performs a general query resolving county name and some data
      doQuery: function (name, choice) {
        var clbk = null;
        map.removeAll();
        map.add(countyLyr); //need to keep the county layer available
        params.where = "NAME=" + "'" + name + "'";

        //Enables same query, different topics
        if (choice === "Land Management") {
          var clbk = getLMResults;
        } else if (choice === "Land Cover") {
          var clbk = getLCResults;
        }
        qTask.execute(params).then(clbk).otherwise(promiseRejected);
      }


    });
  });