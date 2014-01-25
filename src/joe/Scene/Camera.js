// The camera represents a 2D viewport, defined in terms of height and width,
// that determines which portion of a view gets rendered. The camera manages
// an image into which the visible portion of the associated view is rendered.

joe.Scene.Camera = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  canvas: null,
  destPos: {x:0, y:0},            // Position in the output buffer.
  viewRect: {x:0, y:0, w:0, h:0}, // Window into the layer, determines size of off-screen buffer.
  srcRect: {x:0, y:0, w:0, h:0},  // Window defining region of layer source to render into view buffer.
  drawRect: {x:0, y:0, w:0, h:0}, // Window we will draw: overlap between viewRect and screen buffer.
  magnification: 1,
  workPoint: {x:0, y:0},

  init: function(width, height) {
    this.viewRect.w = Math.max(1, width);
    this.viewRect.h = Math.max(1, height);

    this.clipToScreen();

    this.canvas = joe.Graphics.createOffscreenBuffer(this.viewRect.w, this.viewRect.h, false);
  },

  viewToWorldPos: function(localPos) {
    this.workPoint.x = localPos.x - this.viewRect.x;
    this.workPoint.y = localPos.y - this.viewRect.y;

    return this.workPoint;
  },

  clipToScreen: function() {
    var clipRect = {x:this.destPos.x, y:this.destPos.y, w:this.viewRect.w, h:this.viewRect.h},
        screenRect = {x:0, y:0, w:joe.Graphics.getWidth(), h:joe.Graphics.getHeight()};

    clipRect = joe.MathEx.clip(clipRect, screenRect);

    this.drawRect.x = clipRect.x;
    this.drawRect.y = clipRect.y;
    this.drawRect.w = clipRect.w;
    this.drawRect.h = clipRect.h;
  },

  getViewRect: function() {
    return this.viewRect;
  },

  getScreenRect: function() {
    return this.drawRect;
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

    this.clipToScreen();
  },

  setMagnification: function(newmagnification) {
    this.magnification = Math.max(0.0001, newmagnification);
  },

  // TODO: add functions to interpolate to new src and dest positions over time.

  getGraphics: function() {
    return this.canvas.getContext('2d');
  },

  draw: function(gfx) {
    if (gfx && this.canvas && this.drawRect.w >= 0 && this.drawRect.h >= 0) {
      gfx.drawImage(this.canvas,
                    0, 0, this.drawRect.w, this.drawRect.h,
                    this.drawRect.x, this.drawRect.y, this.drawRect.w, this.drawRect.h);
    }
  }
});

