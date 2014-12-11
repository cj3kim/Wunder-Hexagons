var Surface  = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var View     = require('famous/core/View');
var BubbleView = require('./BubbleView.js');

function ContentView() {
    View.apply(this, arguments);

    var textSurface = new Surface({
        size: [500, 600]
      , properties: {
        backgroundColor: 'brown'
      }
    });
    var textSurfaceMod = new Modifier({
      transform: Transform.translate(300, 100, 0)
    });

    this.add(textSurfaceMod).add(textSurface);

    this.bubbleView  = new BubbleView();
};

ContentView.prototype = Object.create(View.prototype);
ContentView.prototype.constructor = ContentView;


module.exports = ContentView;
