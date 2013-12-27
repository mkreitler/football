/**
 * Extend existing joe objects with this axis-aligned bounding box.
 */

joe.MathEx.AABB_SHARED = {x:0, y:0, width:0, height:0};
joe.MathEx.AABB_BOUNDS_KEY_MAP = {"0":"x", "1":"y", "2":"width", "3":"height"};

joe.MathEx.AABBmodule = {
  bounds: {x:0, y:0, width:0, height: 0},

  // Set bounds directly.
  AABBset: function(x, y, w, h) {
    this.bounds.x = x;
    this.bounds.y = y;
    this.bounds.width = w;
    this.bounds.height = h;
  },

  // Copy from another bounds object. Assumes the bounds will define
  // its fields in the order of x, y, width, and height, but may use
  // different names.
  AABBcopy: function(bounds) {
    var i = 0;
    var key = null;

    for (key in bounds) {
      bounds[key] = this.bounds[joe.MathEx.AABB_BOUNDS_KEY_MAP["" + i]]
      i += 1;
    }
  },

  AABBgetX: function() {
    return this.bounds.x;
  },

  AABBgetY: function() {
    return this.bounds.y;
  },

  // Generates bounds from a list of points. Assumes the points are
  // passed as an array of objects with 'x' and 'y' fields.
  AABBfromPoints: function(points) {
    var xMin = Number.POSITIVE_INFINITY;
    var yMin = Number.POSITIVE_INFINITY;
    var xMax = Number.NEGATIVE_INFINITY;
    var yMax = Number.NEGATIVE_INFINITY;
    var x = 0;
    var y = 0;
    var i = 0;

    for (i=0; i<points.length; ++i) {
      x = points[i].x;
      y = points[i].y;

      if (x < xMin) {
        xMin = x;
      }
      else if (x > xMax) {
        xMax = x;
      }

      if (y < yMin) {
        yMin = y;
      }
      else if (y > yMax) {
        yMax = y;
      }
    }

    this.bounds.x = xMin;
    this.bounds.y = yMin;
    this.bounds.width = xMax - xMin;
    this.bounds.height = yMax - yMin;
  },

  // Gets a reference to this object's 'bounds' field.
  // DANGEROUS: allows other objects to overwrite the bounds.
  AABBgetRef: function() {
    return this.bounds;
  },

  // Returns a copy of the bounds in a shared static object.
  // DANGEROUS: other calls to getVolatile will overwrite the
  // object returned in this function. It is best to copy the
  // results of getVolatile() immediately after the call.
  AABBgetVolatile: function() {
    this.copy(joe.MathEx.AABB_SHARED);

    return joe.MathEx.AABB_SHARED;
  },

  AABBoffset: function(dx, dy) {
    this.bounds.x += dx;
    this.bounds.y += dy;
  },

  AABBcontainsPoint: function(x, y) {
    return x >= this.bounds.x &&
           x <= this.bounds.x + this.bounds.width &&
           y >= this.bounds.y &&
           y <= this.bounds.y + this.bounds.height;
  },

  AABBdraw: function(ctx, color) {
    var color = color || "#ff0000";
    var context = ctx ? ctx : joe.Graphics.getActiveContext();

    if (context && color) {
      context.save();

      context.strokeStyle = color;
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(this.bounds.x, this.bounds.y);
      context.lineTo(this.bounds.x + this.bounds.width, this.bounds.y);
      context.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height);
      context.lineTo(this.bounds.x, this.bounds.y + this.bounds.height);
      context.closePath();

      context.stroke();

      context.restore();
    }
  }
};

joe.MathEx.AABB = new joe.ClassEx(null, [joe.MathEx.AABBmodule,
  {
    init: function(x, y, w, h) {
      this.AABBset(x, y, w, h);
    }
  }]
);


