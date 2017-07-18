import 'babel-polyfill';
import header from 'head';

class Loader {
	constructor () {
		// Singleton Object
		if(window.CM == null){
				window.CM = {};
		}
		window.CM.Loader = this;

		head.ready(document, function() {
				head.load(["//fonts.googleapis.com/css?family=Maven+Pro:400,700",
									"assets/app.css",
									"assets/app.js",
								], CM.Loader.startApplication);
		});
	}
	removeGFX (){

		document.body.setAttribute("class", document.body.getAttribute("class").split("hideloader").join(""));
		let preloader = document.getElementsByClassName("Preloader")[0];
		if(preloader && preloader.parentNode){
				preloader.parentNode.removeChild(preloader);
		}
	}
	startApplication (){
		if(window.CM.App == undefined){
				setTimeout(CM.Loader.startApplication, 500);
		} else {

			CM.App.blastoff();

			document.body.setAttribute("class", document.body.getAttribute("class").split("loading").join("loaded") );
			setTimeout(function(){
			 document.body.setAttribute("class", document.body.getAttribute("class").split("loaded").join("hideloader") );
			}, 500);
			setTimeout(function(){ CM.Loader.removeGFX(); }, 1000);
		}
	}
};

export default new Loader();
