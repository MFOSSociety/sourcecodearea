/*
  Page represents the entire visual space of a code editor.
  It wraps up nenumbers, line content, carets.

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

  this.config = {
    codeElementLeft: 51,
    lineHeight: 13,
    linenumHeight: 14,
    linecodeHeight: 15,
  };

  let _this = this;

  this.insertNewLineAfter(1);
  this.defaultCaret.show();
  
  // Style adjustments
  this.setWidth(width);
  this.setHeight(height);
  
  let linecodeEl = $(`.line:nth-child(1) .code`);
  let linecodeHeight = $(linecodeEl).height();
  this.config.linecodeHeight = linecodeHeight;
  
  // Keyboard event handlers
  $(`#${id}`).focus();
  $(`#${id}`).on('keydown', function(event) {
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
    handleKeyDown(_this, event.keyCode);
  });

  // Mouse Event Handlers
  // On mousedown on character, move caret to this character
  $(document).on('mousedown', '.character', function(event) {
    let el = $(this);
    let clicked_el = $(this)[0];

    // get character attributes on page
    let character_pos = el.offset();
    let character_width = el.width();

    // calculate line index of clicked character
    while( el.attr('class').indexOf('line') == -1 )
      el = el.parent();
    let line_num = el.index() + 1;
    
    // calculate character index on clicked line
    let character_index = 0;
    let character_found = false;
    $('.character', $(`#${_this.id} .line:nth-child(${line_num})`)).each(function(){
      if(!character_found)
        character_index++;
    
      if( $(this)[0] == clicked_el )
        character_found = true;
    });

    // calculate target character index on clicked line
    if(event.pageX > character_pos.left + (character_width/2) )
      character_index++;

    console.log(`${line_num}:${character_index}`)

    // set caret position
    _this.defaultCaret.setPos(line_num, character_index);
  });

  // On mousedown on line(whitespace after code ends), move character 
  // to end of this line
  $(document).on('mousedown', '.line', function(event) {
    let el = $(this);
    let line_num = el.index() + 1;
    let codeEl = $(`#${_this.id} .line:nth-child(${line_num}) > .code`);
    let codePos = codeEl.offset();
    let codeEnd = codePos.left + codeEl.width();
    if(event.pageX > codeEnd) {
      let line_ref = _this.getLineRef(line_num);
      _this.defaultCaret.setPos(line_num, line_ref.getCharCount()+1);
    }
  });

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
    $(`#${this.id}`).css('width', `${width}px`);
    this.defaultCaret.setPos(this.defaultCaret.getRow(), this.defaultCaret.getCol());
  },
  getHeight: function() {
    return this.height;
  },
  setHeight: function(height) {
    $(`#${this.id}`).css('height', `${height}px`);
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
      this.lineRef[l].setLineNum(this.lineRef[l].getLineNum()+1);
    }


    // let linecodeEl = $(`.line:nth-child(${newLineNum}) .code`);
    // $(linecodeEl).width( this.width - $(linecodeEl).position().left - 8);
  },

  /*
    deleteLine
      deletes the line in the DOM and
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
