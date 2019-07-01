const characterPrefix = '<div class="character">';
const characterSuffix = '</div>';

const keywordPrefix = '<div class="keyword">';
const keywordSuffix = '</div>';

const valuePrefix = '<div class="value">';
const valueSuffix = '</div>';

var lineRef = [];
var defaultCaret = new Caret(0,1,1);
var shiftKey = new Key(16, '');
var ctrlKey = new Key(17, '');
var altKey = new Key(18, '');
var ignoreKeyList = [16, 17, 18];