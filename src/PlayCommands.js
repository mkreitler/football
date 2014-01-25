// Manages input for standard 'play' states.

fb.PlayCommands = new joe.ClassEx(
{
  IO_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  IO_TIMEOUT: 333,          // Reset inputs after 1/3 second of inactivity.
  IO_HOLD_INTERVAL: 200,    // Keys held for more than 1/5 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, TAPPED:2, HELD:3},
  CMD_TYPE: {NONE:0, LEFT:1, RIGHT:2, FORWARD:3, ACTION:4},
},
{
  ioStates: {left:0, right:0},
  commandTimers: {left:0, right:0},
  lastUp: 0, // Corresponds to IO_TYPE.NONE
  lastInput: 0, // Corresponds to IO_TYPE.NONE
  lastCommand: 0, // Corresponds to CMD_TYPE.NONE
  newInput: 0, // Corresponds to IO_TYPE.NONE
  resetTimer: 0,
  handler: null,
  ioHistory: [0, 0, 0], // [IO_TYPE.NONE, IO_TYPE.NONE, IO_TYPE.NONE],
  ioHistoryIndex: 0,

  init: function(handler) {
    this.handler = handler;
  },

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
    if (keyCode === joe.KeyInput.KEYS.LEFT && this.ioStates.left === fb.PlayCommands.IO_STATE.UP) {
      this.ioStates.left = fb.PlayCommands.IO_STATE.DOWN;
      this.commandTimers.left = 0;
      this.newInput = fb.PlayCommands.IO_TYPE.LEFT;
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT && this.ioStates.right === fb.PlayCommands.IO_STATE.UP) {
      this.ioStates.right = fb.PlayCommands.IO_STATE.DOWN;
      this.commandTimers.right = 0;
      this.newInput = fb.PlayCommands.IO_TYPE.RIGHT;
    }

    return true;
  },

  keyRelease: function(keyCode) {
    if (keyCode === joe.KeyInput.KEYS.LEFT && this.ioStates.left !== fb.PlayCommands.IO_STATE.UP) {
      this.ioStates.left = this.ioStates.left === fb.PlayCommands.IO_STATE.HELD ?
                           fb.PlayCommands.IO_STATE.UP : fb.PlayCommands.IO_STATE.TAPPED;

      if (this.lastCommand === fb.PlayCommands.CMD_TYPE.ACTION) {
        this.ioStates.left = fb.PlayCommands.IO_STATE.UP;
      }
    }
    else if (keyCode === joe.KeyInput.KEYS.RIGHT && this.ioStates.right !== fb.PlayCommands.IO_STATE.UP) {
      this.ioStates.right = this.ioStates.right === fb.PlayCommands.IO_STATE.HELD ?
                            fb.PlayCommands.IO_STATE.UP : fb.PlayCommands.IO_STATE.TAPPED;

    if (this.lastCommand === fb.PlayCommands.CMD_TYPE.ACTION) {
        this.ioStates.right = fb.PlayCommands.IO_STATE.UP;
      }
    }
    
    return true;
  },

  updateInputResets: function(dt) {
    if (this.ioStates.left !== fb.PlayCommands.IO_STATE.UP ||
        this.ioStates.right !== fb.PlayCommands.IO_STATE.UP) {
      this.resetTimer = 0;
    }

    if (this.ioStates.left === fb.PlayCommands.IO_STATE.UP &&
        this.ioStates.right === fb.PlayCommands.IO_STATE.UP &&
        this.lastInput !== fb.PlayCommands.IO_TYPE.NONE) {

      this.resetTimer += dt;

      if (this.resetTimer >= fb.PlayCommands.IO_TIMEOUT) {
        this.resetInputs();
      }
    }
  },

  resetInputs: function() {
    var i = 0;

    this.lastInput = fb.PlayCommands.IO_TYPE.NONE;
    this.lastCommand = fb.PlayCommands.CMD_TYPE.NONE;
    this.resetTimer = 0;

    for (i=0; i<this.ioHistory.length; ++i) {
      this.ioHistory[i] = fb.PlayCommands.IO_TYPE.NONE;
    }

    this.ioHistoryIndex = 0;
  },

  tapLeft: function() {
    var curIndex = this.ioHistoryIndex,
        lastIndex = (this.ioHistoryIndex - 1) % this.ioHistory.length,
        oldestIndex = (this.ioHistoryIndex - 2) % this.ioHistory.length;

    if (lastIndex < 0) lastIndex += this.ioHistory.length;
    if (oldestIndex < 0) oldestIndex += this.ioHistory.length;

    this.ioHistory[this.ioHistoryIndex] = fb.PlayCommands.IO_TYPE.LEFT;
    this.ioHistoryIndex = (this.ioHistoryIndex + 1) % this.ioHistory.length;

    if (this.ioHistory[curIndex] === this.ioHistory[lastIndex] &&
        this.ioHistory[curIndex] !== fb.PlayCommands.IO_TYPE.NONE) {
      this.handler.moveLeft();
      this.lastCommand = fb.PlayCommands.CMD_TYPE.LEFT;
    }
    else if (this.ioHistory[oldestIndex] === this.ioHistory[curIndex]) {
      this.handler.moveForward();
      this.lastCommand = fb.PlayCommands.CMD_TYPE.FORWARD;
    }

    this.resetTimer = 0;
    this.lastInput = fb.PlayCommands.IO_TYPE.LEFT;
  },

  tapRight: function() {
    var curIndex = this.ioHistoryIndex,
        lastIndex = (this.ioHistoryIndex - 1) % this.ioHistory.length,
        oldestIndex = (this.ioHistoryIndex - 2) % this.ioHistory.length;

    if (lastIndex < 0) lastIndex += this.ioHistory.length;
    if (oldestIndex < 0) oldestIndex += this.ioHistory.length;

    this.ioHistory[this.ioHistoryIndex] = fb.PlayCommands.IO_TYPE.RIGHT;
    this.ioHistoryIndex = (this.ioHistoryIndex + 1) % this.ioHistory.length;

    if (this.ioHistory[curIndex] === this.ioHistory[lastIndex] &&
        this.ioHistory[curIndex] !== fb.PlayCommands.IO_TYPE.NONE) {
      this.handler.moveRight();
      this.lastCommand = fb.PlayCommands.CMD_TYPE.RIGHT;
    }
    else if (this.ioHistory[oldestIndex] === this.ioHistory[curIndex]) {
      this.handler.moveForward();
      this.lastCommand = fb.PlayCommands.CMD_TYPE.FORWARD;
    }

    this.resetTimer = 0;
    this.lastInput = fb.PlayCommands.IO_TYPE.RIGHT;
  },

  update: function(dt) {
    var key = null;

    // Update the key states.
    for (key in this.ioStates) {
      if (this.ioStates[key] === fb.PlayCommands.IO_STATE.DOWN) {
        this.commandTimers[key] += dt;
        if (this.commandTimers[key] >= fb.PlayCommands.IO_HOLD_INTERVAL) {
          this.ioStates[key] = fb.PlayCommands.IO_STATE.HELD;
        }
      }
    }

    // Convert key states into commands.
    if (this.ioStates.left === fb.PlayCommands.IO_STATE.HELD &&
        this.ioStates.right === fb.PlayCommands.IO_STATE.HELD) {
        if (this.lastCommand !== fb.PlayCommands.CMD_TYPE.ACTION) {
          this.handler.startAction();
          this.lastCommand = fb.PlayCommands.CMD_TYPE.ACTION;
        }
        else {
          this.handler.continueAction();
        }
    }
    else {
      if (this.lastCommand === fb.PlayCommands.CMD_TYPE.ACTION) {
        if (this.ioStates.left === fb.PlayCommands.IO_STATE.UP &&
            this.ioStates.right === fb.PlayCommands.IO_STATE.UP) {
          this.handler.triggerAction();
          this.resetInputs();
        }
      }
      else if (this.ioStates.left === fb.PlayCommands.IO_STATE.TAPPED) {
        this.tapLeft();
        this.ioStates.left = fb.PlayCommands.IO_STATE.UP;
      }
      else if (this.ioStates.right === fb.PlayCommands.IO_STATE.TAPPED) {
        this.tapRight();
        this.ioStates.right = fb.PlayCommands.IO_STATE.UP;
      }
    }

    this.updateInputResets(dt);
  },
});
