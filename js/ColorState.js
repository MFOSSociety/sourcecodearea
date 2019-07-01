function ColorState(startKey, endKey, color) {
  this.startKey = startKey;
  this.endKey = endKey;
  this.color = color;
  this.openStatus = false;
}

ColorState.prototype = {
  constructor: ColorState,

  getStartKey: function() { return this.startKey; },
  getCloseKey: function() { return this.endKey; },
  getColor: function() { return this.color; },

  isOpen: function() { return this.openStatus; },
  open: function() { this.openStatus = true; },
  close: function() { this.openStatus = false; }
}