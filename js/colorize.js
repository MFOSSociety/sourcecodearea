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
    if(char == '\t') {
      for(let i = 0; i<page.tabSize; i++) html += characterPrefix + '&nbsp;' + characterSuffix;
    } else {
      if(char == ' ') char = '&nbsp;';
      html += characterPrefix + char + characterSuffix;
    }
  }

  return html;
}

const  wordToHTML = function(page, word) {
  let htmlWord = word.length==0 ? '' : characterizeWord(page, word);
  
  if(isNumber(word)) {
    htmlWord = valuePrefix + htmlWord + valueSuffix;
  } else {
    let p = colorMap[word];
    if(p != undefined) {
      htmlWord = p.prefix + htmlWord + p.suffix;
    }
  }
  return htmlWord;
}

const colorizeLine = function(page, text, prevColorStateList) {
  // TODO handle multiple line coloring
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
      htmlLine += wordToHTML(page, word);
      htmlLine += characterizeWord(page, char);
      word = "";
    } else if(i == text.length-1) {
      word = word + char;
      htmlLine += wordToHTML(page, word);
    } else {
      word = word + char;
    }
  }
  return htmlLine;
}

