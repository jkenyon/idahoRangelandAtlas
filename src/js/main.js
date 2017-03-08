/**
 * Created by kande on 2/23/2017.
 */

$(document)
  .ready(function () {
    $('.back-btn')
      .on('click', function () {
        $('#topics').removeClass('hidden');
        $('#cover-info, #management-info, #cow-info, #back-button, #select-county, #table-d' +
          'iv').addClass('hidden');
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

function exportPDF() {
  var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var filename = countyName.toLowerCase() + " result.pdf";
  var doc = new jsPDF('p', 'mm');
  var elem = document.getElementsByClassName('table-result')[0];
  var res = doc.autoTableHtmlToJson(elem);
  // hide map widgets
  // $('.esri-ui-inner-container, .esri-ui-corner-container').hide();
  $('.esri-ui-top-right, .esri-ui-top-left, .esri-ui-bottom-left').hide();
  html2canvas($("#mapCanvas"), {
    useCORS: true
  })
    .then(function (canvas) {
      var imgData = new Image();
      imgData.crossOrigin = "Anonymous";
      canvas.crossOrigin = 'Anonymous';
      canvas.allowTaint = true;
      imgData = canvas.toDataURL('image/jpeg');
      doc.text(countyName + "'S MAP", 20, 20);
      doc.addImage(imgData, 'JPEG', 15, 40, 180, 150);
      doc.addPage();

    }).then(function () {
    doc.autoTable(res.columns, res.data, {
      margin: {top: 40},
      addPageContent: function(data){
        doc.text(countyName.toUpperCase(), 20, 20);
      }
    });
    doc.save(filename);
    $('.esri-ui-top-right, .esri-ui-top-left, .esri-ui-bottom-left').show();
  });

}