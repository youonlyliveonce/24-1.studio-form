/*global $*/
// base view for page
import View from 'ampersand-view';
import _ from 'lodash';

let Base = View.extend({

		props: {
				isInitial: ['boolean', true, false],
				isKilled: ['boolean', true, false]
		},

		template: function(){
				var content = this.model.pageContent;
				return content;
		},

		render: function(){
			// console.log("RENDER");
			if(!this.isInitial){
				this.renderWithTemplate(this);
			}

			this.hookInRender();
			this.once('remove', this.cleanup, this);

			return this;
		},

		hookBeforeHide: function(){
			// destroy or animate before hide
		},

		hookInRender: function(){
				// additional Stuff in Render
		},

		cleanup: function(){
				//console.log("cleanup");
		}

});

export default Base;
