// 2D animated game object, possibly with a collision model. Usually rendered
// as part of a SpriteLayer object (see LayerSprite.js).

joe.Sprite = new joe.ClassEx({

},
[
  joe.kinematicObject,
  joe.physicsCollider,
  {
    spriteSheet: null,
    align: {x:0, y:0},
    
    init: function(spriteSheet, alignX, alignY, x, y, vx, vy, ax, ay, blocksMask, blockedByMask) {
      this.spriteSheet = spriteSheet || null;
      this.align.x = alignX || 0;
      this.align.y = alignY || 0;

      this.kinInit(x, y, vx, vy, ax, ay);
      this.collideInit(x,
                       y,
                       this.spriteSheet ? this.spriteSheet.getCellWidth() : 0,
                       this.spriteSheet ? this.spriteSheet.getCellHeight() : 0,
                       blocksMask,
                       blockedByMask);

      // TODO: add collision callback?
    },

    draw: function(gfx) {
      joe.assert(this.spriteSheet);
    },

    update: function(dt, gameTime) {
      this.kinUpdate(dt);
      this.updateBounds(this.pos.x, this.pos.y);
    }
  }
]);

