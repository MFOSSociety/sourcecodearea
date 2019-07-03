// TODO encapsulate Page
// function Page(id, width, height) {
//   this.id = id;
//   this.width = width;
//   this.height = height;
// }

// Page.prototype = {
//   constructor: Page,

//   getId: function() {
//     return this.id;
//   },

//   getWidth: function() { 
//     return this.width;
//   },
//   getHeight: function() {
//     return this.height;
//   },

//   readLineText: function(lineNum) {
//     let el = $(`${this.id}`).getElementsByClassName("code")[lineNum-1];
//     if(el == undefined) return undefined;
//     return el.textContent;  
//   },

//   setLineHTML: function(lineNum, html) {
//     let el = $(`${this.id}`).getElementsByClassName("code")[lineNum-1];
//     el.innerHTML = html;
//   },

//   insertNewLineAfter: function(lineNum) {
//     // check if line number has exceeded number of lines on page
//     let lineExceed = lineNum > lineRef.length;
  
//     // generate new line data
//     let newLineNum = lineExceed ? lineRef.length+1 : lineNum+1;
//     let newLine = new Line(newLineNum);
//     let html = `<div class="line">${newLine.getHTML()}</div>`;
  
//     // if lineExceed, add line at end of page
//     if(lineExceed) {
//       let el = document.getElementById(`${this.id}`);
//       el.innerHTML += html;
//     } else { // else add line at the target position
//       let el = document.getElementsByClassName("line")[lineNum-1];
//       el.insertAdjacentHTML('afterEnd', html);    
//     }
    
//     // update lineRef
//     lineRef.splice(newLine.getLineNum()-1, 0, newLine);
//     for(let l = newLineNum; l < lineRef.length; l++) 
//       lineRef[l].setLineNum(lineRef[l].getLineNum()+1);
//   },

//   deleteLine = function(lineNum) {
//     if(lineNum > lineRef.length) return;
//     $(`#${this.id} .line:nth-child(${lineNum})`).remove();
    
//     lineRef.splice(lineNum-1, 1);
//     for(let i = lineNum-1;i<lineRef.length;i++) 
//       lineRef[i].setLineNum(lineRef[i].getLineNum()-1);
//   }
// }
const readLineText = function(lineNum) {
  let el = document.getElementsByClassName("code")[lineNum-1];
  if(el == undefined) return undefined;
  return el.textContent;  
}
const setLineHTML = function(lineNum, html) {
  let el = document.getElementsByClassName("code")[lineNum-1];
  el.innerHTML = html;
}

const insertNewLineAfter = function(lineNum) {
  // check if line number has exceeded number of lines on page
  let lineExceed = lineNum > lineRef.length;

  // generate new line data
  let newLineNum = lineExceed ? lineRef.length+1 : lineNum+1;
  let newLine = new Line(newLineNum);
  let html = `<div class="line">${newLine.getHTML()}</div>`;

  // if lineExceed, add line at end of page
  if(lineExceed) {
    let el = document.getElementById("page");
    el.innerHTML += html;
  } else { // else add line at the target position
    let el = document.getElementsByClassName("line")[lineNum-1];
    el.insertAdjacentHTML('afterEnd', html);    
  }
  
  // update lineRef
  lineRef.splice(newLine.getLineNum()-1, 0, newLine);
  for(let l = newLineNum; l < lineRef.length; l++) 
    lineRef[l].setLineNum(lineRef[l].getLineNum()+1);
}

const deleteLine = function(lineNum) {
  if(lineNum > lineRef.length) return;
  $(`.line:nth-child(${lineNum})`).remove();
  
  lineRef.splice(lineNum-1, 1);
  for(let i = lineNum-1;i<lineRef.length;i++) 
    lineRef[i].setLineNum(lineRef[i].getLineNum()-1);
}