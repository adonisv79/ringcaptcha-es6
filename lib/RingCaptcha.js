"use strict";

const http = require("http");
const https = require("https");
const rp = require('request-promise');
const util = require("util");
const querystring = require("querystring");
const ringcaptchaSecuredService = [ 'verify', 'captcha', 'sms' ];
const API_HOSTNAME = "api.ringcaptcha.com";


/**
 * Creates instance of RingCaptchaClient
 *
 * @constructor
 * @this {RingCaptchaClient}
 * @return {RingCaptchaClient} self
 */
class RingCaptchaClient {
	constructor(app_key, api_key, secret_key, options ) {
		this.token = null;
		this.app_key = app_key;
		this.api_key = api_key;
		this.secret_key = secret_key;

		//set default options { secure: true };
		this.options = options || { secure: true };
	}

	sendRequest( endpoint, params) {
		let uri = this.options.secure ? 'https' : 'http';
		uri += '://' + API_HOSTNAME + '/' + this.app_key + '/' + endpoint;

		const options = {
			method: 'POST',
			uri: uri,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: params,
			json: true
		};

		return rp(options)
			.then(function (data) {
				if (!data || !data.token) {
					throw new Error('RINGCAPTCHA_NO_RESPONSE');
				}
				this.token = data.token;
				return data;
			});

		// var server = ( this.options.secure ) ? https : http;
		//
		// var postData = querystring.stringify( params );
		// var serverOptions = {
		// 	hostname: API_HOSTNAME,
		// 	path: '/' + this.app_key + '/' + endpoint,
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 		'Content-Length': postData.length
		// 	}
		// };
		//
		// var req = server.request( serverOptions, function( res ) {
		// 	res.on('data', function( data ) {
		// 		var object = JSON.parse( data.toString() );
		// 		if (object.token) self.token = object.token;
		// 		callback(object);
		// 	})
		// });
		// req.write( postData );
		// req.end();
	};

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