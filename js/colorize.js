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

const  wordToHTML = function(word) {
  let htmlWord = word.length==0 ? '' : characterizeWord(word);
  
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

const colorizeLine = function(text, prevColorStateList) {
  // TODO handle multiple line coloring
  let htmlLine = "";
  let char, word="", htmlWord;
  
  for(let i = 0; i < text.length; i++) {
    
    char = text.charAt(i);

    // WORKAROUND
    // &nbsp; is stored for SPACE(ASCII: 32) in HTML, hence, replaced (char)160 with (char)32
    if(char.charCodeAt(0) == 160) char = ' ';
    
    if(isWordBreak(char)) {
      htmlWord = wordToHTML(word);
      
      // WORKAROUND
      // coz HTML handles spaces differently
      htmlLine += htmlWord;
      if(char == ' ') {
        char = '&nbsp;';
      }
      
      htmlWord = characterPrefix + char + characterSuffix;
      htmlLine += htmlWord;
      word = "";
    }  else if(i == text.length-1) {
      word = word + char;
      htmlWord = wordToHTML(word);
      htmlLine += htmlWord;

    }else {
      word = word + char;
      
    }
  }
  return htmlLine;
}

const characterizeWord = function(word) {
  let html = "";
  for(let i = 0; i < word.length; i++) {
    let char = word.charAt(i);
    html += characterPrefix + char + characterSuffix;
  }

  return html;
}