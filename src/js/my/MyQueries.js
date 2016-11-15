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
      },
      activateOtptions: function (choice) {
        $('#valSelect').change(function () {
          doQuery(this.value, choice);
        });
        var mapClick = view.on("click", function (evt) {
          getCounty(evt.mapPoint, choice)
        });
      },
      getCounty: function(evt, selection){
        var qCnty = new Query();
        qCnty.returnGeometry = true;
        qCnty.outFields = ["NAME"];
        qCnty.geometry = evt;
        countyLyr.queryFeatures(qCnty).then(function (results) {
          doQuery(results.features[0].attributes.NAME, selection);
          $('#valSelect').val('Choose a County...');
        }).otherwise(promiseRejected);
      }
    });
  });