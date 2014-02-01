// Manages the text and graphics for player Actions.

fb.ActionOverlay = new joe.ClassEx({
  // Static Definition ////////////////////////////////////////////////////////
},
[
  // Instance Definition //////////////////////////////////////////////////////
  joe.Scene.LayerInterface,

  {
    actionCircle: {x:0, y:0, r:0, bActive: false},
    font: null,
    directionArrow: {x:0, y:0, length:0, angle:0, bActive: false, alpha: 0.5},

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

    updateDirectionArrow: function(x, y, length, angle, alpha) {
      this.directionArrow.bActive = true;
      this.directionArrow.x = x;
      this.directionArrow.y = y;
      this.directionArrow.length = length;
      this.directionArrow.angle = angle;
      this.directionArrow.alpha = alpha;
    },

    drawClipped: function(gfx, clipRect, scale) {
      var screenRect = this.parent ? this.parent.getBounds() : null;

      if (screenRect) {
        if (this.actionCircle.bActive && this.font) {
          this.font.draw(gfx, "ACTION!", screenRect.w / 2, screenRect.h / 2, joe.Resources.BitmapFont.ALIGN.CENTER);

          joe.GUI.Ring.drawClipped(gfx, null,
                                   this.actionCircle.x - clipRect.x,
                                   this.actionCircle.y - clipRect.y,
                                   this.actionCircle.r,
                                   6,
                                   "#FFFFFF",
                                   0.33);
        }

        if (this.directionArrow.bActive) {
          this.directionArrow.bActive = false;

          joe.GUI.Arrow.drawClipped(gfx, null,
                                    this.directionArrow.x, this.directionArrow.y,
                                    this.directionArrow.length, this.directionArrow.angle,
                                    "#ffffff", "#ffffff", this.directionArrow.alpha,
                                    2, 4)
        }
      }
    }
  }
]);

