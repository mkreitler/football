joe.SpriteSheet = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  srcImage: null,
  rows: 0,
  cols: 0,
  spriteWidth: 0,
  spriteHeight: 0,

  init: function(srcImage, rows, cols) {
    this.srcImage = srcImage;
    this.rows = Math.max(1, rows);
    this.cols = Math.max(1, cols);
    this.spriteWidth = this.srcImage.width / this.cols;
    this.spriteHeight = this.srcImage.height / this.rows;
  },

  draw: function(gfx, x, y, row, col) {
    joe.assert(row >= 0 && row < this.rows);
    joe.assert(col >= 0 && col < this.cols);
    joe.assert(gfx);

    gfx.drawImage(this.srcImage, col * this.spriteWidth, row * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                       x, y, this.spriteWidth, this.spriteHeight);
  },

  drawIndexed: function(gfx, x, y, index) {
    var row = 0;
    var col = 0;

    joe.assert(index >= 0 && index < this.rows * this.cols);

    row = Math.floor(index / this.cols);
    col = index % this.cols;

    // TODO: draw directly instead of making a function call.
    this.draw(gfx, x, y, row, col);
  },

  drawIndexedAligned: function(gfx, x, y, index, alignX, alignY) {
    var alignX = x - alignX * this.spriteWidth;
    var alignY = y - alignY * this.spriteHeight;

    // TODO: draw directly instead of making a function call.
    this.drawIndexed(gfx, alignX, alignY, index);
  }
});
