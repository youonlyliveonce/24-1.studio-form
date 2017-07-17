/* global me, app */
import AmpersandRouter from 'ampersand-router';

import ContentView from './views/content';
import ContentModel from './models/content';
// import FormModel from './features/form/form-model';
// import MapModel from './features/mapbox/mapbox-model';


let Router = AmpersandRouter.extend({

		routes: {
			// ':lang': 'content',
			// ':lang/*path': 'content'
			'(*path)': 'content'
		},
		props: {
			currentPath: 'object'
		},
		// ------- ROUTE HANDLERS ---------
		// Handelt alle Links und übergibt alle Parameter über den Event an die App
		content: function (value, params) {
			// console.log("lang", lang, value, params);
			// if ( lang == null)
			// catalog.json
			if(value == null) value = "";

			// check if value == params
			if(value.indexOf("=") != -1){
				params = value;
				value = "";
			}

			// add lang to model url value
			// value = `${lang}/${value}`;

			// prüfe ob sich nur der search String ?x=y geändert hat
			var onlyParamChange = this._checkForParamChange(value, params);

			if(onlyParamChange){
				// Update active View
				this.trigger('update', params);
			} else {
				// Trigger new View
				// this.trigger('page', new ContentView({ model: new ContentModel({id:value, lang:lang}) }), params);
				this.trigger('page', new ContentView({ model: new ContentModel({id:value}) }), params);
			}
		},
		_checkForParamChange: function(value, params){
			// if(params == null) return false
			if(this.currentPath == null){
				this.currentPath = value;
				return false;
			} else {
				if(this.currentPath == value){
					return true;
				} else {
					this.currentPath = value;
					return false;
				}
			}
		}

});

export default Router;
