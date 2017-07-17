/*global me, app*/
import _ from 'lodash';
import View from 'ampersand-view';
import ViewSwitcher from 'ampersand-view-switcher';

import "ScrollToPlugin";
import "TweenMax";

var MainView = View.extend({

		/* Set Properties */
		props: {
			isSticky: ['boolean', true, false]
		},

		/* Bind basic Events, all link clicks, toggle Navigation, etc. */
		events: {
				'click a[href]': 'handleLinkClick'
		},

		/* Render Main View */
		render: function () {

				/* Set scope for callbacks */
				var self = this;

				/* Cache Elements */
				this.cacheElements({
						header: '.Header',
						switcher: '[data-hook=switcher]'
				});
				// Init and configure our page switcher
				this.pageSwitcher = new ViewSwitcher(this.queryByHook('switcher'), {
						waitForRemove: true,
						hide: function (oldView, cb) {
								// Set scope for callback of TweenMax
								var inSwitcher = this;

								// Hide oldView if oldView exits
								if(oldView && oldView.el){
										oldView.hookBeforeHide();
										TweenMax.to(oldView.el, 0.25, {opacity:0, onComplete:function(){
											cb.apply(inSwitcher);
											// scroll to top
											if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
												window.scrollTo(0,0)
											} else {
												TweenMax.to(window, 0.1, {scrollTo:{y:0}});
											}
										}, delay:0.2 });
								}
						},
						show: function (newView) {
								// Set Page Title
								document.title = _.result(newView.model, 'pageTitle');
								// Set newView opacity to 0
								TweenMax.set(newView.el, {opacity:0});

								// Animate newView opacity to 1
								TweenMax.to(newView.el, 0.8, {opacity:1, onComplete:function(){
									// Scroll to paramter 'section'
									self.handleUpdateView();
								}, delay:0.5});
						}
				});
				return this;
		},

		/*

			Function for the inital Handling of the Page

		*/

		handleInitialView: function (view) {
			var self = this;

			// Set child view as initial
			view.isInitial = true;

			CM.App.router.lang = view.model.lang;

			// Set the el of the child view
			view.el = this.query('.view');

			// Render child view
			view.render();

			// Set current view of page switcher (silent)
			this.pageSwitcher.current = view;

			// Handle active stuff in navigation
			this.updateActiveNav();

				// Scroll to paramter 'section'
				TweenMax.delayedCall(0.15, function(){ self.handleUpdateView() });
		},

		/*

			Function for the Handling of a new Page loaded via Ajax

		*/

		handleNewView: function (view) {
			// TRACKING
			if(typeof ga != 'undefined'){
					ga('send', 'pageview', {
							'page': CM.App.router.history.location.pathname,
							'title': view.model.pageTitle
					});
			}

			// SWICTH THE VIEW
			this.pageSwitcher.set(view);

			// UPDATE LANG
			this.updateI18n(view);
			// UPDATE PAG NAV
			this.updateActiveNav();
		},
		updateI18n: function(view){
			if ( view.model.lang != CM.App.router.lang ){
				CM.App.router.lang = view.model.lang;
				document.querySelector('.Navigation').innerHTML = _.result(view.model, 'pageMenu');
				document.querySelector('.Footer').innerHTML = _.result(view.model, 'pageFooter');
			}
			// console.log("toggle", document.querySelector('.Button-i18n--toggle') );
			if ( document.querySelector('.Button-i18n--toggle') !== null ){
				document.querySelector('.Button-i18n--toggle').innerHTML = _.result(view.model, 'pageI18n');
			}
			// console.log("updateI18n:", view.model.lang )
		},
		/*
			Updates current View if something changes but no url
		*/
		handleUpdateView: function(){
			this.scrollTo();
			this.updateI18nButton();
		},

		updateI18nButton: function (){
			let self = this;
			TweenMax.delayedCall(0.15, function(){ self.i18nButtonHandler() });
		},
		i18nButtonHandler: function (){
			// let sectionAnchor = '';
			// if (CM.App._params != {} && CM.App._params.section != null){
			// 	let currentPath = document.querySelector('.Button-i18n--toggle a').getAttribute('href').split("?")[0];
			// 	sectionAnchor = currentPath +'?section='+ CM.App._params.section;
			// 	console.log("sectionAnchor", sectionAnchor);
			// 	document.querySelector('.Button-i18n--toggle a').setAttribute('href', sectionAnchor);
			// }
		},



		/*
			Toggle functions for mobile or Desktop Navigation
		*/

		handleClickToggle: function (e){
			e.preventDefault()
			var html = document.getElementsByTagName('html')[0];
			if( html.classList.contains('Navigation--show') || e == undefined){
					html.classList.remove('Navigation--show');
			} else{
					html.classList.add('Navigation--show');
			}
		},

		handleClickClose: function (e){
			var html = document.getElementsByTagName('html')[0];
			html.classList.remove('Navigation--show');
		},

		handleClickOpen: function (e){
			var body = document.body;
			body.classList.add('Navigation--show');
		},


		/*

		Click Handler for each a[href]

		*/

		handleLinkClick: function (e) {
			console.log("handleLinkClick");
			var aTag = e.delegateTarget,
					self = this,
					path = aTag.getAttribute("href"),
					params = path.split("?")[1];

				this.handleClickClose();

				var local = aTag.host === window.location.host;
				if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && aTag.getAttribute("target") !== "_blank") {
						// no link handling via Browser
						e.preventDefault();

						// Update View without reloading view
						if (CM.App._params != {} && CM.App.router.history.location.pathname == e.delegateTarget.pathname && params == CM.App._paramsString ){
							this.handleUpdateView();
						} else {
							// Route
							CM.App.navigate(path);
						}
				}
		},

		scrollTo: function(){
			if (CM.App._params != {} && CM.App._params.section != null){
					var id = this.query('#'+CM.App._params.section);
					if(Modernizr.touchevents) {
						TweenMax.to(window, 4, {scrollTo:{y:id.offsetTop, autoKill:false}});
					} else {
						TweenMax.to(window, 1.2, {scrollTo:{x:0, y:id.offsetTop, autoKill:true}, overwrite:true, ease:Power2.easeOut});
					}
			}
		},

		handleClickCloseOverlayer: function (e){
			let url = CM.App.router.currentPath;
			e.preventDefault();
			// Route
			CM.App.navigate(url);
		},
		updateActiveNav: function () {
				var path = window.location.pathname.slice(1),
						search = /(\w+\/)/g,
						match = search.exec(path),
						folder = path;

				if (match != null ) folder = match[0];
				this.queryAll('.Navigation a[href]').forEach(function (aTag) {
						var aPath = aTag.pathname.slice(1),
								parent = aTag.parentNode.className.indexOf('sub') != -1
												? aTag.parentNode.parentNode.parentNode
												: aTag.parentNode;

						if ( folder.length >= 1 && aPath.indexOf(folder) === 0){
										parent.classList.add('active');
						} else {
								if ( aPath == path){
										parent.classList.add('active');
								} else {
										parent.classList.remove('active');
								}
						}
				});
		}

});


export default MainView;
