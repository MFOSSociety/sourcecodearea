
$(document).ready(function() {
  console.log('READY');
  
  var page0 = initNewPage('code_editor', 150, window.innerHeight);

  window.onresize = function() {
    // page0.setWidth(window.innerWidth);
    page0.setHeight(window.innerHeight);
  }
});