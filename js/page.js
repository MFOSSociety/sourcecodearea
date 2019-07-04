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

  getId: function() {
    return this.id;
  },

  getWidth: function() { 
    return this.width;
  },
  setWidth: function(width) {
    document.getElementById(`${this.id}`).style.width = `${width}px`;
  },
  getHeight: function() {
    return this.height;
  },
  setHeight: function(height) {
    document.getElementById(`${this.id}`).style.height = `${height}`;
  },

  getLineRef: function(lineNum) {
    return this.lineRef[lineNum-1];
  },

  readLineText: function(lineNum) {
    let el = document.getElementById(`${this.id}`).getElementsByClassName("code")[lineNum-1];
    if(el == undefined) return undefined;
    return el.textContent;  
  },

  setLineHTML: function(lineNum, html) {
    let el = $(`#${this.id}`)[0].getElementsByClassName("code")[lineNum-1];
    el.innerHTML = html;
  },

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

  deleteLine: function(lineNum) {
    if(lineNum > this.lineRef.length) return;
    $(`#${this.id} .line:nth-child(${lineNum})`).remove();
    
    this.lineRef.splice(lineNum-1, 1);
    for(let i = lineNum-1;i<this.lineRef.length;i++) 
      this.lineRef[i].setLineNum(this.lineRef[i].getLineNum()-1);
  }
}

const initNewPage = function(id) {
  let page = new Page(id, window.innerWidth, window.innerHeight);
  page.insertNewLineAfter(1);
  page.defaultCaret.show();

  window.onresize = function() {
    page.setWidth(window.innerWidth);
    page.setHeight(window.innerHeight);
    page.defaultCaret.setPos(page0.defaultCaret.getRow(), page0.defaultCaret.getCol());
  }

  $(document).on('keydown', function(event) {
    // prevent TAB KEY from switching focus
    if(event.keyCode == 9) event.preventDefault();
    
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

  $(document).on('keyup', function(event) {
    handleKeyUp(page, event.keyCode);
  });

  return page;
}


