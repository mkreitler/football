// TODO: add support for a 'Scene' object? What would that be?

joe.Scene = {
  DEFAULTS: {
              VIEW_ORDER: 100
            },

  views: [],

  addView: function(view, zOrder) {
    var i = 0,
        bInserted = false;

    zOrder = zOrder || joe.Scene.DEFAULTS.VIEW_ORDER;

    if (view) {
      for (i=0; i<this.views.length; ++i) {
        if (this.views[i].zOrder >= zOrder) {
          this.views.splice(i, 0, {view:view, zOrder:zOrder});
          bInserted = true;
          break;
        }
      }

      if (!bInserted) {
        this.views.push({view:view, zOrder:zOrder});
        bInserted = true;
      }
    }

    return bInserted;
  },

  removeView: function(view) {
    var i = 0,
        bRemoved = false;

    for (i=0; i<this.views.length; ++i) {
      if (this.views.view === view) {
        joe.Utility.erase(this.views, this.views[i]);
        bRemoved = true;
      }
    }
  },

  draw: function(gfx) {
    var i = 0;

    for (i=this.views.length - 1; i>=0; --i) {
      this.views[i].view.draw(gfx);
    }
  }, 

  LayerInterface: {
    parent: null,

    setParent: function(view) {
      this.parent = view;
    }
  } 
};

