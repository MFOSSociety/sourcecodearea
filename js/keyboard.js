/*
  Key simulates keyboard keys
  @keyCode: integer value of key
*/
function Key(keyCode) {
  this.keyCode = keyCode;
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

// --------------------------------------------------------------------------
// Key handling tools

// const isAlphabetKey = function(keyCode) {
//   return keyCode>=65 && keyCode<=90;
// }
// const isNumericKey = function(keyCode) {
//   return keyCode>=48 && keyCode<=59;
// }
// const isAlphaNumericKey = function(keyCode) {
//   return isAlphabetKey(keyCode) || isNumericKey(keyCode);
// }

// CharMap --------------------------------------------------------------------
/*
  CharMap Keys are pair-strings that are related to each other for the editor.
  For example:
    all enclosing literals are handled diffrently by the editor:
    [], {}, (), '', ""
*/
const isCharMapKey = function(char) {
  return charMap[char] !== undefined;
}
const isCharMapValue = function(char) {
  for(let key in charMap) {
    if(charMap.hasOwnProperty(key)) {
      if(char == charMap[key])
        return true;
    }
  }
  return false;
}
const getCharMapValue = function(char) {
  return charMap[char];
}

/*
  Ignore Keys are keys that need not be handled by the editor.
  More like "do nothing when these keys are pressed".

  @param {keyCode} code of keyboard key
  @return {boolean} true if it is a "IGNORE KEY", otherwise false
*/
const isIgnoreKey = function(keyCode) {
  return ignoreKeyList.includes(keyCode);
}

/*
  keyToChar accepts keyCode of key on keyboard and
  returns the expected character.
  It also handles shift and capslock keys.
  // TODO handle alt key

  @param {keyCode} code of keyboard key
  @return expected character mapped to the keyboard
*/
const keyToChar = function(keyCode) {
  let char;
  if(shiftKey.isPressed() || capsLockKey.isPressed()) {
    char = keymap[keyCode][0];
  } else {
    char = keymap[keyCode][1];
  }
  return char;
}

// --------------------------------------------------------------------------
// KEYDOWN
const handleKeyDown = function(page, keyCode) {
  // var tmpkey = String.fromCharCode(keyCode);
  // console.log(tmpkey + ' ' + keyCode);

  // Ignore Keys --------------------------------------------------------------------
  if(isIgnoreKey(keyCode)) {}

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

  // Deletion -------------------------------------------------------------------- 
  else if(keyCode == 8) { // BACKSPACE
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

  // Insertion --------------------------------------------------------------------
  else if(keyCode == 13) { // ENTER
    let prevChar = page.defaultCaret.getCharacterBefore(),
        curChar = page.defaultCaret.getCharacter();
    if( isCharMapKey(prevChar) && getCharMapValue(prevChar)==curChar ) {

      page.insertNewLineAfter(page.defaultCaret.getRow());
      page.insertNewLineAfter(page.defaultCaret.getRow()+1);

      let line0 = page.getLineRef(page.defaultCaret.getRow());
      let line1 = page.getLineRef(page.defaultCaret.getRow()+1);
      let line2 = page.getLineRef(page.defaultCaret.getRow()+2);

      let code = line0.getCode();
      let codeAfter = code.substring(page.defaultCaret.getCol()-1);
      code = code.substring(0, page.defaultCaret.getCol()-1);

      let indentationSize = line0.getIndentationSize();
      let prefix = '';
      for(let i=0;i<indentationSize;i++) prefix += ' ';
      let tab = '';
      for(let i=0;i<page.tabSize;i++) tab += ' ';

      line0.setCode(code);
      line1.setCode(prefix+tab);
      line2.setCode(prefix+codeAfter);

      page.defaultCaret.setPos(page.defaultCaret.getRow()+1, (prefix+tab).length+1);    
    } else {
      
      let line = page.getLineRef(page.defaultCaret.getRow());
      
      let indentationSize = line.getIndentationSize();
      let prefix = '';
      for(let i=0;i<indentationSize;i++) prefix += ' ';
      
      let curCode = line.getCode();
      let codeAfterCaret = curCode.substring(page.defaultCaret.getCol()-1);
      curCode = curCode.substring(0, page.defaultCaret.getCol()-1);
      line.setCode(curCode);
      
      page.insertNewLineAfter(page.defaultCaret.getRow());
      line = page.getLineRef(page.defaultCaret.getRow()+1);
      line.setCode(prefix + codeAfterCaret);
      page.defaultCaret.setPos(page.defaultCaret.getRow()+1, (prefix.length+1));
    }
  }
  else {
    if(!isIgnoreKey(keyCode)) {
      let char = keyToChar(keyCode);
      page.defaultCaret.insertCharacter(char);
    }
  }
}

// --------------------------------------------------------------------------
// KEYUP
// const handleKeyUp = function(page, keyCode) {
  
// }