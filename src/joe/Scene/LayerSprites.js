// "Sprites" layers render sprites into a scene. Each sprite receives a z-order, with 0
// representing the foreground and higher numbers moving further into the background.
// Layers are responsible for calling 'update' and 'draw' for the sprites in their view.

// TODO: implement interface
// drawClipped(gfx, srcRect, scale) -- draws the layer and returns the bounds of the drawn area.

joe.Scene.SpriteLayer = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  requires: joe.Scene.LayerInterface,
  
  sprites: [],

  addSprite: function(sprite, zOrder) {
    // Insert at the start of all sprites with identical zOrder.
    var insertAt = zOrder || 0,
        i = 0,
        bInserted = false;

    for (i=0; i<this.sprites.length; ++i) {
      if (this.sprites[i].getZOrder() >= insertAt) {
        // Insert the sprite here.
        this.sprites.splice(i, 0, sprite);
        bInserted = true;
        break;
      }
    }

    if (!bInserted) {
      // Add to the end.
      this.sprites.push(sprite);
    }

    sprite.setZOrder(zOrder);
  },

  removeSprite: function(sprite) {
    joe.Utility.erase(this.sprites, sprite);
  },

  drawClipped: function(gfx, srcRect, scale) {
    var i=0;

    if (gfx && srcRect && scale) {
      // Loop through sprites from back to front...
      for (i=this.sprites.length - 1; i >= 0; --i) {

        // ...clip against the view and draw if visible.
        if (joe.MathEx.clip(srcRect, this.sprites[i].bounds)) {
          this.sprites[i].drawToWorld(gfx, srcRect.x, srcRect.y);
        }
      }
    }
  },
})