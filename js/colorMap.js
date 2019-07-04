const keywordColor = 'keyword';
const valueColor = 'value';
const commentColor = 'comment';


var colorMap = {
  'abstract': { className: keywordColor },
  'assert': { className: keywordColor },
  'boolean': { className: keywordColor },
  'break': { className: keywordColor },
  'byte': { className: keywordColor },
  'case': { className: keywordColor },
  'catch': { className: keywordColor },
  'char': { className: keywordColor },
  'class': { className: keywordColor },
  'const': { className: keywordColor },
  'continue': { className: keywordColor },
  'default': { className: keywordColor },
  'do': { className: keywordColor },
  'double': { className: keywordColor },
  'else': { className: keywordColor },
  'enum': { className: keywordColor },
  'extends': { className: keywordColor },
  'final': { className: keywordColor },
  'finally': { className: keywordColor },
  'float': { className: keywordColor },
  'for': { className: keywordColor },
  'goto': { className: keywordColor },
  'if': { className: keywordColor },
  'implements': { className: keywordColor },
  'import': { className: keywordColor },
  'instanceof': { className: keywordColor },
  'int': { className: keywordColor },
  'interface': { className: keywordColor },
  'long': { className: keywordColor },
  'native': { className: keywordColor },
  'new': { className: keywordColor },
  'package': { className: keywordColor },
  'private': { className: keywordColor },
  'protected': { className: keywordColor },
  'public': { className: keywordColor },
  'return': { className: keywordColor },
  'short': { className: keywordColor },
  'static': { className: keywordColor },
  'strictfp': { className: keywordColor },
  'super': { className: keywordColor },
  'switch': { className: keywordColor },
  'synchronized': { className: keywordColor },
  'this': { className: keywordColor },
  'throw': { className: keywordColor },
  'throws': { className: keywordColor },
  'transient	': { className: keywordColor },
  'try': { className: keywordColor },
  'void': { className: keywordColor },
  'volatile': { className: keywordColor },
  'while	': { className: keywordColor },
  
  'true':{ className: valueColor, },
  'false': { className: valueColor, },
  'null': { className: valueColor, },

  // '//': { className: commentColor }
};

const singleLineCommentKey = '//';
colorMap[singleLineCommentKey] = { className: commentColor };
