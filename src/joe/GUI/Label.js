/**
 * Renders a text label.
 */

joe.GUI.Label = new joe.ClassEx(
  // Static Definitions ////////////////////////////////////////////////////////
  {
    defaultSize: 30,
    defaultColor: "#ffffff",
    errorColor: "#ff00ff"
  },

  // Instance Definitions ///////////////////////////////////////////////////////
  {
    requires: joe.GUI.WidgetModule,

    buffer: null,
    context: null,
    anchor: {x:0, y:0}, // Upper left
    context: null,

    init: function(text, font, color, size, x, y, inputCallbacks, anchorX, anchorY) {
      var metrics = null,
          dx = 0,
          dy = 0;

      this.inputCallbacks = inputCallbacks || null;

      if (font && text) {
        metrics = font.measureText(text, size || joe.GUI.Label.defaultSize);
        dx = metrics.bounds.maxx - metrics.bounds.minx + 1;
        dy = metrics.fontsize;
      }
      else {
        dx = joe.GUI.Label.defaultSize;
        dy = dx;
      }

      x = x - dx * (anchorX || 0);
      y = y - dy * (anchorY || 0);

      this.AABBset(x, y, dx, dy);

      this.buffer = joe.Graphics.createOffscreenBuffer(dx, dy);

      context = this.buffer.getContext('2d');

      if (font && text) {
        // Render the text into the buffer.
        font.draw(context, text, 0, 0, color || joe.GUI.Label.defaultColor, "top", size || joe.GUI.Label.defaultSize);
      }
      else {
        context.fillColor = errorColor;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(dx, 0);
        context.lineTo(dx, dy);
        context.lineTo(0, dy);
        context.closePath();

        context.fill();
      }
    },

    update: function(dt, gameTime) {
      // Nothing to do here...yet.
    },

    draw: function(context, parentX, parentY) {
      context.drawImage(this.buffer, parentX + this.bounds.x, parentY + this.bounds.y);
    }
  }
);