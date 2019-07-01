const characterPrefix = '<div class="character">';
const characterSuffix = '</div>';

const keywordPrefix = '<div class="keyword">';
const keywordSuffix = '</div>';

const valuePrefix = '<div class="value">';
const valueSuffix = '</div>';

var lineRef = [];
const defaultCaret = new Caret(0,1,1);
const shiftKey = new Key(16, '');
const ctrlKey = new Key(17, '');
const altKey = new Key(18, '');
const capsLockKey = new Key(20, '');
var ignoreKeyList = [16, 17, 18];
var tabSize = 4;