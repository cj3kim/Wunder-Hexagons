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

function TextView() {
  View.apply(this, arguments);

  var _this = this;
  var renderController = new RenderController();
  var textSurfaces = this.generateTextSurfaces();

  this._eventInput.on('finishedBubbling', function (jsonData) {
    console.log('finishedBubbling');
    console.log(jsonData);
    //TODO update text surfaces here
    renderController.show(textSurfaces[0], function () {
      _this._eventOutput.emit('shown-TextView');
    });
  });

  this._eventInput.on('hide-TextView', function () {
    renderController.hide({duration: 0});
  });

  this._eventInput.on('bubbleClicked', function (textIndex) {
    renderController.show(textSurfaces[textIndex]);
  });

  this.add(renderController);
}

TextView.prototype = Object.create(View.prototype);
TextView.prototype.constructor = TextView;

TextView.prototype.generateTextSurfaces = function () {
  var textSurfaces = [];
  var colors = ['green', 'brown', 'white'];

  for (var i = 0; i < 3; i += 1) {
    var color = colors[i];

    var liSettings = {count: 1, units: 'paragraphs'};
    var compiled = _.template("<p> <%= l1 %> </p> <p> <%= l2 %> </p> <p> <%= l3 %> </p>");
    var text = compiled({
      l1: loremIpsum(liSettings),
      l2: loremIpsum(liSettings),
      l3: loremIpsum(liSettings), 
    });

    var textSurface = new Surface({
        size: [500, 600]
      , content: text
      , properties: {
            padding: '20px 30px'
          , backgroundColor: color
      }
    });

    textSurfaces.push(textSurface);
  }

  return textSurfaces;
}

module.exports = TextView
