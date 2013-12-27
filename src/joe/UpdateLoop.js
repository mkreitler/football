// The UpdateLoop drives the update for all objects in the game.
//
// Usage:
// 
// var myObj = {update: function(dt, gameTime) { /* Do stuff here. */ }};
//
// joe.UpdateLoop.addListener(myObj);
// joe.UpdateLoop.start();
//
// Code adapted from "<a href="http://www.hive76.org/fast-javascript-game-loops" target=_blank>Fast Javascript Game Loops</a>," by Sean MacBeth.
// [END HELP]

joe.UpdateLoop = new joe.ClassEx([
  joe.Listeners, {
// Static Definition
  PRIORITY_INPUT: 1000,
  PRIORITY_PROCESS: 100,
  
  SEC_TO_MS: 1000,
  MS_TO_SEC: 0.001,
  TIME_EPSILON: 10, // 10 ms
  
  timeStep: Math.round(1000 / 60),
  lastTime: 0,
  gameTime: 0,
  elapsedTime: 0,
  interval: null,
  
  setTimeStep: function(newStep) {
    joe.UpdateLoop.timeStep = newStep;
  },
  
  getGameTime: function() {
    return joe.UpdateLoop.gameTime;
  },
  
  update: function() {
    var i;
    var dt;
    var curTime = (new Date).getTime();
    var updateTime;
    
    joe.UpdateLoop.elapsedTime += (curTime - joe.UpdateLoop.lastTime);
    joe.UpdateLoop.lastTime = curTime;
    
    dt = joe.UpdateLoop.timeStep;
    
    while (joe.UpdateLoop.elapsedTime >= dt) {
      // TODO: calculate gameTime.
      joe.UpdateLoop.gameTime += dt;
    
      // Update. For the sake of performance, we iterate the inherited
      // listener list directly, rather than use callListeners(...)
      for (i = 0; i < joe.UpdateLoop.listeners.length; ++i) {
        joe.UpdateLoop.listeners[i].update(dt, joe.UpdateLoop.gameTime);
      }
      
      joe.UpdateLoop.elapsedTime -= dt;
    }
      
    // Compute time to next update, accounting for the amount
    // if time the current update took.
    updateTime = (new Date).getTime() - joe.UpdateLoop.lastTime;
  },
  
  start: function(bOutsideTimer) {
    joe.UpdateLoop.lastTime = (new Date).getTime();
    joe.UpdateLoop.gameTime = 0;

    if (!bOutsideTimer) {
      joe.UpdateLoop.interval = setInterval(joe.UpdateLoop.update, joe.UpdateLoop.timeStep);
    }
  },
  
  stop: function() {
    clearInterval(joe.UpdateLoop.interval);
  },
}],
{
// No instance definitions -- UpdateLoop is a singleton.
});