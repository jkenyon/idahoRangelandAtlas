/**
 * Created by kande on 2/23/2017.
 */

$(document).ready(function(){
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
    $('#topics').addClass('hidden');
    $('#table-div, #cow-info, #back-button, #select-county').removeClass('hidden');
  });

});

function exportPDF(){
  var filename = document.getElementsByClassName('county-title')[0].textContent.toLowerCase() + " result.pdf";
  var map = document.getElementById("mapCanvas");
  console.log("map: ", map);
  var doc = new jsPDF('p', 'pt');
  var elem = document.getElementsByClassName('table-result')[0];
  var res = doc.autoTableHtmlToJson(elem);
  doc.autoTable(res.columns, res.data);
  doc.save(filename);
}