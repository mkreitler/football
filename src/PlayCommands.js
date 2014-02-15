// Manages input for standard 'play' states.

fb.PlayCommands = new joe.ClassEx(
{
  IO_TYPE: {NONE:0, LEFT:-1, RIGHT:1},
  IO_TIMEOUT: 333,          // Reset inputs after 1/3 second of inactivity.
  IO_HOLD_INTERVAL: 200,    // Keys held for more than 1/5 second register as "hold" events.
  IO_STATE: {UP:0, DOWN:1, TAPPED:2, HELD:3},
  CMD_TYPE: {NONE:0, LEFT:1, RIGHT:2, FORWARD:3, ACTION:4},
  MOUSE_DRAG_THRESHOLD: 10,
  TOUCH_DRAG_THRESHOLD: 50,
  DRAG_ACCEPT_INTERVAL: 67,
},
{
  ioStates: {left:0, right:0},
  commandTimers: {left:0, right:0},
  lastUp: 0, // Corresponds to IO_TYPE.NONE
  lastInput: 0, // Corresponds to IO_TYPE.NONE
  lastCommand: 0, // Corresponds to CMD_TYPE.NONE
  newInput: 0, // Corresponds to IO_TYPE.NONE
  resetTimer: 0,
  ioHistory: [0, 0, 0], // [IO_TYPE.NONE, IO_TYPE.NONE, IO_TYPE.NONE],
  ioHistoryIndex: 0,
  inputDownTime: 0,
  bMouseDown: false,
  mouseCommand: 0, // CMD_TYPE.NONE
  mouseDownPos: {x:0 ,y:0},
  mouseDragPos: {x:0, y:0},
  bDragging: false,
  bWantsDrag: false,
  touchDragID: -1,
  drawStartTime: 0,

  init: function() {
  },

  touchDown: function(id, x, y) {
    this.inputDownTime = joe.UpdateLoop.getGameTime();

    if (!this.bDragging) {
      this.bMouseDown = true;
    }
  },

  touchUp: function(id, x, y) {
    var inputUpTime = joe.UpdateLoop.getGameTime();

    if (id === this.touchDragID) {
      this.touchDragID = -1;
      this.bDragging = false;
      this.bWantsDrag = false;
    }

    this.bMouseDown = false;

    if (inputUpTime - this.inputDownTime < fb.PlayCommands.IO_HOLD_INTERVAL) {
      // Move forward.
      this.mouseCommand = fb.PlayCommands.CMD_TYPE.FORWARD;
    }
    else if (this.lastCommand === fb.PlayCommands.CMD_TYPE.ACTION) {
      this.mouseCommand = fb.PlayCommands.CMD_TYPE.ACTION;
    }
  },

  touchMove: function(id, x, y) {
    var inputTime = joe.UpdateLoop.getGameTime();

    if (this.touchDragID < 0 || this.touchDragID === id) {
      if (this.touchDragID < 0) {
        this.mouseDownPos.x = x;
        this.mouseDownPos.y = y;
        this.bWantsDrag = true;
        this.touchDragID = id;
        this.dragStartTime = joe.UpdateLoop.getGameTime();
        this.dragDx = 0;
        this.dragDy = 0;
      }
      else if (this.bWantsDrag &&
               Math.abs(x - this.mouseDownPos.x) + Math.abs(y - this.mouseDownPos.y) > fb.PlayCommands.TOUCH_DRAG_THRESHOLD) {
        this.bWantsDrag = false;

        // Update the player's move direction.
        this.bDragging = true;
        this.message("startPlayerDrag", x - this.mouseDownPos.x, y - this.mouseDownPos.y);
      }

      if (this.bDragging && inputTime - this.dragStartTime > fb.PlayCommands.DRAG_ACCEPT_INTERVAL) {
        this.bMouseDown = false; // Prevent actions.
      }

      if (this.bDragging) {
        this.mouseDragPos.x = x;
        this.mouseDragPos.y = y;
      }
    }
  },

  getMouseDragDX: function() {
    return this.mouseDragPos.x - this.mouseDownPos.x;
  },

  getMouseDragDY: function() {
    return this.mouseDragPos.y - this.mouseDownPos.y;
  },

  isPlayerDragging: function() {
    return this.bDragging;
  },

  dragIsValid: function() {
    return joe.Utility.isMobile() ? this.bDragging && !this.bMouseDown : this.bDragging;
  },

  mouseDown : function(x, y) {
    this.inputDownTime = joe.UpdateLoop.getGameTime();
    this.bMouseDown = true;
    this.mouseDownPos.x = x;
    this.mouseDownPos.y = y;
  },

  mouseUp : function(x, y) {
    var inputUpTime = joe.UpdateLoop.getGameTime();

    this.bMouseDown = false;
    this.bDragging = false;

    if (inputUpTime - this.inputDownTime < fb.PlayCommands.IO_HOLD_INTERVAL) {
      // Move forward.
      this.mouseCommand = fb.PlayCommands.CMD_TYPE.FORWARD;
    }
    else if (this.lastCommand === fb.PlayCommands.CMD_TYPE.ACTION) {
      this.mouseCommand = fb.PlayCommands.CMD_TYPE.ACTION;
    }
  },

  mouseDrag : function(x, y) {
    if (this.bDragging || Math.abs(x - this.mouseDownPos.x) + Math.abs(y - this.mouseDownPos.y) > fb.PlayCommands.MOUSE_DRAG_THRESHOLD) {
      this.mouseDragPos.x = x;
      this.mouseDragPos.y = y;

      if (!this.bDragging) {
        // Update the player's move direction.
        this.message("startPlayerDrag", x - this.mouseDownPos.x, y - this.mouseDownPos.y);
        this.bDragging = true;
      }
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
    this.message("moveForward");
    this.lastCommand = fb.PlayCommands.CMD_TYPE.FORWARD;
    this.resetTimer = 0;
    this.lastInput = fb.PlayCommands.IO_TYPE.LEFT;
  },

  tapRight: function() {
    this.message("moveForward");
    this.lastCommand = fb.PlayCommands.CMD_TYPE.FORWARD;
    this.resetTimer = 0;
    this.lastInput = fb.PlayCommands.IO_TYPE.LEFT;

    this.resetTimer = 0;
    this.lastInput = fb.PlayCommands.IO_TYPE.RIGHT;
  },

  update: function(dt, gameTime) {
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

    // Check for mouse hold.
    if (this.mouseCommand && !this.bDragging) {
      if (this.mouseCommand === fb.PlayCommands.CMD_TYPE.FORWARD) {
        this.message("moveForward");
      }
      else {
        this.message("triggerAction");
      }

      this.mouseCommand = fb.PlayCommands.CMD_TYPE.NONE;
    }
    else if (this.bMouseDown && !this.bDragging && gameTime - this.inputDownTime > fb.PlayCommands.IO_HOLD_INTERVAL) {
      if (this.lastCommand !== fb.PlayCommands.CMD_TYPE.ACTION) {
        this.message("startAction");
        this.lastCommand = fb.PlayCommands.CMD_TYPE.ACTION;
      }
      else {
        this.message("continueAction");
      }
    }
    // Convert key states into commands.
    else if (this.ioStates.left === fb.PlayCommands.IO_STATE.HELD &&
        this.ioStates.right === fb.PlayCommands.IO_STATE.HELD) {
        if (this.lastCommand !== fb.PlayCommands.CMD_TYPE.ACTION) {
          this.message("startAction");
          this.lastCommand = fb.PlayCommands.CMD_TYPE.ACTION;
        }
        else {
          this.message("continueAction");
        }
    }
    else {
      if (this.lastCommand === fb.PlayCommands.CMD_TYPE.ACTION) {
        if (this.ioStates.left === fb.PlayCommands.IO_STATE.UP &&
            this.ioStates.right === fb.PlayCommands.IO_STATE.UP) {
          this.message("triggerAction");
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
