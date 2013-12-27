// [HELP]
// <h1>joe.Sound</h1><hr>
// <em>Allows programs to load and play sounds.</em>
//
// <strong>Interface</strong>
// joe.Sound.setMasterVolume(newVolume); /*Where newVolume must be in the range [0, 1];*/
// var volume = joe.Sound.getMasterVolume();
// var newSound = joe.Sound.load(soundName, onLoadedCallback, onErrorCallback, nChannels, repeatDelay);
// joe.Sound.deactivate();
// joe.Sound.activate();
// joe.Sound.stopAll();
// joe.Sound.resetAll();
// joe.Sound.unloadAll();
// joe.Sound.unload(soundName);
//
// <strong>Use</strong>
// <pre> joe.Sound.init();
// var newSound = joe.Sound.load(soundName, onLoadedCallback.bind(this), onErrorCallback.bind(this), nChannels, repeatDelay);
//
// /* Where soundName is the name of an audio resource uploaded to the server.
//       nChannels is the max number of voices that can play this sound simultaneously.
//       repeatDelay is the time, in seconds, that must pass before a subsequent voice is allowed to play.
//       onLoadedCallback(soundName, nChannels, loadEvent) is a function that will be called when
//       the sound data has loaded. */
//
// var channelIndex = joe.Sound.play(newSound);
// Returns index of the channel that was played. -1 indicates the sound didn't play.
//
// joe.Sound.loop(newSound);
// joe.Sound.stop(newSound);
// joe.Sound.pause(newSound);
// joe.Sound.resume(newSound);
//
// [END HELP]

