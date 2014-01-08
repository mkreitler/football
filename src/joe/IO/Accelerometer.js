// Singleton that captures acceleromete input for the game.
//
joe.Accelerometer = new joe.ClassEx([
joe.Listeners, {
  // Static definitions /////////////////////////////////////////////////////
  accelChanged: function(e) {
    var x = e.acceleration.x;
    var y = e.acceleration.y;
    var z = e.acceleration.z;

    joe.Accelerometer.callListenersUntilConsumed("accelChanged", x, y, z);    
  },
}],
{
  // Object definitions /////////////////////////////////////////////////////
});

window.addEventListener("devicemotion", joe.Accelerometer.accelChanged, true);

// Support for updates
if (window.DeviceMotionEvent) {
  joe.Accelerometer.isSupported = true;
};

