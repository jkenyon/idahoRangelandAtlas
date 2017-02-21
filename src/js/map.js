/**
 * Created by kande on 1/19/2017.
 */
require([
  "my/MyViews",
  "esri/config",
  "dojo/domReady!"
], function (MyViews, esriConfig) {
  // Fixes CORS problems.
  esriConfig.request.corsDetection = false;
  esriConfig.request.corsEnabledServers.push("gis-sandbox.northwestknowledge.net");
  var view = new MyViews();


  $('.back-btn').on('click', function () {
    $('#topics').removeClass('hidden');
    $('#cover-info, #management-info, #cow-info, #back-button, #select-county, #table-div').addClass('hidden');
    $('#table').replaceWith("");
  });

  $('#land-cover').on('click', function () {
    $('#topics').addClass('hidden');
    $('#table-div, #cover-info, #back-button, #select-county').removeClass('hidden');
  });

  $('#land-management').on('click', function () {
    $('#topics').addClass('hidden');
    $('#table-div, #management-info, #back-button, #select-county').removeClass('hidden');
  });

  $('#cow-management').on('click', function () {
    console.log("clicked");
    $('#topics').addClass('hidden');
    $('#table-div, #cow-info, #back-button, #select-county').removeClass('hidden');
  });



});
