/* APP
------------------------------------------------------------*/
;(function (window, document, $) {
	
	'use strict';

	var app = app || {};

	app.init = function () {
		this.colorPanes();
		this.bindEvents();
		this.resizeWrapper();
		this.positionControls();
	}

	app.resizeWrapper = function () {
		var windowHeight = $(window).height(),
		headerBoxHeight = $('.header-box').outerHeight(),
		paletteBoxHeight = $('.palette-box').outerHeight();
		$('.pane-wrapper').height(windowHeight - paletteBoxHeight - headerBoxHeight);
	}

	app.positionControls = function () {
		var $paneControls = $('.pane-controls'),
		marginLeft = $paneControls.outerWidth() / -2,
		marginTop = $paneControls.outerHeight() / -2;
		$paneControls.css({
			'margin-left': marginLeft,
			'margin-top': marginTop
		});
	}

	app.panes = $('.pane');

	app.palette = [];

	app.getRandomColor = function () {
		function value () {
			return Math.floor(Math.random() * (255 + 1));
		}
		var color = 'rgba(' + value() + ', ' + value() + ', ' + value() + ')';
		console.log(color);		
		return color;
	}

	app.colorPanes = function () {
		app.panes.each(function (i, pane) {
			var color = app.getRandomColor();
			if ( ! $(pane).hasClass('locked') ) {
				$(pane).animate({'background-color': color}, 200, 'easeInOutQuad');
			}
		});
	}

	app.colorPane = function (index, color) {
		// index is the zero-index of the pane
		// color is the color we want to change it to
		$('.pane').eq(index).animate({'background-color': color}, 200, 'easeInOutQuad');
	}

	app.addColorToPalette = function (color) {
		// the argument colr should be a hex value including the hash
		app.hideEmptyPaletteNotification();
		app.palette.push(color); // add to the data array
		$('.palette-box').append('<div class="color-box" style="opacity: 0"><div class="color-sample" style="background-color: ' + color + '"></div><p class="color-name">' + color + '</p><a class="delete-color-box" href="#">&times;</a>'); // append element
		$('.color-box').last().animate({
			opacity: 1
		}, 100);
		app.makeBoxesDraggable();
	}

	app.removeColorFromPalette = function (index) {
		// argument is the zero-index of the item to remove in the palette
		app.palette.splice(index, 1);
		console.log(index);
		if ( app.palette.length === 0 ) {
			app.showEmptyPaletteNotification();
		}
		$('.palette-box').children('.color-box').eq(index).fadeOut(100, function () {
			$(this).remove();
		});
	}

	app.showEmptyPaletteNotification = function () {
		$('.empty-palette-notification').show();
	}

	app.hideEmptyPaletteNotification = function () {
		$('.empty-palette-notification').hide();
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
		$('.pane-wrapper .add-to-palette').on('click', function (e) {
			e.preventDefault();
			var color = $('.pane').css('background-color');
			app.addColorToPalette(color);
		});
		// remove color from palette (need to delegate since .color-box does not exist on doc.ready)
		$('.palette-box').on('click', '.delete-color-box', function (e) {
			e.preventDefault();
			var index = $(this).parent().index();
			app.removeColorFromPalette(index - 1);
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
				var color = ui.helper.children('.color-box').css('background-color'),
				index = $(this).index();
				app.colorPane(index, color);
			}
		});
	}

	app.makeBoxesDraggable = function () {
		// make .color-box draggable
		$('.color-box').draggable({
			helper: 'clone',
			zIndex: 100,
			cursor: '-webkit-grabbing'
		});
	}

	$(document).ready(function () {
		app.init();
	});

})(window, document, jQuery);
/*----------------------------------------------------------*/