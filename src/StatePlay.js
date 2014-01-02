fb.StatePlayClass = new joe.ClassEx({
  IO_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  IO_TIMEOUT: 0.5,         // Reset inputs after 1/2 second of inactivity.
  IO_HOLD_INTERVAL: 0.25,  // Keys held for more than 1/4 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, HELD:2},
  CMD_TYPE: {NONE:0, LEFT:1, RIGHT:2, ACTION:3},
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
  lastInput: 0, // Corresponds to IO_Type.NONE
  lastCommand: 0, // Corresponds to CMD_TYPE.NONE
  newInput: 0, // Corresponds to IO_TYPE.NONE

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
    if (keyCode === joe.KeyInput.KEYS.LEFT) {
      this.ioStates.left = fb.StatePlayClass.IO_STATE.DOWN;
      this.commandTimers.left = 0;
      this.newInput = fb.StatePlayClass.IO_TYPE.LEFT;
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT) {
      this.ioStates.right = fb.StatePlayClass.IO_STATE.DOWN;
      this.commandTimers.right = 0;
      this.newInput = fb.StatePlayClass.IO_TYPE.RIGHT;
    }

    return true;
  },

  keyRelease: function(keyCode) {
    if (keyCode === joe.KeyInput.KEYS.LEFT) {
      this.ioStates.left = fb.StatePlayClass.IO_STATE.UP;
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT) {
      this.ioStates.right = fb.StatePlayClass.IO_STATE.UP;
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
    this.ball = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.BALL], 1, 1),
                                0, 0.5, 0.5, joe.Graphics.getWidth() * 0.5, joe.Graphics.getHeight() * 0.5,
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

  },

  exit: function() {

  },

  draw: function(gfx) {
    var i =0;

    joe.Graphics.clearToColor("#000000");

    this.playView.draw(gfx);

    this.ball.draw(gfx);
    this.player.draw(gfx);

    if (this.font) {
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
    if (this.ioStates["left"] === fb.StatePlayClass.IO_STATE.HELD &&
        this.ioStates["right"] === fb.StatePlayClass.IO_STATE.HELD) {
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
      }
    }
  },

  startAction: function() {
    this.lastCommand = fb.StatePlayClass.CMD_TYPE.ACTION;
  },

  continueAction: function() {
  },

  triggerAction: function() {
    if (this.lastCommand !== fb.StatePlayClass.CMD_TYPE.ACTION) {
      // Start a new action.
    }
    else {
      // Continue the existing action.
    }

    this.lastCommand = fb.StatePlayClass.CMD_TYPE.NONE;
  }
});

