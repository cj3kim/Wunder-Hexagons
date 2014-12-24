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
var hexagon = require('./hexagon.js');

var Transitionable   = require('famous/transitions/Transitionable');
var Easing           = require('famous/transitions/Easing');
var TweenTransition = require('famous/transitions/TweenTransition');
TweenTransition.registerCurve('inSine', Easing.inSine);

function BubbleView() {
  View.apply(this, arguments);

  var self = this;
  var bubbles = this.bubblify();

  for (var i = 0; i < bubbles.length; i += 1) {
    var bubble = bubbles[i];
    this.add(bubble.renderNode)
  }

  this._eventInput.on('start-BubbleView', function (jsonData) {
    this.showBubbles(jsonData);
  }.bind(this));

  this._eventInput.on('hide-BubbleView', function () {
    for (var i = 0; i < bubbles.length; i += 1) {
      var surface = bubbles[i].surface;
      var rc = surface.renderController;
      rc.hide({duration: 0});
    }
  });


  this.showBubbles = function (jsonData) {
    var defaultBubbleCount = 4
    var imagesLength = jsonData.images.length
    var lastIndex = defaultBubbleCount - 1

    var topics = jsonData.topics;

    function _showNext(index) {
      if (index === -1) {
        self._eventOutput.emit('finishedBubbling', jsonData);
      } else {
        var surface = bubbles[index].surface;
        var rc = surface.renderController;
        var nextIndex = index - 1;

        surface.d3_svg.selectAll('defs').remove();
        surface.d3_svg.selectAll('text').text('');

        function getRandomArbitrary(min, max) { return Math.floor(Math.random() * (max - min) + min); }
        var rgb = _.template('rgb(<%= r %>,<%= g %>,<%= b %>)')({
            r: getRandomArbitrary(0,255)
          , g: getRandomArbitrary(0,255)
          , b: getRandomArbitrary(0,255)
        });

        surface.d3_svg.select('path').attr('fill', rgb);

        if (topics) {
          if (topics[index]) {
            var words = topics[index].split(' ');

            surface.d3_svg.select('text').text(words[0]);
            surface.d3_svg.append('text')
              .attr('x', 23)
              .attr('y', 75)
              .attr('font-size', '20px')
              .attr('fill', 'white')
              .attr('text-align', 'center')
              .text(words[1])
              ;
          }
        } else {
          if (index < imagesLength) {
             var imagePath = jsonData.images[index];
             var imageFileName = imagePath.replace(/^.*[\\\/]/, '');

             applyPattern(surface.d3_svg, imageFileName, imagePath, {
               x:-10, y:0, width: 120, height: 120
             });
          }
        }
        rc.show(surface, {duration: 400}, _showNext.bind(this, nextIndex))
      }
    }
    _showNext.bind(this, lastIndex)();
  };


};

BubbleView.prototype = Object.create(View.prototype);
BubbleView.prototype.constructor = View;

BubbleView.prototype.createBubble = function createBubble(coordinates, size, properties) {
  var x = coordinates[0];
  var y = coordinates[1];
  var z = coordinates[2];

  var renderNode = new RenderNode();

  var bubbleMod = new StateModifier({
    transform: Transform.translate(x, y, z)
  });

  var defaultProperties = {};
  var mergedProps = objectMerge(defaultProperties, properties);

  var d3_svg = hexagon.createSVG();
  var surface = new Surface({
    size: size
    , content: d3_svg.node()
    //, properties: mergedProps
  });
  surface.d3_svg = d3_svg;
  surface.sm = bubbleMod;

  var renderController = new RenderController();

  renderController.inTransformFrom(function (progress) {
    var scaleValue = -0.3 * Math.sin(progress * (4*Math.PI ));
    var rotationMatrix = Transform.rotate(0, 0,scaleValue);
    var origin = Transform.aboutOrigin([50,50, 0], rotationMatrix);
    return origin;
  });
  surface.renderController = renderController;

  renderNode.add(bubbleMod).add(renderController).add(surface);
  return { renderNode:renderNode, surface: surface };
}

BubbleView.prototype.bubblify =  function bubblify () {
  var bubbles = [];
  var properties = { backgroundColor: 'blue' , zIndex: 1000 };

  var b1 = this.createBubble([-8, 51, 0], [100, 100], properties);
  b1.surface.bubble_order = 6;
  bubbles.push(b1);
  b1.surface.on('click', function () {
    this._eventOutput.emit('bubbleClicked', 0);
  }.bind(this));

  var properties = { backgroundColor: 'red' , zIndex: 3000 };
  var b2 = this.createBubble([46, 144, 0], [100, 100], properties);
  b2.surface.bubble_order = 5;
  bubbles.push(b2);

  b2.surface.on('click', function () {
    this._eventOutput.emit('bubbleClicked', 1);
  }.bind(this));

  var properties = { backgroundColor: 'green' , zIndex: 2000 };
  var b3 = this.createBubble([-8, 236, 0], [100, 100], properties);
  b3.surface.bubble_order = 4;
  bubbles.push(b3);

  b3.surface.on('click', function () {
    this._eventOutput.emit('bubbleClicked', 2);
  }.bind(this));

  var properties = { backgroundColor: 'purple' , zIndex: 3500 };
  var b4 = this.createBubble([46, 329, 0], [100, 100], properties);
  b4.surface.bubble_order = 3;
  bubbles.push(b4);

  return bubbles
}

function applyPattern(svg, patternId, href, settings) {
  var defs = svg.append('svg:defs');
  defs.append('svg:pattern')
    .attr('id', patternId)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', settings.width)
    .attr('height', settings.height)
    .append('svg:image')
    .attr('xlink:href', href)
    .attr('x', settings.x)
    .attr('y', settings.y)
    .attr('width', settings.width)
    .attr('height', settings.height);

  var urlString = _.template('url(#<%= patternId %>)')({patternId: patternId});
  svg.select('path').attr('fill', urlString);

  return svg;
}
module.exports = BubbleView;

