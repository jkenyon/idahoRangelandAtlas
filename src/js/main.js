/**
 * Created by kande on 1/19/2017.
 */
require([
  "dojo/dom",
  "dojo/domReady!"
], function (dom) {

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
    $('#select-county').addClass('hidden');
    $('#table').replaceWith("");
    $('#table-div').addClass('hidden');
  });

  $('#land-cover').on('click', function () {
    $('#topics').addClass('hidden');
    $('#table-div').removeClass('hidden');
    $('#cover-info').removeClass('hidden');
    $('#back-button').removeClass('hidden');
    $('#select-county').removeClass('hidden');
  });

  $('#land-management').on('click', function () {
    $('#topics').addClass('hidden');
    $('#table-div').removeClass('hidden');
    $('#management-info').removeClass('hidden');
    $('#back-button').removeClass('hidden');
    $('#select-county').removeClass('hidden');
  });



});
