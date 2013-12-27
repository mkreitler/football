/**
 * Provides the base interface for objects managed by the GUI.
 */
joe.GUI.WidgetModule = {
  widgetChildren: [],
  bWidgetVisible: true,
  bWidgetActive: true,
  inputHandlers: null,
  bInitialized: false,

  staticInit: function() {
    if (!this.bInitialized) {
      joe.loadModule.call(this, this.widgetInputHandlers);
      this.bInitialized = true;
    }
  },

  widgetSetVisible: function(newVisible) {
    this.bWidgetVisible = newVisible;
  },

  widgetSetActive: function(newActive) {
    this.bWidgetActive = newActive;
  },

  widgetVisible: function() {
    return this.bWidgetVisible;
  },

  widgetActive: function() {
    return this.bWidgetActive;
  },

  widgetAddChild: function(child) {
    this.widgetChildren.push(child);
  },

  widgetRemoveChild: function(child) {
    joe.Utility.erase(this.widgetChildren, child);
  },

  widgetGetChildAt: function(x, y) {
    var widget  = this,
        i       = 0,
        bounds  = null;

    for (i=0; i<this.widgetChildren.length; ++i) {
      if (this.widgetChildren[i].AABBcontainsPoint(x, y)) {
        bounds = this.widgetChildren[i].AABBgetRef();
        widget = this.widgetChildren[i].widgetGetChildAt(x - bounds.x, y - bounds.y);

        break;
      }
    }

    return widget;
  },

  updateWidget: function(dt, gameTime, parentX, parentY) {
    if (this.update) {
      this.update(dt, gameTime, parentX, parentY);
    }

    this.updateWidgetChildren(dt, gameTime, parentX, parentY);
  },

  drawWidget: function(context, parentX, parentY) {
    if (this.draw) {
      this.draw(context, parentX, parentY);
    }

    this.drawWidgetChildren(context, parentX, parentY);
  },

  updateWidgetChildren: function(dt, gameTime, parentX, parentY) {
    var i = 0,
        bounds = this.AABBgetRef();

    // Update self... (in this case, do nothing)

    // ...update children relative to self.
    for (i=0; i<this.widgetChildren.length; ++i) {
      if (this.widgetChildren[i].widgetActive()) {
        this.widgetChildren[i].update(dt, gameTime, parentX + bounds.x, parentY + bounds.y);
      }
    }
  },

  drawWidgetChildren: function(context, parentX, parentY) {
    var i = 0,
        bounds = this.AABBgetRef();

    // Draw self... (in this case, do nothing)

    // ...draw children relative to self.
    for (i=0; i<this.widgetChildren.length; ++i) {
      if (this.widgetChildren[i].widgetVisible()) {
        this.widgetChildren[i].draw(context, parentX + bounds.x, parentY + bounds.y);
      }
    }
  },

  widgetSetInputCallbacks: function(newCallbacks) {
    this.inputCallbacks = newCallbacks;
  },

  // Default Input Handlers ///////////////////////////////////////////////////
  widgetInputHandlers: {
    mouseUp: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseUp ? this.inputCallbacks.mouseUp(x, y, this) : true) : false;
    },

    mouseDown: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseDown ? this.inputCallbacks.mouseDown(x, y, this) : true) : false;
    },

    mouseDrag: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseDrag ? this.inputCallbacks.mouseDrag(x, y, this) : true) : false;
    },

    mouseOver: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseOver ? this.inputCallbacks.mouseOver(x, y, this) : true) : false;
    },

    mouseHold: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseHold ? this.inputCallbacks.mouseHold(x, y, this) : true) : false;
    },

    mouseClick: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseClick ? this.inputCallbacks.mouseClick(x, y, this) : true) : false;
    },

    mouseDoubleClick: function(x, y) {
      return this.bWidgetActive && this.bWidgetVisible && this.inputCallbacks ? (this.inputCallbacks.mouseDoubleClick ? this.inputCallbacks.mouseDoubleClick(x, y, this) : true) : false;
    },
  }
};
