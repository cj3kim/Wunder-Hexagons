var Surface  = require('famous/core/Surface');
var View     = require('famous/core/View');

function BubbleView() {
  View.apply(this, arguments);
};

BubbleView.prototype = Object.create(View.prototype);
BubbleView.prototype.constructor = BubbleView;


module.exports = BubbleView;
