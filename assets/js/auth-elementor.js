/**
 * PharmaGrade Core — Elementor handler for the Login Form widget.
 *
 * Re-initializes the research-access form behaviour whenever Elementor
 * renders or re-renders the widget (editor canvas, preview, frontend).
 */
( function () {
	'use strict';

	function initScope( scope ) {
		var el = scope instanceof Array || scope instanceof Object ? ( scope[ 0 ] || scope ) : scope;
		if ( ! el || ! el.querySelectorAll ) {
			return;
		}
		if ( ! window.PGPAuthInit ) {
			return;
		}
		el.querySelectorAll( '.pga' ).forEach( function ( root ) {
			window.PGPAuthInit( root );
		} );
	}

	window.addEventListener( 'elementor/frontend/init', function () {
		if ( ! window.elementorFrontend || ! window.elementorFrontend.hooks ) {
			return;
		}
		window.elementorFrontend.hooks.addAction( 'frontend/element_ready/pgp_login_form.default', function ( $scope ) {
			initScope( $scope );
		} );
	} );
} )();
