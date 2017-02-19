/**
 * Created by kande on 1/19/2017.
 */
require([
  "dojo/domReady!"
], function () {

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
