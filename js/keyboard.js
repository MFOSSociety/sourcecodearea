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
  if(shiftKey.isPressed() || capsLockKey.isPressed()) {
    char = keymap[keyCode][0];
  } else {
    char = keymap[keyCode][1];
  }
  return char;
}

// KEYDOWN
const handleKeyDown = function(page, keyCode) {
  var tmpkey = String.fromCharCode(keyCode);
  // console.log(tmpkey + ' ' + keyCode);

  // Ignore Keys --------------------------------------------------------------------
  if(keyCode == 20) {}

  // Deletion --------------------------------------------------------------------
  else if(keyCode == 13) { // ENTER
    // TODO handle brackets indentation (|) {|} [|]
    // let charBefore = page.defaultCaret.getCharacterBefore();
    // let charAfter = page.defaultCaret.getCharacter();
    
    let line = page.getLineRef(page.defaultCaret.getRow());
    let curCode = line.getCode();
    let codeAfterCaret = curCode.substring(page.defaultCaret.getCol()-1);
    curCode = curCode.substring(0, page.defaultCaret.getCol()-1);
    line.setCode(curCode);
    
    page.defaultCaret.insertNewLineBelow();
    line = page.getLineRef(page.defaultCaret.getRow());
    line.setCode(codeAfterCaret);
  } 
  else if(keyCode == 8) { // BACKSPACE
    // TODO handle matching pairs: [] () {} '' "    
    page.defaultCaret.deleteCharacterBefore();
  }
  
  else if(keyCode == 46) { // DELETE
    let char = page.defaultCaret.getCharacter();
    let row = page.defaultCaret.getRow();
    let col = page.defaultCaret.getCol();

    if(char == undefined) { // delete linechange
      if( !(row+1 > page.lineRef.length) ) { // if next line exists
        let line = page.getLineRef(row);
        let curCode = line.getCode();

        let nextLine = page.getLineRef(row+1);
        let nextCode = nextLine.getCode();

        curCode = curCode + nextCode;
        page.deleteLine(row+1);
        line.setCode(curCode);        
      }
    } else { // delete character
      let line = page.getLineRef(row);
      let code = line.getCode();
      code = code.substring(0, col-1) + code.substring(col);
      line.setCode(code);      
    }
  }

  // Navigation --------------------------------------------------------------------
  else if(keyCode == 38) { // UP ARROW KEY
    page.defaultCaret.moveUp();
  }
  else if(keyCode == 40) { // DOWN ARROW KEY
    page.defaultCaret.moveDown();
  }
  else if(keyCode == 37) { // LEFT ARROW KEY
    page.defaultCaret.moveLeft();
  }
  else if(keyCode == 39) { // RIGHT ARROW KEY
    page.defaultCaret.moveRight();
  }
  else if(keyCode == 36) { // HOME
    page.defaultCaret.setPos(page.defaultCaret.getRow(), 1);
  }
  else if(keyCode == 35) { // END
    let newRow = page.defaultCaret.getRow();
    let line = page.getLineRef(newRow);
    let newCol = line.getCode().length + 1;
    
    page.defaultCaret.setPos(newRow, newCol);
  }

  // Insertion --------------------------------------------------------------------
  else {
    if(!isIgnoreKey(keyCode)) {
      let char = keyToChar(keyCode);
      page.defaultCaret.insertCharacter(char);
    }
  }
}

// KEYUP
const handleKeyUp = function(keyCode) {
  
}