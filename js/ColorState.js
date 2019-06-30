function ColorState(startKey, endKey, color) {
  this.startKey = startKey;
  this.endKey = endKey;
  this.color = color;
  this.state = false;
}

ColorState.prototype = {
  constructor: ColorState,

  getStartKey: function() { return this.startKey; },
  getCloseKey: function() { return this.endKey; },
  getColor: function() { return this.color; },

  isOpen: function() { return this.state; },
  open: function() { this.state = true; },
  close: function() { this.state = false; }
}