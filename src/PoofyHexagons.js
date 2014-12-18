
var View         = require('famous/core/View');
var Timer        = require('famous/utilities/Timer');
var EventEmitter = require('famous/core/EventEmitter');
var _ = require('underscore');

function PoofyHexagons() {
  View.apply(this, arguments);
};

PoofyHexagons.prototype = Object.create(View.prototype);
PoofyHexagons.prototype.constructor = View;

PoofyHexagons.prototype.disappear = function (surfaces, clickedSurface) {
  var _this = this;
  var transition = {duration: 500};
  var greySurfaces    = _.shuffle(_.where(surfaces,  {colored: false}));
  var coloredSurfaces = _.shuffle(_.where(surfaces, {colored: true}));

  function getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }

  function greyDisappear() {
    var greyHiddenCount = 0;

    for (var i = 0; i < greySurfaces.length; i += 1) {
      var surface = greySurfaces[i];
      var rc = surface.rc;

      var fn = (function (s, rc) { 
        return function () { Timer.setTimeout(function () {
          rc.hide(transition, function () {
            greyHiddenCount += 1;
            if (greyHiddenCount === greySurfaces.length) {
              colorDisappear();
            }
          });
        }, getRandomArbitrary(200,500)); };
      })(surface, rc);

      fn();
    }

  }

  function colorDisappear() {
    var colorHiddenCount = 0;

    for (var i = 0; i < coloredSurfaces.length; i += 1) {
      var surface = coloredSurfaces[i];
      var rc = surface.rc;

      var fn = (function (s, rc) { 
        return function () { Timer.setTimeout(function () {
          colorHiddenCount += 1;
          if (s.id !== clickedSurface.id) {
              rc.hide(transition, function () {
                if (colorHiddenCount === coloredSurfaces.length) {
                  _this._eventOutput.emit('finishedPoof', clickedSurface)
                }
              });
          }
        }, getRandomArbitrary(200,500)); };
      })(surface, rc);

      fn();
    }
  }

  greyDisappear();

}

module.exports = PoofyHexagons;
