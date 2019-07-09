var page0;

$(document).ready(function() {
  console.log('READY');
 
  page0 = initNewPage('code_editor');

  window.onresize = function() {
    page0.setWidth(window.innerWidth);
    page0.setHeight(window.innerHeight);
    // page0.defaultCaret.show();
  }
});