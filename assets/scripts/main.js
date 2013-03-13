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
			if ( ! $(pane).hasClass('locked') ) {
				$(pane).css('background-color', color).children('h1').html(color);
			}
			/*if ( app.checkContrast(color.substring(1)) === 'white' ) {
				$(pane).css('color', 'rgba(255, 255, 255, .7)');
			} else {
				$(pane).css('color', 'rgba(0, 0, 0, .5)');
			}*/
		});
	}

	app.colorPane = function (index, color) {
		// index is the zero-index of the pane
		// color is the color we want to change it to
		$('.pane').eq(index).css('background-color', color);
	}

	app.addColorToPalette = function (color) {
		// the argument colr should be a hex value including the hash
		app.palette.push(color); // add to the data array
		$('.palette-box').append('<div class="color-box" style="opacity: 0; background-color:' + color + '"></div>'); // append element
		$('.color-box').last().animate({
			opacity: 1
		}, 100);
		app.makeBoxesDraggable();
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

	app.lockPane = function (index) {
		// argument is zero-index of pane to lock
		var pane = app.panes[index];
		$(pane).addClass('locked');
		$(pane).children('.lock-pane').html('&#128274;');
		console.log('lock pane');
	}

	app.unlockPane = function (index) {
		// argument is zero-index of pane to lock
		var pane = app.panes[index];
		$(pane).removeClass('locked');
		$(pane).children('.lock-pane').html('&#128275;');
		console.log('unlock pane');
	}

	app.bindEvents = function () {
		//refresh colors
		$('.refresh-colors').on('click', function (e) {
			e.preventDefault();
			app.colorPanes();
		});
		// resize wrapper on window resize
		$(window).on('resize', app.resizeWrapper);
		// add color to palette
		$('.wrapper .pane .add-to-palette').on('click', function (e) {
			e.preventDefault();
			var color = $(this).parent().css('background-color');
			app.addColorToPalette(color);
		});
		// remove color from palette (need to delegate since .color-box does not exist on doc.ready)
		$('.palette-box').on('click', '.color-box', function (e) {
			e.preventDefault();
			console.log('test');
			var index = $(this).index();
			app.removeColorFromPalette(index);
		});
		// lock panes
		$('.lock-pane').on('click', function (e) {
			e.preventDefault();
			var index = $(this).parent().index(),
			$targetPane = $(this).parent();
			console.log($targetPane);
			if ( ! $targetPane.hasClass('locked') ) {
				app.lockPane(index);
			} else if ( $targetPane.hasClass('locked') ) {
				app.unlockPane(index);
			}
		});
		// make panes droppable
		$('.pane').droppable({
			accept: '.color-box',
			drop: function (e, ui) {
				var color = ui.helper.css('background-color'),
				index = $(this).index();
				app.colorPane(index, color);
				app.lockPane(index);
			}
		});
	}

	app.makeBoxesDraggable = function () {
		// make .color-box draggable
		$('.color-box').draggable({
			helper: 'clone',
			zIndex: 100,
			cursor: 'move'
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