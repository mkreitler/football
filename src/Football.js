fb.GameClass = new joe.ClassEx({
  // Class Definition /////////////////////////////////////////////////////////
},
{
  // Instance Definition //////////////////////////////////////////////////////
  sysFont: null,
  spriteSheet: null,
  field: null,
  titleState: null,
  playState: null,

  init: function() {
    this.sysFont = joe.Resources.loader.loadFont("fonts/collegiateHeavyOutline Medium.ttf", fb.onResourceLoaded, fb.onResourceLoadFailed, this);
    this.spriteSheet = joe.Resources.loader.loadImage("img/football.png", fb.onResourceLoaded, fb.onResourceLoadFailed, this);
    this.field = joe.Resources.loader.loadImage("img/field.png", fb.onResourceLoaded, fb.onResourceLoadFailed, this);
  },

  start: function() {
    this.titleState = new fb.StateTitleClass(this.sysFont);
    this.playState = new fb.StatePlayClass(this.sysFont, this.spriteSheet, this.field);

    this.startTitleState();

    joe.UpdateLoop.start();
    joe.Graphics.start();
  },

  startPlayState: function() {
    joe.GameStateClass.setState(this.playState);
  },

  startTitleState: function() {
    joe.GameStateClass.setState(this.titleState);
  },

  touchUp: function(touchID, x, y) {
    var curState = joe.GameState.getState();

    console.log(">>> Football: touchUp");

    if (curState && curState.touchUp) {
      console.log("  >>> Football: touchUp");
      curState.touchUp(touchID, x, y);
    }

    return true;
  },

  touchDown: function(touchID, x, y) {
    var curState = joe.GameStateClass.getState();

    console.log(">>> Football: touchDown");

    if (curState && curState.touchDown) {
      console.log("  >>> Football: touchDown");
      curState.touchDown(touchID, x, y);
    }

    return true;
  },

  keyPress: function(keyCode) {
    var curState = joe.GameStateClass.getState();

    if (curState && curState.keyPress) {
      curState.keyPress(keyCode);
    }

    return true;
  },

  keyRelease: function(keyCode) {
    var curState = joe.GameStateClass.getState();

    if (curState && curState.keyRelease) {
      curState.keyRelease(keyCode);
    }

    return true;
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

fb.game = new fb.GameClass();

// Accept input.
joe.KeyInput.addListener(fb.game);
joe.Multitouch.addListener(fb.game);


