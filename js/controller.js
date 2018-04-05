jQuery(function() {

	"use strict";

	var $ = $ || this;

	var _options = {
		P:		0.6,
		risk:	0.02,
		sl:		1,
		tp:		2
	};

	var _total = {
		win: 0,
		lose: 0,
		profit: 0,
		trades: 0
	};

	var _account_size = 2000;
	var _trades_week = 4;
	var _trades_month = 6;

	var _trades = [];

	// init the form
	$( '#account_size' ).val( _account_size );
	$( '#probability' ).val( _options.P );
	$( '#risk' ).val( _options.risk );
	$( '#sl' ).val( _options.sl );
	$( '#tp' ).val( _options.tp );
	$( '#trades_week' ).val( _trades_week );
	$( '#trades_month' ).val( _trades_month );

	var _clickOnSimulate = function( e ) {

		"use strict";

		e.preventDefault();

		_hideSummaryBox();

		_trades = [];

		var equity = parseInt( $( '#account_size' ).val() );
		var account_size = equity;
		var length = ( $( '#trades_week' ).val() * 4 ) * $( '#trades_month' ).val();
		var options = {
			P:		parseFloat( $( '#probability' ).val() ),
			risk:	parseFloat( $( '#risk' ).val() ),
			sl:		parseFloat( $( '#sl' ).val() ),
			tp:		parseFloat( $( '#tp' ).val() )
		};

		var table = new Table();
		var row = table.tr();

		row.th( 'ID' );
		row.th( 'Initial account size' );
		row.th( 'Profit' );
		row.th( 'Growth' );
		row.th( 'Actual account size' );
		row.th( 'Win' );

		var a_month = $( '#trades_week' ).val() * 4;

		for ( var i = 0; i < length; ++i ) {

			var new_order = new Order();
			var properties = {};

			new_order.trade( equity, options );

			if ( i !== 0 && i % ( a_month * 12 ) === 0 ) {
				// check year
				properties.class = 'separator separator--year';

				row = table.tr( properties );

				row.th( 'year', { colspan: 5 });
				row.th( ( i / ( a_month * 12 ) ) + '.' );
			} else if ( i !== 0 && i % a_month === 0 ) {
				// check month

				properties.class = 'separator separator--month';

				row = table.tr( properties );

				row.th( 'month', { colspan: 5 });
				row.th( ( i / a_month ) + '.');
			}

			row = table.tr({
				class: ( new_order.isWining() ? 'winner' : 'loser' )
			});

			row.td( ( i + 1 ) + '.' );
			row.td( equity );
			row.td( new_order.getProfit() );

			equity = equity + new_order.getProfit();

			row.td( Math.floor( equity * 100 / account_size ) - 100 + '%' );
			row.td( equity );
			row.td( ( new_order.isWining() ? 't' : 'f' ) );

			_trades.push( new_order );

			if ( new_order.isWining() ) {
				++_total.win;
			} else {
				++_total.lose;
			}

			++_total.trades;

			_total.profit += new_order.getProfit();
		}

		_showSummaryBox();
		$( '#result' ).html( table.toString() );
	};

	var _hideSummaryBox = function() {

		_total = {
			win: 0,
			lose: 0,
			profit: 0,
			trades: 0
		};

		$( '#_showTotalBox' ).css({ opacity: 0 });
	};

	var _showSummaryBox = function() {


		var account_size = parseInt( $( '#account_size' ).val() );
		var new_size = account_size + _total.profit;

		var $total = $(
			'<h3>Summary:</h3>' +
			'<p><span>Trades: </span><b>' + _total.trades + '</b></p>' +
			'<p><span>Win: </span><b>' + _total.win + ' - ' + ( Math.round( _total.win * 100 / _total.trades ) ) + '%</b></p>' +
			'<p><span>Lose: </span><b>' + _total.lose + ' - ' + ( Math.round( _total.lose * 100 / _total.trades ) ) + '%</b></p>' +
			'<p><span>Profit: </span><b>' + _total.profit + '</b></p>' +
			'<p><span>Account size: </span><b>' + new_size + '</b></p>' +
			'<p><span>Account growth: </span><b>' + ( Math.round( new_size * 100 / account_size ) - 100 ) + '%</b></p>'
		);

		$( '#summary_box' ).html( $total );
		$( '#summary_box' ).animate({
			opacity: 1,
		},
			300
		);
	};

	var _scrollTo = function( direction, e ) {

		e.preventDefault();

		var top = direction === 'top'
			? 0
			: $( document ).height()
		;

		$( 'html, body' ).animate({
			scrollTop: top
		},
			300
		);
	};

	$( '#do_trade' ).click( _clickOnSimulate );

	$( '.navigator__bottom' ).click( _scrollTo.bind( this, 'bottom' ) );
	$( '.navigator__top' ).click( _scrollTo.bind( this, 'top' ) );

}.bind( jQuery ));