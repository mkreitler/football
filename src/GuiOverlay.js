// Manages the text and graphics for player Actions.

fb.GuiOverlay = new joe.ClassEx({
  // Static Definition ////////////////////////////////////////////////////////
},
[
  // Instance Definition //////////////////////////////////////////////////////
  joe.Scene.LayerInterface,

  {

    font: null,
    scoreWidth: 0,
    LINE_WIDTH: 4,

    init: function(font, scoreWidth) {
      this.font = font;
      this.scoreWidth = scoreWidth;
    },

    drawClipped: function(gfx, clipRect, scale) {
      var x = clipRect.w * 0.5 - this.scoreWidth * 0.5 + this.LINE_WIDTH * 0.5,
          y = fb.GameClass.WINDOW.MARGIN_VERTICAL + this.LINE_WIDTH * 0.5,
          w = this.scoreWidth - this.LINE_WIDTH,
          h = fb.GameClass.WINDOW.BOARD_HEIGHT - this.LINE_WIDTH;

      gfx.save();

      gfx.lineWidth = this.LINE_WIDTH;
      gfx.strokeStyle = "#ffffff";
      gfx.beginPath();
      gfx.rect(x, y, w, h);
      gfx.stroke();

      gfx.restore();

      this.font.draw(gfx, "SCORE!", x + w * 0.5, y + h * 0.5, joe.Resources.BitmapFont.ALIGN.CENTER);
    }
  }
]);

