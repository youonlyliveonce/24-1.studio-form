import View from 'ampersand-view';

let Base = View.extend({
	props: {
		id: ['string', true, '']
		,active: ['boolean', true, true]
		,parentview: ['object', true, function(){ return {} }]
	},
	events: { },
	render: function(){
		console.log("feature");
		this.on('change:active', this.onActiveChange, this);
	},
	handleResize: function(){
	},
	onActiveChange: function(value){
	}
})

export default Base;
