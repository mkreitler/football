// Manages the text and graphics for player Actions.

fb.ActionOverlay = new joe.ClassEx({
  // Static Definition ////////////////////////////////////////////////////////
},
[
  // Instance Definition //////////////////////////////////////////////////////
  joe.View.LayerInterface,

  {
    actionCircle: {x:0, y:0, r:0, bActive: false},
    font: null,

    init: function(font) {
      this.font = font;
    },

    updateActionCircle: function(bActive, x, y, radius) {
      this.actionCircle.bActive = bActive;

      if (bActive) {
        this.actionCircle.x = x || 0;
        this.actionCircle.y = y || 0;
        this.actionCircle.r = radius || 0;
      }
    },

    drawClipped: function(gfx, clipRect, scale) {
      var screenRect = this.parent ? this.parent.getBounds() : null;

      if (screenRect && this.actionCircle.bActive && this.font) {
        this.font.draw(gfx, "ACTION!", screenRect.w / 2, screenRect.h / 2, joe.Resources.BitmapFont.ALIGN.CENTER);

        joe.GUI.Ring.drawClipped(gfx, clipRect,
                                 this.actionCircle.x - screenRect.x,
                                 this.actionCircle.y - screenRect.y,
                                 this.actionCircle.r,
                                 6,
                                 "#FFFFFF",
                                 0.33);
      }
    }
  }
]);

