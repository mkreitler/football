fb.StateTrainingMenu = new joe.ClassEx({
  TITLE_PADDING: 50,
},
{
  requires: joe.GameState.inputHandlers,

  font: null,
  commands: null,
  guiManager: null,

  init: function(fonts) {
    var self = this;

    this.font = fonts[0];
    this.guiManager = new joe.GuiClass();

    this.commands = {
      mouseUp: function(x, y) {
        return false;
      },

      touchDown: function(id, x, y) {
        return false;
      }
    }

    this.guiManager.addWidget(new joe.GUI.TextMenu(
      joe.Graphics.getWidth() * 0.5,
      joe.Graphics.getHeight() * 0.5,
      this.font,
      [
        {text: fb.Strings.TRAINING_TITLE,
         inputHandlers: null,
         anchorX: 0.5,
         padding: fb.StateTrainingMenu.TITLE_PADDING,
        },
        {text: fb.Strings.TRAINING,
         inputHandlers: {mouseUp: function(x, y) {self.message("startDashTraining"); return true;},
                         touchDown: function(x, y) {self.message("startDashTraining"); return true;}
                        },
         anchorX: 0.5
        },
        {text: fb.Strings.TRAINING_DASH,
         inputHandlers: {mouseUp: function(x, y) {self.message("startDashTraining"); return true;},
                         touchDown: function(x, y) {self.message("startDashTraining"); return true;}
                        },
         anchorX: 0.5
        },
        {text: fb.Strings.TRAINING_SHUTTLE,
         inputHandlers: {mouseUp: function(x, y) {self.message("startDashTraining"); return true;},
                         touchDown: function(x, y) {self.message("startDashTraining"); return true;}
                        },
         anchorX: 0.5
        },
        {text: fb.Strings.TRAINING_PASSING,
         inputHandlers: {mouseUp: function(x, y) {self.message("startDashTraining"); return true;},
                         touchDown: function(x, y) {self.message("startDashTraining"); return true;}
                        },
         anchorX: 0.5
        },
        {text: fb.Strings.TRAINING_SCRIMMAGE,
         inputHandlers: {mouseUp: function(x, y) {self.message("startDashTraining"); return true;},
                         touchDown: function(x, y) {self.message("startDashTraining"); return true;}
                        },
         anchorX: 0.5
        }                 
      ],
      0.5,
      0.5,
      0.1,
      null
    ));
  },

  enter: function() {
    joe.MouseInput.addListener(this.guiManager);
    joe.Multitouch.addListener(this.guiManager);
  },

  exit: function() {
    joe.MouseInput.removeListener(this.guiManager);
    joe.Multitouch.removeListener(this.guiManager);
  },

  draw: function(gfx) {
    joe.Graphics.clearToColor("#000000");

    if (this.guiManager) {
      this.guiManager.draw(gfx);
    }
  },

  update: function(dt, gameTime) {
    if (this.guiManager) {
      this.guiManager.update(dt, gameTime);
    }
  },
});

