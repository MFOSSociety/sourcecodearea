var page0;

const initNewPage = function(id) {
  let page = new Page(id, window.innerWidth, window.innerHeight);
  page.insertNewLineAfter(1);
  page.defaultCaret.show();
  return page;
}

$(document).ready(function() {
  console.log('READY');
 
  page0 = initNewPage('page');

  window.onresize = function() {
    page0.setWidth(window.innerWidth);
    page0.setHeight(window.innerHeight);
    page0.defaultCaret.setPos(page0.defaultCaret.getRow(), page0.defaultCaret.getCol());
  } 

  $(document).on('keydown', function(event) {
    // prevent TAB KEY from switching focus
    if(event.keyCode == 9) event.preventDefault();
    
    // detect capslock
    if (event.originalEvent.getModifierState("CapsLock")) capsLockKey.press();
    else capsLockKey.release();
    
    // handle key pressed
    handleKeyDown(page0, event.keyCode);
  });

  $(document).on('keyup', function(event) {
    handleKeyUp(event.keyCode);
  });
});