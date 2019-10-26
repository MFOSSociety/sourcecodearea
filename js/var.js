const characterPrefix = '<div class="character">';
const characterSuffix = '</div>';

const shiftKey = new Key(16);
const ctrlKey = new Key(17);
const altKey = new Key(18);
const capsLockKey = new Key(20);
const ignoreKeyList = [16, 17, 18];
const preventDefaultKeyList = [9, 32];
const mouseLeft = new Key(1);
const mouseMiddle = new Key(2);
const mouseRight = new Key(3);

const charMap = {
  '(': ')',
  '{' : '}',
  '[': ']',
  "'": "'",
  '"': '"'
};