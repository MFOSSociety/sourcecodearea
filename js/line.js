function Line(page, lineNum) {
  this.page = page;
  this.lineNum = lineNum;
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

  getCharCount: function() {
    return this.getCode().length;
  },

  setLineNum: function(num) {
    this.lineNum = num;
    let el = $(`#${this.page.getId()} .line:nth-child(${this.lineNum}) .linenum`);
    $(el).html(num);
  },
  getLineNum: function() {
    return this.lineNum;
  },

  getIndentationSize: function() {
    let code = this.getCode();
    let len = 0;
    
    // WORKAROUND
    // HTML stores (char)32 as (char)160
    const whitespace = String.fromCharCode(160);
    for(let i=0;i<code.length && code.charAt(i)==whitespace;i++) len++;
    return len;
  }
}

