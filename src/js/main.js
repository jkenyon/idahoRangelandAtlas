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

  // $('#land-cover').on('click', function () {
  //   dom.byId()
  // });
  $('#hamburger-button').on('click', function () {
    var header = dom.byId('header');
    $('#about').toggleClass('hidden');
    $('#navbar-close').toggleClass('hidden');
    $('#navbar-open').toggleClass('hidden');
    if(header.style.height === '100%'){
      header.style.height = 'auto';
    }
    else {
      header.style.height = '100%';
    }
  });

  $("#nav-menu ul li a").on('click', function (event) {
    $('#about, #disclaimer, #technical, #data').addClass('hidden');
    switch(event.target.hash){
      case "#about":
        $('#about').toggleClass();
        break;
      case "#technical":
        $('#technical').toggleClass();
        break;
      case "#disclaimer":
        $('#disclaimer').toggleClass();
        break;
      case "#data":
        $('#data').toggleClass();
        break;
    }
  })
});
