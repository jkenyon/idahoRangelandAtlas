/**
 * Created by kande on 2/23/2017.
 */

$(document)
  .ready(function () {
    $('#select-county-hint').hide();
    $('.back-btn')
      .on('click', function () {
        $('#topics').removeClass('hidden');
        $('#cover-info, #management-info, #cow-info, #back-button, #select-county, #table-div').addClass('hidden');
        $('#table').replaceWith("");
        $('#select-county-hint').hide();
      });

    $('#land-cover').on('click', function () {
      $('#topics').addClass('hidden');
      $('#table-div, #cover-info, #back-button, #select-county').removeClass('hidden');
      $('#select-county-hint').show();
    });

    $('#land-management').on('click', function () {
      $('#topics').addClass('hidden');
      $('#table-div, #management-info, #back-button, #select-county').removeClass('hidden');
      $('#select-county-hint').show();
    });

    $('#cow-management').on('click', function () {
      $('#topics').addClass('hidden');
      $('#table-div, #cow-info, #back-button, #select-county').removeClass('hidden');
      $('#select-county-hint').show();
    });

    defaultTable = $('.table-result').tableExport();

  });


const exportResults = function (format, choice) {
  var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var filename = countyName.toLowerCase() + " result.csv";
  if (format === "pdf") {
    exportPDF("png", choice);
  }
  else if (format === "csv") {
    exportCSV(filename);
  }

};

define("tableexport", function(TableExport){
  $(function(){
    $(".table").tableExport({
      headings: true,                    // (Boolean), display table headings (th/td elements) in the <thead>
      footers: true,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
      formats: ["xls", "csv", "txt"],    // (String[]), filetypes for the export
      fileName: "id",                    // (id, String), filename for the downloaded file
      bootstrap: true,                   // (Boolean), style buttons using bootstrap
      position: "bottom",                 // (top, bottom), position of the caption element relative to table
      ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file
      ignoreCols: null,                  // (Number, Number[]), column indices to exclude from the exported file
      ignoreCSS: ".tableexport-ignore"   // (selector, selector[]), selector(s) to exclude from the exported file
    });
  });
});

function exportCSV(filename) {
  // $('.table-result').tableToCSV({
  //   filename: filename,
  //   rowFilter: '.dlegend'
  // });

}

const exportPDF = function (format, choice) {
  var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var filename = countyName.toLowerCase() + " result.pdf";
  var doc = new jsPDF('p', 'mm');
  var elem = document.getElementsByClassName('table-result')[0];
  var res = doc.autoTableHtmlToJson(elem);
  // hide map widgets
  // $('.esri-ui-inner-container, .esri-ui-corner-container').hide();
  $('.esri-ui-top-right, .esri-ui-top-left, .esri-ui-bottom-left').hide();

  console.log("format: ", format);
  html2canvas($("#mapCanvas"), {
    useCORS: true
  }).then(function (canvas) {
    var imgData = new Image();
    var text = (choice === "cover") ? "Land Cover" : "Land Management";
    imgData.crossOrigin = "Anonymous";
    canvas.crossOrigin = 'Anonymous';
    canvas.allowTaint = true;
    imgData = canvas.toDataURL('image/' + format.toLowerCase());
    doc.text(text + " for " + countyName + "County", 20, 20);
    doc.addImage(imgData, format.toUpperCase(), 15, 40, 180, 150);
    doc.addPage();

  }).then(function () {
    doc.autoTable(res.columns, res.data, {
      margin: {top: 40},
      addPageContent: function () {
        doc.text(countyName.toUpperCase(), 20, 20);
      }
    });
    doc.save(filename);
    $('.esri-ui-top-right, .esri-ui-top-left, .esri-ui-bottom-left').show();
  });
};
