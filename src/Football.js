fb.GameClass = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
  SPRITE_INDEX: { PLAYERS: 0,
                  BALL: 1 },

  WINDOW: {MARGIN_VERTICAL: 10,
           BOARD_HEIGHT: 150},

  Z_ORDER: {
    SPRITE_BALL: 10,
    SPRITE_PLAYER: 50,

    LAYER_GUI: 10,
    LAYER_ACTION_OVERLAY: 50,
    LAYER_PLAYFIELD: 100,

    VIEW_GUI: 5,
    VIEW_PLAYFIELD: 100,
  },

  PLAYER_OVERLAY_ALPHA: 0.5,
  ANGLE_RESOLUTION: 15,
},
{
  // Instance Definition //////////////////////////////////////////////////////
  requires: joe.GameState.stateMachine,

  sysFont: null,
  boardFont: null,
  spriteSheets: null,
  field: null,
  titleState: null,
  playState: null,
  trainingMenuState: null,

  init: function() {
    this.sysFont = joe.Resources.loader.loadBitmapFont(["img/font_college_48_01.png",
                                                        "img/font_college_48_02.png",
                                                        "img/font_college_48_03.png"],
                                                        fb.onResourceLoaded,
                                                        fb.onResourceLoadFailed,
                                                        this);

    this.boardFont = joe.Resources.loader.loadBitmapFont(["img/font_scoreboard_80_01.png",
                                                          "img/font_scoreboard_80_02.png",
                                                          "img/font_scoreboard_80_03.png"],
                                                          fb.onResourceLoaded,
                                                          fb.onResourceLoadFailed,
                                                          this);    

    this.spriteSheets = [];
    this.spriteSheets.push(joe.Resources.loader.loadImage("img/players.png", fb.onResourceLoaded, fb.onResourceLoadFailed, this));
    this.spriteSheets.push(joe.Resources.loader.loadImage("img/ball.png", fb.onResourceLoaded, fb.onResourceLoadFailed, this));
    this.field = joe.Resources.loader.loadImage("img/field.png", fb.onResourceLoaded, fb.onResourceLoadFailed, this);

    joe.MouseInput.addListener(this);
    joe.KeyInput.addListener(this);

    this.onMessage("startTraining", this, function() {this.startPlayState(); });
    this.onMessage("startExhibitionGame", this, function() {this.startPlayState(); });
    this.onMessage("startRegularSeasonGame", this, function() {this.startPlayState(); });
    this.onMessage("showTrainingMenu", this, function() {this.showTrainingMenu(); });
  },

  start: function() {
    this.titleState = new fb.StateTitleClass([this.sysFont]);
    this.playState = new fb.StatePlayClass([this.sysFont, this.boardFont], this.spriteSheets, this.field);
    this.trainingMenuState = new fb.StateTrainingMenu([this.sysFont]);

    this.startTitleState();

    joe.UpdateLoop.start();
    joe.Graphics.start();
  },

  startPlayState: function() {
    this.setState(this.playState);
  },

  startTitleState: function() {
    this.setState(this.titleState);
  },

  showTrainingMenu: function() {
    this.setState(this.trainingMenuState);
  },

  mouseDrag: function(x, y) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.mouseDrag) {
      bConsumed = curState.commands.mouseDrag(x, y);
    }

    return bConsumed;
  },

  mouseUp: function(x, y) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.mouseUp) {
      bConsumed = curState.commands.mouseUp(x, y);
    }

    return bConsumed;
  },

  mouseDown: function(x, y) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.mouseDown) {
      bConsumed = curState.commands.mouseDown(x, y);
    }

    return bConsumed;
  },

  touchUp: function(touchID, x, y) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.touchUp) {
      bConsumed = curState.commands.touchUp(touchID, x, y);
    }

    return bConsumed;
  },

  touchDown: function(touchID, x, y) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.touchDown) {
      bConsumed = curState.commands.touchDown(touchID, x, y);
    }

    return bConsumed;
  },

  touchMove: function(touchID, x, y) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.touchMove) {
      bConsumed = curState.commands.touchMove(touchID, x, y);
    }

    return bConsumed;
  },

  keyPress: function(keyCode) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.keyPress) {
      bConsumed = curState.commands.keyPress(keyCode);
    }

    return bConsumed;
  },

  keyRelease: function(keyCode) {
    var curState = this.getState(),
        bConsumed = false;

    if (curState && curState.commands && curState.commands.keyRelease) {
      bConsumed = curState.commands.keyRelease(keyCode);
    }

    return bConsumed;
  },
});

fb.onResourceLoaded = function(resource) {
  if (joe.Resources.loadComplete()) {
    fb.game.start();
  }
};

fb.onResourceLoadFailed = function(resourceURL) {
  console.log("Failed to load font resource from " + resourceURL);
};

window.onload = function() {
  fb.game = new fb.GameClass();

  // Accept input.
  joe.KeyInput.addListener(fb.game);
  joe.Multitouch.addListener(fb.game);
};



