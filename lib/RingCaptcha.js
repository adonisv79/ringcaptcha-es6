"use strict";

const http = require("http");
const https = require("https");
const rp = require('request-promise');
const util = require("util");
const querystring = require("querystring");
const ringcaptchaSecuredService = [ 'verify', 'captcha', 'sms' ];
const API_HOSTNAME = "api.ringcaptcha.com";
let secure = true;


function sendRequest( endpoint, params) {
	let uri = secure ? 'https' : 'http';
	uri += '://' + API_HOSTNAME + '/' + params.app_key + '/' + endpoint;

	const options = {
		method: 'POST',
		uri: uri,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: params,
		json: true
	};

	return rp(options)
		.then(function (data) {
			//throw the error, Ringcaptcha API throws stuff all over the place,
			// there are more ways they return an error and sadly does not standardize
			if (data.result ==='ERROR') {
				throw new Error(data.status);
			} else if (data.status ==='ERROR') {
				throw new Error(data.message);
			}

			return data;
		});
};

/**
 * Creates instance of RingCaptchaClient
 *
 * @constructor
 * @this {RingCaptchaClient}
 * @return {RingCaptchaClient} self
 */
class RingCaptchaClient {
	constructor(app_key, api_key, secret_key, options ) {
		this.app_key = app_key;
		this.api_key = api_key;
		this.secret_key = secret_key;

		this.options = options || { secure: true };
		if (!this.options.secure) { secure = false; }

	}


	getToken(locale) {
		return sendRequest('captcha', {
			locale: locale,
			app_key: this.app_key,
			api_key: this.api_key
		});
	}

	normalize(phone) {
		return sendRequest( 'normalize', {
			phone: phone,
			app_key: this.app_key,
			api_key: this.api_key
		});
	}

	generateSMS(phone, token) {
		const options = {
			type: 'sms',
			app_key: this.app_key,
			api_key: this.api_key,
			token: token,
			phone: '+' + phone
		};

		return sendRequest('code/sms' , options);
	}

	verify(code, token) {
		return sendRequest('verify', {
			app_key: this.app_key,
			api_key: this.api_key,
			token: token,
			code: code
		});
	}
}

module.exports = RingCaptchaClient;