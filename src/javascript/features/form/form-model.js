import Model from 'ampersand-model';
import sync from "ampersand-sync";
import qs from "qs";
import {Promise} from "es6-promise";

let Content = Model.extend({

		ajaxConfig: {
				headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						"X-Requested-With": "XMLHttpRequest"
				}
		},

		props: {
				action: ["string", true, "contactForm/sendMessage"],
				fields: ["object", true, function(){
					return {
							author: "YOLO",
							emailvalidation: ""
					}
				}],
				error: ["boolean", false, false],
				success: ["boolean", true, false]
		},

		session: {
				isSending: ["boolean", true, false]
		},

		derived: {
				isSend: {
						deps: ["success"],
						fn: function () {
								return this.success;
						}
				}
		},

		send: function (attrs) {
				let that = this;
				if (attrs) {
						this.set(attrs);
				}
				this.isSending = true;
				console.log(qs.stringify(that.fields));

				return new Promise(function (resolve, reject) {
						that._request = sync.call(that, "create", that, {
								data: qs.stringify(that.fields),
								// url: "/ajax/sendmail",
								url: "ajaxform/sendEmail.php",
								error: function (resp, state, msg) {

										that.isSending = false;
										reject(new Error(msg));
								},
								success: function (resp) {
										that.isSending = false;
										if (resp.success) {
												that.success = true;
												console.log(resp);
												resolve(that);
										} else if (resp.error) {
												console.log("error");
												that.error = resp.error;
												reject(new Error("The message did not validate."));
										}
								}
						});
				});
		},

});

export default Content;
