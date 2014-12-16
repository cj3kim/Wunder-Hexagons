
var d3 = require('d3');

var h = (Math.sqrt(3)/2);
var radius = 50;
var xp     = 53.5;
var yp     = 57.5;

var hexagonData = [
    { "x": radius+xp,   "y": yp}, 
    { "x": radius/2+xp,  "y": radius*h+yp},
    { "x": -radius/2+xp,  "y": radius*h+yp},
    { "x": -radius+xp,  "y": yp}, { "x": -radius/2+xp,  "y": -radius*h+yp},
    { "x": radius/2+xp, "y": -radius*h+yp}
  ];

//returns a function
var drawHexagon = 
  d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("cardinal-closed")
        .tension("0.25");


var ranColor = function () { return Math.floor((Math.random() * 255) + 1) };
var ranRGB = function () {
  var string = "rgb(" + ranColor() + "," + ranColor() + "," + ranColor() + ")";
  return string;
}

var createSVG = function () {
  var text = ''
  if (arguments.length > 0) { text = arguments[0];}
  var color = ranRGB();
  var strokeColor = 'white';
  var d3_svg = d3.select(document.createElement('div')).append('svg')
             .attr('width',  105)
             .attr('height', 114)

  d3_svg.append("path").attr("d", drawHexagon(hexagonData))
             .attr('fill-opacity', 0.7)
             .attr("fill", color)
             .attr("stroke", strokeColor)
             //.attr("stroke-dasharray","20,5")
             .attr("stroke-width", 2)
             ;

  d3_svg.append('text')
    .attr('x', 23)
    .attr('y', 55)
    .attr('font-size', '20px')
    .attr('fill', 'white')
    .attr('text-align', 'center')
    .text(text)
    ;


  return d3_svg;
}

module.exports = {drawHexagon: drawHexagon, createSVG: createSVG}
