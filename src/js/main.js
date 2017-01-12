require([
  "my/MyViews",
  "my/MySearchBox",
  "dojo/store/Memory",
  "dijit/form/FilteringSelect",
  "esri/config",
  "dojo/dom",
  "dojo/on",
  "dojo/dom-style",
  "dojo/domReady!"
], function (MyViews, MySearchBox, Memory, FilteringSelect, esriConfig, dom, on, domStyle) {
  // Fixes CORS problems.
  esriConfig.request.corsDetection = false;
  esriConfig.request.corsEnabledServers.push("gis-sandbox.northwestknowledge.net");
  var view = new MyViews();

  // { id: 0, text: 'enhancement' }
  // var counties = [
  //   {
  //     id: 0,
  //     text: 'ADA'
  //   },
  //   {
  //     id: 1,
  //     text: 'ADAMS'
  //   },
  //   {
  //     id: 2,
  //     text: 'BANNOCK'
  //   },
  //   {
  //     id: 3,
  //     text: 'BEAR LAKE'
  //   },
  //   {
  //     id: 4,
  //     text: 'BENEWAH'
  //   },
  //   {
  //     id: 5,
  //     text: 'BINGHAM'
  //   },
  //   {
  //     id: 6,
  //     text: 'BLAINE'
  //   },
  //   {
  //     id: 7,
  //     text: 'BOISE'
  //   },
  //   {
  //     id: 8,
  //     text: 'BONNER'
  //   },
  //   {
  //     id: 9,
  //     text: 'BONNEVILLE'
  //   },
  //   {
  //     id: 10,
  //     text: 'BOUNDARY'
  //   },
  //   {
  //     id: 11,
  //     text: 'BUTTE'
  //   },
  //   {
  //     id: 12,
  //     text: 'CAMAS'
  //   },
  //   {
  //     id: 13,
  //     text: 'CANYON'
  //   },
  //   {
  //     id: 14,
  //     text: 'CARIBOU'
  //   },
  //   {
  //     id: 15,
  //     text: 'CASSIA'
  //   },
  //   {
  //     id: 16,
  //     text: 'CLARK'
  //   },
  //   {
  //     id: 17,
  //     text: 'CLEARWATER'
  //   },
  //   {
  //     id: 18,
  //     text: 'CUSTER'
  //   },
  //   {
  //     id: 19,
  //     text: 'ELMORE'
  //   },
  //   {
  //     id: 20,
  //     text: 'FRANKLIN'
  //   },
  //   {
  //     id: 21,
  //     text: 'FREMONT'
  //   },
  //   {
  //     id: 22,
  //     text: 'GEM'
  //   },
  //   {
  //     id: 23,
  //     text: 'GOODING'
  //   },
  //   {
  //     id: 24,
  //     text: 'IDAHO'
  //   },
  //   {
  //     id: 25,
  //     text: 'JEFFERSON'
  //   },
  //   {
  //     id: 26,
  //     text: 'JEROME'
  //   },
  //   {
  //     id: 27,
  //     text: 'KOOTENAI'
  //   },
  //   {
  //     id: 28,
  //     text: 'LATAH'
  //   },
  //   {
  //     id: 29,
  //     text: 'LEMHI'
  //   },
  //   {
  //     id: 30,
  //     text: 'LEWIS'
  //   },
  //   {
  //     id: 31,
  //     text: 'LINCOLN'
  //   },
  //   {
  //     id: 32,
  //     text: 'MADISON'
  //   },
  //   {
  //     id: 33,
  //     text: 'MINIDOKA'
  //   },
  //   {
  //     id: 34,
  //     text: 'NEZ PERCE'
  //   },
  //   {
  //     id: 35,
  //     text: 'ONEIDA'
  //   },
  //   {
  //     id: 36,
  //     text: 'OWYHEE'
  //   },
  //   {
  //     id: 37,
  //     text: 'PAYETTE'
  //   },
  //   {
  //     id: 38,
  //     text: 'POWER'
  //   },
  //   {
  //     id: 39,
  //     text: 'SHOSHONE'
  //   },
  //   {
  //     id: 40,
  //     text: 'TETON'
  //   },
  //   {
  //     id: 41,
  //     text: 'TWIN FALLS'
  //   },
  //   {
  //     id: 42,
  //     text: 'VALLEY'
  //   },
  //   {
  //     id: 43,
  //     text: 'WASHINGTON'
  //   }
  // ];

  var header = dom.byId('header');
  var headerHeight = header.style.height;
  var headerWidth = header.style.width;
  var navbar = dom.byId('navbar');
  navbar.style.display = 'none';
  $('#navbar-open').on('click', function () {
    navbar.style.display = 'block';
    header.style.height = '100vh';
    header.style.width = '100vw';
    $('#disclaimer, #technical, #data, #contact').addClass('hidden');
    // header.style.height = '100%';
    $('#about').toggleClass('hidden');
    $('#navbar-close').toggleClass('hidden');
    $('#navbar-open').toggleClass('hidden');
  });
  $('#navbar-close').on('click', function () {
    navbar.style.display = 'none';
    header.style.height = headerHeight;
    header.style.width = headerWidth;
    $('#about, #disclaimer, #technical, #data, #contact').addClass('hidden');
    // header.style.height = 'auto';
    $('#navbar-close').toggleClass('hidden');
    $('#navbar-open').toggleClass('hidden');
  });

  $("#nav-menu ul li a").on('click', function (event) {
    $('#about, #disclaimer, #technical, #data, #contact').addClass('hidden');
    switch (event.target.hash) {
      case "#about":
        $('#about').toggleClass('hidden');
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
      default:
        break;
    }
  });

  $('.back-btn').on('click', function () {
    $('#topics').removeClass('hidden');
    $('#cover-info, #management-info, #back-button').addClass('hidden');
    $('#esri_widgets_Search_0').addClass('hidden');
    $('#table').replaceWith("");
    $('#tableDiv').addClass('hidden');
  });

  $('#land-cover').on('click', function () {
    $('#topics').addClass('hidden');
    $('#tableDiv').removeClass('hidden');
    $('#cover-info').removeClass('hidden');
    $('#back-button').removeClass('hidden');
    $('#esri_widgets_Search_0').removeClass('hidden');
  });
  $('#land-management').on('click', function () {
    $('#topics').addClass('hidden');
    $('#tableDiv').removeClass('hidden');
    $('#management-info').removeClass('hidden');
    $('#back-button').removeClass('hidden');
    $('#esri_widgets_Search_0').removeClass('hidden');
  });

  // $(".select-counties").select2({
  //   placeholder: "Select a county",
  //   data: counties
  // });

});
