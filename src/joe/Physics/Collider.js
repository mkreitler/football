// The Collider manages interactions between collidable entities.

joe.Collider = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
  collisionGroups: [],

  getCollisionGroupFromMask: function(mask) {
    var iGroup = 0,
        group = null;

    if (mask) {
      for (iGroup=0; iGroup<this.collisionGroups.length; ++iGroup) {
        if (this.collisionGroups[iGroup].mask === mask) {
          group = this.collisionGroups[iGroup];
          break;
        }
      }
    }

    return group;
  },

  addToCollisionGroup: function(mover) {
    var group = null,
        blocksMask = mover ? mover.getBlocksMask() : 0;

    group = getCollisionGroupFromMask(blocksMask);

    if (group) {
      group.list.push(mover);
    }
    else if (blocksMask) {
      group = {mask: blocksMask, list:[]};
      group.list.push(mover);
      this.collisionGroups.push(group);
    }
  },

  removeFromCollisionGroup: function(mover) {
    var group = null,
        blocksMask = mover ? mover.getBlocksMask() : 0;

    group = getCollisionGroupFromMask(blocksMask);

    if (group) {
      joe.Utiliy.fastErase(group.list, mover);
    }
  },

  collide: function(collider) {
    // Colliders must have the following interface:
    // getBounds(): returns {x:#, y:#, w:#, h:#}
    // isBlockedBy(): returns an 8-bit number representing collision flags.
    // onBlockedBy(blocker): called to notify mover of a collision.

    var bCollided = false,
        blocker = null;

    // TODO: collide with static geometry.

    if (!bCollided) {
      blocker = collideWithmovers(collider);
      if (blocker) {
        collider.onCollidedWith(blocker);
        bCollided = true;
      }
    }

    // TODO: collide with dynamic, non-mover objects.
  }
},
{
  // Instance Definition //////////////////////////////////////////////////////
})