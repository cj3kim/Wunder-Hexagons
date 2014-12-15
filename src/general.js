var Surface        = require('famous/core/Surface');
var RenderNode     = require('famous/core/RenderNode');
var Modifier       = require('famous/core/Modifier');
var StateModifier  = require('famous/modifiers/StateModifier');
var Transform      = require('famous/core/Transform');
var Easing           = require('famous/transitions/Easing');

var View           = require('famous/core/View');
var ContentView    = require('./ContentView.js');
var PoofyHexagons  = require('./poofyHexagons.js');
var poofyHexagons  = new PoofyHexagons();

var RenderController = require('famous/views/RenderController');
var Timer            = require('famous/utilities/Timer');
var EventEmitter = require('famous/core/EventEmitter');
var _ = require('underscore');
var hexagon = require('./hexagon');

function General(mainContext) {
  View.apply(this, arguments);
  var _this = this;
  this.renderNodes = null;
  this.mainContext = mainContext;

  this.contentView = new ContentView();
  mainContext.add(this.contentView.rc);
  this.contentView.rc.add(this.contentview);

  this.contentView.pipe(this);

  this._eventInput.on('hidden-ContentView', function () {
    console.log('hidden-ContentView');
    _this.contentView.bubbleView._eventInput.emit('hide-BubbleView');
    _this.contentView.textView._eventInput.emit('hide-TextView');
    _this.startSecondAnimation(_this.renderNodes, true);
  });

  this._eventOutput.on('finished-InitialAnimation', function (renderNodes) {
    _this.startSecondAnimation(renderNodes);
  });

  this._eventOutput.on('finished-SecondAnimation', function (renderNodes) {
  });

  this._eventOutput.on('linkClick', function (surface) {
    console.log('Start linkClick flow');
    var sm = surface.sm;
    var rc = surface.rc;

    sm.setTransform(Transform.translate(100,100, 0), {duration: 300}, function () {
      var contentView = _this.contentView;
      var contentViewRc = contentView.rc;
      rc.show(surface);
      contentView.setCurrentSurface(surface);
      contentViewRc.show(contentView, function () {
        console.log('do i offend?');
        contentView.bubbleView.showBubbles();
      });
    });
  });
};

General.prototype = Object.create(View.prototype);
General.prototype.constructor = View;

General.prototype.convertHexagonsToSurfaces = function (hexagons) {
  var surfaces = [];

  for(var i=0; i< hexagons.length; i += 1) {
    var obj = hexagons[i];
    var x = obj.screenCoordinate.x;
    var y = obj.screenCoordinate.y;

    var d3_svg;

    console.log('colored: ' + obj.colored);
    console.log('linkName: ' + obj.linkName);

    obj.colored  ? d3_svg = hexagon.createSVG() : d3_svg = hexagon.createSVG();
    if (obj.linkName) {
       d3_svg = hexagon.createSVG(obj.linkName);
    }

    var surface = new Surface({
      size: [107, 114],
      content: d3_svg.node(),
      classes: ['backfaceVisibility'],
    });

    surface.d3_svg = d3_svg;
    surface.colored = obj.colored;
    surface.linkName = obj.linkName

    surface.screenCoordinate = obj.screenCoordinate;

    surface.offsetX = 180;
    surface.offsetY = 40;

    surfaces.push(surface);
  }

  return surfaces;
};

General.prototype.setInitialStates = function (surfaces) {
  var initialRenderNodes = [];

  for (var i = 0; i < surfaces.length; i += 1) {
    var surface = surfaces[i];
    var renderController = new RenderController();
    var x = surface.screenCoordinate.x;
    var y = surface.screenCoordinate.y;

    var stateModifier  = new StateModifier({transform: genRanTranslation(x,y)});

    stateModifier.setTransform(
      genRanTranslation(x,y), {duration: 2000, curve: Easing.inOutSine });

    var rotateModifier = new Modifier({transform :Transform.identity});

    surface.rc = renderController;
    surface.sm = stateModifier;
    surface.rm = rotateModifier;

    var renderNode = new RenderNode();
    renderNode.surface = surface;

    renderNode.add(rotateModifier).add(stateModifier).add(renderController);

    initialRenderNodes.push(renderNode);
  }
  this.renderNodes = initialRenderNodes;

  return initialRenderNodes;
};

