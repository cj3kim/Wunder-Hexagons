// load css
require('./styles');

// Load polyfills
require('famous-polyfills');

var hexagon = require('./hexagon').module;
var grid = require('./grid').module;
var d3 = require('d3');
var _ = require('underscore');

// import dependencies
var Engine = require('famous/core/Engine');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
Surface  = require('famous/core/Surface');
var StateModifier = require('famous/modifiers/StateModifier');
var Easing = require('famous/transitions/Easing');
var RenderController = require("famous/views/RenderController");
var RenderNode = require("famous/core/RenderNode");
var Timer = require('famous/utilities/Timer');
var ContentView = require('./ContentView.js');
var EventEmitter = require('famous/core/EventEmitter');

Transitionable = require('famous/transitions/Transitionable');
// create the main context
var mainContext = Engine.createContext();
mainContext.setPerspective(300);

var row = 8;
var col = 11;
var hexagons = grid.genOffsetGrid(row, col);

for (var i=0; i < hexagons.length; i++) {
  var obj = hexagons[i];
  grid.add_cube_attrs(obj);
}

var surfaces = [];

for(var i=0; i< hexagons.length; i += 1) {
  var obj = hexagons[i];
  var x = obj.screenCoordinate.x;
  var y = obj.screenCoordinate.y;

  var renderController = new RenderController();

  var colored = checkIfColored(obj, hexagon)
  if (colored) {
    var d3_svg = hexagon.createSVG('About');
  } else {
    var d3_svg = hexagon.createSVG();
  }

  var surface = new Surface({
    size: [107, 114],
    content: d3_svg.node(),
    classes: ['backfaceVisibility'],
  });

  if (colored) {
    (function () {
      surface.on('linkClick', function (ary) {
        var _surface          = ary[0];
        var _renderController = ary[1];
        var _stateMod         = ary[2];

        _stateMod.setTransform(Transform.translate(100,100, 0), {duration: 100}, function () {
          _renderController.show(_surface);

          var contentView = new ContentView();
          mainContext.add(contentView);
        });
      });
    })(surface);
  }

  surface.d3_svg = d3_svg;
  surface.colored = colored;
  surface.screenCoordinate = obj.screenCoordinate;

  surface.offsetX = 180;
  surface.offsetY = 40;

  var randomX = getRandomArbitrary(-1200, 1200);
  var randomY = getRandomArbitrary(-1200, 1200);
  var randomZ = getRandomArbitrary(-1200, 1200);

  var stateModifier  = new StateModifier({ transform: Transform.translate(x+randomX, y+randomY, randomZ) });
  var rotateModifier = new Modifier({transform : Transform.identity});
  rotateModifier.setTransform(Transform.rotate(0.8, 0.7, 0.0), {curve : 'linear', duration : 0});

  var renderNode = new RenderNode(stateModifier);
  renderNode.add(renderController);
  surface.renderController = renderController;

  surfaces.push([surface, renderController, rotateModifier, stateModifier]);


  var randomTranslation = genRanTranslation();
  //stateModifier.setTransform(randomTranslation, {duration: 1500, curve: Easing.inOutSine });

  var chain = mainContext.add(rotateModifier).add(renderNode);
  renderController.show(surface)

  if (colored) {
    (function (surface, renderController, stateModifier) {
      surface.on('click', function () {
        makeHexagonsGoPoof(surfaces, this);
        //the hexagon I clicked pops up in the upper left part of the screen

        Timer.setTimeout(function () {
          renderController.hide({duration: 200}, function () {
            surface.emit("linkClick", [surface, renderController, stateModifier]);
          });

        }, 1000)
      });
    })(surface, renderController, stateModifier);
  }
}

secondAnimation();

