const initNewDoc = function() {
  insertNewLineAfter(1);
  defaultCaret.show();
}

$(document).ready(function() {
  console.log('READY');
 
  initNewDoc();

  $(document).on('keydown', function(event) {
    // prevent TAB KEY from switching focus
    if(event.keyCode == 9) event.preventDefault();
    
    // detect capslock
    if (event.originalEvent.getModifierState("CapsLock")) capsLockKey.press();
    else capsLockKey.release();
    
    // handle key pressed
    handleKeyDown(event.keyCode);
  });

  $(document).on('keyup', function(event) {
    handleKeyUp(event.keyCode);
  });
});