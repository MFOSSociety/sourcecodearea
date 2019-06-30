function Caret(id, row, col) {
  this.id = id;
  this.row = row;
  this.col = col;
}

Caret.prototype = {
  constructor : Caret,

  getRow : function() { 
    return this.row; 
  },
  getCol : function() {
     return this.col; 
  },
  
  setPos : function(row, col) {
    this.row = row;
    this.col = col;
    
    let el = this.getCharacterElementBefore();
    let caretElement = document.getElementById(`caret_${this.id}`);

    let top, left;
    if(this.row == 1) top = 0;
    else top = $(`.line:nth-child(${this.row})`).position().top;
    if(this.col == 1 || el == undefined) left = 15;
    else left = $(el).position().left + $(el).width();

    caretElement.style.top = `${top}px`;
    caretElement.style.left = `${left}px`;
  },

  getCharacterElementBefore: function() {
    return (document.getElementsByClassName("line")[this.row-1]).querySelectorAll(".character")[this.col-2];
  },

  getCharacterElement: function() {
    return (document.getElementsByClassName("line")[this.row-1]).querySelectorAll(".character")[this.col-1];
  },

  getCharacterElementAfter: function() {
    return (document.getElementsByClassName("line")[this.row-1]).querySelectorAll(".character")[this.col];
  },

  getCharacterBefore: function() {
    let el = this.getCharacterElementBefore();
    if(el == undefined) return undefined;
    return $(el).html();
  },

  getCharacter: function() {
    let el = this.getCharacterElement();
    if(el == undefined) return undefined;
    return $(el).html();
  },

  getCharacterAfter: function() {
    let el = this.getCharacterElementAfter();
    if(el == undefined) return undefined;
    return $(el).html();
  },

  show: function() {
    let html = `<div class="caret" id="caret_${this.id}"></div>`;
    document.body.innerHTML += html;

    this.setPos(this.row, this.col);
  },

  insertCharacter: function(char) {
    let line = lineRef[this.row-1];
    let text = line.getCode();
    let newText = text.substring(0, this.col-1) + char + text.substring(this.col-1);
    line.setCode(newText);
    this.setPos(this.row, this.col+1);
  },

  deleteCharacterBefore: function() {
    if(this.col == 1) { // delete current line if line is empty
      if(this.row > 1) {
        let prevLine = lineRef[defaultCaret.getRow()-2];
        let prevCode = prevLine.getCode();

        let curLine = lineRef[defaultCaret.getRow()-1];
        let curCode = curLine.getCode();

        let newCol = prevCode.length + 1;
        prevCode = prevCode + curCode;
        prevLine.setCode(prevCode);
        deleteLine(defaultCaret.getRow());
        defaultCaret.setPos(defaultCaret.getRow()-1, newCol);
      }
    } else { // delete previous character
      let line = lineRef[this.row-1];
      let code = line.getCode();
      code = code.substring(0, this.col-2) +
             code.substring(defaultCaret.getCol()-1);
      line.setCode(code);
      this.setPos(this.row, this.col-1);
    }
  },

  insertNewLineBelow: function() {
    insertNewLineAfter(this.row);
    this.setPos(this.row+1, 1);
  },

  moveUp: function() {
    let newRow, newCol;
    
    newRow = this.row - 1;
    if(newRow < 1) newRow = 1;
    
    newCol = this.col;
    let line = lineRef[newRow-1];
    let len = line.getCode().length;
    if(newCol>len) newCol = len+1;

    this.setPos(newRow, newCol);
  },

  moveDown: function() {
    let newRow, newCol;

    newRow = this.row + 1;
    if(newRow > lineRef.length) newRow = lineRef.length;

    newCol = this.col;
    let line = lineRef[newRow-1];
    let len = line.getCode().length;
    if(newCol>len) newCol = len+1;

    this.setPos(newRow, newCol);
  },

  moveLeft: function() {
    let newRow, newCol;

    if(this.col == 1) { // if caret is at beginning, jump to previous line's end
      newRow = this.row - 1;
      if(newRow < 1) { // if caret is at beginning of file
        newRow = 1;
        newCol = 1;
      } else {
        let line = lineRef[newRow-1];
        newCol = line.getCode().length + 1;
      }
    } else { // else jump to previouse character
      newRow = this.row;
      newCol = this.col - 1;
    }

    this.setPos(newRow, newCol);
  },

  moveRight: function() {
    let newRow, newCol;

    let line = lineRef[this.row - 1];
    let end = line.getCode().length + 1;
    if(end == this.col) { // if caret is at end, jump to next line
      newRow = this.row + 1;
      if(newRow > lineRef.length) { // if caret is at end of file
        newRow = lineRef.length;
        newCol = this.col;
      } else {
        newCol = 1;
      }
    } else { // jump to next character
      newRow = this.row;
      newCol = this.col + 1;
    }

    this.setPos(newRow, newCol);
  }
}