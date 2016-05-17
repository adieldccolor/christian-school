/* ***
Main functions file for Founders Christian School
Author: Adiel Hercules | jadher.11x2@gmail.com | @adielhercules
*** */
(function() {
	'use strict';

	//Object contains all website functions
	var school = {};
	
	//This object will contain all callbacks that will be triggered in window.resize
	school.resizeCallbacks = [];

	//Check svg support and create special svg buttons
	school.checkSVG = function() {
		var nocheck = arguments.length == 1 ? arguments[0] : false;
		var format = arguments.length == 2 ? arguments[1] : 'png';

		svgeezy.init(false, 'png');


		//handle svg-buttons
		school.createSVGButtons('.btn-has-path');
	}

	/*
	Create SVG for buttons
	@param w integer is the width of the new svg
	@return Element is the svg element
	*/
	school.svgButton = function(w) {
		if ( w == undefined ) {
			return false;
		}

		var path_width = w - 60;
		var arrlen = 0;
		var svg;

		var svgbutton = '<svg><path fill="none" stroke="#9F302E" stroke-width="3.5" stroke-linecap="round" stroke-miterlimit="10" d="M52.347,11.879C56.496,16.763,59,23.089,59,30c0,15.464-12.536,28-28,28S3,45.464,3,30S15.536,2,31,2h1.358h' + path_width + 'c15.4,0,28,12.6,28,28v0c0,15.4-12.6,28-28,28H55.454"/></svg>';

		svg = $(svgbutton);
		arrlen = svg.find('path')[0].getTotalLength();
		svg.css({ width: (w + 5), height: 60 });
		svg.find('path').css({ 'stroke-dasharray': arrlen, 'stroke-dashoffset': arrlen });

		return svg;
	}

	/*
	Add a new callback to the callbacks object
	@param callback is the callback to be executed
	@param arguments are the others options for the callback
	*/
	school.addResizeCallback = function(callback) {
		var _arguments = [];
		var _found = false;
		for (var i = 1; i < arguments.length; i++) {
			_arguments.push(arguments[i]);
		}

		for (var i = 0; i < school.resizeCallbacks.length; i++) {
			if ( school.resizeCallbacks[i].data[0] == arguments[1] 
			    && school.resizeCallbacks[i].data[1] == arguments[2] ) {
				_found = true;
			}
		}

		if ( !_found ) {
			school.resizeCallbacks.push({
				data: _arguments,
				callback: function() {
					callback(_arguments[0], _arguments[1]);
				}
			});
		}
	}

	/*
	Create the svg-buttons
	@param buttons string is the selector of the buttons to create
	@param force boolean means if will be forced to do not animate
	*/
	school.createSVGButtons = function(buttons, force) {
		force = force || false;

		if ( !$(buttons).length ) {
			return false;
		}

		//add a new callback
		school.addResizeCallback(school.createSVGButtons, buttons, 1);

		$(buttons).each(function() {
			var $button = $(this);
			var timerID = window['__svg-btn-timer-' + $button.index()];
			var width, svg;

			if ( !force && $button.hasClass('btn-path-init') ) {
				return false;
			}

			if ( $button.find('svg').length ) {
				$button.find('svg').remove().end().removeClass('btn-path-init is-path is-animated');
			}

			width = $button.outerWidth();
			svg = school.svgButton(width);

			if ( timerID != undefined ) {
				clearTimeout(timerID);
			}

			if ( force ) {
				$button.addClass('js-noanimation');
			}

			$button.addClass('btn-path-init is-path').append(svg);
			window['__svg-btn-timer-' + $button.index()] = setTimeout(function() {
				$button.find('path').css({ 'stroke-dashoffset': 0 }).end().addClass('is-animated');
			}, 10);
		});
	}

	//handlers, events and listeners for the quick newsletter form in the bottom
	school.newsletter = function() {
		$('body').on('focus', '.newsletter-email', function(e) {
			if ( $(this).hasClass('notempty') ) {
				$(this).addClass('notempty');
			}
		}).on('blur', '.newsletter-email', function(e) {
			if ( $(this).val().trim() != "" ) {
				$(this).addClass('notempty');
			}
		});
	}

	//start the window.resize listener and execute the callbacks with delay
	school.enableResize = function() {
		
		$(window).resize(function() {
			var timerID = window['_resize-timer'];
			if ( timerID != undefined ) {
				clearTimeout(timerID);
			}

			window['_resize-timer'] = setTimeout(function() {
				for (var i = 0; i < school.resizeCallbacks.length; i++) {
					school.resizeCallbacks[i].callback.call(this);
				}
			}, 100);
		});

	}

	//Start everything
	school.ready = function() {
		school.checkSVG();
		school.newsletter();
		school.enableResize();
	}


	$(document).on('ready', school.ready);
})();