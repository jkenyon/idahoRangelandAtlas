require([
  "my/MyViews",
  "my/MySearchBox",
  "dojo/store/Memory",
  "dijit/form/FilteringSelect",
  "esri/config",
  "dojo/dom",
  "dojo/domReady!"
], function(MyViews,MySearchBox,  Memory, FilteringSelect, esriConfig, dom) {
  // Fixes CORS problems.
  esriConfig.request.corsDetection = false;
  esriConfig.request.corsEnabledServers.push("gis-sandbox.northwestknowledge.net");
  var view = new MyViews();

  var header = dom.byId('header');
  $('#hamburger-button #navbar-open').on('click', function () {
    $('#disclaimer, #technical, #data, #contact').removeClass('hidden');
    header.style.height = '100%';
    $('#about').toggleClass('hidden');
    $('#navbar-close').toggleClass('hidden');
    $('#navbar-open').toggleClass('hidden');
  });
  $('#hamburger-button #navbar-close').on('click', function () {
    $('#about, #disclaimer, #technical, #data, #contact').addClass('hidden');
    header.style.height = 'auto';
    $('#navbar-close').toggleClass('hidden');
    $('#navbar-open').toggleClass('hidden');
  });

  $("#nav-menu ul li a").on('click', function (event) {
    $('#about, #disclaimer, #technical, #data, #contact').addClass('hidden');
    switch(event.target.hash){
      case "#about":
        $('#about').toggleClass('hidden');
        $(this).addClass('selected')
        break;
      case "#technical":
        $('#technical').toggleClass('hidden');
        break;
      case "#disclaimer":
        $('#disclaimer').toggleClass('hidden');
        break;
      case "#data":
        $('#data').toggleClass('hidden');
        break;
      case "#contact":
        $('#contact').toggleClass('hidden');
        break;
      default: break;
    }
  });

  $('.back-btn').on('click', function () {
    $('#topics').removeClass('hidden');
    $('#cover-info, #management-info').addClass('hidden');
  });

  $('#land-cover').on('click', function () {
    $('#topics').addClass('hidden');
    $('#cover-info').removeClass('hidden');
  });
  $('#land-management').on('click', function () {
    $('#topics').addClass('hidden');
    $('#management-info').removeClass('hidden');
  });

});
