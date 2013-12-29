fb.StatePlayClass = new joe.ClassEx({
  CMD_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  CMD_TIMEOUT: 0.5,         // Reset inputs after 1/2 second of inactivity.
  CMD_HOLD_INTERVAL: 0.25,  // Keys held for more than 1/4 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, HELD:2},
},
{
  font: null,
  spriteSheet: null,
  fieldImg: null,
  playView: null,
  playCam: null,
  ioStates: {left:0, right:0},
  commandTimers: {left:0, right:0},
  lastUp: 0, // Corresponds to CMD_TYPE.NONE

  touchDown: function(id, x, y) {
    if (x < joe.Graphics.getWidth() / 2) {
      // console.log(">>> touchDownLeft");
      this.keyPress(joe.KeyInput.KEYS.LEFT);
    }
    else {
      // console.log(">>> touchDownRight");
      this.keyPress(joe.KeyInput.KEYS.RIGHT);
    }
  },

  touchUp: function(id, x, y) {
    if (x < joe.Graphics.getWidth() / 2) {
      // console.log(">>> touchUpLeft");
      this.keyRelease(joe.KeyInput.KEYS.LEFT);
    }
    else {
      // console.log(">>> touchUpRight");
      this.keyRelease(joe.KeyInput.KEYS.RIGHT);
    }
  },

  keyPress: function(keyCode) {
    if (keyCode === joe.KeyInput.KEYS.LEFT) {
      this.ioStates.left = fb.StatePlayClass.IO_STATE.DOWN;
      this.commandTimers.left = 0;
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT) {
      this.ioStates.right = fb.StatePlayClass.IO_STATE.DOWN;
      this.commandTimers.right = 0;
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

  init: function(font, spriteImg, fieldImg) {
    this.font = font;
    this.spriteSheet = new joe.SpriteSheet(spriteImg, 3, 2);
    this.fieldImg = fieldImg;

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

    if (this.font) {
      if (this.ioStates.left !== fb.StatePlayClass.IO_STATE.UP &&
          this.ioStates.right !== fb.StatePlayClass.IO_STATE.UP) {
        this.font.draw(gfx, "Both!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, "#00FF00", 72, 0.5);
      }
      else if (this.ioStates.left !== fb.StatePlayClass.IO_STATE.UP) {
        this.font.draw(gfx, "Left!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, "#00FF00", 72, 0.5);
      }
      else if (this.ioStates.right !== fb.StatePlayClass.IO_STATE.UP) {
        this.font.draw(gfx, "Right!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, "#00FF00", 72, 0.5);
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

    for (key in this.ioStates) {
      if (this.ioStates[key] === fb.StatePlayClass.IO_STATE.DOWN) {
        this.commandTimers[key] += dt;
        if (this.commandTimers[key] >= fb.StatePlayClass.CMD_HOLD_INTERVAL) {
          this.ioStates[key] = fb.StatePlayClass.IO_STATE.HELD;
        }
      }
    }
  }
});

