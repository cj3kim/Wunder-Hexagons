  define('main', function (require, exports, module) {
  var Engine = require("famous/core/Engine");
  var Surface = require("famous/core/Surface");
  var Modifier = require("famous/core/Modifier");
  var Transform = require("famous/core/Transform");
  var RenderController = require("famous/views/RenderController");
  var ContainerSurface = require("famous/surfaces/ContainerSurface");
  var Scrollview = require("famous/views/Scrollview");
  var GridLayout = require("famous/views/GridLayout");

  var mainContext = Engine.createContext();

  var container = new ContainerSurface({
    size: [400, 400],
    properties: {
      overflow: 'hidden',
      backgroundColor: "hsl(" + (100 * 360 / 40) + ", 100%, 50%)"
    }
  });
  var grid = new GridLayout({
    dimensions: [10, 10],
    gutterSize: [1, 1]
  });

  var surfaces = [];
  grid.sequenceFrom(surfaces);

  var temp;
  for (var i = 0; i < 100; i++) {
    rc = new RenderController();
    rc.surface = new Surface({
      size: [40, 40],
      content: '' + (i + 1),
      properties: {
        textAlign: 'center',
        lineHeight: '40px',
        backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)"
      }
    });

    surfaces.push(rc);
    rc.show(rc.surface)
  }

  container.add(grid);

  mainContext.add(new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  })).add(container);

  function _hideNext(index) {
    if (index === surfaces.length) {
      //do something final
      _showNext(0);
    } else {
      var rc = surfaces[index];
      var nextIndex = index + 1;
      rc.hide(rc.surface, _hideNext.bind(this, nextIndex));
    }
  }

  function _showNext(index) {
    if (index === surfaces.length) {
      //do something final
      _hideNext(0);
    } else {
      var rc = surfaces[index];
      var nextIndex = index + 1;
      rc.show(rc.surface, _showNext.bind(this, nextIndex));
    }
  }

  _hideNext(0);

});
