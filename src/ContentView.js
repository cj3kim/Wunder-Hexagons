var Surface  = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var View     = require('famous/core/View');
var BubbleView = require('./BubbleView.js');
var RenderController = require("famous/views/RenderController");

function ContentView() {
    View.apply(this, arguments);

    var renderController = new RenderController();

    var textSurfaceMod = new Modifier({
      transform: Transform.translate(250, 100, 0)
    });

    var textSurface = new Surface({
        size: [500, 600]
      , properties: {
        backgroundColor: 'brown'
      }
    });

    this._eventInput.on('finishedBubbling', function () {
      console.log('finishedBubbling');
      renderController.show(textSurface);
    });


    this.add(textSurfaceMod).add(renderController);

    this.bubbleView  = new BubbleView();
    var baseX = 600;
    var bubbleMod = new Modifier({
        transform: Transform.translate(baseX + 200, 50, 0)
    });
    this.add(bubbleMod).add(this.bubbleView);
    this.bubbleView.pipe(this)
};

ContentView.prototype = Object.create(View.prototype);
ContentView.prototype.constructor = ContentView;


module.exports = ContentView;
