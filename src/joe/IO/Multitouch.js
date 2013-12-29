// >Converts touchStart, touchMove, and touchEnd events into mouseDown, mouseMove, and mouseEnd events, respectively.
//
// Usage
//  var myListenerObject = {
//  mousePress: function(x, y) { ... },
//  mouseRelease: function(x, y) { ... }
//};
//

joe.Multitouch = new joe.ClassEx([
  joe.Listeners,
  {
    pointInfo: {clientX:0, clientY:0, srcElement:null},
    
    touchStart: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.touches.length; ++i) {
          joe.MouseInput.getClientPos(e.touches[i]);
          joe.MouseInput.callListenersUntilConsumed("touchDown",
                                                    e.touches[i].identifier,
                                                    joe.Multitouch.pointInfo.clientX,
                                                    joe.Multitouch.pointInfo.clientY);    
        }
      }
    },
    
    touchMove: function(e) {
      if (e) {
        // TODO: do something here?
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
      
      joe.Multitouch.pointInfo.clientX = x;
      joe.Multitouch.pointInfo.clientY = y;
      joe.Multitouch.pointInfo.srcElement = document._gameCanvas ? document._gameCanvas : null;
    },
    
    touchEnd: function(e) {
      var i = 0;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
        
        for (i=0; i<e.touches.length; ++i) {
          joe.MouseInput.getClientPos(e.touches[i]);
          joe.MouseInput.callListenersUntilConsumed("touchUp",
                                                    e.touches[i].identifier,
                                                    joe.Multitouch.pointInfo.clientX,
                                                    joe.Multitouch.pointInfo.clientY);    
        }
      }
    }
  }
],
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("touchstart", joe.Multitouch.touchStart, true);
window.addEventListener("touchmove", joe.Multitouch.touchMove, true);
window.addEventListener("touchend", joe.Multitouch.touchEnd, true);
