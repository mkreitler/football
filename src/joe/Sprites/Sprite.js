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
    zOrder: 0,
    
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

    setZOrder: function(zOrder) {
      this.zOrder = zOrder;
    },

    getZOrder: function() {
      return this.zOrder;
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

    drawToWorld: function(gfx, worldX, worldY) {
      joe.assert(this.spriteSheet);

      this.spriteSheet.draw(gfx, this.pos.x - worldX, this.pos.y - worldY, this.frameIndex);
    },

    update: function(dt, gameTime) {
      this.kinUpdate(dt);
    },

    setPos: function(x, y) {
      this.pos.x = x;
      this.pos.y = y;

      this.updateBounds(x, y);
    },

    updateBounds: function(x, y) {
      this.bounds.x = this.pos.x - this.align.x * this.bounds.w;
      this.bounds.y = this.pos.y - this.align.y * this.bounds.h;
    }
  }
]);

