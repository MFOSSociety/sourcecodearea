
$(document).ready(function() {
  console.log('READY');
 
  var page0 = initNewPage('code_editor', window.innerWidth, window.innerHeight);

  window.onresize = function() {
    page0.setWidth(window.innerWidth);
    page0.setHeight(window.innerHeight);
  }
});