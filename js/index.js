const initNewDoc = function() {
  document.getElementById("page").style.height = `${window.innerHeight}px`;
  document.getElementById("page").style.width = `${window.innerWidth}px`;
  insertNewLineAfter(1);
  defaultCaret.show();
}

$(document).ready(function() {
  console.log('READY');
 
  initNewDoc();

  window.onresize = function() {
    document.getElementById("page").style.height = `${window.innerHeight}px`;
    document.getElementById("page").style.width = `${window.innerWidth}px`;
    defaultCaret.show();
  } 

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