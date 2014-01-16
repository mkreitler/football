/**
 * Captures mouse input and forwards to custom handler.
 */

joe.GUI.CaptureBox = new joe.ClassEx(
  // Static Definition //////////////////////////////////////////////////////
  {
  	captureBoxes: [],

  	addCaptureBox: function(newBox) {
  	  this.captureBoxes.push(newBox);
  	},

  	removeCaptureBox: function(box) {
  	  joe.Utility.erase(this.captureBoxes, box);
  	}
  },

  // Instance Definition ////////////////////////////////////////////////////
  {
    requires: joe.GUI.WidgetModule,

    onColor: "#ffff00",
    offColor: "#0000ff",
    bIsOn: false,
    customDraw: null,

    init: function(x, y, width, height, onColor, offColor, inputCallbacks, customDraw) {
      this.AABBset(x, y, width, height);

      this.onColor = onColor || "#ffff00";
      this.offColor = offColor || "#0000ff";

      this.inputCallbacks = inputCallbacks || null;
      this.customDraw = customDraw;

      joe.GUI.CaptureBox.addCaptureBox(this);
    },

    destroy: function() {
      joe.GUI.CaptureBox.removeCaptureBox(this);
    },

    isOn: function() {
    	return this.bIsOn && this.widgetActive();
    },

    draw: function(context, worldX, worldY) {
    	var color = this.bIsOn ? this.onColor : this.offColor;

    	if (this.widgetVisible()) {
    		this.AABBoffset(worldX, worldY);

      	context.save();

      	this.AABBdraw(context, color);

      	this.strokeStyle = color;

      	if (this.customDraw) {
      		this.customDraw(context, worldX, worldY);
      	}

      	context.restore();

      	this.AABBoffset(-worldX, -worldY);
     }
    }
	}
);
