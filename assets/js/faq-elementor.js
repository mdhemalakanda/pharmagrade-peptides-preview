/**
 * PharmaGrade Core — Elementor handler for the FAQ widget.
 */
( function () {
	'use strict';

	window.addEventListener( 'elementor/frontend/init', function () {
		if ( ! window.elementorFrontend || ! window.elementorFrontend.hooks ) {
			return;
		}
		window.elementorFrontend.hooks.addAction( 'frontend/element_ready/pgp_faq.default', function ( $scope ) {
			var el = $scope && ( $scope[ 0 ] || $scope );
			if ( ! el || ! el.querySelectorAll || ! window.PGPFAQInit ) {
				return;
			}
			el.querySelectorAll( '.pgp-faq' ).forEach( function ( root ) {
				window.PGPFAQInit( root );
			} );
		} );
	} );
} )();
