fb.StateTitleClass = new joe.ClassEx({
},
{
  font: null,

  init: function(font) {
    this.font = font;
  },

  enter: function() {

  },

  exit: function() {

  },

  draw: function(gfx) {
    joe.Graphics.clearToColor("#000000");

    if (this.font) {
      this.font.draw(gfx, "Football!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, "#00FF00", 72, 0.5);
    }
  },

  update: function(dt, gameTime) {

  },

  mouseUp: function(x, y) {
    fb.game.startPlayState();
  }
});

