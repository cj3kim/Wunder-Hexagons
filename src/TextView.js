var Surface    = require('famous/core/Surface');
var Transform  = require('famous/core/Transform');
var Draggable  = require("famous/modifiers/Draggable");
var View       = require('famous/core/View');
var RenderNode = require('famous/core/RenderNode');
var RenderController = require("famous/views/RenderController");
var Modifier   = require('famous/core/Modifier');
var StateModifier = require('famous/modifiers/StateModifier');
var objectMerge = require('object-merge');
var _ = require('underscore');
var loremIpsum = require('lorem-ipsum');
var Easing           = require('famous/transitions/Easing');

var Transitionable   = require('famous/transitions/Transitionable');
var SpringTransition = require('famous/transitions/SpringTransition');
Transitionable.registerMethod('spring', SpringTransition);


function TextView() {
  View.apply(this, arguments);

  var _this = this;
  var rotateModifier = new Modifier({transform : Transform.identity});
  var state = new Transitionable(0);

  rotateModifier.transformFrom(function () {
    var stateValue = 0.3 * Math.sin(state.get());
    return Transform.rotateX(stateValue);
  });

  var renderController = new RenderController();

  var defaultEndState = 1;
  renderController.inTransformFrom(function (progress) {
    var y = -500 * (defaultEndState - progress);
    var matrix = Transform.translate(0, y, 0);
    var rotateX = 2.0 * (defaultEndState - progress);
    var rotateMatrix = Transform.rotateX(rotateX);

    return Transform.multiply4x4(matrix, rotateMatrix);
  });

  renderController.outTransformFrom(function (progress) {
    var y = 500 * (defaultEndState - progress);
    var matrix = Transform.translate(0, y, 0);
    var rotateZ = 0.3 *(defaultEndState - progress);
    var rotateMatrix = Transform.rotateZ(rotateZ);
    return Transform.multiply4x4(matrix, rotateMatrix);

  });

  this.add(rotateModifier).add(renderController);

  var textSurfaces = this.generateTextSurfaces(state);

  this._eventInput.on('finishedBubbling', function (jsonData) {
    _this.text = jsonData.text;

    for (var i = 0; i < jsonData.text.length; i += 1) {
      textSurfaces[i].content = jsonData.text[i]
    }

    renderController.show(textSurfaces[0],{duration: 1000}, function () {
      _this._eventOutput.emit('shown-TextView');
    });
  });

  this._eventInput.on('hide-TextView', function () {
    renderController.hide({duration: 0});
  });

  this._eventInput.on('bubbleClicked', function (textIndex) {
    if (_this.text[textIndex]) {
      renderController.show(textSurfaces[textIndex]);
    }
  });

}

TextView.prototype = Object.create(View.prototype);
TextView.prototype.constructor = TextView;

TextView.prototype.generateTextSurfaces = function (state) {
  var textSurfaces = [];
  for (var i = 0; i < 3; i += 1) {

    var textSurface = new Surface({
        size: [500, 425]
      , content: ""
      , properties: {
            padding: '20px 30px'
          , backgroundColor:"#002637" 
          , borderRadius: '2%'
          , border: '2px solid white '
      }
    });

    textSurface.on('mouseenter', function () {
      state.set(0);
      state.set(3, {method : 'spring', dampingRatio : 0.5, period : 3000}); // spring
    });

    textSurfaces.push(textSurface);
  }

  return textSurfaces;
}

module.exports = TextView
