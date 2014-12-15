
var View       = require('famous/core/View');
var EventEmitter = require('famous/core/EventEmitter');
var _ = require('underscore');


function PoofyHexagons() {
  View.apply(this, arguments);
};

PoofyHexagons.prototype = Object.create(View.prototype);
PoofyHexagons.prototype.constructor = View;

PoofyHexagons.prototype.disappear = function (surfaces, clickedSurface) {
  var _this = this;

  var greySurfaces    = _.shuffle(_.where(surfaces,  {colored: false}));
  var coloredSurfaces = _.shuffle(_.where(surfaces, {colored: true}));

  var ee = new EventEmitter();

  console.log(greySurfaces);
  console.log(greySurfaces.length);

  ee.on('finishedPoof', function () {
    console.log('poofs have been finished');
    this._eventOutput.emit('finishedPoof');
  }.bind(_this));

  ee.on('startHideGray', function () {
    //console.log('started to hide gray');
    //console.log(greySurfaces);
    //console.log(greySurfaces.length);
    _hideNext(0, greySurfaces, 'startHideColored')
  });

  ee.on('startHideColored', function () {
    //console.log('start to hide colored');
    //console.log(coloredSurfaces);
    //console.log(coloredSurfaces.length);
    _hideNext(0, coloredSurfaces, 'finishedPoof')
  });
  

  function _hideNext(index, _surfaces, eventType) {
    console.log(_surfaces);
    if (index === _surfaces.length) {
      console.log(eventType);
      ee.emit(eventType);
    } else {
      var s  = _surfaces[index];
      var rc = s.rc;
      var nextIndex = index + 1;

      if (s.id !== clickedSurface.id) {
        rc.hide({duration: 10}, _hideNext.bind(this, nextIndex, _surfaces, eventType));
      } else {
        _hideNext.bind(this, nextIndex, _surfaces, eventType)();
      }
    }
  }

  ee.emit('startHideGray');

}

module.exports = PoofyHexagons;
