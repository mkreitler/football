fb.StatePlayClass = new joe.ClassEx({
  IO_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  IO_TIMEOUT: 333,         // Reset inputs after 1/2 second of inactivity.
  IO_HOLD_INTERVAL: 200,  // Keys held for more than 1/4 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, TAPPED:2, HELD:3},
  CMD_TYPE: {NONE:0, LEFT:1, RIGHT:2, FORWARD:3, ACTION:4},
  IO_TILT: {LEFT_START: 3, LEFT_RESET: 1, RIGHT_START: -3, RIGHT_RESET: -1},
  TILT_STATE: {LEFT: 1, STRAIGHT: 0, RIGHT: -1},
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
  tilt: {x:0, y:0, z:0},
  tiltState: 0, // Corresponds to TILT_STATE.STRAIGHT

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
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT && this.ioStates.right !== fb.StatePlayClass.IO_STATE.UP) {
      this.ioStates.right = this.ioStates.right === fb.StatePlayClass.IO_STATE.HELD ?
                            fb.StatePlayClass.IO_STATE.UP : fb.StatePlayClass.IO_STATE.TAPPED;
    }
    
    return true;
  },

  init: function(font, spriteSheets, fieldImg) {
    this.font = font;
    this.spriteSheets = spriteSheets;
    this.fieldImg = fieldImg;

    this.player = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.PLAYERS], 2, 2),
                                 0, 0.5, 0.5, joe.Graphics.getWidth() * 0.5, joe.Graphics.getHeight() * 0.9,
                                 0, 0, 0, 0);
    this.ball = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.BALL], 1, 4),
                                2, 0.5, 0.5, joe.Graphics.getWidth() * 0.5, joe.Graphics.getHeight() * 0.5,
                                0, 0, 0, 0);

    // Create the playCam and playView.
    this.playCam = new joe.Camera(joe.Graphics.getWidth(), this.fieldImg.height);
    this.playCam.setSourcePosition(0, 0);
    this.playCam.setDestPosition(joe.Graphics.getWidth() * 0.5 - this.fieldImg.width * 0.5, 10);
    // this.playCam.setMagnification(2);

    this.playView = new joe.View(this.fieldImg.width, this.fieldImg.height, this.playCam);
    this.playView.addLayer(new joe.LayerBitmap(this.fieldImg), 100);
  },

  enter: function() {
    joe.Accelerometer.addListener(this);
  },

  exit: function() {
    joe.Accelerometer.removeListener(this);
  },

  accelChanged: function(x, y, z) {
    this.tilt.x = Math.round(x * 100) / 100;
    this.tilt.y = Math.round(y * 100) / 100;
    this.tilt.z = Math.round(z * 100) / 100;

    if (this.tiltState === fb.StatePlayClass.TILT_STATE.STRAIGHT) {
      if (this.tilt.x > fb.StatePlayClass.IO_TILT.LEFT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.LEFT;
      }
      else if (this.tilt.x < fb.StatePlayClass.IO_TILT.RIGHT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.RIGHT;
      }
    }
    else if (this.tiltState === fb.StatePlayClass.TILT_STATE.LEFT) {
      if (this.tilt.x < fb.StatePlayClass.IO_TILT.RIGHT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.RIGHT;
      }
      else if (this.tilt.x < fb.StatePlayClass.IO_TILT.LEFT_RESET) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.STRAIGHT;
      }
    }
    else {
      // Must be TILT_STATE.RIGHT...
      if (this.tilt.x > fb.StatePlayClass.IO_TILT.LEFT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.LEFT;
      }
      else if (this.tilt.x > fb.StatePlayClass.IO_TILT.RIGHT_RESET) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.STRAIGHT;
      }
    }
  },

  draw: function(gfx) {
    var i =0;

    joe.Graphics.clearToColor("#000000");

    this.playView.draw(gfx);

    this.ball.draw(gfx);
    this.player.draw(gfx);

    if (this.font) {
//      this.font.draw(gfx, "X: " + this.tilt.x + "  Y: " + this.tilt.y + "  Z: " + this.tilt.z, joe.Graphics.getWidth() / 2, 50, joe.Resources.BitmapFont.ALIGN.CENTER);

      if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
        this.font.draw(gfx, "ACTION!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, joe.Resources.BitmapFont.ALIGN.CENTER);
      }
    }

    // if (this.spriteSheet) {
    //   for (i=0; i<5; ++i) {
    //     this.spriteSheet.drawIndexed(gfx, 0, 10 + i * 40, i);
    //   }
    // }
  },

  update: function(dt, gameTime) {
    var key = null;

    // Update accelerometer (handheld only)
    if (joe.Accelerometer.isSupported && navigator.isCocoonJS) {
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
    if (this.ioStates.left === fb.StatePlayClass.IO_STATE.NONE &&
        this.ioStates.right === fb.StatePlayClass.IO_STATE.NONE &&
        this.lastInput !== fb.StatePlayClass.IO_TYPE.NONE) {

      this.resetTimer += dt;

      if (this.resetTimer >= fb.StatePlayClass.IO_TIMEOUT) {
        this.resetInputs();
      }
    }
    else if (this.ioStates.left === fb.StatePlayClass.IO_STATE.HELD &&
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
        this.triggerAction();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
        this.lastInput = fb.StatePlayClass.IO_TYPE.NONE;
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
  },

  resetInputs: function() {
    this.lastInput = fb.StatePlayClass.IO_TYPE.NONE;
    this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
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
    if (joe.Accelerometer.isSupported && navigator.isCocoonJS) {
      if (this.tiltState === fb.StatePlayClass.TILT_STATE.STRAIGHT) {
        this.moveForward();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.FORWARD;
      }
      else if (this.tiltState === fb.StatePlayClass.TILT_STATE.LEFT) {
        this.moveLeft();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.LEFT;
      }
      else {
        // Must be TILT_STATE.RIGHT...
        this.moveRight();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.RIGHT;
      }
    }
    else {
      // Web interface
      if (this.lastInput === fb.StatePlayClass.IO_TYPE.LEFT ||
          this.lastCommand === fb.StatePlayClass.CMD_TYPE.LEFT) {
        this.moveLeft();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.LEFT;
      }
      else if (this.lastInput === fb.StatePlayClass.IO_TYPE.RIGHT &&
               this.lastCommand !== fb.StatePlayClass.CMD_TYPE.RIGHT) {
        this.moveForward();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.FORWARD;
      }
      else {
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
      }

      this.resetTimer = 0;
      this.lastInput = fb.StatePlayClass.IO_TYPE.LEFT;
    }
  },

  tapRight: function() {
    if (joe.Accelerometer.isSupported && navigator.isCocoonJS) {
      if (this.tiltState === fb.StatePlayClass.TILT_STATE.STRAIGHT) {
        this.moveForward();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.FORWARD;
      }
      else if (this.tiltState === fb.StatePlayClass.TILT_STATE.LEFT) {
        this.moveLeft();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.LEFT;
      }
      else {
        // Must be TILT_STATE.RIGHT...
        this.moveRight();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.RIGHT;
      }
    }
    else {
      // Web interface
      if (this.lastInput === fb.StatePlayClass.IO_TYPE.RIGHT ||
          this.lastCommand === fb.StatePlayClass.CMD_TYPE.RIGHT) {
          this.moveRight();
          this.lastCommand = fb.StatePlayClass.CMD_TYPE.RIGHT;
      }
      else if (this.lastInput === fb.StatePlayClass.IO_TYPE.LEFT &&
               this.lastCommand !== fb.StatePlayClass.CMD_TYPE.LEFT) {
        this.moveForward();
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.FORWARD;
      }
      else {
        this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
      }

      this.resetTimer;
      this.lastInput = fb.StatePlayClass.IO_TYPE.RIGHT;
    }
  },

  startAction: function() {
    this.lastCommand = fb.StatePlayClass.CMD_TYPE.ACTION;
  },

  continueAction: function() {
  },

  triggerAction: function() {
    // Execute the current action.
  }
});

