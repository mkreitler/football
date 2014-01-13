// Draws custom shapes into the specified Graphics context.

// Arrow containing 6 vertices, default orientation along positive x-axis.
fb.SixPointArrow = {
  SIX_POINT_ARROW_MIN_HEAD_SIZE: 12,
  DEFAULT_LINE_COLOR: "#006600",
  DEFAULT_FILL_COLOR: "#FFFFFF",
  DEFAULT_LINE_WIDTH: 2,

  draw: function(gfx, originX, originY, length, lineColor, fillColor, lineWidth, minHeadSize) {
    var headLength = Math.abs(minHeadSize || this.SIX_POINT_ARROW_MIN_HEAD_SIZE),
        headWidth = Math.abs(minHeadSize || this.SIX_POINT_ARROW_MIN_HEAD_SIZE);

    if (length < 2 * this.SIX_POINT_ARROW_MIN_HEAD_SIZE) {
      headLength = length * 0.5;
      headWidth = length * 0.5;
    }

    gfx.strokeStyle = lineColor || this.DEFAULT_LINE_COLOR;
    gfx.fillStyle = fillColor || this.DEFAULT_FILL_COLOR;
    gfx.lineWidth = lineWidth || this.DEFAULT_LINE_WIDTH;

    gfx.beginPath();

    gfx.moveTo(originX, originY - headWidth * 0.25);
    gfx.lineTo(originX + length - headLength, originY - headWidth * 0.25);
    gfx.lineTo(originX + length - headLength, originY - headWidth * 0.5);
    gfx.lineTo(originX + length, originY);
    gfx.lineTo(originX + length - headLength, originY + headWidth * 0.5);
    gfx.lineTo(originX + length - headLength, originY + headWidth * 0.25);
    gfx.lineTo(originX, originY + headWidth * 0.25);

    gfx.closePath();
    gfx.fill();
    gfx.stroke();
  }
};