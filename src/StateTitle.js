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
      this.font.draw(gfx, "Football!", joe.Graphics.getWidth() / 2, joe.Graphics.getHeight() / 2, joe.Resources.BitmapFont.ALIGN.CENTER);
    }
  },

  update: function(dt, gameTime) {

  },

  mouseUp: function(x, y) {
    fb.game.startPlayState();
  },

  touchDown: function(id, x, y) {
    fb.game.startPlayState();
  }
});

