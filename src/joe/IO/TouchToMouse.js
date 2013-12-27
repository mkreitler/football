// >Converts touchStart, touchMove, and touchEnd events into mouseDown, mouseMove, and mouseEnd events, respectively.
//
// Usage
//  var myListenerObject = {
//  mousePress: function(x, y) { ... },
//  mouseRelease: function(x, y) { ... }
//};
//

joe.TouchToMouse = new joe.ClassEx({
  pointInfo: {clientX:0, clientY:0, srcElement:null},
  
  touchStart: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches.length === 1) {
        joe.TouchToMouse.getClientPos(e.touches[0]);
        joe.MouseInput.mouseDown(joe.TouchToMouse.pointInfo);
      }
    }
  },
  
  touchMove: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.touches.length === 1) {
        joe.TouchToMouse.getClientPos(e.touches[0]);
        joe.MouseInput.mouseDrag(joe.TouchToMouse.pointInfo);
      }
    }
  },
  
  getClientPos: function(touch) {
    // Adapted from gregers' response in StackOverflow:
    // http://stackoverflow.com/questions/5885808/includes-touch-events-clientx-y-scrolling-or-not
    
    var winOffsetX = window.pageXoffset;
    var winOffsetY = window.pageYoffset;
    var x = touch.clientX;
    var y = touch.clientY;
    
    if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
        touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
      x = x - winOffsetX;
      y = y - winOffsetY;
    }
    else if (y < (touch.pageY - winOffsetY) || x < (touch.pageX - winOffsetX)) {
      x = touch.pageX - winOffsetX;
      y = touch.pageY - winOffsetY;
    }
    
    joe.TouchToMouse.pointInfo.clientX = x;
    joe.TouchToMouse.pointInfo.clientY = y;
    joe.TouchToMouse.pointInfo.srcElement = document._gameCanvas ? document._gameCanvas : null;
  },
  
  touchEnd: function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    joe.MouseInput.mouseUp(joe.TouchToMouse.pointInfo);
  }
},
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("touchstart", joe.TouchToMouse.touchStart, true);
window.addEventListener("touchmove", joe.TouchToMouse.touchMove, true);
window.addEventListener("touchend", joe.TouchToMouse.touchEnd, true);

