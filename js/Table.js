/**
 * Table.js
 *
 * This IIFE implements a global Table object which helps to create a dynamic HTML table.
 *
 */
(function() {

	"use strict";

	var _generateProperties = function( properties ) {

		var output = '';

		for ( var key in properties ) {
			output += ' ' + key + '="' + properties[ key ] + '"';
		}

		return output;
	};

	// ---- The public table section ---- //
	function Table( properties ) {
		this.rows = [];
		this.properties = properties;
	}

	Table.prototype.tr = function( properties ) {

		this.rows.push( new TableRow( properties ) );

		return this.rows[ this.rows.length - 1 ];
	};

	Table.prototype.toString = Table.prototype.get = function() {

		var table = '<table' + ( this.properties ? _generateProperties( this.properties ) : '' ) + '>';

		for ( var i = 0; i < this.rows.length; ++i ) {
			table += this.rows[ i ].get();
		}

		return table + '</table>';
	};

	// ---- Table Row section ---- //
	function TableRow( properties ) {
		this.cells = [];
		this.properties = properties;
	}

	TableRow.prototype.th = function( content, properties ) {

		var cell = new TableCell();

		cell.th( content, properties );

		this.cells.push( cell );
	};

	TableRow.prototype.td = function( content, properties ) {

		var cell = new TableCell();

		cell.td( content, properties );

		this.cells.push( cell );
	};

	TableRow.prototype.addColumn = function() {

		this.cells.push( new TableCell() );

		return this.cells[ this.cells.length - 1 ];
	};

	TableRow.prototype.get = function() {

		var row = '<tr' + ( this.properties ? _generateProperties( this.properties ) : '' ) + '>';

		for ( var i = 0; i < this.cells.length; ++i ) {
			row += this.cells[ i ].get();
		}

		return row + '</tr>';
	};

	// ---- Table Cell section ---- //
	function TableCell() {
		this.column = '';
	}

	TableCell.prototype.th = function( content, properties ) {
		this.column = '<th' + ( properties ? _generateProperties( properties ) : '' ) + '>' + content + '</th>';
	};

	TableCell.prototype.td = function( content, properties ) {
		this.column = '<td' + ( properties ? _generateProperties( properties ) : '' ) + '>' + content + '</td>';
	};

	TableCell.prototype.get = function() {
		return this.column;
	};

	window.Table = Table;

})();