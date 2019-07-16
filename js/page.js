/*
  Page represents the entire visual space of a code editor.
  It wraps up linenumbers, line content, carets.

  @param {id} unique id provided to the editor in the DOM
  @param {width} default width of the editor
  @param {height} default height of the editor
*/
function Page(id, width, height) {
  this.id = id;
  this.width = width;
  this.height = height;
  this.lineRef = [];
  this.tabSize = 4;
  this.defaultCaret = new Caret(this, 0,1,1);
}

Page.prototype = {
  constructor: function(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.lineRef = [];
    this.tabSize = 4;
    this.defaultCaret = new Caret(this, 0,1,1);
  },

  // Getter, Setter Methods ------------------------------------------------------------------
  getId: function() {
    return this.id;
  },
  getWidth: function() { 
    return this.width;
  },
  setWidth: function(width) {
    document.getElementById(`${this.id}`).style.width = `${width}px`;
    this.defaultCaret.setPos(this.defaultCaret.getRow(), this.defaultCaret.getCol());
  },
  getHeight: function() {
    return this.height;
  },
  setHeight: function(height) {
    document.getElementById(`${this.id}`).style.height = `${height}`;
    this.defaultCaret.setPos(this.defaultCaret.getRow(), this.defaultCaret.getCol());
  },

  // Line Methods ------------------------------------------------------------------
  /*
    Reference to every line is stored in the array lineRef.
    The order is same as it is displayed on the DOM.
    
    @param {lineNum} line number
    @return line object to the corresponding @lineNum
  */
  getLineRef: function(lineNum) {
    return this.lineRef[lineNum-1];
  },

  /*
    readLineText reads the code written on specified line and returns plain text string.
    
    @param {lineNum} line number
    @return string content on the line @lineNum
  */
  readLineText: function(lineNum) {
    let el = document.getElementById(`${this.id}`).getElementsByClassName("code")[lineNum-1];
    if(el == undefined) return undefined;
    return el.textContent;  
  },

  /*
    setLineHTML sets the html content on the specified line in the DOM.
    
    @param {lineNum} line number of the line to change
    @param {html} html content to insert
  */
  setLineHTML: function(lineNum, html) {
    let el = $(`#${this.id}`)[0].getElementsByClassName("code")[lineNum-1];
    el.innerHTML = html;
  },

  /*
    insertNewLineAfter 
      inserts new line after the specified line number,
      increases the line numbers of the following line numbers by 1,
      updates lineRef array accordingly.

    @param {lineNum} line number
  */
  insertNewLineAfter: function(lineNum) {
    // check if line number has exceeded number of lines on page
    let lineExceed = lineNum > this.lineRef.length;
  
    // generate new line data
    let newLineNum = lineExceed ? this.lineRef.length+1 : lineNum+1;
    let newLine = new Line(this, newLineNum);
    let html = `<div class="line">${newLine.getHTML()}</div>`;
  
    // if lineExceed, add line at end of page
    if(lineExceed) {
      let el = document.getElementById(`${this.id}`);
      el.innerHTML += html;
    } else { // else add line at the target position
      let el = document.getElementsByClassName("line")[lineNum-1];
      el.insertAdjacentHTML('afterEnd', html);    
    }
    
    // update lineRef
    this.lineRef.splice(newLine.getLineNum()-1, 0, newLine);
    for(let l = newLineNum; l < this.lineRef.length; l++) {
      console.log(this.lineRef[l].getLineNum());
      this.lineRef[l].setLineNum(this.lineRef[l].getLineNum()+1);
    }
  },

  /*
    deleteLine
      deletes the line in the DOM,
      updates array lineRef accordingly.
    
    @param {lineNum} line number
  */
  deleteLine: function(lineNum) {
    if(lineNum > this.lineRef.length) return;
    $(`#${this.id} .line:nth-child(${lineNum})`).remove();
    
    this.lineRef.splice(lineNum-1, 1);
    for(let i = lineNum-1;i<this.lineRef.length;i++) 
      this.lineRef[i].setLineNum(this.lineRef[i].getLineNum()-1);
  }
}

/*
  initNewPage creates the code editor in DOM with required attributes.
  It provides for the basic functions that a user expects from an empty code editor.
  Keyboard, Mouse Event handlers are also attached to the editor.

  @param {id} unique id provided to the editor in the DOM
  @param {width} default width of the editor
  @param {height} default height of the editor
  @return page object refering to the @id in DOM.
*/
const initNewPage = function(id, width, height) {
  let page = new Page(id, width, height);
  page.insertNewLineAfter(1);
  page.defaultCaret.show();

  // Keyboard event handler
  $(document).on('keydown', function(event) {
    if(preventDefaultKeyList.includes(event.keyCode))
      event.preventDefault();
    
    // toggle capslock
    if (event.originalEvent.getModifierState("CapsLock")) capsLockKey.press();
    else capsLockKey.release();

    // toggle shiftkey
    if(event.shiftKey) shiftKey.press();
    else shiftKey.release();

    // toggle ctrlKey
    if(event.ctrlKey) ctrlKey.press();
    else ctrlKey.release();
    
    // handle key pressed
    handleKeyDown(page, event.keyCode);
  });

  // $(document).on('keyup', function(event) {
  //   handleKeyUp(page, event.keyCode);
  // });

  // TODO add mouse event handler
  return page;
}


