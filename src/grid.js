function ScreenCoordinate(x, y) {
    this.x = x 
    this.y = y

    self = this;
    this.equals = function(p) { return self.x == p.x && self.y == p.y; }
    this.toString = function() { return self.x + "," + self.y; }
    this.length_squared = function() { return self.x * self.x + self.y * self.y; }
    this.length = function() { return Math.sqrt(length_squared()); }
    this.normalize = function() { var d = length(); return new ScreenCoordinate(self.x / d, self.y / d); }
    this.scale = function (d) { return new ScreenCoordinate(self.x*d, self.y*d)}
    this.rotateLeft = function() { return new ScreenCoordinate(self.y, -self.x); }
    this.rotateRight = function() { return new ScreenCoordinate(-self.y, self.x); }
    
    this.add = function(p) { return new ScreenCoordinate(self.x + p.x, self.y + p.y); }
    this.subtract = function(p) { return new ScreenCoordinate(self.x - p.x, self.y - p.y); }
    this.dot = function(p) { return self.x * p.x + self.y * p.y; }
    this.cross = function(p) { return self.x * p.y - self.y * p.x; }
    this.distance = function(p) { return self.subtract(p).length(); }
}

function cube_to_even_r (cube_coord) {
  var x = cube_coord[0];
  var y = cube_coord[1];
  var z = cube_coord[2];

  var q = x + (z + (z&1)) / 2
  var r = z
  return [q,r]
}

function coord(xyz) {
    var p = toScreen(x, y, z);
    return p.x + "," + p.y;
}

function toScreen(xyz, scale) {
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];

    var SQRT_3_2 = 0.585;
    var mscale   = 0.0001;

    return new ScreenCoordinate(scale * (x-y) * SQRT_3_2, scale * (mscale * (y+x) + z));
}

function even_r_to_cube(offset_coord) {
  var q = offset_coord[0];
  var r = offset_coord[1];

  var x = q - (r + (r&1)) / 2;
  var z = r;
  var y = -x-z;

  return [x,y,z]
}

function add_cube_attrs(obj) {
  function gen_color_val(min, max) { return Math.floor(Math.random() * (max - min)) + min;}
  var min = 0;
  var max = 255;
  var color =  "rgb("+gen_color_val(min,max) + "," + gen_color_val(min, max) + "," + gen_color_val(min,max)+")";

  var scale = 90;

  obj.colorValues = color;
  obj.size = [100, 57.74];

  var xyz = even_r_to_cube(obj.coordinate);
  obj.screenCoordinate = toScreen(xyz, scale);
}

function genOffsetGrid(row, col) {
  var grid = []
  for (var i=0; i<row; i++) {
    for (var j=0; j<col; j++) {
      var subgrid = {coordinate:[j, i]}
      grid.push(subgrid)
    }
  }
  return grid
}



exports.module = {genOffsetGrid: genOffsetGrid, add_cube_attrs:add_cube_attrs}
