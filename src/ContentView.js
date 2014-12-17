var Surface  = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var View     = require('famous/core/View');
var BubbleView = require('./BubbleView.js');
var RenderController = require("famous/views/RenderController");
var TextView = require('./TextView.js');
var Timer            = require('famous/utilities/Timer');

var hexagon = require('./hexagon.js');

function ContentView() {
    View.apply(this, arguments);

    var _this = this;
    this.setupSurfaces();
    this.setupPiping();

    this._eventInput.on('hide-ContentView', function () {
      this._eventOutput.emit('hide-BubbleView');
      this._eventOutput.emit('hide-TextView');
    }.bind(this));

    this._eventInput.on('show-ContentView', this.showContentView.bind(this));
};

ContentView.prototype = Object.create(View.prototype);
ContentView.prototype.constructor = ContentView;

ContentView.prototype.setCurrentSurface = function (surface) {
  this.currentSurface = surface;
}

ContentView.prototype.showContentView = function (clickedSurface) {
  var sm = clickedSurface.sm
  var surfaceRc = clickedSurface.rc;
  sm.setTransform(Transform.translate(0,100, 0), {duration: 0});
  surfaceRc.show(clickedSurface);

  this.setCurrentSurface(clickedSurface);

  this.rc.show(this, function () {
    this._eventOutput.emit('start-BubbleView');
  }.bind(this));
};

ContentView.prototype.setupPiping = function () {
    this.textView.pipe(this);
    this.bubbleView.pipe(this.textView);

    this.pipe(this.bubbleView);
    this.pipe(this.textView);
}

ContentView.prototype.setupSurfaces = function () {
    var _this = this;
    this.rc = new RenderController();
    var d3_svg = hexagon.createSVG('Done');

    var exitSurfaceMod = new Modifier({
      transform: Transform.translate(0, 250, 0)})
    this.exitSurface = new Surface({
      size: [107, 114],
      content: d3_svg.node(),
      classes: ['backfaceVisibility'],
    });
    this.add(exitSurfaceMod).add(this.exitSurface)

    this.exitSurface.on('click', function () {
      _this.rc.hide({duration: 1000}, function () {
        _this.currentSurface.rc.hide({duration:500}, function () {
          Timer.setTimeout(function () {
            _this._eventOutput.emit("hidden-ContentView");
          }, 300);
        });
      });
    });

    this.textView = new TextView();
    var textSurfaceMod = new Modifier({
      transform: Transform.translate(150, 100, 0)
    });

    this.add(textSurfaceMod).add(this.textView);

    this.bubbleView  = new BubbleView();
    var baseX = 600;
    var bubbleMod = new Modifier({
        transform: Transform.translate(baseX + 100, 50, 0)
    });

    this.add(bubbleMod).add(this.bubbleView);
}


module.exports = ContentView;
