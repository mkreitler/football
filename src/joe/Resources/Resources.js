// [HELP]
// <h1>joe.Resources</h1><hr>
//
// <em>Retrieves image, audio, font, and text/svg data from the server.</em>
//
// <strong>Interface</strong>
// loadImage = function(imageURL);
// loadSound = function(soundURL);
// loadFont = function(fontURL);
// loadSVG = function(svgURL);
//
// <strong>Use</strong>
// <pre> var myLoader = {
//   onSoundLoaded = function(sound, soundName) {...},
//   onImageLoaded = function(image) {...},
//   onFontLoaded = function(font) {...},
//   onSVGloaded = function(svgText) {...},
//   onErrorCallback = function(errorText) {...}
// };
//
// joe.Resources.loadSound("mySound", myLoader.onSoundLoaded, myLoader.onErrorCallback, this, nChannels, minDelay);
// joe.Resources.loadImage("myImage", myLoader.onImageLoaded, myLoader.onErrorCallback, this);
// joe.Resources.loadFont("myFont", myLoader.onFontLoaded, myLoader.onErrorCallback, this);
// joe.Resources.loadSVG("mySVG", myLoader.onSVGloaded, myLoader.onErrorCallback, this);</pre>
//
// <strong>Notes</strong>
// TODO: maintain a total resource count and add a progress API.
// [END HELP]

joe.Resources = {
  resourcesPending: 0,

  resourcesLoaded: 0,

  incPendingCount: function() {
    this.resourcesPending += 1;
  },

  incLoadedCount: function() {
    this.resourcesLoaded += 1;

    if (this.resourcesLoaded === this.resourcesPending) {
      this.clearResourceCount();
    }
  },

  clearResourceCount: function() {
    this.resourcesPending = 0;
    this.resourcesLoaded = 0;
  },

  loadComplete: function() {
    return this.resourcesPending === 0 && this.resourcesLoaded === 0;
  }
},


joe.ResourceLoader = new joe.ClassEx(null, {
// Static Definitions /////////////////////////////////////////////////////////
  resourcesPending: 0,
  resourcesLoaded: 0,

  loadImage: function(imageURL, onLoadedCallback, onErrorCallback, observer) {
    var image = new Image();

    joe.Resources.incPendingCount();
  
    image.onload = function() {
      joe.Resources.incLoadedCount();
      if (onLoadedCallback) { onLoadedCallback.call(observer, image); }
    }
    
    image.onerror = function() {
      joe.Resources.incLoadedCount();
      if (onErrorCallback) { onErrorCallback.call(observer, imageURL); }
    }
  
    image.src = imageURL;
  
    return image;
  },

  loadBitmapFont: function(fontURLs, onLoadedCallback, onErrorCallback, observer) {
    var font = null,
        image = null,
        fontURL = null,
        i = 0;

        if (!(fontURLs instanceof Array)) {
          fontURL = fontURLs;
          fontURLs = [];
          fontURLs.push(fontURL);
        }

        font = new joe.Resources.BitmapFont();

        for (i=0; i<fontURLs.length; ++i) {
          image = joe.Resources.loader.loadImage(fontURLs[i],
                                                 function() {
                                                              if (onLoadedCallback) { onLoadedCallback.call(observer, image) }
                                                              font.onLoad(image);
                                                            },
                                                 onErrorCallback,
                                                 observer);
          font.addImage(image);
        }

    return font;
  },
  
  loadFont: function(fontURL, onLoadedCallback, onErrorCallback, observer) {
    joe.Resources.incPendingCount();

    var font = joe.Resources.FontEx.newFromResource(fontURL,
               function() {
                 joe.Resources.incLoadedCount();
                 if (onLoadedCallback) { onLoadedCallback.call(observer, font); }
               },
               function() {
                 joe.Resources.incLoadedCount();
                 if (onErrorCallback) { onErrorCallback.call(observer, fontURL); }
               },
               observer);    
    
    return font;
  },
  
  loadSound: function(soundURL, onLoadedCallback, onErrorCallback, observer, nChannels, repeatDelaySec) {
    return joe.Sound.load(soundName,
        function() {
          joe.Resources.incLoadedCount();
          if (onLoadedCallback) { onLoadedCallback.call(observer, soundURL); }
        },
        function() {
          if (onLoadedCallback) { onLoadedCallback.call(observer, soundURL); }
        },
        nChannels, repeatDelaySec);
  },

  loadSVG: function(svgName, onLoadedCallback, onErrorCallback, observer) {
    var xhr = new XMLHttpRequest();
    var url = "http://www.freegamersjournal.com/svg-edit-2.6/php/loadSVG.php";
    var title = svgName;
    var matches = null;
  
    xhr.open("POST", url, true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText && xhr.responseText.substring(0, "ERROR:".length) === "ERROR:") {
            if (onErrorCallback) onErrorCallback.call(observer);
          }
          else if (onLoadedCallback) {
            joe.Resources.incLoadedCount();
            onLoadedCallback.call(observer, xhr.responseText);
          }
        }
        else if (xhr.responseText) {
          joe.Resources.incLoadedCount();
          if (onErrorCallback) onErrorCallback.call(observer, svgName);
        }
      }
    }

    xhr.send("name=" + svgName);  
  }
},
{
// Instance Definitions ///////////////////////////////////////////////////////
});

joe.Resources.loader = new joe.ResourceLoader();
