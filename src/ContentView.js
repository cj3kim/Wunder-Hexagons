var Surface  = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var View     = require('famous/core/View');
var BubbleView = require('./BubbleView.js');
var RenderController = require("famous/views/RenderController");
var TextView = require('./TextView.js');

function ContentView() {
    View.apply(this, arguments);

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
