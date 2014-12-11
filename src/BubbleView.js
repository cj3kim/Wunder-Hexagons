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

function BubbleView() {
  View.apply(this, arguments);

  var self = this;
  var bubbles = bubblify();
  var sortedBubbles = _.sortBy(bubbles, function (bubble) {
    return bubble.surface.bubble_order;
  });

  for (var i = 0; i < sortedBubbles.length; i += 1) {
    var bubble = sortedBubbles[i];
    this.add(bubble.renderNode)
  }

  function _showNext(index) {
    if (index === sortedBubbles.length) {
      self._eventOutput.emit('finishedBubbling');
    } else {
      var surface = sortedBubbles[index].surface;
      var rc = surface.renderController;
      var nextIndex = index + 1;

      rc.show(surface, {duration: 150}, _showNext.bind(this, nextIndex));
    }
  }

   _showNext(0)

  console.log(this);
};

BubbleView.prototype = Object.create(View.prototype);
BubbleView.prototype.constructor = BubbleView;

function createBubble(coordinates, size, properties) {
  var x = coordinates[0];
  var y = coordinates[1];
  var z = coordinates[2];

  var renderNode = new RenderNode();

  var draggable = new Draggable();

  var bubbleMod = new StateModifier({
    transform: Transform.translate(x, y, z)
  });

  function genString (size, currentPosition, properties) {
    //var string =  "<span style='display: inline-block; color: white;  margin-top:"+ size[1]/2 + "px; margin-left: " + (size[0]/2 - 50) + "px;'>" + currentPosition + ", z-index: " + properties.zIndex + " " + "</span>";
    var string = "";
    return string
  }

  var defaultProperties = {
      borderRadius: '50%'
    , border: '4px solid white'
  };
  var mergedProps = objectMerge(defaultProperties, properties);

  var surface = new Surface({
    size: size
    , content: genString(size, [x,y], properties)
    , properties: mergedProps
  });

  var renderController = new RenderController();
  surface.renderController = renderController;

  var trans = {
    //method: 'snap',
    period: 300,
    dampingRatio: 0.3,
    velocity: 0
  };
  surface.pipe(draggable);

  draggable.on('update', function () {
    var deltaPosition = this.getPosition();
    var dX =  deltaPosition[0];
    var dY =  deltaPosition[1];

    var currentPosition = [x + dX, y + dY];
    var span = genString(size, currentPosition, properties)

    surface.setContent(span);
    console.log(surface);
  });
  
  renderNode.add(bubbleMod).add(renderController).add(surface);

  return { renderNode:renderNode, surface: surface };
}

function bubblify () {
  var bubbles = [];
  var properties = { backgroundColor: 'blue' , zIndex: 1000 };
  var b1 = createBubble([-5, 34, 0], [300, 300], properties);
  b1.surface.bubble_order = 6;
  bubbles.push(b1);

  var properties = { backgroundColor: 'red' , zIndex: 3000 };
  var b2 = createBubble([201, 197, 0], [200, 200], properties);
  b2.surface.bubble_order = 5;
  bubbles.push(b2);

  var properties = { backgroundColor: 'green' , zIndex: 2000 };
  var b3 = createBubble([44, 298, 0], [200, 200], properties);
  b3.surface.bubble_order = 4;
  bubbles.push(b3);

  var properties = { backgroundColor: 'purple' , zIndex: 3500 };
  var b4 = createBubble([205, 422, 0], [75, 75], properties);
  b4.surface.bubble_order = 3;
  bubbles.push(b4);

  var properties = { backgroundColor: 'teal' , zIndex: 4000 };
  var b5 = createBubble([223, 372, 0], [75, 75], properties);
  b5.surface.bubble_order = 2;
  bubbles.push(b5);

  var properties = { backgroundColor: 'gray' , zIndex: 3500 };
  var b6 = createBubble([282, 377, 0], [75, 75], properties);
  b6.surface.bubble_order = 1;
  bubbles.push(b6);

  var properties = { backgroundColor: 'blue' , zIndex: 3000 };
  var b7 = createBubble([264, 430, 0], [75, 75], properties);
  b7.surface.bubble_order = 0;
  bubbles.push(b7);
  return bubbles
}
module.exports = BubbleView;

