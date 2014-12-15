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

var general = new General(mainContext);

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

