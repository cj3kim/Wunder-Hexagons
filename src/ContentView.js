var Surface  = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var View     = require('famous/core/View');
var BubbleView = require('./BubbleView.js');
var RenderController = require("famous/views/RenderController");
var TextView = require('./TextView.js');

var hexagon = require('./hexagon.js');

function ContentView() {
    View.apply(this, arguments);
    var _this = this;

    this.rc = new RenderController();
    var d3_svg = hexagon.createSVG('Done');
    var exitSurfaceMod = new Modifier({
      transform: Transform.translate(100, 250, 0)})

    this.exitSurface = new Surface({
      size: [107, 114],
      content: d3_svg.node(),
      classes: ['backfaceVisibility'],
    });
    this.add(exitSurfaceMod).add(this.exitSurface)

    this.exitSurface.on('click', function () {
      _this.rc.hide({duration: 1000}, function () {
        _this._eventOutput.emit("hidden-ContentView");
      });
    });

    this.textView = new TextView();
    var textSurfaceMod = new Modifier({
      transform: Transform.translate(250, 100, 0)
    });

    this.add(textSurfaceMod).add(this.textView);

    this.bubbleView  = new BubbleView();
    var baseX = 600;
    var bubbleMod = new Modifier({
        transform: Transform.translate(baseX + 200, 50, 0)
    });
    this.add(bubbleMod).add(this.bubbleView);

    this.bubbleView.pipe(this.textView)
};

ContentView.prototype = Object.create(View.prototype);
ContentView.prototype.constructor = ContentView;


module.exports = ContentView;
