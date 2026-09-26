/**
 * PharmaGrade Core — FAQ widget behaviour (single-open accordion).
 * Idempotent + exposed globally for the Elementor handler.
 */
( function () {
	'use strict';

	function PGPFAQInit( root ) {
		if ( ! root || '1' === root.getAttribute( 'data-pgp-faq-bound' ) ) {
			return;
		}
		root.setAttribute( 'data-pgp-faq-bound', '1' );

		root.querySelectorAll( '.pgp-faq__q' ).forEach( function ( btn ) {
			btn.addEventListener( 'click', function () {
				var item = btn.closest( '.pgp-faq__item' );
				var wasOpen = item.classList.contains( 'is-open' );

				root.querySelectorAll( '.pgp-faq__item.is-open' ).forEach( function ( open ) {
					open.classList.remove( 'is-open' );
					var b = open.querySelector( '.pgp-faq__q' );
					if ( b ) {
						b.setAttribute( 'aria-expanded', 'false' );
					}
				} );

				if ( ! wasOpen ) {
					item.classList.add( 'is-open' );
					btn.setAttribute( 'aria-expanded', 'true' );
				}
			} );
		} );
	}

	window.PGPFAQInit = PGPFAQInit;

	function boot() {
		Array.prototype.forEach.call( document.querySelectorAll( '.pgp-faq' ), PGPFAQInit );
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )();
