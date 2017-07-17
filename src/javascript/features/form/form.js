import Base from '../base';
import _ from 'lodash';

let Form = Base.extend({

	events: {
		'click .Form input[type="submit"]': '_handleFormSubmitClick',
		"click .Form-field--radio div":"_handleRadioClick",
		"click .Form-field--checkbox div":"_handleCheckboxClick",
		"focus .Form-field--dropdown input":"_handleDropdownToggle",
		"blur .Form-field--dropdown input":"_handleDropdownToggleBlur",
		"click .Form-field--dropdown li":"_handleDropdownItemClick",
		// "click #contact-form button[type='submit']":"_handleFormSubmitClick"
	},

	_scrollToTop: function(form){
		if(form.parentNode.classList.contains("view")){
				// TweenMax.to(window, 0.5, {scrollTo:{y:form.offsetTop}, ease:Power2.easeOut});
		} else {
			var section = this._findSectionOfFormInView(form);
			// TweenMax.to(window, 0.5, {scrollTo:{y:section.offsetTop}, ease:Power2.easeOut});
		}
	},

	_handleDropdownToggle: function (e){
			var target = e.delegateTarget,
					container = this._findParentByClass(target, 'Form-field');

			if ( container.classList.contains('open') ){
				container.classList.remove('open');
			} else {
				container.classList.add('open');
			}
	},

	_handleDropdownToggleBlur: function (e){
		var self = this;
		setTimeout(function(){
				self._handleDropdownToggle(e);
		}, 150);
	},

	_handleDropdownItemClick: function (e){
		var self = this,
				item = e.delegateTarget,
				itemToShow = item.getAttribute('data-valueToShow'),
				itemToSet = item.getAttribute('data-valueToSet'),
				itemKey = item.getAttribute('data-key'),
				container = self._findParentByClass(item, 'Form-field'),
				input = self._findInputInContainer(container);

		// Set Value in Form to selected
		self.model.fields[itemKey] = itemToSet;
		input.setAttribute('value', itemToShow);
		return false;
	},

	_handleRadioClick: function(event){
		var group = event.delegateTarget.parentNode,
				radios = group.childNodes,
				input = event.delegateTarget.firstElementChild;

		_.each(radios, function(node){
			if(node.classList.contains('isChecked')){
					node.classList.remove('isChecked');
					node.firstElementChild.removeAttribute('checked');
			}
		});
		event.delegateTarget.classList.add('isChecked');
		input.setAttribute('checked', true);
	},

	_handleCheckboxClick: function(event){
		var input = event.delegateTarget.firstElementChild;
		if(event.delegateTarget.classList.contains('isChecked')){
			event.delegateTarget.classList.remove('isChecked');
			input.removeAttribute('checked');
		}else{
			event.delegateTarget.classList.add('isChecked');
			input.setAttribute('checked', true);
		}
	},

	_findFormTag: function(target){
		if(target.parentNode.nodeName.toUpperCase() == "FORM"){
			return target.parentNode;
		} else {
			if(target.nodeName.toUpperCase() == "BODY"){
				return null;
			} else {
				return this._findFormTag(target.parentNode);
			}
		}
	},

	_findInputInContainer: function(container){
		var self = this;
		return _.find(container.childNodes, function(child, index){
				if(child.nodeName.toUpperCase() == "INPUT"){
					return true;
				} else if(child != null && child.childNodes && child.childNodes.length > 1){
					self._findInputInContainer(child);
				}
		});
	},

	_findSectionOfFormInView: function(target){
		if(target.parentNode){
			if(target.parentNode.classList.contains("view")){
				return target;
			} else {
				return this._findSectionOfFormInView(target.parentNode);
			}
		} else {
			return target;
		}
	},

	_findParentByClass: function(target, className){
		if(target.parentNode.classList.contains(className)){
			return target.parentNode;
		} else {
			if(target.nodeName.toUpperCase() == "BODY"){
				return null;
			} else {
				return this._findParentByClass(target.parentNode, className);
			}
		}
	},

	_handleFormSubmitClick: function(event){

		// console.log("handleFormSubmitClick", event);

		event.preventDefault();


		var that = this,
				errorClass = 'haserror',
				invalidClass = 'invalid',
				successClass = 'issent',
				elementClass = 'Form-element',
		form = this._findFormTag(event.delegateTarget),
		formid, formsent, honeypot, inputs, hidden, textareas, radios, radiogroups, checkboxes, checkboxgroups, errors;

		if(form === null){
			throw(new Error("The DOM misses a Form-tag."));
		} else {
			formid = '#' + form.getAttribute('id');
			that.model.fields.uid = form.getAttribute('data-url');
		}

		honeypot = this.query(formid + ' .emailvalidation input');
		if(honeypot.value !== ""){
			return;
		}

		errors = [];
		form.classList.remove(invalidClass);
		form.classList.remove(errorClass);
		_.each(this.queryAll(formid + ' .' + invalidClass), function(erroritem){
			erroritem.classList.remove(invalidClass);
		});

		inputs = this.queryAll(formid + ' input[type=text]');
		_.each(inputs, function(input){
			that.model.fields[input.getAttribute('name')] = input.value;
			if(input.required){
				if(input.value === "" || input.value.length < 1){
					errors.push(input);
				}
			}
		});

		hidden = this.queryAll(formid + ' input[type=hidden]');
		_.each(hidden, function(input){
			that.model.fields[input.getAttribute('name')] = input.value;
		});

		textareas = this.queryAll(formid + ' textarea');
		_.each(textareas, function(area){
			that.model.fields[area.getAttribute('name')] = area.value;
			if(area.required){
				if(area.value === "" || area.value.length < 1){
					errors.push(area);
				}
			}
		});

		radios = this.queryAll(formid + ' input[type=radio]');
		radiogroups = {};
		_.each(radios, function(radio){
			if(radiogroups[radio.getAttribute('name')] === undefined){
				radiogroups[radio.getAttribute('name')] = [];
			}
			radiogroups[radio.getAttribute('name')].push(radio);
		});
		_.each(radiogroups, function(radiogroup, index){
			that.model.fields[index] = "";
			var isrequired = false;
			_.each(radiogroup, function(radiobutton){
				if(radiobutton.required) isrequired = true;
				if(radiobutton.getAttribute('checked')){
					that.model.fields[index] = radiobutton.value;
				}
			});
			if(isrequired && that.model.fields[index] === ""){
				errors.push(radiogroup);
			}
		});

		checkboxes = this.queryAll(formid + ' input[type=checkbox]');
		checkboxgroups = {};
		_.each(checkboxes, function(checkbox){
			if(checkboxgroups[checkbox.getAttribute('name')] === undefined){
				checkboxgroups[checkbox.getAttribute('name')] = [];
			}
			checkboxgroups[checkbox.getAttribute('name')].push(checkbox);
		});
		_.each(checkboxgroups, function(checkboxgroup, index){
			that.model.fields[index] = "";
			var isrequired = false;
			_.each(checkboxgroup, function(checkbox){
				if(checkbox.required) isrequired = true;
				if(checkbox.checked){
					if(that.model.fields[index] === "") that.model.fields[index] = checkbox.value;
					else that.model.fields[index] = that.model.fields[index] + ', ' + checkbox.value;
				}
			});
			if(isrequired && that.model.fields[index] === ""){
				errors.push(checkboxgroup);
			}
		});

		if(errors.length > 0){
			that._scrollToTop(form);
			form.classList.add(invalidClass);
			_.each(errors, function(erroritem){
				var FormItem;
				if(erroritem.length > 0){
					FormItem = that._findParentByClass(erroritem[0], elementClass);
				} else {
					FormItem = that._findParentByClass(erroritem, elementClass);
				}

				if(FormItem === null){
					if(erroritem.length > 0){
						erroritem[0].parentNode.classList.add(invalidClass);
					} else {
						erroritem.parentNode.classList.add(invalidClass);
					}
				} else {
					FormItem.classList.add(invalidClass);
				}
			});
		} else {

			that.model.send(that.model.fields).then(function(success){
				form.classList.add(successClass);
				// reset
				_.each(inputs, function(element, index, list){
					element.value = '';
				}, this);
				_.each(textareas, function(element, index, list){
					element.value = '';
				}, this);
				_.each(radios, function(element, index, list){
					element.removeAttribute('checked');
					element.parentNode.classList.remove('isChecked');
				}, this);
				_.each(checkboxes, function(element, index, list){
					element.removeAttribute('checked');
					element.parentNode.classList.remove('isChecked');
				}, this);

				that._scrollToTop(form);

			}, function(error){
				form.classList.add(errorClass);
				that._scrollToTop(form);
			});

		}

	}

});

export default Form;
