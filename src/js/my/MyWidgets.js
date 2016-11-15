/**
 * Created by kande on 11/8/2016.
 */
define([
    "dojo/_base/declare",
    "esri/widgets/Search",
    "dojo/domReady!"
  ],
  function (declare, Search) {
    return declare(null, {
      searchWidget: null,
      constructor: function (view) {
        this.searchWidget = new Search({
          view: view,
          allPlaceholder: "Land Management or cover"
        });
        this.searchWidget.startup();
      },
      search: function() { return this.searchWidget; }
    });
  });