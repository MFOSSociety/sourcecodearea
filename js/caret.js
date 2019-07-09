function Caret(page, id, row, col) {
  this.page = page;
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
    let caretElement = $(`#caret_${this.page.getId()}_${this.id}`);

    let top, left;
    if(this.row == 1) top = 0;
    else top = $(`#${this.page.getId()} .line:nth-child(${this.row})`).position().top;
    if(this.col == 1 || el == undefined) left = $(`#${this.page.getId()} .line:nth-child(${this.row}) .linenum`).width() + 10;
    else left = $(el).position().left + $(el).width();

    // caretElement = $(caretElement)[0];
    $(caretElement).css('top', `${top}px`);
    $(caretElement).css('left', `${left}px`);
  },

  getCharacterElementBefore: function() {
    let parent = document.getElementById(`${this.page.getId()}`);
    return (parent.getElementsByClassName("line")[this.row-1]).querySelectorAll(".character")[this.col-2];
  },

  getCharacterElement: function() {
    let parent = document.getElementById(`${this.page.getId()}`);
    return (parent.getElementsByClassName("line")[this.row-1]).querySelectorAll(".character")[this.col-1];
  },

  getCharacterElementAfter: function() {
    let parent = document.getElementById(`${this.page.getId()}`);
    return (parent.getElementsByClassName("line")[this.row-1]).querySelectorAll(".character")[this.col];
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
    let html = `<div id="caret_${this.page.getId()}_${this.id}" class="caret"></div>`;
    document.body.innerHTML += html;

    this.setPos(this.row, this.col);
  },

  insertCharacter: function(char) {
    let line = this.page.getLineRef(this.row);
    let text = line.getCode();

    let str;
    if(isCharMapValue(char) && (this.getCharacter()==char)) {
      str = '';
    } else if(isCharMapKey(char)) {
      str = char + getCharMapValue(char);
    } else {
      str = char;
    }

    let newText = text.substring(0, this.col-1) + str + text.substring(this.col-1);
    line.setCode(newText);

    if(char == '\t')
      this.setPos(this.row, this.col+this.page.tabSize);
    else
      this.setPos(this.row, this.col+1);
  },

  deleteCharacterBefore: function() {
    if(this.col == 1) { // delete current line if line is empty
      if(this.row > 1) {
        let prevLine = this.page.getLineRef(this.getRow()-1);
        let prevCode = prevLine.getCode();

        let curLine = this.page.getLineRef(this.getRow());
        let curCode = curLine.getCode();

        let newCol = prevCode.length + 1;
        prevCode = prevCode + curCode;
        prevLine.setCode(prevCode);
        this.page.deleteLine(this.getRow());
        this.setPos(this.getRow()-1, newCol);
      }
    } else { // delete previous character
      let line = this.page.getLineRef(this.row);
      let code = line.getCode();

      let prevChar = this.getCharacterBefore();
      if(isCharMapKey(prevChar)) {
        let nextChar = this.getCharacter();
        if(getCharMapValue(prevChar) == nextChar) {
          code = code.substring(0, this.col-2) + code.substring(this.getCol());
        } else {
          code = code.substring(0, this.col-2) + code.substring(this.getCol()-1);
        }
      } else {
        code = code.substring(0, this.col-2) + code.substring(this.getCol()-1);
      }

      line.setCode(code);
      this.setPos(this.row, this.col-1);
    }
  },

  insertNewLineBelow: function() {
    this.page.insertNewLineAfter(this.row);
    this.setPos(this.row+1, 1);
  },

  moveUp: function() {
    let newRow, newCol;
    
    newRow = this.row - 1;
    if(newRow < 1) newRow = 1;
    
    newCol = this.col;
    let line = this.page.getLineRef(newRow);
    let len = line.getCode().length;
    if(newCol>len) newCol = len+1;

    this.setPos(newRow, newCol);
  },

  moveDown: function() {
    let newRow, newCol;

    newRow = this.row + 1;
    if(newRow > this.page.lineRef.length) newRow = this.page.lineRef.length;

    newCol = this.col;
    let line = this.page.getLineRef(newRow);
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
        let line = this.page.getLineRef(newRow);
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

    let line = this.page.getLineRef(this.row);
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