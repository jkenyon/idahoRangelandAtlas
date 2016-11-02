$(document).ready(function(){
  $("#menu-toggle").click(function(){
    $("#navbar-bottom")
    .toggleClass("w3-hide-small")
    .toggleClass("w3-hide-medium");
  });

  $("#navbar-bottom > ul > li").click(function(){
    $("#navbar-bottom")
    .toggleClass("w3-hide-small")
    .toggleClass("w3-hide-medium");
  });

});
