(function( $ ) {

	"use strict";

	var _options = {
		P:		0.6,
		risk:	0.02,
		sl:		1,
		tp:		2
	};

	function Order() {
		this.winning = false;
		this.equity = 0;
		this.profit = 0;
	}

	Order.prototype.options = _options;

	Order.prototype.trade = function( equity, options ) {
		this.options = $.extend( _options, options );
		this.equity = equity;

		var rand = Math.floor( Math.random() * Math.floor( 100 ) );
		var prob = this.options.P * 100;
		var profit;

		if ( rand < prob ) {
			// win
			this.winning = true;

			profit = Math.floor( this.equity * this.options.tp * this.options.risk );

		} else {
			// loose
			this.winning = false;

			profit = -1 * Math.floor( this.equity * this.options.sl * this.options.risk );
		}

		this.profit = profit;
	};

	Order.prototype.isWining = function() {
		return this.winning;
	};

	Order.prototype.getProfit = function() {
		return this.profit;
	};

	Order.prototype.getAccountSizeAfterTrade = function() {
		return this.equity + this.profit;
	};

	window.Order = Order;

})( jQuery );
