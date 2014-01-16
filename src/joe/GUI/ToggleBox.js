/**
 * Draws a labeled box and responds to mouse and touch events.
 */

joe.GUI.ToggleBox = new joe.ClassEx(
  // Stati Definition ///////////////////////////////////////////////////////////
  {
    toggleBoxes: [],

    untoggleGroup: function(group, toggled) {
      var i = 0;

      for (i=0; i<this.toggleBoxes.length; ++i) {
        if (this.toggleBoxes[i] !== toggled && this.toggleBoxes[i].getGroup() === group) {
          this.toggleBoxes[i].forceUntoggled();
        }
      }
    },

    addToggleBox: function(newBox) {
      this.toggleBoxes.push(newBox);
    },

    removeToggleBox: function(box) {
      joe.Utility.erase(this.toggleBoxes, box);
    }
  },

  // Instance Definition ////////////////////////////////////////////////////////
  [
    {
      requires: joe.GUI.WidgetModule,

      onColor: "#ffff00",
      offColor: "#0000ff",
      bOn: false,
      customDraw: null,
      group: null,

      init: function(x, y, width, height, onColor, offColor, group, inputCallbacks, customDraw, getValue) {
        this.AABBset(x, y, width, height);

        this.onColor = onColor || "#ffff00";
        this.offColor = offColor || "#0000ff";

        this.getValue = getValue;

        this.inputCallbacks = inputCallbacks || null;

        this.setGroup(group);
        this.customDraw = customDraw;

        joe.GUI.ToggleBox.addToggleBox(this);
      },

      destroy: function() {
        joe.GUI.ToggleBox.removeToggleBox(this);
      },

      update: function(dt, gameTime, worldX, worldY) {
        // Anything to do here?
      },

      isOn: function() {
        return this.bIsOn && this.widgetActive();
      },

      setGroup: function(newGroup) {
        this.group = newGroup;
      },

      getGroup: function() {
        return this.group;
      },

      forceUntoggled: function() {
        this.bIsOn = false;
      },

      toggle: function() {
        if (!this.bIsOn && this.group) {
          joe.GUI.ToggleBox.untoggleGroup(this.group, this);
        }

        this.bIsOn = !this.bIsOn;
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
          this.toggle();

          this.widgetInputHandlers.mouseDown.call(this, x, y);

          bConsumed = true;
        }

        return bConsumed;
      },
    }
  ]
);
