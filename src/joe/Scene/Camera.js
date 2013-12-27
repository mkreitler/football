// The camera represents a 2D viewport, defined in terms of height and width,
// that determines which portion of a view gets rendered. The camera manages
// an image into which the visible portion of the associated view is rendered.

joe.Camera = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  canvas: null,
  destPos: {x:0, y:0},  // Position in the output buffer
  viewRect: {x:0, y:0, w:0, h:0},
  srcRect: {x:0, y:0, w:0, h:0},
  magnification: 1,

  init: function(width, height) {
    this.viewRect.w = Math.max(1, width);
    this.viewRect.h = Math.max(1, height);

    this.canvas = joe.Graphics.createOffscreenBuffer(this.viewRect.w, this.viewRect.h, false);
  },

  getViewRect: function() {
    return this.viewRect;
  },

  getSourceRect: function() {
    this.srcRect.x = this.viewRect.x;
    this.srcRect.y = this.viewRect.y;
    this.srcRect.w = this.viewRect.w / this.magnification;
    this.srcRect.h = this.viewRect.h / this.magnification;

    return this.srcRect;
  },

  getMagnification: function() {
    return this.magnification;
  },

  setSourcePosition: function(x, y) {
    this.viewRect.x = x;
    this.viewRect.y = y;
  },

  setDestPosition: function(x, y) {
    this.destPos.x = x;
    this.destPos.y = y;
  },

  setMagnification: function(newmagnification) {
    this.magnification = Math.max(0.0001, newmagnification);
  },

  // TODO: add functions to interpolate to new src and dest positions over time.

  getGraphics: function() {
    return this.canvas.getContext('2d');
  },

  draw: function(gfx) {
    if (gfx && this.canvas) {
      gfx.drawImage(this.canvas, this.destPos.x, this.destPos.y);
    }
  }
});