General.prototype.startInitialAnimations = function (renderNodes) {
  var _this = this;
  var surfaceCount = renderNodes.length;
  var animationCount = 0;
  var rotationCount  = 0;

  for (var i = 0; i < renderNodes.length; i += 1) {
    var r = renderNodes[i]
    var surface = r.surface;
    var rc = surface.rc;

    _this.mainContext.add(r);

    rc.show(surface, {duration: 2000 },function () {
      animationCount += 1;
      rotationCount  += 1;

      if (animationCount === surfaceCount && rotationCount === surfaceCount) {
        console.log('finished-InitialAnimation');
        _this._eventOutput.emit('finished-InitialAnimation', renderNodes);
      }
    });
  }
};

General.prototype.startSecondAnimation = function (renderNodes) {
  if (arguments.length == 2) {
    //bool
    var reveal = arguments[1];
  }

  var surfaces = _.map(renderNodes, function (r) {return r.surface});
  var surfaceLength = surfaces.length;

  var rotationCount  = 0;
  var animationCount = 0;

  for (var i = 0; i < surfaces.length; i += 1) {
    var surface = surfaces[i];
    var rc = surface.rc;
    var rm = surface.rm;
    var sm = surface.sm;

    var x = surface.screenCoordinate.x;
    var y = surface.screenCoordinate.y;

    var offsetX = surface.offsetX;
    var offsetY = surface.offsetY;
    var randomX = getRandomArbitrary(-1200, 1200);
    var randomY = getRandomArbitrary(-1200, 1200);

    var duration = 1000
    var opacityDuration = 1000;

    var finishFn = function (count) {
      count += 1;
      if (rotationCount === surfaceLength && animationCount === surfaceLength) {
        _this._eventOutput.emit('finished-SecondAnimation', renderNodes)
      }
    };

    if (surface.colored) {
      rm.setTransform(Transform.rotate(0.0, 0.0, 0.0), {duration : duration}, finishFn.bind(this, rotationCount));
      sm.setTransform(Transform.translate(x + offsetX, y + offsetY, 0), { duration: duration}, finishFn.bind(this, animationCount));

    } else {
      if (reveal !== true) {
        sm.setTransform(Transform.translate(x + randomX, y + randomY, 0), {duration: duration});
      } else {
        sm.setTransform(Transform.translate(x + randomX, y + randomY, 0), {duration: 0});
      }
      sm.setTransform(Transform.translate(x + offsetX, y + offsetY, 0), {duration: duration}, finishFn.bind(this, animationCount));

      rm.setTransform(Transform.rotate(0.0, 0.0, 0.0), {duration: duration}, finishFn.bind(this, rotationCount));

      surface.d3_svg.transition().duration(opacityDuration).style('opacity', 0.3)
    }
    if (reveal) {
      rc.show(surface);
    }
  }
}

General.prototype.assignEvents = function (surfaces) {
  var _this = this;

  for (var i = 0; i < surfaces.length; i += 1) {
    var surface = surfaces[i];

    if (surface.linkName) {
      (function (surface) {
        var rc = surface.rc;
        var sm = surface.sm;

        surface.on('click', function () {
          poofyHexagons._eventOutput.on('finishedPoof', function () {
            Timer.setTimeout(function () {
              rc.hide({duration: 500}, function () {
                _this._eventOutput.emit('linkClick', surface)
              })
            }, 500);
          });

          poofyHexagons.disappear(surfaces, surface);
        });
      })(surface);
    }
  }
};

function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }

function genRanTranslation(x, y) {
  return Transform.translate(x + getRandomArbitrary(-800, 800), y + getRandomArbitrary(-800, 800),getRandomArbitrary(-800, 800) );
}

module.exports = General;
