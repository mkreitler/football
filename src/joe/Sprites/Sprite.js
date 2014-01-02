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
    frameIndex: 0,
    
    init: function(spriteSheet, frameIndex, alignX, alignY, x, y, vx, vy, ax, ay, blocksMask, blockedByMask) {
      joe.assert(spriteSheet);

      this.spriteSheet = spriteSheet;
      this.spriteSheet.setAlignment(alignX, alignY);
      this.frameIndex = frameIndex || 0;

      this.kinInit(x, y, vx, vy, ax, ay);
      this.collideInit(x,
                       y,
                       this.spriteSheet ? this.spriteSheet.getCellWidth() : 0,
                       this.spriteSheet ? this.spriteSheet.getCellHeight() : 0,
                       blocksMask,
                       blockedByMask);

      // TODO: add collision callback?
    },

    setAlignment: function(alignX, alignY) {
      joe.assert(this.spriteSheet);
      this.spriteSheet.setAlignment(alignX, alignY);
    },

    setFrame: function(index) {
      this.frameIndex = index;
    },

    draw: function(gfx) {
      joe.assert(this.spriteSheet);

      this.spriteSheet.draw(gfx, this.pos.x, this.pos.y, this.frameIndex);
    },

    update: function(dt, gameTime) {
      this.kinUpdate(dt);
      this.updateBounds(this.pos.x, this.pos.y);
    },
  }
]);