joe.Sound = new joe.ClassEx({
// Class Definitions /////////////////////////////////////////////////////////////////
  FORMAT: {
	    MP3: {ext: 'mp3', mime: 'audio/mpeg'},
	    OGG: {ext: 'ogg', mime: 'audio/ogg; codecs=vorbis'}
	  },
  DEFAULT_CHANNELS: 2,
  DEFAULT_DELAY:    0.1,
  STOP_ALL_CHANNELS:-1,
  INVALID_CHANNEL:  -99,
	  
  isEnabled:       true,
  isAvailable:     window.Audio,
  preferredFormat: null,
  sounds:          {},
  masterVolume:    1.0,
  
  init: function() {
    var capTester = new Audio();
    var iFormat = 0;
    
    for (iFormat in joe.Sound.FORMAT) {
      if (capTester.canPlayType(joe.Sound.FORMAT[iFormat].mime)) {
        joe.Sound.preferredFormat = joe.Sound.FORMAT[iFormat];
        break;
      }
    }
    
    if (!joe.Sound.preferredFormat) {
      joe.Sound.isAvailable = false;
      joe.Sound.isEnabled = false;
    }
  },
  
  activate: function() {
    joe.Sound.isEnabled = true;
  },
  
  deactivate: function() {
    joe.Sound.stopAll();
    joe.Sound.isEnabled = false;
  },
  
  getFreeChannelIndex: function(sound, now) {
    var i = 0;
    var iChannel = joe.Sound.INVALID_CHANNEL;
    var mostDelay = 0;
    var testDelay = 0;
    
    if (sound && sound.channels.length && sound.playing.length && sound.lastPlayTime.length) {
      for (var i=0; i<sound.channels.length; ++i) {
        testDelay = (now - sound.lastPlayTime[i]) * 0.001;
        if (testDelay > mostDelay && testDelay > sound.minDelay) {
          mostDelay = testDelay;
          iChannel = i;
        }
      }
    }
    
    return iChannel;
  },
  
  play: function(sound, volume) {
    var totalVolume = typeof(volume) === 'undefined' ? 1 : volume;
    totalVolume = joe.Sound.clampVolume(totalVolume * joe.Sound.getMasterVolume());
    var playedIndex = joe.Sound.INVALID_CHANNEL;
    var now = Date.now();
    
    if (sound) {
      playedIndex = joe.Sound.getFreeChannelIndex(sound, now);
      
      if (playedIndex !== joe.Sound.INVALID_CHANNEL) {
        sound.iChannel = playedIndex;
        sound.lastPlayTime[playedIndex] = now;
        sound.channels[playedIndex].pause();
        sound.channels[playedIndex].loop = false;
        sound.channels[playedIndex].volume = totalVolume;
        sound.channels[playedIndex].currentTime = 0;
        sound.playing[playedIndex] = true;
        sound.channels[playedIndex].play();
      }
    }
    
    return playedIndex;
  },
  
  loop: function(sound, volume) {
    var now = Date.now();
    var totalVolume = typeof(volume) === 'undefined' ? 1 : volume;
    totalVolume = joe.Sound.clampVolume(totalVolume * joe.Sound.getMasterVolume());
    var playedIndex = joe.Sound.INVALID_CHANNEL;
    
    if (sound) {
      playedIndex = joe.Sound.getFreeChannelIndex(sound, now);
      
      if (playedIndex !== joe.Sound.INVALID_CHANNEL) {
        sound.iChannel = playedIndex;
        sound.lastPlayTime[playedIndex] = now;
        sound.channels[playedIndex].pause();
        sound.channels[playedIndex].loop = true;
        sound.channels[playedIndex].volume = totalVolume;
        sound.channels[playedIndex].currentTime = 0;
        sound.playing[playedIndex] = true;
        sound.channels[playedIndex].play();
      }
    }
    
    return playedIndex;
  },
  
  pause: function(sound, channelIndex) {
    var iChannel = 0;
    var iStart = typeof(channelIndex) === 'undefined' || channelIndex === joe.Sound.INVALID_CHANNEL ? 0 : channelIndex;
    var iEnd = typeof(channelIndex) === 'undefined' || channelIndex === joe.Sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;
    
    for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
      sound.channels[iChannel].pause();
      sound.playing[iChannel] = false;
    }
  },
  
  resume: function(sound, channelIndex) {
    var iChannel = 0;
    var iStart = typeof(channelIndex) === 'undefined' || channelIndex === joe.Sound.INVALID_CHANNEL ? 0 : channelIndex;
    var iEnd = typeof(channelIndex) === 'undefined' || channelIndex === joe.Sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;
    
    for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
      sound.channels[iChannel].play();
      sound.playing[iChannel] = true;
    }
  },
  
  stop: function(sound, channelIndex) {
    var iChannel = 0;
    var iStart = channelIndex === joe.Sound.INVALID_CHANNEL ? 0 : channelIndex;
    var iEnd = channelIndex === joe.Sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;
    
    for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
      sound.channels[iChannel].pause();
      sound.channels[iChannel].loop = false;
      sound.channels[iChannel].currentTime = 0;
      sound.playing[iChannel] = false;
    }
  },
  
  stopAll: function() {
    var key;
    
    for (key in joe.Sound.sounds) {
      joe.Sound.stop(joe.Sound.sounds[key], joe.Sound.STOP_ALL_CHANNELS);
    }
  },
  
  setMasterVolume: function(newMasterVolume) {
    joe.Sound.masterVolume = joe.Sound.clampVolume(newMasterVolume);
  },
  
  getMasterVolume: function() {
    return joe.Sound.masterVolume;
  },
  
  clampVolume: function(volume) {
    return Math.min(1, Math.max(0, volume));
  },
  
  load: function(resourceName, onLoadedCallback, onErrorCallback, nChannels, replayDelay) {
    var numChannels = nChannels || joe.Sound.DEFAULT_CHANNELS;
    var minReplayDelay = replayDelay || joe.Sound.DEFAULT_DELAY;
    
    var path = "../audio/" + resourceName;
    var extension = path.substring(path.lastIndexOf("."));
    var nNewChannels = 0;
    var i = 0;
    var newChannel = null;

    if (joe.Sound.preferredFormat) {
      if (extension) {
        path = path.replace(extension, "");
      }
    
      path = path + "." + joe.Sound.preferredFormat.ext;
      
      if (!joe.Sound.sounds[resourceName] ||
        joe.Sound.sounds[resourceName].length < nChannels) {
      
        if (!joe.Sound.sounds[resourceName]) {
          joe.Sound.sounds[resourceName] = {
            channels:     [],
            playing:      [],
            lastPlayTime: [],
            minDelay:     minReplayDelay,
          };
        }
        
        nNewChannels = numChannels - joe.Sound.sounds[resourceName].channels.length;
        for (i=0; i<nNewChannels; ++i) {
          newChannel = new Audio(path);
          
          if (onLoadedCallback) {
            newChannel.addEventListener('canplaythrough', function callback() {
              onLoadedCallback(joe.Sound.sounds[resourceName], resourceName);
            }, false);
          }
          
          if (onErrorCallback) {
            newChannel.addEventListener('onerror', function callback() {
              onErrorCallback(resourceName);
            }, false);
          }
        
          newChannel.preload = "auto";
          newChannel.load();
          joe.Sound.sounds[resourceName].channels.push(newChannel);
          joe.Sound.sounds[resourceName].playing.push(false);
          joe.Sound.sounds[resourceName].lastPlayTime.push(0);
        }
      }
    }
    else if (onLoadedCallback) {
      onLoadedCallback(resourceName, "Error: no preferred format");
    }
    
    return joe.Sound.sounds[resourceName];
  },
},  
{
// Instance Definitions //////////////////////////////////////////////////////////////
  audioClip: null,
  
});