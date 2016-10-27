function toggleSideNav(){
  var sidenav = document.getElementById("sidenav-left");
  if(sidenav.style.width > "0%"){
    sidenav.style.width = "0%";
  }
  else {
    sidenav.style.width = "50%";    
  }
}

function sidenavOpen(text){
  toggleSideNav();
}