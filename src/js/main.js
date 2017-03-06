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

// function exportPDF() {   var countyName =
// document.getElementsByClassName('county-title')[0].textContent;   var
// filename = countyName.toLowerCase() + " result.pdf";   var doc = new
// jsPDF('p', 'mm');   var elem =
// document.getElementsByClassName('table-result')[0];   var res =
// doc.autoTableHtmlToJson(elem);   // hide map widgets
// $('.esri-ui-top-left.esri-ui-corner,   //
// .esri-ui-top-right.esri-ui-corner').hide();   html2canvas($("#mapCanvas"),
// {allowTaint: true})     .then(function (canvas) {       canvas.allowTaint =
// true;       canvas.crossOrigin = true;       var img = new Image;
// img.crossOrigin = "anonymous";       img = canvas.toDataURL('image/jpeg');
// doc.text(countyName.toUpperCase(), 75, 30);       doc.addImage(img, 'jpeg',
// 15, 40, 180, 180);       doc.addPage(); doc.autoTable(res.columns, res.data);
//       doc.save(filename);     }) .then(function () {       //
// $('.esri-ui-top-left.esri-ui-corner,       //
// .esri-ui-top-right.esri-ui-corner').show();     }); }

function exportPDF() {
  var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var filename = countyName.toLowerCase() + " result.pdf";
  var doc = new jsPDF('p', 'mm');
  var elem = document.getElementsByClassName('table-result')[0];
  var res = doc.autoTableHtmlToJson(elem);
  // hide map widgets
  $('.esri-ui-top-left.esri-ui-corner', '.esri-ui-top-right', '.esri-ui-corner').hide();
  html2canvas($("#mapCanvas"), {
    useCORS: true
  })
    .then(function (canvas) {
      var imgData = new Image();
      imgData.crossOrigin = "Anonymous";
      canvas.crossOrigin = 'Anonymous';
      canvas.allowTaint = true;
      imgData = canvas.toDataURL('image/jpeg');
      doc.addImage(imgData, 'JPEG', 15, 40, 180, 180);

    }).then(function () {
    doc.text(countyName.toUpperCase(), 75, 30);
    doc.autoTable(res.columns, res.data);
    doc.save(filename);
    $('.esri-ui-top-left, .esri-ui-top-right').show();
  });

}

// function exportPagePDF() {
//   html2canvas($("#mapCanvas"), {
//     onrendered: function (canvas) {
//       var imgData = canvas.toDataURL('image/jpeg');
//       var doc = new jsPDF('p', 'mm');
//       doc.addImage(imgData, 'JPEG', 15, 40, 180, 180);
//       doc.save('sample-file.pdf');
//     }
//   });

// }

function exportPagePDF() {
  var countyName = document.getElementsByClassName('county-title')[0].textContent;
  var filename = countyName.toLowerCase() + " result.pdf";
  var doc = new jsPDF('p', 'mm');
  var elem = document.getElementsByClassName('table-result')[0];
  var res = doc.autoTableHtmlToJson(elem);
  html2canvas($("#mapCanvas"), {
    onrendered: function (canvas) {
      canvas.allowTaint = true;
      var img = new Image;
      imgData.crossOrigin = "anonymous";
      imgData.src = 'image/jpeg';
      var imgData = canvas.drawImage(img);
      doc.text(countyName.toUpperCase(), 100, 10);
      doc.addImage(imgData, 'JPEG', 15, 40, 180, 180);
      doc.addPage();
    },
    allowTaint: true,
    useCORS: true
  })
    .then(function () {
      doc.autoTable(res.columns, res.data);
      doc.save(filename);
    });

}