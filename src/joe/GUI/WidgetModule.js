/**
 * Provides the base interface for objects managed by the GUI.
 */
joe.GUI.TRANSITION_TYPES = {NONE:0, FADE:1, SLIDE_X:2, SLIDE_Y:3};
joe.GUI.DEFAULT_TRANSITION_TIME = 1;  // In seconds

joe.GUI.WidgetModule = {
  requires: joe.MathEx.AABBmodule,

  widgetChildren: [],
  bWidgetVisible: true,
  bWidgetActive: true,
  inputHandlers: null,
  bWidgetInitialized: false,
  widgetTransIn: null,
  widgetTransOut: null,
  widgetTransType: joe.GUI.TRANSITION_TYPES.NONE,
  widgetTransPeriod: joe.GUI.DEFAULT_TRANSITION_TIME,
  widgetTransTimer: 0,
  widgetTransGoal: 0,
  bWidgetTransitioning: false,
  widgetAlpha: 1,
  widgetTransObserver: null,
  widgetTransWantPos: {x:0, y:0},

  staticInit: function() {
    if (!this.bWidgetInitialized) {
      joe.loadModule.call(this, this.widgetInputHandlers);
      this.bWidgetInitialized = true;
    }
  },

  widgetSetTransition: function(transType, transPeriod, observer) {
    this.widgetTransPeriod = transPeriod || Math.max(0, joe.GUI.DEFAULT_TRANSITION_TIME);
    this.widgetTransObserver = observer || null;

    switch(transType) {
      case joe.GUI.TRANSITION_TYPES.FADE:
        this.widgetTransIn = this.widgetFadeIn;
        this.widgetTransOut = this.widgetFadeOut;
      break;

      case joe.GUI.TRANSITION_TYPES.SLIDE_X:
        this.widgetTransIn = this.widgetSlideInX;
        this.widgetTransOut = this.widgetSlideOutX;
        this.widgetTransWantPos.x = this.bounds.x;
        this.widgetTransWantPos.y = this.bounds.y;
      break;

      case joe.GUI.TRANSITION_TYPES.SLIDE_Y:
        this.widgetTransIn = this.widgetSlideInY;
        this.widgetTransOut = this.widgetSlideOutY;
        this.widgetTransWantPos.x = this.bounds.x;
        this.widgetTransWantPos.y = this.bounds.y;
      break;

      default:
        this.widgetTransIn = null;
        this.widgetTransOut = null;
      break;
    }
  },

  widgetSetVisible: function(newVisible) {
    this.bWidgetVisible = newVisible;
  },

  widgetSetActive: function(newActive) {
    if (this.bWidgetActive !== newActive) {
      if (this.transType) {
        this.bWidgetTransitioning = true;
        this.widgetTransGoal = newActive ? this.widgetTransPeriod : 0;

        // Deactivate widget until transition complete.
        this.bWidgetActive = false;
      }
      else {
        this.bWidgetActive = newActive;
      }
    }
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

  updateWidgetTransition: function(dt) {
    var param = -1; // Indicates transition complete

    if (this.widgetTransTimer < this.widgetTransGoal && this.widgetTransIn) {
      this.widgetTransTimer += dt * 0.001;
      this.widgetTransTimer = Math.min(this.widgetTransTimer, this.widgetTransGoal);
      param = MathEx.sin(Math.PI * 0.5 * this.widgetTransTimer / this.widgetTransPeriod);
      this.widgetTransIn(param);

      if (param === 1) {
        this.bWidgetActive = true;

        if (this.widgetTransObserver) {
          this.widgetTransObserver.onWidgetTransitionedIn(this);
        }
      }
    }
    else if (this.widgetTransTimer > this.widgetTransGoal) {
      this.widgetTransTimer -= dt * 0.001;
      this.widgetTransTimer = Math.max(0, this.widgetTransTimer);
      param = MathEx.sin(Math.PI * 0.5 * this.widgetTransTimer / this.widgetTransPeriod);
      this.widgetTransOut(param);

      if (param === 0) {
        this.bWidgetActive = false; // Should already be the case, but for safety's sake...

        if (this.widgetTransObserver) {
          this.widgetTransObserver.onWidgetTrasitionedOut(this);
        }
      }
    }

    if (this.widgetTransTimer === this.widgetTransGoal) {
      this.bWidgetTransitioning = false;
    }

    return param;
  },

  updateWidget: function(dt, gameTime, parentX, parentY) {
    if (this.bWidgetTransitioning || this.bWidgetActive) {
      if (this.bWidgetTransitioning) {
        this.updateWidgetTransition(dt);
      }

      if (this.update) {
        this.update(dt, gameTime, parentX, parentY);
      }

      this.updateWidgetChildren(dt, gameTime, parentX, parentY);
    }
  },

  drawWidget: function(context, parentX, parentY) {
    if (this.bWidgetVisible) {
      context.save();
      context.globalAlpha = this.widgetAlpha;

      if (this.draw) {
        this.draw(context, parentX, parentY);
      }

      this.drawWidgetChildren(context, parentX, parentY);
      context.restore();
    }
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

  // Default Transitions //////////////////////////////////////////////////////
  widgetTransitions: {
    widgetFadeIn: function(param) {
      this.widgetAlpha = param;
    },

    widgetFadeOut: function(param) {
      this.widgetAlpha = param;
    },

    widgetSlideInX: function(param) {
      this.bounds.x = this.widgetTransWantPos.x * param + (1 - param) * -(joe.Graphics.getWidth() + this.bounds.width);
    },

    widgetSlideOutX: function(param) {
      this.bounds.x = this.widgetTransWantPos.x * param + (1 - param) * joe.Graphics.getWidth();
    },

    widgetSlideInY: function(param) {
      this.bounds.y = this.widgetTransWantPos.y * param + (1 - param) * -(joe.Graphics.getHeight() + this.bounds.height);
    },

    widgetSlideOutY: function(param) {
      this.bounds.y = this.widgetTransWantPos.y * param + (1 - param) * joe.Graphics.getHeight();
    }
  },

  // Default Input Handlers ///////////////////////////////////////////////////
  widgetInputHandlers: {
    mouseUp: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseUp ? this.widgetChildren[i].mouseUp(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseUp ? this.inputCallbacks.mouseUp(x, y) : true) : false;
      }

      return bHandled;
    },

    mouseDown: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseDown ? this.widgetChildren[i].mouseDown(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseDown ? this.inputCallbacks.mouseDown(x, y) : true) : false;
      }

      return bHandled;
    },

    mouseDrag: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseDrag ? this.widgetChildren[i].mouseDrag(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseDrag ? this.inputCallbacks.mouseDrag(x, y) : true) : false;
      }

      return bHandled;
    },

    mouseOver: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseOver ? this.widgetChildren[i].mouseOver(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseOver ? this.inputCallbacks.mouseOver(x, y) : true) : false;
      }

      return bHandled;
    },

    mouseHold: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseHold ? this.widgetChildren[i].mouseHold(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseHold ? this.inputCallbacks.mouseHold(x, y) : true) : false;
      }

      return bHandled;
    },

    mouseClick: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseClick ? this.widgetChildren[i].mouseClick(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseClick ? this.inputCallbacks.mouseClick(x, y) : true) : false;
      }

      return bHandled;
    },

    mouseDoubleClick: function(x, y) {
      var i = 0,
          bHandled = false;

      // Give children a chance to consume the event.
      if (this.bWidgetActive && this.bWidgetVisible) {
        for (i=0; !bHandled && i<this.widgetChildren.length; ++i) {
          if (this.widgetChildren[i].inputCallbacks) {
            bHandled = this.widgetChildren[i].inputCallbacks.mouseDoubleClick ? this.widgetChildren[i].mouseDoubleClick(x, y) : true;
          }
        }
      }

      if (!bHandled) {
        bHandled = this.inputCallbacks ? (this.inputCallbacks.mouseDoubleClick ? this.inputCallbacks.mouseDoubleClick(x, y) : true) : false;
      }

      return bHandled;
    },
  }
};
