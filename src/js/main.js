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
  // var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var countyName = "state wide ranches data";
  var filename = countyName.toLowerCase() + ".csv";
  if (format === "pdf") {
    exportPDF("png");
  }
  else if (format === "csv") {
    exportCSV(filename);
  }

};

function exportCSV() {
  // var filename = document.getElementsByClassName('result-title')[0].textContent.toLowerCase() + '.csv';
  var filename = "state wide ranches data.csv";
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
    doc.text(text + " for " + countyName, 20, 20);
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

function createModal(modalId, title, definition, description){
  var modal =
    '<div class="modal fade metadata-modal" id="' + modalId + '" tabindex="-1" role="dialog"aria-labelledby="myModalLabel">' +
      '<div class="modal-dialog" role="document">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
          '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
          '</button><h2 class="modal-title" id="myModalLabel">'+ title +'</h2>' +
          '</div>' +
          '<div class="modal-body">' +
              '<h3 class="text-left modal-text-underline">Definition:</h3><p class="text-justify modal-text">' + description + '</p></div>' +
          '<div class="modal-footer">' +
            '<div><h3 class="text-left modal-text-underline">Source: </h3><p class="text-justify modal-text">' + definition + '</p></div>' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
          '</div>' +
        '</div>' +
      '</div>'+
    '</div>';
  $('body').append(modal);
}

function removeModal(){
  $('.modal.metadata-modal').remove();
}