function secondAnimation () {
  Timer.setTimeout(function () {
  //Engine.on('click', function () {
    var duration = 1000;
    var opacityDuration = 0;
    var bgDuration = 0;
    //var localDuration = 600;
    var localDuration = 0;
    var easing = Easing.inOutSine

    var body = d3.select('body');
    body.transition().duration(bgDuration).style('background', '#161a21');

    for (var i = 0; i < surfaces.length; i += 1) {
      var ary = surfaces[i];
      var s = ary[0];
      var rc = ary[1];
      var rm = ary[2];
      var sm = ary[3]

      var x = s.screenCoordinate.x
      var y = s.screenCoordinate.y

      var offsetX = s.offsetX;
      var offsetY = s.offsetY;

      var randomX = getRandomArbitrary(-1200, 1200);
      var randomY = getRandomArbitrary(-1200, 1200);

      var colored = s.colored;
      if (colored === true) {
        rm.setTransform(Transform.rotate(0.0, 0.0, 0.0), {duration : localDuration});
        sm.setTransform(Transform.translate(x + offsetX, y + offsetY, 0), { duration: localDuration});
        //sm.setTransform(Transform.translate(x + offsetX, y + offsetY, 0), { duration: 500});
        //sm.setTransform(Transform.translate(x + offsetX, y + offsetY, 150), {duration: duration});
      } else {
        sm.setTransform(Transform.translate(x + randomX, y + randomY, 0), {duration: localDuration});
        sm.setTransform(Transform.translate(x + offsetX, y + offsetY, 0), {duration: localDuration });
        rm.setTransform(Transform.rotate(0.0, 0.0, 0.0), {duration: localDuration});
        s.d3_svg.transition().duration(opacityDuration).style('opacity', 0.3)
      }

    };

  }, 0)
};


function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }

function genRanTranslation() {
  return Transform.translate(x + getRandomArbitrary(-800, 800), y + getRandomArbitrary(-800, 800),getRandomArbitrary(-800, 800) );
}

function color_hexa_test(obj) {
  var colored_hexagons = [[3,1],[3,2],[2,2],[3,5],[3,6], [4,5], [4,4], [6,3], [5,4], [6,5], [7,3], [7,2], [8,3]]

  for (var i = 0; i < colored_hexagons.length; i += 1) {
    var ch = colored_hexagons[i]
    if (obj.coordinate[0] == ch[0] && obj.coordinate[1] == ch[1]) {
      return false;
    }
  }
  return true;
}

function checkIfColored(obj, hexagon) {
  var colored;
  color_hexa_test(obj) ? colored = false: colored = true;
  return colored;
}

function makeHexagonsGoPoof(surfaces, clickedSurface) {
  var transition = { duration: 200 };
  var coloredDuration = 400;

  //var surfaces = _.map(surfaces, function (ary) { return ary[0] });
  //var coloredSurfaces = _.shuffle(_.where(surfaces, {colored: true}));
  //var greySurfaces = _.shuffle(_.where(surfaces,{colored: false}));

  //var ee = new EventEmitter();

  //ee.on('startHideGray', function () {
    //console.log('started to hide gray');
    //_hideNext(0, greySurfaces, 'startHideColored')
  //});

  //ee.on('startHideColored', function () {
    //console.log('start to hide colored');
    //console.log(coloredSurfaces);
    //console.log(coloredSurfaces.length);
    //_hideNext(0, coloredSurfaces, 'none')
  //});
  

  //function _hideNext(index, _surfaces, eventType) {
    //if (index === _surfaces.length) {
      //console.log(eventType);
      //ee.emit(eventType);
    //} else {
      //var s  = _surfaces[index];
      //var rc = s.renderController;
      //var nextIndex = index + 1;

      //if (s.id !== clickedSurface.id) {
        //rc.hide({duration: 10}, _hideNext.bind(this, nextIndex, _surfaces, eventType));
      //} else {
        //_hideNext.bind(this, nextIndex, _surfaces, eventType)();
      //}
    //}
  //}

  //ee.emit('startHideGray');
  //ee.emit('startHideColored');


  for (var i = 0; i < surfaces.length; i += 1) {
    var s  = surfaces[i][0];
    var rc = surfaces[i][1];

    if (s.id !== clickedSurface.id) {
      var fn = (function (s, rc) { 
        //return function () { Timer.setTimeout(function () {rc.hide(transition)}, getRandomArbitrary(200,2000)); };
        return function () { Timer.setTimeout(function () {rc.hide(transition)}, getRandomArbitrary(2,20)); };
      })(s, rc);

      s.colored ? Timer.setTimeout(fn, coloredDuration) : fn();
    }
  }
}


