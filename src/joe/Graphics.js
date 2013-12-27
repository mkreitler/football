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

    init: function(left, top, width, height) {
      if (document.body) {
        var pageWidth = joe.Utility.getPageWidth();
        var pageHeight = joe.Utility.getPageHeight();

        // console.log(pageWidth, pageHeight);

        this.gameCanvas = document.createElement("canvas");

        this.gameCanvas.setAttribute('width', width);
        this.gameCanvas.setAttribute('height', height);
        this.gameCanvas.setAttribute('id', 'gameCanvas');

        this.gameCanvas.style.position = "absolute";
        this.gameCanvas.style.left = left + Math.round((pageWidth - width) * 0.5) + "px";
        this.gameCanvas.style.top = top + Math.round((height - pageHeight) * 0.5) + "px";

        document.body.appendChild(this.gameCanvas);

        this.setCanvas(this.gameCanvas);
      }
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

    getWidth: function() {
      return this.gameCanvas.width;
    },

    getHeight: function() {
      return this.gameCanvas.height;
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
      var clearWidth = width || this.gameCanvas.width;
      var clearHeight = height || this.gameCanvas.height;
      
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
      var clearWidth = width || this.gameCanvas.width;
      var clearHeight = height || this.gameCanvas.height;
      
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

    render: function() {
      var i;
      
      if (this.bWantsToRender) {
        window.requestAnimFrame()(this.render.bind(this));
      }

      this.callListeners("draw", this.activeContext);

      if (this.activeContext !== this.screenContext) {
        this.screenContext.drawImage(this.activeContext, 0, 0);
      }
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
joe.Graphics = new joe.GraphicsClass(0, 0, gameWidth || 1024, gameHeight || 768);


