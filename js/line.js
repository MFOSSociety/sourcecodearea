function Line(lineNum) {
  this.lineNum = lineNum;
  this.colorState = [];
}

Line.prototype = {
  constructor: Line,

  getCode: function() { 
    return readLineText(this.lineNum); 
  },
  
  setCode: function(text) {
    let html = colorizeLine(text, null);
    setLineHTML(this.lineNum, html);
  },

  getHTML: function() {
    let linenumHTML = `<div class="linenum">${this.lineNum}</div>`;
    let text = this.getCode();
    if(text == undefined) text = '';

    let textHTML = `<pre class="code">${text}</pre>`;

    return linenumHTML + textHTML;
  },

  setLineNum: function(num) {
    this.lineNum = num;
    let el = document.getElementsByClassName("linenum")[this.lineNum-1];
    el.textContent = this.lineNum;
  },
  getLineNum: function() {
    return this.lineNum;
  }

  // TODO
  /*
    init colorState[]
  */
}

