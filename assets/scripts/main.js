/* APP
------------------------------------------------------------*/
;(function (window, document, $) {
	
	'use strict';

	var app = app || {};

	app.init = function () {
		this.colorPane();
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

	app.pane = $('.pane');

	app.palette = [];

	app.colorHistory = [];

	app.colorHistoryNumber = -1; // so first color added is [0]

	app.goBackInHistory = function () {
		app.colorHistoryNumber --;
		var color = app.colorHistory[app.colorHistoryNumber];
		app.colorPaneSpecific(color);
	}

	app.goForwardInHistory = function () {
		app.colorHistoryNumber ++;
		var color = app.colorHistory[app.colorHistoryNumber];
		app.colorPaneSpecific(color);
	}

	app.getRandomColor = function () {
		function value () {
			return Math.floor(Math.random() * (255 + 1));
		}
		var color = 'rgba(' + value() + ', ' + value() + ', ' + value() + ')';
		console.log(color);		
		return color;
	}

	app.colorPane = function () {
		var color = app.getRandomColor();
		$('.pane').animate({'background-color': color}, 200, 'easeInOutQuad');
		app.colorHistory.push(color);
		app.colorHistoryNumber ++;
		console.log(app.colorHistory);
	}

	app.colorPaneSpecific = function (color) {
		// color is the color we want to change it to
		$('.pane').animate({'background-color': color}, 200, 'easeInOutQuad');
	}

	app.addColorToPalette = function (color) {
		// the argument colr should be a hex value including the hash
		app.hideEmptyPaletteNotification();
		app.palette.push(color); // add to the data array
		$('.palette-box').append('<div class="color-box"><div class="color-sample" style="background-color: ' + color + '"></div><p class="color-name">' + color + '</p><div class="delete-color-box-wrapper"><a class="delete-color-box" href="#">&times;</a></div>'); // append element
		app.makeBoxesDraggable();
	}

	app.removeColorFromPalette = function (index) {
		// argument is the zero-index of the item to remove in the palette
		app.palette.splice(index, 1);
		$('.palette-box').children('.color-box').eq(index).remove();
		if ( app.palette.length === 0 ) {
			app.showEmptyPaletteNotification();
		}
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
		var pane = app.pane[index];
		$(pane).addClass('locked');
		$(pane).children('.lock-pane').html('&#128274;');
		console.log('lock pane');
	}

	app.unlockPane = function (index) {
		// argument is zero-index of pane to lock
		var pane = app.pane[index];
		$(pane).removeClass('locked');
		$(pane).children('.lock-pane').html('&#128275;');
		console.log('unlock pane');
	}

	app.bindEvents = function () {
		//refresh colors
		$('.refresh-colors').on('click', function (e) {
			e.preventDefault();
			app.colorPane();
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
				var color = ui.helper.children('.color-sample').css('background-color');
				console.log(color);
				app.colorPaneSpecific(color);
			}
		});
		// history
		$('.color-history-back').on('click', app.goBackInHistory);
		$('.color-history-forward').on('click', app.goForwardInHistory);
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