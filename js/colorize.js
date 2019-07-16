const isWordBreak = function(char) {
  let ascii = char.charCodeAt(0);
  return !((ascii>=65 && ascii<=90) || (ascii>=97 && ascii<=122) || (ascii>=48 && ascii<=57) );
}

const getColorClass = function(word) {
  return colorMap[word];  
}

const isNumber = function(str) {
  let flag = false;
  for(let i=0;i<str.length;i++) {
    let c = str.charCodeAt(i);
    if(c<48 || c>57) return false;
    flag = true;
  }
  return flag;
}

const characterizeString = function(page, word) {
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

const  colorizeWord = function(page, word) {
  let htmlWord = word.length==0 ? '' : characterizeString(page, word);
  
  if(isNumber(word)) {
    htmlWord = `<div class="${valueColor}">` + htmlWord + '</div>';
  } else {
    let color = colorMap[word];
    if(color !== undefined) {
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
      htmlLine += colorizeWord(page, word);
      htmlLine += characterizeString(page, char);
      word = "";
    } else if(i == text.length-1) {
      word = word + char;
      htmlLine += colorizeWord(page, word);
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
    let suffix = characterizeString(page, text.substring(slCommentIndex));
    html = colorizeString(page, prefix) + `<div class="${getColorClass(singleLineCommentKey).className}">` + suffix + '</div>';
  } else {
    html = colorizeString(page, text);
  }

  return html;

}

