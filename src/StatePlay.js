fb.StatePlayClass = new joe.ClassEx({
  IO_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  IO_TIMEOUT: 333,         // Reset inputs after 1/2 second of inactivity.
  IO_HOLD_INTERVAL: 200,  // Keys held for more than 1/5 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, TAPPED:2, HELD:3},
  CMD_TYPE: {NONE:0, LEFT:1, RIGHT:2, FORWARD:3, ACTION:4},
},
{
  font: null,
  spriteSheets: null,
  player: null,
  ball: null,
  fieldImg: null,
  playView: null,
  playCam: null,
  ioStates: {left:0, right:0},
  commandTimers: {left:0, right:0},
  lastUp: 0, // Corresponds to IO_TYPE.NONE
  lastInput: 0, // Corresponds to IO_TYPE.NONE
  lastCommand: 0, // Corresponds to CMD_TYPE.NONE
  newInput: 0, // Corresponds to IO_TYPE.NONE
  resetTimer: 0,
  actionLength: 0,
  MIN_ACTION_LENGTH: 10,
  MAX_ACTION_LENGTH: 1024,
  actionSpeed: 500,   // Pixels per second
  actionTimer: 0,
  screenWidth: joe.Graphics.getWidth(),
  actionLayer: null,

  touchDown: function(id, x, y) {
    if (x < joe.Graphics.getScreenWidth() / 2) {
      this.keyPress(joe.KeyInput.KEYS.LEFT);
    }
    else {
      this.keyPress(joe.KeyInput.KEYS.RIGHT);
    }
  },

  touchUp: function(id, x, y) {
    if (x < joe.Graphics.getScreenWidth() / 2) {
      this.keyRelease(joe.KeyInput.KEYS.LEFT);
    }
    else {
      this.keyRelease(joe.KeyInput.KEYS.RIGHT);
    }
  },

  keyPress: function(keyCode) {
    if (keyCode === joe.KeyInput.KEYS.LEFT && this.ioStates.left === fb.StatePlayClass.IO_STATE.UP) {
      this.ioStates.left = fb.StatePlayClass.IO_STATE.DOWN;
      this.commandTimers.left = 0;
      this.newInput = fb.StatePlayClass.IO_TYPE.LEFT;
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT && this.ioStates.right === fb.StatePlayClass.IO_STATE.UP) {
      this.ioStates.right = fb.StatePlayClass.IO_STATE.DOWN;
      this.commandTimers.right = 0;
      this.newInput = fb.StatePlayClass.IO_TYPE.RIGHT;
    }

    return true;
  },

  keyRelease: function(keyCode) {
    if (keyCode === joe.KeyInput.KEYS.LEFT && this.ioStates.left !== fb.StatePlayClass.IO_STATE.UP) {
      this.ioStates.left = this.ioStates.left === fb.StatePlayClass.IO_STATE.HELD ?
                           fb.StatePlayClass.IO_STATE.UP : fb.StatePlayClass.IO_STATE.TAPPED;

      if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
        this.ioStates.left = fb.StatePlayClass.IO_STATE.UP;
      }
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT && this.ioStates.right !== fb.StatePlayClass.IO_STATE.UP) {
      this.ioStates.right = this.ioStates.right === fb.StatePlayClass.IO_STATE.HELD ?
                            fb.StatePlayClass.IO_STATE.UP : fb.StatePlayClass.IO_STATE.TAPPED;

    if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
        this.ioStates.right = fb.StatePlayClass.IO_STATE.UP;
      }
    }
    
    return true;
  },

  init: function(font, spriteSheets, fieldImg) {
    this.font = font;
    this.spriteSheets = spriteSheets;
    this.fieldImg = fieldImg;

    this.player = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.PLAYERS], 2, 3),
                                 1, 0.5, 0.5, joe.Graphics.getWidth() * 0.5, joe.Graphics.getHeight() * 0.9,
                                 0, 0, 0, 0);
    this.ball = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.BALL], 1, 4),
                                2, 0.5, 0.5, joe.Graphics.getWidth() * 0.5, joe.Graphics.getHeight() * 0.5,
                                0, 0, 0, 0);

    // Create the playCam and playView.
    this.playCam = new joe.Camera(this.fieldImg.width, this.fieldImg.height);
    this.playCam.setSourcePosition(0, 0);
    this.playCam.setDestPosition(joe.Graphics.getWidth() * 0.5 - this.fieldImg.width * 0.5, 10);
    // this.playCam.setMagnification(2);

    this.playView = new joe.View(this.fieldImg.width, this.fieldImg.height, this.playCam);
    this.playView.addLayer(new joe.LayerBitmap(this.fieldImg), 100);

    this.actionLayer = new fb.ActionOverlay(this.font);
    this.playView.addLayer(this.actionLayer, 50);
  },

  enter: function() {
  },

  exit: function() {
  },

  draw: function(gfx) {
    var i =0;

    joe.Graphics.clearToColor("#000000");

    this.playView.draw(gfx);

    // TODO: move these into a Sprite Layer.
    this.ball.draw(gfx);
    this.player.draw(gfx);
  },

  boundsCheck: function(newLength) {
  },

  updateInputResets: function(dt) {
    if (this.ioStates.left !== fb.StatePlayClass.IO_STATE.UP ||
        this.ioStates.right !== fb.StatePlayClass.IO_STATE.UP) {
      this.resetTimer = 0;
    }

    if (this.ioStates.left === fb.StatePlayClass.IO_STATE.UP &&
        this.ioStates.right === fb.StatePlayClass.IO_STATE.UP &&
        this.lastInput !== fb.StatePlayClass.IO_TYPE.NONE) {

      this.resetTimer += dt;

      if (this.resetTimer >= fb.StatePlayClass.IO_TIMEOUT) {
        this.resetInputs();
      }
    }
  },

  updateAction: function(dt) {
    // Update action timer.
    newActionLength = this.MIN_ACTION_LENGTH + this.actionSpeed * (this.actionTimer + dt * 0.001);

    if (newActionLength + this.player.pos.y > this.fieldImg.height ||
        this.player.pos.y , newActionLength < 0) {

      this.resetInputs();
      this.resetAction();
      this.actionLayer.updateActionCircle(false);
    }
    else {
      this.actionLength = newActionLength;
      this.actionTimer += dt * 0.001;
      this.actionLayer.updateActionCircle(true, this.player.pos.x, this.player.pos.y, this.actionLength);
    }
  },

  update: function(dt, gameTime) {
    var key = null,
        newActionLength = 0;

    if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
      this.updateAction(dt);
    }
    else {
      this.actionLayer.updateActionCircle(false);
    }

    // Update the key states.
    for (key in this.ioStates) {
      if (this.ioStates[key] === fb.StatePlayClass.IO_STATE.DOWN) {
        this.commandTimers[key] += dt;
        if (this.commandTimers[key] >= fb.StatePlayClass.IO_HOLD_INTERVAL) {
          this.ioStates[key] = fb.StatePlayClass.IO_STATE.HELD;
        }
      }
    }

    // Convert key states into commands.
    if (this.ioStates.left === fb.StatePlayClass.IO_STATE.HELD &&
        this.ioStates.right === fb.StatePlayClass.IO_STATE.HELD) {
        if (this.lastCommand !== fb.StatePlayClass.CMD_TYPE.ACTION) {
          this.startAction();
        }
        else {
          this.continueAction();
        }
    }
    else {
      if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
        if (this.ioStates.left === fb.StatePlayClass.IO_STATE.UP &&
            this.ioStates.right === fb.StatePlayClass.IO_STATE.UP) {
          this.triggerAction();
          this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
          this.lastInput = fb.StatePlayClass.IO_TYPE.NONE;
        }
      }
      else if (this.ioStates.left === fb.StatePlayClass.IO_STATE.TAPPED) {
        this.tapLeft();
        this.ioStates.left = fb.StatePlayClass.IO_STATE.UP;
      }
      else if (this.ioStates.right === fb.StatePlayClass.IO_STATE.TAPPED) {
        this.tapRight();
        this.ioStates.right = fb.StatePlayClass.IO_STATE.UP;
      }
    }

    this.updateInputResets(dt);
  },

  resetInputs: function() {
    this.lastInput = fb.StatePlayClass.IO_TYPE.NONE;
    this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
    this.resetTimer = 0;
  },

  moveLeft: function() {
    var bounds = this.player.getBoundsRef(),
        pos = this.player.getPosRef(),
        newX = 0;

    newX = pos.x - bounds.w * 0.5;
    if (newX < 0) {
      newX = joe.Graphics.getWidth() * 0.5;
    }

    this.player.setPos(newX, pos.y);
  },

  moveRight: function() {
    var bounds = this.player.getBoundsRef(),
        pos = this.player.getPosRef(),
        maxWidth = joe.Graphics.getWidth(),
        newX = 0;

    newX = pos.x + bounds.w * 0.5;
    if (newX >= maxWidth) {
      newX = maxWidth * 0.5;
    }

    this.player.setPos(newX, pos.y);
  },

  moveForward: function() {
    var bounds = this.player.getBoundsRef(),
        pos = this.player.getPosRef(),
        newY = 0;

    newY = pos.y - bounds.h * 0.5;
    if (newY < 0) {
      newY = joe.Graphics.getHeight() * 0.9;
    }

    this.player.setPos(pos.x, newY);
  },

  tapLeft: function() {
    // Web interface
    if (this.ioStates.right === fb.StatePlayClass.IO_STATE.HELD) {
      this.moveLeft();
      this.lastCommand = fb.StatePlayClass.CMD_TYPE.LEFT;
    }
    else {
      this.moveForward();
      this.lastCommand = fb.StatePlayClass.CMD_TYPE.FORWARD;
    }

    this.resetTimer = 0;
    this.lastInput = fb.StatePlayClass.IO_TYPE.LEFT;
  },

  tapRight: function() {
    // Web interface
    if (this.ioStates.left === fb.StatePlayClass.IO_STATE.HELD) {
      this.moveRight();
      this.lastCommand = fb.StatePlayClass.CMD_TYPE.LEFT;
    }
    else {
      this.moveForward();
      this.lastCommand = fb.StatePlayClass.CMD_TYPE.FORWARD;
    }

    this.resetTimer;
    this.lastInput = fb.StatePlayClass.IO_TYPE.RIGHT;
  },

  startAction: function() {
    this.lastCommand = fb.StatePlayClass.CMD_TYPE.ACTION;
    this.actionLength = this.MIN_ACTION_LENGTH;
    this.actionTimer = 0;
  },

  continueAction: function() {
  },

  triggerAction: function() {
    // Execute the current action.

    this.resetAction();
  },

  resetAction: function() {
    this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
    this.actionLength = this.MIN_ACTION_LENGTH;
    this.actionTimer = 0; 
  }
});

