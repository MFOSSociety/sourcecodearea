const isWordBreak = function(char) {
  let ascii = char.charCodeAt(0);
  return !((ascii>=65 && ascii<=90) || (ascii>=97 && ascii<=122) || (ascii>=48 && ascii<=57) );
}

const getColorClass = function(word) {
  return colorMap[word];  
}

const isNumber = function(str) {
  return !isNaN(str);
}

const characterizeWord = function(page, word) {
  let html = "";
  for(let i = 0; i < word.length; i++) {
    let char = word.charAt(i);
    if(char.charCodeAt(0) == 160) char = ' ';
    if(char == '\t') {
      for(let i = 0; i<page.tabSize; i++) html += characterPrefix + '&nbsp;' + characterSuffix;
    } else {
      if(char == ' ') char = '&nbsp;';
      html += characterPrefix + char + characterSuffix;
    }
  }

  return html;
}

const  colorizeHTML = function(page, word) {
  let htmlWord = word.length==0 ? '' : characterizeWord(page, word);
  
  if(isNumber(word)) {
    htmlWord = `<div class="${valueColor}">` + htmlWord + '</div>';
  } else {
    let color = colorMap[word];
    if(color != undefined) {
      // let prefix = ``
      htmlWord = `<div class="${color.className}">` + htmlWord + '</div>';
    }
  }
  return htmlWord;
}

const colorizeString = function(page, text) {
  let htmlLine = "";
  let char, word="";
  
  for(let i = 0; i < text.length; i++) {
    
    char = text.charAt(i);

    // WORKAROUND
    // &nbsp; is stored for SPACE(ASCII: 32) in HTML, hence, replaced (char)160 with (char)32
    if(char.charCodeAt(0) == 160) char = ' ';
    
    if(isWordBreak(char)) {
      
      // WORKAROUND
      // coz HTML handles spaces differently
      htmlLine += colorizeHTML(page, word);
      htmlLine += characterizeWord(page, char);
      word = "";
    } else if(i == text.length-1) {
      word = word + char;
      htmlLine += colorizeHTML(page, word);
    } else {
      word = word + char;
    }
  }
  return htmlLine;
}

const colorizeLine = function(page, text) {
  // TODO handle multiple line coloring
  let html = '';
  let slCommentIndex = text.indexOf('//');

  if(slCommentIndex != -1) {

    let prefix = text.substring(0, slCommentIndex);
    prefix = colorizeString(page, prefix);
    
    let suffix = text.substring(slCommentIndex);
    suffix = characterizeWord(page, suffix);

    let color = getColorClass(singleLineCommentKey);
    html = prefix + `<div class=${color.className}">` + suffix + '</div>';
  } else {
    html = colorizeString(page, text);
  }
  // console.log(html);
  return html;

}

