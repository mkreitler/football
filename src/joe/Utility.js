// Define a namespace for the engine.
var joe = {};

joe.Utility = {};

joe.Utility.erase = function(array, item) {
  var iRemove = -1;
  var i = 0;
  
  if (array instanceof Array) {
    iRemove = array.indexOf(item);
    
    if (iRemove >= 0) {
      for (i=iRemove; i<array.length - 1; ++i) {
        array[i] = array[i + 1];
      }
      
      array.length = array.length - 1;
    }
  }
};

joe.Utility.fastErase = function(array, item) {
  var iRemove = array ? array.indexOf(item) : -1;

  if (iRemove >= 0) {
    array[iRemove] = array[array.length - 1];
    array.length = array.length - 1;
  }
};

joe.Utility.getPageWidth = function() {
  return Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
};

joe.Utility.getPageHeight = function() {
  return Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
};