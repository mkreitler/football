// Contains modules that implement common physics behaviors.

joe.kinematicObject = {
  pos: null,
  vel: null,
  acc: null,
  oldPos: null,

  kinInit: function(x, y, vx, vy, ax, ay) {
    this.pos = new joe.MathEx.vec2(x || 0, y || 0);
    this.vel = new joe.MathEx.vec2(vx || 0, vy || 0);
    this.acc = new joe.MathEx.vec2(ax || 0, ay || 0);
    this.oldPos = new joe.MathEx.vec2(this.pos.x, this.pos.y);
  },

  kinUpdate: function(dt) {
    var newVx = this.vel.x + this.acc.x * dt;
    var newVy = this.vel.y + this.acc.y * dt;
    var vAveX = (newVx + this.vel.x) * 0.5;
    var vAveY = (newVy + this.vel.y) * 0.5;
    var newX = this.pos.x + vAveX * dt;
    var newY = this.pos.y + vAveY * dt;

    this.vel.x = newVx;
    this.vel.y = newVy;

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = newX;
    this.pos.y = newY;
  },

  getX: function() {
    return this.pos.x;
  },

  getY: function() {
    return this.pos.y;
  },

  getPosRef: function() {
    return this.pos;
  }
},

joe.physicsCollider = {
  bounds: null,
  collisionMasks: {blocks: 0, blockedBy: 0},

  collideInit: function(x, y, w, h, blocksMask, blockedByMask) {
    this.bounds = new joe.MathEx.rect2(0, 0, 0, 0),
    this.bounds.x = x || 0;
    this.bounds.y = y || 0;
    this.bounds.w = w || 0;
    this.bounds.h = h || 0;

    this.collisionMasks.blocks = blocksMask;
    this.collisionMasks.blockedBy = blockedByMask;
  },

  getHeight: function() {
    return this.bounds.h;
  },

  getWidth: function() {
    return this.bounds.w;
  },

  getBoundsRef: function() {
    return this.bounds;
  },

  isBlockedBy: function(blockMask) {
    return (this.collisionMasks.blockedBy & blockMask) !== 0;
  },

  blocks: function(isBlockedBy) {
    return (this.collisionMasks.blocks & isBlockedBy) !== 0;
  },

  onBlockedBy: function(blocker) {
    if (blocker) {
      // TODO: 
    }
  },

  getBlocksMask: function() {
    return this.collisionMasks.blocks;
  },

  getBlockedByMask: function() {
    return this.collisionMasks.blockedBy;
  },
};

