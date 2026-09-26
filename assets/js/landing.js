/**
 * PharmaGrade Core — landing page behaviour (ModernAminos-style redesign).
 */
( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		var site = document.querySelector( '.pgp-site' );
		if ( ! site ) {
			return;
		}

		/* ---------- Toast helper ---------- */
		var toast = site.querySelector( '.js-pgp-toast' );
		var toastTimer;
		function showToast( message ) {
			if ( ! toast ) {
				window.alert( message );
				return;
			}
			toast.textContent = message;
			toast.hidden = false;
			clearTimeout( toastTimer );
			toastTimer = window.setTimeout( function () {
				toast.hidden = true;
			}, 2600 );
		}

		/* ---------- Header shadow on scroll ---------- */
		var header = site.querySelector( '#pgpHeader' );
		function onScroll() {
			if ( ! header ) {
				return;
			}
			header.classList.toggle( 'is-stuck', window.scrollY > 8 );
		}
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();

		/* ---------- Mobile menu ---------- */
		var burger = site.querySelector( '.js-pgp-burger' );
		var nav = site.querySelector( '#pgpNav' );
		var backdrop = null;

		function closeNav() {
			if ( ! nav ) {
				return;
			}
			nav.classList.remove( 'is-open' );
			if ( burger ) {
				burger.setAttribute( 'aria-expanded', 'false' );
			}
			if ( backdrop ) {
				backdrop.remove();
				backdrop = null;
			}
		}

		if ( burger && nav ) {
			burger.addEventListener( 'click', function () {
				var open = nav.classList.toggle( 'is-open' );
				burger.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
				if ( open ) {
					backdrop = document.createElement( 'div' );
					backdrop.className = 'pgp-nav-backdrop';
					backdrop.addEventListener( 'click', closeNav );
					document.body.appendChild( backdrop );
				} else {
					closeNav();
				}
			} );

			nav.querySelectorAll( '.pgp-nav__has-sub > a' ).forEach( function ( link ) {
				link.addEventListener( 'click', function ( event ) {
					if ( window.matchMedia( '(max-width: 880px)' ).matches ) {
						event.preventDefault();
						link.parentElement.classList.toggle( 'is-open' );
					}
				} );
			} );
		}

		/* ---------- Region dropdown ---------- */
		var region = site.querySelector( '.js-pgp-region' );
		if ( region ) {
			var regionBtn = region.querySelector( '.pgp-region__btn' );
			var regionLabel = region.querySelector( '.js-pgp-region-label' );

			regionBtn.addEventListener( 'click', function ( event ) {
				event.stopPropagation();
				var open = region.classList.toggle( 'is-open' );
				regionBtn.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			} );

			region.querySelectorAll( '[data-region]' ).forEach( function ( item ) {
				item.addEventListener( 'click', function () {
					regionLabel.textContent = item.dataset.region;
					region.classList.remove( 'is-open' );
					showToast( 'Store region set to ' + item.textContent.trim() + '.' );
				} );
			} );

			document.addEventListener( 'click', function ( event ) {
				if ( ! region.contains( event.target ) ) {
					region.classList.remove( 'is-open' );
				}
			} );
		}

		/* ---------- Category carousel ---------- */
		site.querySelectorAll( '.pgp-carousel' ).forEach( function ( carousel ) {
			var track = carousel.querySelector( '.js-pgp-track' );
			if ( ! track ) {
				return;
			}
			var step = function () {
				var card = track.querySelector( '.pgp-cat' );
				return card ? card.getBoundingClientRect().width + 16 : 184;
			};
			var prev = carousel.querySelector( '.js-pgp-prev' );
			var next = carousel.querySelector( '.js-pgp-next' );
			if ( prev ) {
				prev.addEventListener( 'click', function () {
					track.scrollBy( { left: -step(), behavior: 'smooth' } );
				} );
			}
			if ( next ) {
				next.addEventListener( 'click', function () {
					track.scrollBy( { left: step(), behavior: 'smooth' } );
				} );
			}
		} );

		/* ---------- FAQ accordion ---------- */
		site.querySelectorAll( '.pgp-faq' ).forEach( function ( list ) {
			list.addEventListener( 'click', function ( event ) {
				var q = event.target.closest( '.pgp-faq__q' );
				if ( ! q ) {
					return;
				}
				var item = q.parentElement;
				var wasOpen = item.classList.contains( 'is-open' );
				list.querySelectorAll( '.pgp-faq__item' ).forEach( function ( other ) {
					other.classList.remove( 'is-open' );
					var btn = other.querySelector( '.pgp-faq__q' );
					if ( btn ) {
						btn.setAttribute( 'aria-expanded', 'false' );
					}
				} );
				if ( ! wasOpen ) {
					item.classList.add( 'is-open' );
					q.setAttribute( 'aria-expanded', 'true' );
				}
			} );
		} );

		/* ---------- Footer subscribe ---------- */
		site.querySelectorAll( '.js-pgp-subscribe' ).forEach( function ( form ) {
			form.addEventListener( 'submit', function ( event ) {
				event.preventDefault();
				var email = form.querySelector( 'input[type="email"]' );
				if ( email && email.value ) {
					showToast( 'Subscribed! Watch your inbox for deals and insights.' );
					email.value = '';
				}
			} );
		} );
	} );
} )();
