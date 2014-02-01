// A view is a component of a scene that knows how to render itself.
// It may be composed of layers and is rendered to a viewport via a camera.
//
// Layers are arranged by zOrder, with order 0 at the front of the screen, and
// high-ordered layers moving further to the rear of the view.

joe.Scene.View = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  width: 0,
  height: 0,
  camera: null,
  layers: [],
  workPos: {x:0, y:0},

  init: function(width, height, viewportWidth, viewportHeight) {
    this.width = width;
    this.height = height;
    this.camera = new joe.Scene.Camera(viewportWidth, viewportHeight);

    this.setWorldPos(0, 0);
    this.setSourcePos(0, 0);
  },

  getViewport: function() {
    return this.camera;
  },

  setWorldPos: function(x, y) {
    if (this.camera) {
      this.camera.setDestPosition(x, y);
    }
  },

  getWorldPos: function(x, y) {
    this.workPos.x = x;
    this.workPos.y = y;
    
    return this.camera.viewToWorldPos(this.workPos);
  },

  setSourcePos: function(x, y) {
    if (this.camera) {
      this.camera.setSourcePosition(x, y);
    }
  },

  getBounds: function() {
    return this.camera.getScreenRect();
  },

  draw: function(gfx) {
    var iLayer = 0,
        camGfx = null;

    joe.assert(this.camera);

    camGfx = this.camera.getGraphics();
    camGfx.save();

    // Render layers into the camera's buffer.
    for (iLayer=this.layers.length-1; iLayer>=0; --iLayer) {
      this.layers[iLayer].layer.drawClipped(this.camera.getGraphics(),
                                            this.camera.getSourceRect(),
                                            this.camera.getMagnification());
    }

    // Draw the camera's buffer into the primary buffer.
    if (this.layers.length) {
      this.camera.draw(gfx);
    }

    camGfx.restore();
  },

  addLayer: function(layer, zOrder) {
    var iLayer = 0,
        bInserted = false;

    joe.assert(layer);

    for (iLayer=0; iLayer<this.layers.length; ++iLayer) {
      if (this.layers[iLayer].zOrder >= zOrder) {
        // Insert the layer at this point in the array;
        this.layers.splice(iLayer, 0, {layer:layer, zOrder:zOrder});
        layer.setParent(this);
        bInserted = true;
        break;
      }
    }

    if (!bInserted) {
      this.layers.push({layer:layer, zOrder:zOrder});
      layer.setParent(this);
    }
  }
});


