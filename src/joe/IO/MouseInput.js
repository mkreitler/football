// Singleton that captures mouse input for the game.
//
// MouseListener module:
//   mouseDown: function(x, y) {};
//   mouseUp: function(x, y) {};
//   mouseDrag: function(x, y) {};
//   mouseOver: function(x, y) {};
//   mouseClick: function(x, y) {};
//   mouseDoubleClick: function(x, y) {};
//
// myInstance = new myClass();
//
// joe.MouseInput.addListener(myInstance);</pre>

joe.MouseInput = new joe.ClassEx([
joe.Listeners, {
  // Static definitions /////////////////////////////////////////////////////
  doubleTapInterval: 200,
  holdInterval: 333,
  mouseState: {x: -1, y:-1, bDown: false, bOff: false, pressTime: 0, pressCount: 0},
  
  setDoubleTapInterval: function(newInterval) {
    joe.MouseInput.doubleTapInterval = newInterval;
  },
  
  setHoldInterval: function(newInterval) {
    joe.MouseInput.holdInterval = newInterval;
  },
  
  init: function() {
    // Nothing to do here.
  },
  
  getClientX: function(e) {
    return e.srcElement ? e.clientX - e.srcElement.offsetLeft : e.clientX;
  },
  
  getClientY: function(e) {
    return e.srcElement ? e.clientY - e.srcElement.offsetTop : e.clientY;
  },
  
  mouseUp: function(e) {
    var x = joe.MouseInput.getClientX(e ? e : window.event);
    var y = joe.MouseInput.getClientY(e ? e : window.event);
    
    // console.log("Mouse up at ", x, y);
    
    joe.MouseInput.mouseState.bDown = false;
    window.removeEventListener("mousemove", joe.MouseInput.mouseDrag, true);
    
    joe.MouseInput.callListenersUntilConsumed("mouseUp", x, y);
    
    (e ? e : event).preventDefault();
  },
  
  mouseDown: function(e) {
    var x = joe.MouseInput.getClientX(e ? e : window.event);
    var y = joe.MouseInput.getClientY(e ? e : window.event);
    var curTime = joe.UpdateLoop.getGameTime();
    
    // console.log("Mouse down at", x, y);
    
    if (curTime - joe.MouseInput.mouseState.pressTime < joe.MouseInput.doubleTapInterval) {
        joe.MouseInput.mouseDoubleClick(e);
    }
    else {
      joe.MouseInput.mouseState.pressCount = 1;
      joe.MouseInput.mouseState.pressTime = curTime;
    }
    
    joe.MouseInput.mouseState.x = x;
    joe.MouseInput.mouseState.y = y;

    joe.MouseInput.callListenersUntilConsumed("mouseDown", x, y);    
    joe.MouseInput.mouseState.bDown = true;
    
    window.addEventListener("mousemove", joe.MouseInput.mouseDrag, true);
    
    (e ? e : event).preventDefault();
  },
  
  mouseDrag: function(e) {
    var x = joe.MouseInput.getClientX(e ? e : window.event);
    var y = joe.MouseInput.getClientY(e ? e : window.event);
    
    joe.MouseInput.mouseState.pressTime = 0;
    
    // console.log("Mouse drag at", x, y);

    joe.MouseInput.callListenersUntilConsumed("mouseDrag", x, y);    
    
    (e ? e : event).preventDefault();
  },
  
  mouseOver: function(e) {
    // var x = joe.MouseInput.getClientX(e ? e : window.event);
    // var y = joe.MouseInput.getClientY(e ? e : window.event);
    // console.log("Mouse over at", x, y);
  },
  
  mouseOut: function(e) {
    var x = joe.MouseInput.getClientX(e ? e : window.event);
    var y = joe.MouseInput.getClientY(e ? e : window.event);
    // console.log("Mouse out at", x, y);
    
    joe.MouseInput.mouseState.bDown = false;
    joe.MouseInput.mouseState.pressCount = 0;
    window.removeEventListener("mousemove", joe.MouseInput.mouseDrag, true);
  },
  
  mouseHold: function() {
    var x = joe.MouseInput.mouseState.x;
    var y = joe.MouseInput.mouseState.y;
    
    // console.log("Mouse hold at", x, y);
    
    joe.MouseInput.callListenersUntilConsumed("mouseHold", x, y);
  },
  
  mouseClick: function() {
    var x = joe.MouseInput.mouseState.x;
    var y = joe.MouseInput.mouseState.y;
    var i = 0;

    // console.log("Mouse click at", x, y);

    joe.MouseInput.callListenersUntilConsumed("mouseClick", x, y);    
  },
  
  mouseDoubleClick: function(e) {
    var x = e ? e.clientX : window.event.clientX;
    var y = e ? e.clientY : window.event.clientY;
    
    joe.MouseInput.mouseState.pressTime = 0;
    joe.MouseInput.mouseState.pressCount = 0;
    
    // console.log("Mouse double click at", x, y);

    joe.MouseInput.callListenersUntilConsumed("mouseDoubleClick", x, y);    
  },

  update: function(dt, gameTime) {    
    if (joe.MouseInput.mouseState.bDown && joe.MouseInput.mouseState.pressTime > 0) {
      // Check for hold.
      if (gameTime - joe.MouseInput.mouseState.pressTime > joe.MouseInput.holdInterval) {
          joe.MouseInput.mouseState.pressTime = 0;
          joe.MouseInput.mouseState.pressCount = 0;
          joe.MouseInput.mouseHold();
      }
    }
    else if (joe.MouseInput.mouseState.pressTime > 0 && !joe.MouseInput.mouseState.bDown) {
      // Check for click.
      if (gameTime - joe.MouseInput.mouseState.pressTime > joe.MouseInput.doubleTapInterval) {
        joe.MouseInput.mouseState.pressTime = 0;
        joe.MouseInput.mouseState.pressCount = 0;
        joe.MouseInput.mouseClick();
      }
    }
  },
}],
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("mouseover", joe.MouseInput.mouseOver, true);
window.addEventListener("mouseout", joe.MouseInput.mouseOut, true);
window.addEventListener("mousedown", joe.MouseInput.mouseDown, true);
window.addEventListener("mouseup", joe.MouseInput.mouseUp, true);

// Support for updates
joe.UpdateLoop.addListener(joe.MouseInput);
