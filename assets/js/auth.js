/**
 * PharmaGrade Core — Research Access gate behaviour.
 *
 * PGPAuthInit( root ) is idempotent (a root is bound once) and exposed
 * globally so the Elementor widget handler can (re)initialize the form
 * whenever the widget markup is rendered inside the editor or preview.
 */
( function () {
	'use strict';

	function PGPAuthInit( root ) {
		if ( ! root || '1' === root.getAttribute( 'data-pga-bound' ) ) {
			return;
		}
		root.setAttribute( 'data-pga-bound', '1' );

		/* ---------- Tab / panel switching (with ?mode= deep links) ---------- */
		var tabs = root.querySelectorAll( '.pga-tab' );
		var panels = root.querySelectorAll( '.pga-panel' );

		function activate( name ) {
			tabs.forEach( function ( tab ) {
				var on = tab.dataset.tab === name;
				tab.classList.toggle( 'is-active', on );
				tab.setAttribute( 'aria-selected', on ? 'true' : 'false' );
			} );
			panels.forEach( function ( panel ) {
				panel.classList.toggle( 'is-active', panel.dataset.panel === name );
			} );
		}

		tabs.forEach( function ( tab ) {
			tab.addEventListener( 'click', function () {
				activate( tab.dataset.tab );
			} );
		} );

		var mode = root.dataset.mode;
		if ( mode && 'login' !== mode ) {
			activate( mode );
		}

		root.querySelectorAll( '.js-pga-forgot-link' ).forEach( function ( link ) {
			link.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				activate( 'forgot' );
			} );
		} );
		root.querySelectorAll( '.js-pga-login-link' ).forEach( function ( link ) {
			link.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				activate( 'login' );
			} );
		} );

		/* ---------- Password show / hide ---------- */
		root.querySelectorAll( '.js-pga-toggle' ).forEach( function ( toggle ) {
			toggle.addEventListener( 'click', function () {
				var input = toggle.parentElement.querySelector( 'input' );
				if ( ! input ) {
					return;
				}
				var showing = 'text' === input.type;
				input.type = showing ? 'password' : 'text';
				toggle.textContent = showing ? ( toggle.dataset.show || 'Show' ) : ( toggle.dataset.hide || 'Hide' );
			} );
		} );

		/* ---------- Flash helper ---------- */
		var flash = root.querySelector( '.js-pga-flash' );
		function showFlash( message, kind ) {
			if ( ! flash ) {
				return;
			}
			flash.textContent = message;
			flash.className = 'pga-flash js-pga-flash ' + ( 'error' === kind ? 'is-error' : 'is-ok' );
			flash.hidden = false;
			window.clearTimeout( showFlash._t );
			showFlash._t = window.setTimeout( function () {
				flash.hidden = true;
			}, 4200 );
		}

		var bootAlert = root.querySelector( '.js-pga-boot-alert' );
		if ( bootAlert ) {
			bootAlert.insertAdjacentElement( 'afterend', flash );
			flash.textContent = bootAlert.textContent;
			flash.className = 'pga-flash js-pga-flash is-ok';
			flash.hidden = false;
			bootAlert.remove();
			window.setTimeout( function () {
				if ( flash ) {
					flash.hidden = true;
				}
			}, 4200 );
		}

		/* ---------- AJAX form handling ---------- */
		root.querySelectorAll( '.js-pga-form' ).forEach( function ( form ) {
			form.addEventListener( 'submit', function ( event ) {
				event.preventDefault();

				var submit = form.querySelector( '.pga-btn' );
				var action = form.dataset.action;
				var nonceKey = {
					pga_login: window.PGA && window.PGA.loginNonce,
					pga_register: window.PGA && window.PGA.registerNonce,
					pga_forgot: window.PGA && window.PGA.forgotNonce,
				}[ action ];

				form.querySelectorAll( '.has-error' ).forEach( function ( field ) {
					field.classList.remove( 'has-error' );
				} );

				var data = new FormData( form );
				data.append( 'action', action );
				data.append( 'nonce', nonceKey || '' );
				data.append( 'redirect_to', window.location.search.match( /redirect_to=([^&]+)/ ) ? decodeURIComponent( window.location.search.match( /redirect_to=([^&]+)/ )[ 1 ] ) : '' );

				if ( submit ) {
					submit.disabled = true;
				}

				window.fetch( ( window.PGA && window.PGA.ajaxUrl ) || '', {
					method: 'POST',
					credentials: 'same-origin',
					body: data,
				} )
					.then( function ( response ) {
						return response.json();
					} )
					.then( function ( result ) {
						if ( result && result.success ) {
							if ( 'pga_forgot' === action ) {
								showFlash( result.data.message, 'ok' );
								form.reset();
							} else {
								showFlash( result.data.message, 'ok' );
								window.setTimeout( function () {
									window.location.href = result.data.redirect || '/';
								}, 700 );
							}
						} else {
							var message = ( result && result.data && result.data.message ) || 'Something went wrong. Please try again.';
							showFlash( message, 'error' );
							var field = result && result.data && result.data.field;
							if ( field ) {
								var input = form.querySelector( '[name="' + field + '"]' );
								if ( input ) {
									var wrap = input.closest( '.pga-field' ) || input.closest( '.pga-check' );
									if ( wrap ) {
										wrap.classList.add( 'has-error' );
									}
								}
							}
						}
					} )
					.catch( function () {
						showFlash( 'Network error. Please check your connection and try again.', 'error' );
					} )
					.finally( function () {
						if ( submit ) {
							submit.disabled = false;
						}
					} );
			} );
		} );
	}

	window.PGPAuthInit = PGPAuthInit;

	function boot() {
		var roots = document.querySelectorAll( '.pga' );
		Array.prototype.forEach.call( roots, PGPAuthInit );
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
