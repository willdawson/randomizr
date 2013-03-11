/* APP
------------------------------------------------------------*/
;(function (window, document, $) {
	
	'use strict';

	var app = app || {};

	app.init = function () {
		this.colorPanes();
		this.bindEvents();
		this.verticallyCenterText();
		this.resizeWrapper();
	}

	app.resizeWrapper = function () {
		var windowHeight = $(window).height(),
		paletteBoxHeight = $('.palette-box').outerHeight();
		$('.wrapper').height(windowHeight - paletteBoxHeight);
	}

	app.panes = $('.pane');

	app.palette = [];

	app.getRandomColor = function () {
		var characters = '0123456789ABCDEF'.split(''),
		color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += characters[Math.round(Math.random() * (characters.length - 1))];
		}
		console.log(color);
		return color;
	}

	app.colorPanes = function () {
		app.panes.each(function (i, pane) {
			var color = app.getRandomColor();
			$(pane).css('background-color', color).children('h1').html(color);
			if ( app.checkContrast(color.substring(1)) === 'white' ) {
				$(pane).css('color', 'rgba(255, 255, 255, .7)');
			} else {
				$(pane).css('color', 'rgba(0, 0, 0, .5)');
			}
		});
	}

	app.addColorToPalette = function (color) {
		// the argument colr should be a hex value including the hash
		app.palette.push(color); // add to the data array
		$('.palette-box').append('<div class="color-box" style="background-color:' + color + '"></div>'); // append element
		console.log(app.palette);
	}

	app.removeColorFromPalette = function (index) {
		// argument is the zero-index of the item to remove in the palette
		app.palette.splice(index, 1);
		$('.palette-box').children('.color-box').eq(index).fadeOut(100, function () {
			$(this).remove();
		});
		console.log(app.palette);
	}

	app.checkContrast = function getContrast50(hexcolor){
		return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
	}

	app.bindEvents = function () {
		//refresh colors
		$('.refresh-colors').on('click', app.colorPanes);
		// resize wrapper on window resize
		$(window).on('resize', app.resizeWrapper);
		// add color to palette
		$('.wrapper .pane .add-to-palette').on('click', function () {
			var color = $(this).parent().css('background-color');
			app.addColorToPalette(color);
			console.log('test');
		});
		// remove color from palette (need to delegate since .color-box does not exist on doc.ready)
		$('.palette-box').on('click', '.color-box', function () {
			console.log('test');
			var index = $(this).index();
			app.removeColorFromPalette(index);
		});
	}

	app.verticallyCenterText = function () {
		var height = $('.pane').eq(0).outerHeight();
		$('.pane').children('h1').css('line-height', height + 'px');
	}

	$(document).ready(function () {
		app.init();
	});

})(window, document, jQuery);
/*----------------------------------------------------------*/