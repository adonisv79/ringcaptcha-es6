"use strict";
const RingCaptcha = require('./lib/RingCaptcha.js');
let rc;

module.exports = {
	init: (app_key, api_key, secret_ket) => {
		rc = new RingCaptcha(app_key, api_key, secret_ket, {});
		return rc;
	},
	instance : () => {
		return rc;
	}
}