/**
 * Draws a labeled box and responds to mouse and touch events.
 */

joe.GUI.ClickBox = new joe.ClassEx(
  // Stati Definition ///////////////////////////////////////////////////////////
  {
    clickBoxes: [],

    addClickBox: function(newBox) {
      this.clickBoxes.push(newBox);
    },

    removeClickBox: function(box) {
      joe.Utility.erase(this.clickBoxes, box);
    }
  },

  // Instance Definition ////////////////////////////////////////////////////////
  {
    requires: joe.GUI.WidgetModule,

    onColor: "#ffff00",
    offColor: "#0000ff",
    bOn: false,
    customDraw: null,

    init: function(x, y, width, height, onColor, offColor, inputCallbacks, customDraw) {
      this.AABBset(x, y, width, height);

      this.onColor = onColor || "#ffff00";
      this.offColor = offColor || "#0000ff";

      this.inputCallbacks = inputCallbacks || null;
      this.customDraw = customDraw;

      joe.GUI.ClickBox.addClickBox(this);
    },

    destroy: function() {
      joe.GUI.ClickBox.removeClickBox(this);
    },

    update: function(dt, gameTime, worldX, worldY) {
      // Anything to do here?
    },

    isOn: function() {
      return this.bIsOn && this.widgetActive();
    },

    press: function() {
      this.bIsOn = true;
    },

    release: function() {
      this.bIsOn = false;
    },

    draw: function(context, worldX, worldY) {
      var color = joe.GUI.INACTIVE_COLOR;

      if (context && this.widgetVisible()) {
        this.AABBoffset(worldX, worldY);

        context.save();
        if (this.widgetActive()) {
          color = this.bIsOn ? this.onColor : this.offColor;
        }

        context.strokeStyle = color;
        context.fillStyle = color;

        this.AABBdraw(context, color);

        if (this.customDraw) {
          this.customDraw.call(this, context, worldX, worldY);
        }

        context.restore();

        this.AABBoffset(-worldX, -worldY);
      }
    },

    mouseDown: function(x, y) {
      var bConsumed = false;

      if (this.widgetActive() && this.widgetVisible()) {
        this.press();

        this.widgetInputHandlers.mouseDown.call(this, x, y);

        bConsumed = true;
      }

      return bConsumed;
    },

    mouseUp: function(x, y) {
      var bConsumed = false;

      if (this.widgetActive() && this.widgetVisible()) {
        this.release();

        this.widgetInputHandlers.mouseUp.call(this, x, y);

        bConsumed = true;
      }

      return bConsumed;
    }
  }
);
