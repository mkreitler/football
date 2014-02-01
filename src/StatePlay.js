fb.StatePlayClass = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  font: null,
  boardFont: null,
  spriteSheets: null,
  player: null,
  ball: null,
  fieldImg: null,
  playView: null,
  playViewport: null,
  guiView: null,
  guiViewport: null,
  guiLayer: null,
  actionLength: 0,
  MIN_ACTION_LENGTH: 10,
  MAX_ACTION_LENGTH: 1024,
  CAMERA_SCROLL_FACTOR: 0.33,
  actionSpeed: 500,   // Pixels per second
  actionTimer: 0,
  screenWidth: joe.Graphics.getWidth(),
  screenHeight: joe.Graphics.getHeight(),
  actionLayer: null,
  commands: null,
  bActionLive: false,
  playerLayer: null,
  dragArrow: {bUpdated:false, length:0, angle:-Math.PI * 0.5},
  playerDirection: {length:0, angle:-Math.PI * 0.5},

  init: function(fonts, spriteSheets, fieldImg) {
    this.font = fonts[0];
    this.boardFont = fonts[1];

    this.spriteSheets = spriteSheets;
    this.fieldImg = fieldImg;

    this.commands = new fb.PlayCommands(this);

    this.player = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.PLAYERS], 2, 3),
                                 1, 0.5, 0.5, this.fieldImg.width * 0.5, this.fieldImg.height * 0.9,
                                 0, 0, 0, 0);
    this.ball = new joe.Sprite(new joe.SpriteSheet(spriteSheets[fb.GameClass.SPRITE_INDEX.BALL], 1, 4),
                                2, 0.5, 0.5, this.fieldImg.width * 0.5, this.fieldImg.height * 0.5,
                                0, 0, 0, 0);

    // Create the playViewport and playView.
    this.playView = new joe.Scene.View(this.fieldImg.width, this.fieldImg.height,
                                       this.fieldImg.width, joe.Graphics.getHeight() - 2 * fb.GameClass.WINDOW.MARGIN_VERTICAL - fb.GameClass.WINDOW.BOARD_HEIGHT);
    this.playViewport = this.playView.getViewport();
    this.playView.setWorldPos(joe.Graphics.getWidth() * 0.5 - this.fieldImg.width * 0.5, fb.GameClass.WINDOW.MARGIN_VERTICAL + fb.GameClass.WINDOW.BOARD_HEIGHT)
    this.playView.setSourcePos(0, this.fieldImg.height - this.playViewport.getViewRect().h)

    // Add a background image view to the play layer.
    this.playView.addLayer(new joe.Scene.LayerBitmap(this.fieldImg), 100);

    // Add a sprite layer and put the player and ball sprites in it.
    this.playerLayer = new joe.Scene.SpriteLayer();
    this.playerLayer.addSprite(this.player, fb.GameClass.Z_ORDER.SPRITE_PLAYER);
    this.playerLayer.addSprite(this.ball, fb.GameClass.Z_ORDER.SPRITE_BALL);
    this.playView.addLayer(this.playerLayer, fb.GameClass.Z_ORDER.LAYER_PLAYFIELD);

    // Add the action overlay layer to the play view.
    this.actionLayer = new fb.ActionOverlay(this.font);
    this.playView.addLayer(this.actionLayer, fb.GameClass.Z_ORDER.LAYER_ACTION_OVERLAY);

    // Add the play view to the scene.
    joe.Scene.addView(this.playView, fb.GameClass.Z_ORDER.VIEW_PLAYFIELD);

    // Create the gui view and add it to the scene.
    this.guiView = new joe.Scene.View(this.screenWidth, this.screenHeight,
                                      this.screenWidth, this.screenHeight);
    this.guiViewport = this.guiView.getViewport();

    this.guiView.addLayer(new fb.GuiOverlay(this.boardFont, this.fieldImg.width), fb.GameClass.Z_ORDER.LAYER_GUI);
    joe.Scene.addView(this.guiView, fb.GameClass.Z_ORDER.VIEW_GUI);
  },

  enter: function() {
  },

  exit: function() {
  },

  draw: function(gfx) {
    var i =0;

    joe.Graphics.clearToColor("#000000");

    joe.Scene.draw(gfx);
  },

  boundsCheck: function(newLength) {
  },

  updateAction: function(dt) {
    // Update action timer.
    newActionLength = this.MIN_ACTION_LENGTH + this.actionSpeed * (this.actionTimer + dt * 0.001);
    newActionLength = Math.min(newActionLength, this.fieldImg.height);
    this.actionLength = newActionLength;
    this.actionTimer += dt * 0.001;
    this.actionLayer.updateActionCircle(true, this.player.pos.x, this.player.pos.y, this.actionLength);
  },

  updateFieldPosition: function() {
    var playerWorldPos = null,
        playerPosRef = this.player.getPosRef(),
        newCameraY = 0;

    // Get the player's world position.
    playerWorldPos = this.playViewport.viewToWorldPos(playerPosRef);

    // Check against the top of the screen.
    if (Math.abs(playerWorldPos.y - this.screenHeight * 0.5) < this.screenHeight * this.CAMERA_SCROLL_FACTOR) {
      // Compute the desired camera position to focus on the player.
      newCameraY = Math.round(playerPosRef.y - this.screenHeight * this.CAMERA_SCROLL_FACTOR);

      // If player is too close to top, move the field position to catch
      // up...
      newCameraY = Math.max(0, newCameraY);
      newCameraY = Math.min(newCameraY, this.fieldImg.height - this.playViewport.getViewRect().h);

      // ...but prevent scrolling the field off the edge of the screen.
      this.playViewport.setSourcePosition(0, newCameraY);
    }
  },

  setPlayerMoveDirection: function(dx, dy) {
    this.playerDirection.bUpdated = true;
    this.playerDirection.length = Math.sqrt(dx * dx + dy * dy);
    this.playerDirection.angle = Math.atan2(dy, dx);

    this.playerDirection.angle = Math.round(this.playerDirection.angle * 180 / Math.PI / 15) * 15;
    this.playerDirection.angle = this.playerDirection.angle * Math.PI / 180;

    this.dragArrow.length = this.playerDirection.length;
    this.dragArrow.angle = this.playerDirection.angle;
    this.dragArrow.bUpdated = true;
  },

  updatePlayerMoveDirection: function() {
    this.playerDirection.length = this.dragArrow.length;
    this.playerDirection.angle = this.dragArrow.angle;
  },

  updateDragArrow: function(dx, dy) {
    this.dragArrow.length = Math.sqrt(dx * dx + dy * dy);
    this.dragArrow.angle = Math.atan2(dy, dx);
    this.dragArrow.angle = Math.round(this.dragArrow.angle * 180 / Math.PI / 15) * 15;
    this.dragArrow.angle = this.dragArrow.angle * Math.PI / 180;
    this.dragArrow.bUpdated = true;
  },

  update: function(dt, gameTime) {
    var playerPos = null;

    // Update the command interpreter.
    this.commands.update(dt, gameTime);

    this.updateFieldPosition();

    if (this.bActionLive) {
      this.updateAction(dt);
    }
    else {
      this.actionLayer.updateActionCircle(false);
    }

    if (this.dragArrow.bUpdated) {
      playerPos = this.player.getPosRef();
      playerPos = this.playView.getWorldPos(playerPos.x, playerPos.y);
      this.actionLayer.updateDirectionArrow(playerPos.x, playerPos.y, this.dragArrow.length, this.dragArrow.angle, fb.GameClass.PLAYER_OVERLAY_ALPHA);
      this.dragArrow.bUpdated = false;
    }
  },

  moveLeft: function() {
    var bounds = this.player.getBoundsRef(),
        pos = this.player.getPosRef(),
        newX = 0;

    newX = Math.max(0, pos.x - bounds.w * 0.5);

    this.player.setPos(newX, pos.y);
  },

  moveRight: function() {
    var bounds = this.player.getBoundsRef(),
        pos = this.player.getPosRef(),
        maxWidth = this.fieldImg.width,
        newX = 0;

    newX = Math.min(pos.x + bounds.w * 0.5, maxWidth);

    this.player.setPos(newX, pos.y);
  },

  moveForward: function() {
    var bounds = this.player.getBoundsRef(),
        pos = this.player.getPosRef(),
        newX = pos.x,
        newY = pos.y,
        playerWidth = this.player.getWidth(),
        playerHeight = this.player.getHeight();

    newX = Math.max(playerWidth * 0.5, pos.x + bounds.h * 0.5 * joe.MathEx.cos(this.playerDirection.angle));
    newX = Math.min(this.fieldImg.width - playerWidth * 0.5, newX);

    newY = Math.max(playerHeight * 0.5, pos.y + bounds.h * 0.5 * joe.MathEx.sin(this.playerDirection.angle));
    newY = Math.min(this.fieldImg.height - playerHeight * 0.5, newY);
    // if (newY < 0) {
    //   newY = joe.Graphics.getHeight() * 0.9;
    // }

    this.player.setPos(newX, newY);
  },

  startAction: function() {
    this.actionLength = this.MIN_ACTION_LENGTH;
    this.actionTimer = 0;
    this.bActionLive = true;
  },

  continueAction: function() {
  },

  triggerAction: function() {
    // Execute the current action.

    this.resetAction();
  },

  resetAction: function() {
    this.actionLength = this.MIN_ACTION_LENGTH;
    this.actionTimer = 0; 
    this.bActionLive = false;
  }
});

