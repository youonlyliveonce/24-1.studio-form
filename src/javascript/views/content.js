import PageView from './base';

import FormModel from '../features/form/form-model';
import FormView from '../features/form/form';

let Content = PageView.extend({

	props:{
		isInitial: ['boolean', true, false]
		,isScrollTop: ['boolean', true, false]
		,subViews: ['array', true, function(){ return []; }]
		,activeElement: ['object', true, function(){ return {}; }]
	},

	events: {

	},

	hookBeforeHide: function(){

	},

	hookInRender: function () {
		let self = this;
		let elements = this.queryAll('.Element');
		if(elements.length > 0){
			elements.forEach(function(element, index, array){
				let view = {};
				switch(element.getAttribute('data-view')){
					case "FormView" :
						view = new FormView({el:element, parentview:self, model: new FormModel()});
						view.render();
						break;
				}
				self.registerSubview(view);
				self.subViews.push({id:element.getAttribute("id"), view:view});
			});
		}
	}

});

export default Content;
