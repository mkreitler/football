fb.StatePlayClass = new joe.ClassEx({
},
{
  font: null,
  spriteSheet: null,
  fieldImg: null,
  playView: null,
  playCam: null,

  init: function(font, spriteImg, fieldImg) {
    this.font = font;
    this.spriteSheet = new joe.SpriteSheet(spriteImg, 3, 2);
    this.fieldImg = fieldImg;

    // Create the playCam and playView.
    this.playCam = new joe.Camera(joe.Graphics.getWidth(), this.fieldImg.height);
    this.playCam.setSourcePosition(0, 0);
    this.playCam.setDestPosition(joe.Graphics.getWidth() * 0.5 - this.fieldImg.width * 0.5, 10);
    // this.playCam.setMagnification(2);

    this.playView = new joe.View(this.fieldImg.width, this.fieldImg.height, this.playCam);
    this.playView.addLayer(new joe.LayerBitmap(this.fieldImg), 100);
  },

  enter: function() {

  },

  exit: function() {

  },

  draw: function(gfx) {
    var i =0;

    joe.Graphics.clearToColor("#000000");

    this.playView.draw(gfx);
    if (this.spriteSheet) {
      for (i=0; i<5; ++i) {
        this.spriteSheet.drawIndexed(gfx, 0, 10 + i * 40, i);
      }
    }
  },

  update: function(dt, gameTime) {

  }
});

