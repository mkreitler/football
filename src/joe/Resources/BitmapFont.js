// Modified from Dominic Szablewski's Impact engine (www.impactjs.com),
// version 1.23.

joe.Resources.BitmapFont = new joe.ClassEx(
	// Class Definition /////////////////////////////////////////////////////////
	{
		ALIGN: {
							LEFT: 0,
							RIGHT: 1,
							CENTER: 2
						},
		ALPHA_THRESHOLD: 2
	},
	// Instance Definition //////////////////////////////////////////////////////
	{
		widthMap: [],
		indices: [],
		firstChar: 32,
		alpha: 1,
		letterSpacing: 1,
		lineSpacing: 0,
		data: null,
		height: 0,
		width: 0,
		loaded: false,

		onLoad: function(image) {
			this.data = image;
			this.height = this.data.height;
			this.width = this.data.width;

			this._loadMetrics( this.data );
			this.loaded = true;
		},

		draw: function( gfx, text, x, y, align ) {
			if( typeof(text) != 'string' ) {
				text = text.toString();
			}
			
			// Multiline?
			if( text.indexOf('\n') !== -1 ) {
				var lines = text.split( '\n' );
				var lineHeight = this.height + this.lineSpacing;
				for( var i = 0; i < lines.length; i++ ) {
					this.draw( gfx, lines[i], x, y + i * lineHeight, align );
				}
				return;
			}
			
			if( align == joe.Resources.BitmapFont.ALIGN.RIGHT || align == joe.Resources.BitmapFont.ALIGN.CENTER ) {
				var width = this._widthForLine( text );
				x -= align == joe.Resources.BitmapFont.ALIGN.CENTER ? width/2 : width;
			}
			

			if( this.alpha !== 1 ) {
				joe.Graphics.setGlobalAlpha(this.alpha);
			}

			for( var i = 0; i < text.length; i++ ) {
				var c = text.charCodeAt(i);
				x += this._drawChar( gfx, c - this.firstChar, x, y );
			}

			if( this.alpha !== 1 ) {
				joe.Graphics.setGlobalAlpha(1);
			}
		},
		
		widthForString: function( text ) {
				// Multiline?
				if( text.indexOf('\n') !== -1 ) {
					var lines = text.split( '\n' );
					var width = 0;
					for( var i = 0; i < lines.length; i++ ) {
						width = Math.max( width, this._widthForLine(lines[i]) );
					}
					return width;
				}
				else {
					return this._widthForLine( text );
				}
			},
		
		_widthForLine: function( text ) {
			var width = 0;
			for( var i = 0; i < text.length; i++ ) {
				width += this.widthMap[text.charCodeAt(i) - this.firstChar] + this.letterSpacing;
			}
			return width;
		},

		heightForString: function( text ) {
			return text.split('\n').length * (this.height + this.lineSpacing);
		},


		_drawChar: function( gfx, c, targetX, targetY ) {
			if( !this.loaded || c < 0 || c >= this.indices.length ) { return 0; }
			
			var scale = 1;
			
			
			var charX = this.indices[c] * scale;
			var charY = 0;
			var charWidth = this.widthMap[c] * scale;
			var charHeight = (this.height-2) * scale;		
			
			gfx.drawImage( 
				this.data,
				charX, charY,
				charWidth, charHeight,
				targetX, targetY,
				charWidth, charHeight
			);
			
			return this.widthMap[c] + this.letterSpacing;
		},
		
		_loadMetrics: function( image ) {
			// Draw the bottommost line of this font image into an offscreen canvas
			// and analyze it pixel by pixel.
			// A run of non-transparent pixels represents a character and its width
			
			this.height = image.height-1;
			this.widthMap = [];
			this.indices = [];
			
			var px = this._getImagePixels( image, 0, image.height-1, image.width, 1 );
			
			var currentChar = 0;
			var currentWidth = 0;
			for( var x = 0; x < image.width; x++ ) {
				var index = x * 4 + 3; // alpha component of this pixel
				if( px.data[index] > joe.Resources.BitmapFont.ALPHA_THRESHOLD ) {
					currentWidth++;
				}
				else if( px.data[index] < joe.Resources.BitmapFont.ALPHA_THRESHOLD && currentWidth ) {
					this.widthMap.push( currentWidth );
					this.indices.push( x-currentWidth );
					currentChar++;
					currentWidth = 0;
				}
			}
			this.widthMap.push( currentWidth );
			this.indices.push( x-currentWidth );
		},

		_getVendorAttribute: function( el, attr ) {
			var uc = attr.charAt(0).toUpperCase() + attr.substr(1);
			return el[attr] || el['ms'+uc] || el['moz'+uc] || el['webkit'+uc] || el['o'+uc];
		},

		_normalizeVendorAttribute: function( el, attr ) {
			var prefixedVal = this._getVendorAttribute( el, attr );
			if( !el[attr] && prefixedVal ) {
				el[attr] = prefixedVal;
			}
		},

		_setVendorAttribute: function( el, attr, val ) {
			var uc = attr.charAt(0).toUpperCase() + attr.substr(1);
			el[attr] = el['ms'+uc] = el['moz'+uc] = el['webkit'+uc] = el['o'+uc] = val;
		},

		_getImagePixels: function( image, x, y, width, height ) {
			var canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			var ctx = canvas.getContext('2d');
			
			// Try to draw pixels as accurately as possible
			this._CRISP(canvas, ctx);

			var ratio = this._getVendorAttribute( ctx, 'backingStorePixelRatio' ) || 1;
			this._normalizeVendorAttribute( ctx, 'getImageDataHD' );

			var realWidth = image.width / ratio,
				realHeight = image.height / ratio;

			canvas.width = Math.ceil( realWidth );
			canvas.height = Math.ceil( realHeight );

			ctx.drawImage( image, 0, 0, realWidth, realHeight );
			
			return (ratio === 1)
				? ctx.getImageData( x, y, width, height )
				: ctx.getImageDataHD( x, y, width, height );
		},

		_CRISP: function( canvas, context ) {
			this._setVendorAttribute( context, 'imageSmoothingEnabled', false );
			canvas.style.imageRendering = '-moz-crisp-edges';
			canvas.style.imageRendering = '-o-crisp-edges';
			canvas.style.imageRendering = '-webkit-optimize-contrast';
			canvas.style.imageRendering = 'crisp-edges';
			canvas.style.msInterpolationMode = 'nearest-neighbor'; // No effect on Canvas :/
		},
	}
);
