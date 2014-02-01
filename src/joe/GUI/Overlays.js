// Draws custom shapes into the specified Graphics context.

joe.GUI.Ring = {
  DEFAULT_THICKNESS: 4,
  DEFAULT_LINE_COLOR: "#000000",
  DEFAULT_FILL_COLOR: "#FFFFFF",
  bounds: {x:0, y:0, w:0, h:0},

  clip: function(clipRect) {
    return !clipRect || joe.MathEx.clip(this.bounds, clipRect);
  },

  drawClipped: function(gfx, clipRect, originX, originY, radius, thickness, lineColor, alpha) {
    this.bounds.x = originX - radius;
    this.bounds.y = originY - radius;
    this.bounds.w = 2 * radius;
    this.bounds.h = 2 * radius;

    if (!clipRect || this.clip(clipRect)) {
      gfx.strokeStyle = lineColor || this.DEFAULT_LINE_COLOR;
      gfx.lineWidth = thickness || this.DEFAULT_THICKNESS;
      gfx.globalAlpha = alpha;

      gfx.beginPath();
      gfx.arc(originX, originY, radius, 0, 2 * Math.PI, true); 
      gfx.stroke();
      gfx.closePath();

      gfx.globalAlpha = 1;
    }
  }
};

// Arrow containing 7 vertices, default orientation along positive x-axis.
joe.GUI.Arrow = {
  ARROW_MIN_HEAD_SIZE: 12,
  DEFAULT_LINE_COLOR: "#000000",
  DEFAULT_FILL_COLOR: "#FFFFFF",
  DEFAULT_LINE_WIDTH: 2,
  bounds: {x:0, y:0, w:0, h:0},
  points: [{x:0, y:0},
           {x:0, y:0},
           {x:0, y:0},
           {x:0, y:0},
           {x:0, y:0},
           {x:0, y:0},
           {x:0, y:0}],

  generatePoints: function(x, y, a, l, hl, hw) {
    var i = 0,
        xMin = 0,
        yMin = 0,
        xMax = 0,
        yMax = 0,
        cosA = joe.MathEx.cos(a),
        sinA = joe.MathEx.sin(a),
        newX = 0,
        newY = 0;

    this.points[0].x = 0;
    this.points[0].y = -hw * 0.25;

    this.points[1].x = l - hl;
    this.points[1].y = -hw * 0.25;

    this.points[2].x = l - hl;
    this.points[2].y = -hw * 0.5;

    this.points[3].x = l;
    this.points[3].y = 0;

    this.points[4].x = l - hl;
    this.points[4].y = hw * 0.5;

    this.points[5].x = l - hl;
    this.points[5].y = hw * 0.25;

    this.points[6].x = 0;
    this.points[6].y = hw * 0.25;

    // Transform and construct bounds.
    for (i=0; i<this.points.length; ++i) {
      newX = this.points[i].x * cosA - this.points[i].y * sinA;
      newY = this.points[i].x * sinA + this.points[i].y * cosA;
      this.points[i].x = x + newX;
      this.points[i].y = y + newY;
    }

    maxX = this.points[0].x;
    minX = maxX;
    maxY = this.points[0].y;
    minY = maxY;

    for (i=1; i<this.points.length; ++i) {
      if (this.points[i].x < minX) {
        minX = this.points[i].x;
      }
      else if (this.points[i].x > maxX) {
        maxX = this.points[i].x;
      }

      if (this.points[i].y < minY) {
        minY = this.points[i].y;
      }
      else if (this.points[i].y > maxY) {
        maxY = this.points[i].y;
      }
    }

    this.bounds.x = minX;
    this.bounds.y = minY;
    this.bounds.w = maxX - minX;
    this.bounds.h = maxY - minY;
  },

  clip: function(clipRect) {
    return !clipRect || joe.MathEx.clip(this.bounds, clipRect);
  },

  drawClipped: function(gfx, clipRect, originX, originY, length, angle, lineColor, fillColor, alpha, lineWidth, minHeadSize) {
    var headLength = Math.abs(minHeadSize || this.ARROW_MIN_HEAD_SIZE),
        headWidth = Math.abs(minHeadSize || this.ARROW_MIN_HEAD_SIZE),
        i = 0;

    if (alpha > joe.MathEx.EPSILON) {
      if (length < 2 * this.ARROW_MIN_HEAD_SIZE) {
        headLength = length * 0.5;
        headWidth = length * 0.5;
      }

      this.generatePoints(originX, originY, angle, length, headLength, headWidth);

      if (!clipRect || this.clip(clipRect)) {
        gfx.save();
        gfx.strokeStyle = lineColor || this.DEFAULT_LINE_COLOR;
        gfx.fillStyle = fillColor || this.DEFAULT_FILL_COLOR;
        gfx.lineWidth = lineWidth || this.DEFAULT_LINE_WIDTH;

        if (alpha < 1 - joe.MathEx.EPSILON) {
          gfx.globalAlpha = alpha;
        }

        gfx.beginPath();

        gfx.moveTo(this.points[0].x, this.points[0].y);
        for (i=1; i<this.points.length; ++i) {
          gfx.lineTo(this.points[i].x, this.points[i].y);
        }

        gfx.closePath();
        gfx.fill();
        gfx.stroke();
        gfx.restore();
      }
    }
  }
};