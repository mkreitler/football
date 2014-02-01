// Provides access to the canvas.
//
// Usage:
// <pre>var newRenderObj = {
//   draw: function(graphics) {
//     graphics.lock();
//     /* Do drawing stuff here. */
//     graphics.unlock();
//   }
// }</pre>
// graphics.addListener(newRenderObj);
// graphics.start();
//
// <strong>Notes</strong>
// Update code adapted from Paul Irish's <a href="http://paulirish.com/2011/requestanimationframe-for-smart-animating/" target=_blank>article</a> on 'requestAnimFrame':
// [END HELP] 

// Create an on-screen canvas into which we'll render.
joe._gfx = {
  styles: window.frameElement ? window.frameElement.getAttribute("style").split(";") : null,
  i: 0,
  curStyle: null,
  index: -1,
  width: 0,
  height: 0
};

// From Paul Irish's article on 'requestAnimFrame':
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//
// Shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ) {
            window.setTimeout(callback, 1000 / 60);
          };
});

joe.GraphicsClass = new joe.ClassEx(null, [
  joe.Listeners,
  {
    gameCanvas: null,
    activeContext: null,
    buffers: [],
    bWantsToRender: false,
    newBufferCount: 0,
    screenContext: null,
    wantWidth: 0,
    wantHeight: 0,
    globalScale: 1,
    globalAlpha: 1,

    init: function(wantWidth, wantHeight) {

      this.wantWidth = wantWidth;
      this.wantHeight = wantHeight;

      // Create the game canvas (what we actually see).
      this.resizeCanvas();

      // Create the back buffer (what we render the game into).
      this.createOffscreenBuffer(wantWidth, wantHeight, true);
    },

    setGlobalAlpha: function(newAlpha) {
      if (this.activeContext) {
        this.activeContext.globalAlpha = newAlpha;
      }
    },

    resizeCanvas: function() {
      if (document.body) {
        var pageWidth = joe.Utility.getPageWidth(),
            pageHeight = joe.Utility.getPageHeight(),
            bAppendCanvas = !this.gameCanvas,
            wantAspectRatio = this.wantWidth / Math.max(1, this.wantHeight),
            aspectRatio = pageWidth / Math.max(1, pageHeight),
            width = this.wantWidth,
            height = this.wantHeight;

        if (aspectRatio < wantAspectRatio) {
          // The actual screen is narrower than the desired display.
          // In this case, we'll crop the height and scale to the
          // actual width.
          this.globalScale = pageWidth / this.wantWidth;
        }
        else {
          // The actual screen is wider (or exactly equal to) the
          // desired display. In this case we'll crop the width and
          // scale to the actual height.
          this.globalScale = pageHeight / this.wantHeight;
        }

        if (!this.gameCanvas) {
          this.gameCanvas = document.createElement(joe.Utility.isMobile() ? 'screencanvas' : 'canvas');
//          this.gameCanvas = document.createElement("canvas");
        }

        width = Math.round(width * this.globalScale);
        height = Math.round(height * this.globalScale);

        this.gameCanvas.setAttribute('width', width);
        this.gameCanvas.setAttribute('height', height);
        this.gameCanvas.setAttribute('id', 'gameCanvas');

        this.gameCanvas.style.position = "absolute";

        this.gameCanvas.style.left = Math.round((pageWidth - width) * 0.5) + "px";
        this.gameCanvas.style.top = Math.round((pageHeight - height) * 0.5) + "px";

        if (bAppendCanvas) {
          document.body.appendChild(this.gameCanvas);
        }

        this.setCanvas(this.gameCanvas);
      }
    },

    render: function() {
      var i;  // Dummy text node used to force WebKit browsers to refresh the canvas.
      
      if (this.bWantsToRender) {
        window.requestAnimFrame()(this.render.bind(this));
      }

      this.callListeners("draw", this.activeContext);

      if (this.activeContext !== this.screenContext) {
        this.screenContext.save();
        this.screenContext.scale(this.globalScale, this.globalScale);
        this.screenContext.drawImage(this.activeContext.canvas, 0, 0);
        this.screenContext.restore();
      }

      // var bStyle = document.body.style;
      // bStyle.backgroundColor = "#fad";

      // Force webkit browsers to refresh the page.
      // document.body.removeChild(document.body.appendChild(document.createElement('style')));      
      // document.body.style.webkitTransform = 'scale(1)';
      // this.gameCanvas.style.webkitTransform = 'scale(1)';

      // var n = document.createTextNode(' ');
      // this.gameCanvas.appendChild(n);
      // setTimeout(function(){n.parentNode.removeChild(n);}, 0);
    },

    setCanvas: function(newCanvas) {
      if (newCanvas) {
        this.gameCanvas = newCanvas;
        // The basic graphics object is the context of the primary canvas.
        this.screenContext = this.gameCanvas.getContext('2d');
        this.activeContext = this.screenContext;
      }
    },

    getCanvas: function() {
      return this.gameCanvas;
    },

    getScreenWidth: function() {
      return this.gameCanvas ? this.gameCanvas.width : 0;
    },

    getScreenHeight: function() {
      return this.gameCanvas ? this.gameCanvas.height : 0;
    },

    getWidth: function() {
      return this.wantWidth;
    },

    getHeight: function() {
      return this.wantHeight;
    },

    createOffscreenBuffer: function(width, height, setAsActive) {
      var offscreenBuffer = this.newCanvas(width || this.gameCanvas.width, height || this.gameCanvas.height);

      if (setAsActive) {
        this.setActiveBuffer(offscreenBuffer);
      }

      return offscreenBuffer;
    },

    destroyBuffer: function(buffer) {
      joe.Utility.erase(this.buffers, buffer);
    },

    setActiveBuffer: function(buffer) {
      this.activeContext = buffer ? buffer.getContext('2d') : this.screenContext;
    },

    getActiveContext: function() {
      return this.activeContext;
    },

    clear: function(buffer, width, height) {
      var targetBuffer = buffer || this.activeContext;
      var clearWidth = width || this.getWidth();
      var clearHeight = height || this.getHeight();
      
      targetBuffer.clearRect(0, 0, clearWidth, clearHeight);
    },

    copyFrom: function(otherBuffer, left, top) {
      this.activeContext.drawImage(otherBuffer, left, top);
    },

    lock: function(buffer) {
      var targetBuffer = buffer || this.activeContext;
      
      targetBuffer.save();
    },

    unlock: function(buffer) {
      var targetBuffer = buffer || this.activeContext;
      
      targetBuffer.restore();
    },

    clearToColor: function(color, buffer, width, height) {
      var targetBuffer = buffer || this.activeContext;
      var clearWidth = width || this.getWidth();
      var clearHeight = height || this.getHeight();
      
      targetBuffer.fillStyle = color;
      targetBuffer.fillRect(0, 0, clearWidth, clearHeight);
    },

    newCanvas: function(width, height) {
      this.newBufferCount++;
      var newCanvas = document.createElement("canvas");

      newCanvas.width = width;
      newCanvas.height = height;
      
      this.buffers.push(newCanvas);

      return newCanvas;   
    },

    start: function() {
      this.bWantsToRender = true;
      this.render();
    },

    stop: function() {
      this.bWantsToRender = false;
    }
  }
]);

// gameWidth and gameHeight, if used, should be set in the first file loaded
// into the browser.
joe.Graphics = new joe.GraphicsClass(gameWidth || 1024, gameHeight || 768);


