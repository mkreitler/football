// Provides a singleton that processes keyboard events for the game.
// Handlers should return 'true' if they want to consume the event.
//
// Usage:
//  KeyListener module:
//   keyPress: function(keyCode) {};
//   keyRelease: function(keyCode) {};
//   keyTap: function(keyCode) {};
//   keyHold: function(keyCode) {};
//   keyDoubleTap: function(keyCode) {};
//
// myInstance = new joe.Class();
//
// joe.KeyInput.addListener(myInstance);</pre>


joe.KeyInput = new joe.ClassEx([
  joe.Listeners, {
  // Static Definitions ////////////////////////////////////////////////////////////
  keyState: [],
  doubleTapInterval: 150,
  holdInterval: 333,
  tapInterval: 150,
  
  setDoubleTapInterval: function(newInterval) {
    joe.KeyInput.doubleTapInterval = newInterval;
  },
  
  setHoldInterval: function(newInterval) {
    joe.KeyInput.holdInterval = newInterval;
  },
  
  setTapInterval: function(newInterval) {
    joe.KeyInput.tapInterval = newInterval;
  },
  
  init: function() {
    var key = null;
    var keyCode;
    var maxCode = -1;
    
    // Get the largest recognized keyCode.
    for (key in joe.KeyInput.KEYS) {
      keyCode = joe.KeyInput.KEYS[key];
      if (keyCode > maxCode) {
        maxCode = keyCode;
      }
    }
    
    // Add keyState trackers for all codes up
    // to the largets (many will be unused).
    while (maxCode >= 0) {
      joe.KeyInput.keyState.push({pressed:false, pressCount: 0, pressTime:-1});
      maxCode -= 1;
    }
  },

  update: function(dt, gameTime) {
    // Iterate through the keyStates.
    // For 'pressed' states, check for 'hold' events.
    // For 'unpressed' states, check for 'tap' events.
    var i;
    var curKeyState;
    
    for (i=0; i<joe.KeyInput.keyState.length; ++i) {
      curKeyState = joe.KeyInput.keyState[i];
      
      if (curKeyState.pressed && curKeyState.pressTime > 0) {
        // Check for hold.
        if (gameTime - curKeyState.pressTime > joe.KeyInput.holdInterval) {
            curKeyState.pressTime = 0;
            joe.KeyInput.keyHold(i);
        }
      }
      else if (curKeyState.pressTime > 0) {
        // Check for tap.
        if (gameTime - curKeyState.pressTime > joe.KeyInput.tapInterval) {
          curKeyState.pressTime = 0;
          joe.KeyInput.keyTap(i);
        }
      }
    }
  },
  
  keyPress: function(e) {
    var localEvent = window.event ? window.event : e;
    var keyCode = ('keyCode' in localEvent) ? localEvent.keyCode : event.charCode;
    var curKeyState = null;
    var curTime = 0;
    
    // Update the button state.
    if (typeof(joe.KeyInput.keyState[keyCode]) !== 'undefined') {
      curTime = joe.UpdateLoop.getGameTime();
      
      curKeyState = joe.KeyInput.keyState[keyCode];
      
      if (!curKeyState.pressed) {
        curKeyState.pressed = true;
      
        // Check for double-tap event.
        // Double taps measure time from the first
        // tap.
        if (curTime - curKeyState.pressTime < joe.KeyInput.doubleTapInterval) {
            curKeyState.pressCount = 0;
            curKeyState.pressTime = 0;
            joe.KeyInput.keyDoubleTap(keyCode);
        }
        else {
          curKeyState.pressCount = 1;
          curKeyState.pressTime = curTime;
        }
      }
    }
    
    joe.KeyInput.callListenersUntilConsumed("keyPress", keyCode);
    
    localEvent.preventDefault();
  },
  
  keyRelease: function(e) {
    var localEvent = window.event ? window.event : e;
    var keyCode = ('keyCode' in localEvent) ? localEvent.keyCode : event.charCode;
    var curKeyState = null;
    
    // Update the button state.
    if (typeof(joe.KeyInput.keyState[keyCode]) !== 'undefined') {
      curKeyState = joe.KeyInput.keyState[keyCode];
      curKeyState.pressed = false;
      curKeyState.pressTime = curKeyState.pressTime > 0 ? joe.UpdateLoop.getGameTime() : 0;
      curKeyState.pressCount = 0;
    }
    
    joe.KeyInput.callListenersUntilConsumed("keyRelease", keyCode);
    
    localEvent.preventDefault();
  },
  
  keyTap: function(keyCode) {
    joe.KeyInput.callListenersUntilConsumed("keyTap", keyCode);
  },
  
  keyHold: function(keyCode) {
    joe.KeyInput.callListenersUntilConsumed("keyHold", keyCode);
  },
  
  keyDoubleTap: function(keyCode) {
    joe.KeyInput.callListenersUntilConsumed("keyDoubleTap", keyCode);
  },
  
  // Key codes
  KEYS: {
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  },
}],
{
  // Object Definitions ////////////////////////////////////////////////////////////
});

document.addEventListener("keydown", joe.KeyInput.keyPress, true);
document.addEventListener("keyup", joe.KeyInput.keyRelease, true);

// Support for updates
joe.UpdateLoop.addListener(joe.KeyInput);