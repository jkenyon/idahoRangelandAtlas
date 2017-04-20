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

  });

const exportResults = function (format) {
  var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var filename = countyName.toLowerCase() + " result.csv";
  if (format === "pdf") {
    exportPDF("png");
  }
  else if (format === "csv") {
    exportCSV(filename);
  }

};

function exportCSV() {
  var filename = document.getElementsByClassName('result-title')[0].textContent.toLowerCase() + '.csv';
  $('.table-result').tableToCSV({
    filename: filename,
    rowFilter: '.dlegend'
  });
  console.log("export CSV");
}

const exportPDF = function () {
  var format = "png";
  var countyName = document.getElementsByClassName('result-title')[0].textContent;
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
