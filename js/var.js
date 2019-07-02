const characterPrefix = '<div class="character">';
const characterSuffix = '</div>';

const defaultCaret = new Caret(0,1,1);
const shiftKey = new Key(16, '');
const ctrlKey = new Key(17, '');
const altKey = new Key(18, '');
const capsLockKey = new Key(20, '');
const ignoreKeyList = [16, 17, 18];

var tabSize = 4;
var lineRef = [];