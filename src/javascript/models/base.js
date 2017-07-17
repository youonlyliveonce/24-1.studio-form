/*global $*/
// base model for models
import Model from 'ampersand-model';
import _ from 'lodash';


let Base = Model.extend({
		urlRoot: '',
		props: {
				id: ['string', true, ''],
				pageContent: ['object', true, function(){ return []; }],
				pageI18n: ['string', true, ''],
				pageMenu: ['string', true, ''],
				pageFooter: ['string', true, ''],
				pageTitle: ['string', true, ''],
				lang: ['string', true, 'en']
		},
		parse:function (resp, options) {
			var tempDom = document.createElement('document');
			tempDom.insertAdjacentHTML('afterbegin', resp);
			this.pageTitle = resp.split("<title>")[1].split("</title>")[0];
			this.pageContent = tempDom.querySelectorAll('.view')[0];
			this.pageI18n = ( tempDom.querySelectorAll('.Button-i18n--toggle').length >= 1  ) ? tempDom.querySelectorAll('.Button-i18n--toggle')[0].innerHTML : '';
			this.pageMenu = ( tempDom.querySelectorAll('.Navigation').length >= 1 ) ? tempDom.querySelectorAll('.Navigation')[0].innerHTML : '';
			this.pageFooter = ( tempDom.querySelectorAll('.Footer').length >= 1 ) ?  tempDom.querySelectorAll('.Footer')[0].innerHTML : '';
			//  console.log(this.pageContent);
			 return resp;
	 },
		ajaxConfig: function () {
				return {
						xhrFields: {
								'withCredentials': true
						},
						headers: {
								'accept': 'application/html'
						}

				};
		},
		url: function () {
			var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError(),
					url;
			if (this.isNew()) url = base;
			else url = base + (base.charAt(base.length - 1) === '/' ? '' : '/') + this.getId();
			return url;
		}
});

export default Base;
