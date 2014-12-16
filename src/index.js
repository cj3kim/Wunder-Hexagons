// load css
require('./styles');
// Load polyfills
require('famous-polyfills');

// import dependencies
var Engine           = require('famous/core/Engine');
var Surface          = require('famous/core/Surface');
var RenderNode       = require('famous/core/RenderNode');
var Modifier         = require('famous/core/Modifier');
var StateModifier    = require('famous/modifiers/StateModifier');
var Transform        = require('famous/core/Transform');
var Transitionable   = require('famous/transitions/Transitionable');

var EventEmitter     = require('famous/core/EventEmitter');
var Easing           = require('famous/transitions/Easing');
var Timer            = require('famous/utilities/Timer');

var hexagon = require('./hexagon');
var grid    = require('./grid').module;

var d3 = require('d3');
var _  = require('underscore');
var General = require('./general.js');

// create the main context
var mainContext = Engine.createContext();
mainContext.setPerspective(300);

var initialOffset = computeOffsetXY([window.screen.availWidth, window.screen.availHeight - 80]);
var windowTransition = new Transitionable(initialOffset);

var windowModifier = new Modifier({
  transform: function () {
    var offset = windowTransition.get();
    var x = offset[0];
    var y = offset[1];

    return Transform.translate(x, y, 0);
  }
});
var node = mainContext.add(windowModifier)

Engine.on('resize', function () {
  var size   = mainContext.getSize();
  resizeAdjustment(size);
});

function resizeAdjustment(size) {
   var offsetXY = computeOffsetXY(size);
   windowTransition.set(offsetXY, {duration: 100});
}

function computeOffsetXY(size) {
  var width  = size[0];
  var height = size[1];
  console.log('width');
  console.log(width);
  console.log('height');
  console.log(height);

  var hexagonWidth = 1210;
  var hexagonHeight = 744;
  var offsetX = (width - hexagonWidth)/2 + 50;
  var offsetY = (height - hexagonHeight)/2;
  console.log('offsetX');
  console.log(offsetX);
  console.log('offsetY');
  console.log(offsetY);

  var result = [offsetX, offsetY];
  console.log(result);
  return result;
}

var general = new General(node);
var row = 8;
var col = 11;

var hexagons = grid.genOffsetGrid(row, col);

for (var i=0; i < hexagons.length; i++) {
  var obj = hexagons[i];
  grid.add_cube_attrs(obj);
}

var surfaces    = general.convertHexagonsToSurfaces(hexagons);
var renderNodes = general.setInitialStates(surfaces);
general.assignEvents(surfaces);

//trigger animation chain
general.startInitialAnimations(renderNodes);


