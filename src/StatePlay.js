fb.StatePlayClass = new joe.ClassEx({
  IO_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  IO_TIMEOUT: 333,         // Reset inputs after 1/2 second of inactivity.
  IO_HOLD_INTERVAL: 200,  // Keys held for more than 1/4 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, TAPPED:2, HELD:3},
  CMD_TYPE: {NONE:0, LEFT:1, RIGHT:2, FORWARD:3, ACTION:4},
  IO_TILT: {LEFT_START: 3, LEFT_RESET: 2, RIGHT_START: -3, RIGHT_RESET: -2},
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
  tilt: [],
  tiltState: 0, // Corresponds to TILT_STATE.STRAIGHT
  actionLength: 0,
  MIN_ACTION_LENGTH: 10,
  MAX_ACTION_LENGTH: 1024,
  actionSpeed: 500,   // Pixels per second
  actionTimer: 0,
  actionAngle: Math.PI * 0.5,
  actionOmega: Math.PI * 0.5,
  actionScale: 3,
  screenWidth: joe.Graphics.getWidth(),
  screenHeight: joe.Graphics.getHeight(),
  smoothTilt: {x:0, y:0, z:0},
  accelDir: 1,
  TILT_HISTORY: 5,

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
  },

  enter: function() {
    joe.Accelerometer.addListener(this);
  },

  exit: function() {
    joe.Accelerometer.removeListener(this);
  },

  accelChanged: function(x, y, z) {
    var oldTilt = null,

        i = 0;

    if (this.tilt.length < this.TILT_HISTORY) {
      while(this.tilt.length < this.TILT_HISTORY) {
        this.tilt.unshift({x:x, y:y, z:z});
      }
    }
    else {
      oldTilt = this.tilt.pop();
      oldTilt.x = x;
      oldTilt.y = y;
      oldTilt.z = z;

      this.tilt.unshift(oldTilt);
    }

    for (i=0; i<this.tilt.length; ++i) {
      this.smoothTilt.x += this.tilt[i].x;
      this.smoothTilt.y += this.tilt[i].y;
      this.smoothTilt.z += this.tilt[i].z;
    }

    this.smoothTilt.x /= this.tilt.length;
    this.smoothTilt.y /= this.tilt.length;
    this.smoothTilt.z /= this.tilt.length;

    this.smoothTilt.x = Math.round(this.smoothTilt.x * 100) / 100;
    this.smoothTilt.y = Math.round(this.smoothTilt.y * 100) / 100;
    this.smoothTilt.z = Math.round(this.smoothTilt.z * 100) / 100;

    if (this.tiltState === fb.StatePlayClass.TILT_STATE.STRAIGHT) {
      if (this.smoothTilt.x > fb.StatePlayClass.IO_TILT.LEFT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.LEFT;
      }
      else if (this.smoothTilt.x < fb.StatePlayClass.IO_TILT.RIGHT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.RIGHT;
      }
    }
    else if (this.tiltState === fb.StatePlayClass.TILT_STATE.LEFT) {
      if (this.smoothTilt.x < fb.StatePlayClass.IO_TILT.RIGHT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.RIGHT;
      }
      else if (this.smoothTilt.x < fb.StatePlayClass.IO_TILT.LEFT_RESET) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.STRAIGHT;
      }
    }
    else {
      // Must be TILT_STATE.RIGHT...
      if (this.smoothTilt.x > fb.StatePlayClass.IO_TILT.LEFT_START) {
        this.tiltState = fb.StatePlayClass.TILT_STATE.LEFT;
      }
      else if (this.smoothTilt.x > fb.StatePlayClass.IO_TILT.RIGHT_RESET) {
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
      // this.font.draw(gfx, "X: " + this.smoothTilt.x + "  Y: " + this.smoothTilt.y + "  Z: " + this.smoothTilt.z, joe.Graphics.getWidth() / 2, 50, joe.Resources.BitmapFont.ALIGN.CENTER);

      if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
        this.font.draw(gfx, "ACTION!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, joe.Resources.BitmapFont.ALIGN.CENTER);

        gfx.save();
        gfx.translate(this.player.pos.x, this.player.pos.y);
        gfx.rotate(-this.actionAngle);
        fb.SixPointArrow.draw(gfx, 0, 0, this.actionLength);
        gfx.restore();
      }
    }

    // if (this.spriteSheet) {
    //   for (i=0; i<5; ++i) {
    //     this.spriteSheet.drawIndexed(gfx, 0, 10 + i * 40, i);
    //   }
    // }
  },

  boundsCheck: function(newLength) {
    var actionCos = Math.cos(this.actionAngle),
        actionSin = Math.sin(this.actionAngle),
        newX = newLength * actionCos + this.player.pos.x,
        newY = -newLength * actionSin + this.player.pos.y,
        screenRect = this.playView.getCamera().getScreenRect(),
        dx = 0,
        dy = 0,
        dxClipped = 0,
        dyClipped = 0,
        dxParam = 1,
        dyParam = 1,
        clipParam = 0;

    dx = newX - this.player.pos.x;
    dy = newY - this.player.pos.y;

    newX = Math.max(screenRect.x, newX);
    newY = Math.max(screenRect.y, newY);
    newX = Math.min(screenRect.x + screenRect.w - 1, newX);
    newY = Math.min(screenRect.y + screenRect.h - 1, newY);

    dxClipped = newX - this.player.pos.x;
    dyClipped = newY - this.player.pos.y;

    if (dxClipped !== dx && dx !== 0) {
      dxParam = Math.abs(dxClipped / dx);
    }

    if (dyClipped !== dy && dy !== 0) {
      dyParam = Math.abs(dyClipped / dy);
    }

    clipParam = Math.min(dxParam, dyParam);

    dx = dx * clipParam;
    dy = dy * clipParam;

    return Math.round(Math.sqrt(dx * dx + dy * dy));
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

  update: function(dt, gameTime) {
    var key = null,
        newActionLength = 0;

    if (this.lastCommand === fb.StatePlayClass.CMD_TYPE.ACTION) {
      // Update action timer.
      newActionLength = this.MIN_ACTION_LENGTH + this.actionSpeed * (this.actionTimer + dt * 0.001);

      // Bounds check for the new action length;
      this.actionLength = this.boundsCheck(newActionLength);
      this.actionTimer = (this.actionLength - this.MIN_ACTION_LENGTH) / this.actionSpeed;
    }

    // Update accelerometer (handheld only)
    if (joe.Accelerometer.isSupported && navigator.isCocoonJS) {
      this.actionAngle = this.actionScale * Math.atan2(-this.smoothTilt.y * 0.1, this.accelDir * this.smoothTilt.x * 0.1); 
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
        else if (!navigator.isCocoonJS) {
          if (this.ioStates.left !== fb.StatePlayClass.IO_STATE.DOWN &&
              this.ioStates.right === fb.StatePlayClass.IO_STATE.HELD) {
            // Rotate clockwise.
            this.actionAngle -= this.actionOmega * dt * 0.001;
            this.actionAngle = Math.max(0, this.actionAngle);
            this.ioStates.left = fb.StatePlayClass.IO_STATE.UP;
          }
          else if (this.ioStates.left === fb.StatePlayClass.IO_STATE.HELD &&
                   this.ioStates.right !== fb.StatePlayClass.IO_STATE.DOWN) {
            // Rotate counter-clockwise.
            this.actionAngle += this.actionOmega * dt * 0.001;
            this.actionAngle = Math.min(Math.PI, this.actionAngle);
            this.ioStates.right = fb.StatePlayClass.IO_STATE.UP;
          }
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
    this.actionLength = this.MIN_ACTION_LENGTH;
    this.actionTimer = 0;
    this.actionAngle = Math.PI * 0.5;
  },

  continueAction: function() {
  },

  triggerAction: function() {
    // Execute the current action.
  }
});

