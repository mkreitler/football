joe.GameStateClass = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
  currentState: null,

  setState: function(newState) {
    if (joe.GameStateClass.currentState !== newState) {
      if (joe.GameStateClass.currentState) {
        joe.GameStateClass.currentState.exit();
      }

      if (newState) {
        newState.enter();
      }

      joe.GameStateClass.currentState = newState;
    }
  },

  getState: function() {
    return joe.GameStateClass.currentState;
  }
},
{
  // Instance Definition //////////////////////////////////////////////////////
  update: function(dt, gameTime) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.update) {
      joe.GameStateClass.currentState.update(dt, gameTime);
    }
  },

  draw: function(gfx) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.draw) {
      joe.GameStateClass.currentState.draw(gfx);
    }
  },

  keyPress: function(keyCode) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.keyPress) {
      joe.GameStateClass.currentState.keyPress(keyCode);
    }
  },

  keyRelease: function(keyCode) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.keyRelease) {
      joe.GameStateClass.currentState.keyRelease(keyCode);
    }
  },

  keyTap: function(keyCode) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.keyTap) {
      joe.GameStateClass.currentState.keyTap(keyCode);
    }
  },

  keyHold: function(keyCode) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.keyHold) {
      joe.GameStateClass.currentState.keyHold(keyCode);
    }
  },

  keyDoubleTap: function(keyCode) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.keyDoubleTap) {
      joe.GameStateClass.currentState.keyDoubleTap(keyCode);
    }
  },

  mouseDown : function(x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.mouseDown) {
      joe.GameStateClass.currentState.mouseDown(x, y);
    }
  },

  mouseUp : function(x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.mouseUp) {
      joe.GameStateClass.currentState.mouseUp(x, y);
    }
  },

  mouseDrag : function(x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.mouseDrag) {
      joe.GameStateClass.currentState.mouseDrag(x, y);
    }
  },

  mouseOver : function(x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.mouseOver) {
      joe.GameStateClass.currentState.mouseOver(x, y);
    }
  },

  mouseClick : function(x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.mouseClick) {
      joe.GameStateClass.currentState.mouseClick(x, y);
    }
  },

  mouseDoubleClick : function(x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.mouseDoubleClick) {
      joe.GameStateClass.currentState.mouseDoubleClick(x, y);
    }
  },

  touchDown : function(id, x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.touchDown) {
      joe.GameStateClass.currentState.touchDown(id, x, y);
    }
  },

  touchUp : function(id, x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.touchUp) {
      joe.GameStateClass.currentState.touchUp(id, x, y);
    }
  },

  touchMove : function(id, x, y) {
    if (joe.GameStateClass.currentState && joe.GameStateClass.currentState.touchMove) {
      joe.GameStateClass.currentState.touchMove(id, x, y);
    }
  },
});

joe.GameState = new joe.GameStateClass()

// Register with game systems.
joe.UpdateLoop.addListener(joe.GameState);
joe.Graphics.addListener(joe.GameState);
