var XeviCounter = XeviCounter || function(opt){
	this.source;
	this.$easel;
	this.w = 14;
	this.h = 20;
	this.r = 1;
	this.pos = {};
	this.init = function(opt){
		for (var i in opt) {
			if (['w', 'h', 'r'].some(function(){retrun this === i})) {
				this[i] = opt[i];
			}}
		}
	};
	this.run = function(){
		if (!this.source || !this.$easel) {
			return;
		}
		var hexArr = this.source.count().toString(16).split('');
		if (!hexArr.length) {
			return;
		}
		this.source.$.hide();
		this._render(hexArr);
	};
	this._render = function(hexArr){
		var that = this;
		this.$easel.hide();
		this._setPositions();
		hexArr.each(function(){
			that._addCanvas(parseInt(this, 16));
		});
		this.$easel.show();
	};
	this._setPositions = function(){
		with (this) {
			pos = {
				0: [[0, h],     [w, 0]],
				1: [[r, h - r], [w, h - r]],
				2: [[w - r, h], [w - r, r]],
				4: [[w - r, r], [0, r]],
				8: [[r, 0],     [r, h - r]]
			};
		}
	};
	this._addCanvas = function(n){
		var $c = $('<canvas/>').attr({
			width: this.w,
			height: this.h
		}).addClass('counters').appendTo(this.$easel),
		ctx = $c[0].getContext('2d');
		ctx.strokeStyle = 'red';
		ctx.lineWidth = this.r * 2;
		ctx.beginPath();
		this._lines(ctx, n);
		ctx.stroke();
	};
	this._lines = function(ctx, n){
		var i, j, line = function(from, to){
			this.moveTo.apply(this, from);
			this.lineTo.apply(this, to);
		};
		this._line(ctx, 0);
		for (var i = 0; i < 5; i++) {
			(n & (j = Math.pow(2, i))) && line.apply(ctx, this.pos[j]);
		}
	};
	this.init(opt);
};

$ && $(function(){
	XeviCounter.source = {
		$: $('#counter'),
		_extract: function(img){
			var m = (img.src || '').match(/\b(\d+)\.\w+$/);
			return (m && m[1]) ? parseInt(m[1], 10) : 0;
		},
		count: function(){
			var that = this, numStr = '', $img = $('img', this.$);
			if (!$img.length) {
				console.log('img element not found');
			}
			$img.each(function(){
				var n = that._extract(this);
				numStr += (n + '');
			});
			return parseInt(numStr, 10);
		}
	};
});

