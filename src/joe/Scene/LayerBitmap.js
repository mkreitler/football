// The BitmapLayer renders a single bitmap into a scene.
// This is useful for displaying a background, for example.

joe.Scene.LayerBitmap = new joe.ClassEx({
},
{
  requires: joe.Scene.LayerInterface,

  bitmap: null,

  init: function(bitmap) {
    joe.assert(bitmap instanceof Image);

    this.bitmap = bitmap;
  },

  drawClipped: function(gfx, srcRect, scale) {
    joe.assert(this.bitmap && this.bitmap instanceof Image);

    if (scale) {
      gfx.scale(scale, scale);
      gfx.drawImage(this.bitmap, srcRect.x, srcRect.y, srcRect.w, srcRect.h,
                    0, 0, srcRect.w, srcRect.h);
      gfx.scale(1, 1);
    }
  }
}
);

