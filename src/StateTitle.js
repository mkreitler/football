fb.StateTitleClass = new joe.ClassEx({
},
{
  font: null,
  commands: null,

  init: function(fonts) {
    this.font = fonts[0];

    this.commands = {
      mouseUp: function(x, y) {
        fb.game.startPlayState();
      },

      touchDown: function(id, x, y) {
        fb.game.startPlayState();
      }
    }
  },

  enter: function() {

  },

  exit: function() {

  },

  draw: function(gfx) {
    joe.Graphics.clearToColor("#000000");

    if (this.font) {
      this.font.draw(gfx, "Football!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, joe.Resources.BitmapFont.ALIGN.CENTER);
    }
  },

  update: function(dt, gameTime) {

  },
});

