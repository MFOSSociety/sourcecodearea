function Line(page, lineNum) {
  this.page = page;
  this.lineNum = lineNum;
  this.colorState = [];
}

Line.prototype = {
  constructor: Line,

  getCode: function() { 
    return this.page.readLineText(this.lineNum); 
  },
  
  setCode: function(text) {
    let html = colorizeLine(this.page, text, null);
    this.page.setLineHTML(this.lineNum, html);
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
    // let el = document.getElementsByClassName("linenum")[this.lineNum-1];
    let el = $(`${this.page.getId()} .linenum:nth-child(${this.lineNum})`);
    $(el).html(num);
  },
  getLineNum: function() {
    return this.lineNum;
  }

  // TODO
  /*
    init colorState[]
  */
}

