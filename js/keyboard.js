function Key(keyCode, char) {
  this.keyCode = keyCode;
  this.char = char;
  this.down = false;
}

Key.prototype = {
  constructor: Key,

  press: function() {
    this.down = true;
  },

  release: function() {
    this.down = false;
  },

  isPressed: function() {
    return this.down;
  }
}

var shiftKey = new Key(16, '');
var ctrlKey = new Key(17, '');
var altKey = new Key(18, '');
var ignoreKeyList = [16, 17, 18];

const isAlphabetKey = function(keyCode) {
  return keyCode>=65 && keyCode<=90;
}
const isNumericKey = function(keyCode) {
  return keyCode>=48 && keyCode<=59;
}
const isAlphaNumericKey = function(keyCode) {
  return isAlphabetKey(keyCode) || isNumericKey(keyCode);
}
const isIgnoreKey = function(keyCode) {
  return ignoreKeyList.includes(keyCode);
}

const keyToChar = function(keyCode) {
  let char;
  console.log(shiftKey.isPressed());
  if(shiftKey.isPressed()) {
    char = keymap[keyCode][0];
  } else {
    char = keymap[keyCode][1];
  }
  return char;
}

// KEYDOWN
const handleKeyDown = function(keyCode) {
  var tmpkey = String.fromCharCode(keyCode);
  console.log(tmpkey + ' ' + keyCode);

  // TRIGGER HELPER KEYS: CTRL, SHIFT
  if(keyCode == shiftKey.keyCode) {
    shiftKey.press();
  } else if(keyCode == ctrlKey.keyCode) {
    ctrlKey.press();
  }

  // Deletion --------------------------------------------------------------------
  if(keyCode == 13) { // ENTER
    // TODO handle brackets indentation (|) {|} [|]
    let charBefore = defaultCaret.getCharacterBefore();
    let charAfter = defaultCaret.getCharacter();
    
    let line = lineRef[defaultCaret.getRow()-1];
    let curCode = line.getCode();
    let codeAfterCaret = curCode.substring(defaultCaret.getCol()-1);
    curCode = curCode.substring(0, defaultCaret.getCol()-1);
    line.setCode(curCode);
    
    defaultCaret.insertNewLineBelow();
    line = lineRef[defaultCaret.getRow()-1];
    line.setCode(codeAfterCaret);
  } 
  else if(keyCode == 8) { // BACKSPACE
    // TODO handle matching pairs: [] () {} '' "    
    defaultCaret.deleteCharacterBefore();
  }
  
  else if(keyCode == 46) { // DELETE
    let char = defaultCaret.getCharacter();
    let row = defaultCaret.getRow();
    let col = defaultCaret.getCol();

    if(char == undefined) { // delete linechange
      if( !(row+1 > lineRef.length) ) { // if next line exists
        let line = lineRef[row-1];
        let curCode = line.getCode();

        let nextLine = lineRef[row];
        let nextCode = nextLine.getCode();

        curCode = curCode + nextCode;
        deleteLine(row+1);
        line.setCode(curCode);        
      }
    } else { // delete character
      let line = lineRef[row-1];
      let code = line.getCode();
      code = code.substring(0, col-1) + code.substring(col);
      line.setCode(code);      
    }
  }

  // NAVIGATION --------------------------------------------------------------------
  else if(keyCode == 38) { // UP ARROW KEY
    defaultCaret.moveUp();
  }
  else if(keyCode == 40) { // DOWN ARROW KEY
    defaultCaret.moveDown();
  }
  else if(keyCode == 37) { // LEFT ARROW KEY
    defaultCaret.moveLeft();
  }
  else if(keyCode == 39) { // RIGHT ARROW KEY
    defaultCaret.moveRight();
  }
  else if(keyCode == 36) { // HOME
    defaultCaret.setPos(defaultCaret.getRow(), 1);
  }
  else if(keyCode == 35) { // END
    let newRow = defaultCaret.getRow();
    let line = lineRef[newRow-1];
    let newCol = line.getCode().length + 1;
    
    defaultCaret.setPos(newRow, newCol);
  }

  // Insertion --------------------------------------------------------------------
  else {
    if(!isIgnoreKey(keyCode)) {
      let char = keyToChar(keyCode);
      defaultCaret.insertCharacter(char);
    }
  }
}

// KEYUP
const handleKeyUp = function(keyCode) {
  if(keyCode == shiftKey.keyCode) {
    shiftKey.release();
  } else if(keyCode == ctrlKey.keyCode) {
    ctrlKey.release();
  }
}