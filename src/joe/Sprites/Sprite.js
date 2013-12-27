// 2D animated game object, possibly with a collision model. Usually rendered
// as part of a SpriteLayer object (see LayerSprite.js).

joe.Sprite = new joe.ClassEx({
},
{
  spriteSheet: null,
  align: {x:0, y:0},
  pos: {x:0, y:0, oldX:0, oldY:0},
  vel: {x:0, y:0},
  acc: {x:0, y:0},

  init: function(spriteSheet, alignX, alignY, x, y, vx, vy, ax, ay) {
    this.spriteSheet = spriteSheet || null;
    this.align.x = alignX || 0;
    this.align.y = alignY || 0;
    this.pos.x = x || 0;
    this.pos.y = y || 0;
    this.vel.x = vx || 0;
    this.vel.y = vy || 0;
    this.acc.x = ax || 0;
    this.acc.y = ay || 0;
  },

  draw: function(gfx) {
    joe.assert(this.spriteSheet);
  },

  update: function(dt, gameTime) {
    var newVx = this.vel.x + this.acc.x * dt;
    var newVy = this.vel.y + this.acc.y * dt;
    var vAveX = (newVx + this.vel.x) * 0.5;
    var vAveY = (newVy + this.vel.y) * 0.5;
    var newX = this.pos.x + vAveX * dt;
    var newY = this.pos.y + vAveY * dt;

    this.vel.x = newVx;
    this.vel.y = newVy;

    this.pos.oldX = this.pos.x;
    this.pos.oldY = this.pos.y;

    this.pos.x = newX;
    this.pos.y = newY;
  }
});

