"use strict";

//See https://my.ringcaptcha.com/docs/api
const rp = require('request-promise');
const util = require("util");
const querystring = require("querystring");
const API_HOSTNAME = "https://api.ringcaptcha.com";

/**
 * Gets the locale to use when a user performs ringcaptcha
 * @param language_code
 * @param country_code
 * @returns {*|string}
 */
function getLocale(language_code = 'en', country_code) {
	const lang = language_code ? language_code.toLowerCase() : 'en' ;
	const country = country_code ? country_code.toLowerCase() : undefined ;

	if (language_code.length !== 2) {
		throw new Error('LANGUAGE_CODE_INVALID')
	};


	const available_locales = [ //always update this list when ringcaptcha makes it available
		'ar', //Arabic
		'de', //German
		'en', //US English
		'en_gb', //UK English
		'es', //Spanish
		'fi', //Finnish
		'fr', //French
		'gr', //Greek
		'it', //Italian
		'ja', //Japanese
		'nl', //Dutch
		'pt', //Portuguese
		'ru', //Russian
		'sv', //Swedish
		'tr', //Turkish
		'zh' //Chinese
	]
	let use, i;

	i = available_locales.indexOf(lang);
	if (i < 0 && country && available_locales.indexOf(lang + _ + country) >= 0) {
		i = available_locales.indexOf(lang + _ + country);
	}
	use = i >= 0 ? available_locales[i] : 'en';

	return use;
}

function sendRequest(method, uri, payload) {
	const options = {
		method: method,
		uri: uri,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		},
		form: payload,
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
}

/**
 * This class defines a RingCaptchaClient object
 */
class RingCaptchaClient {
	/**
	 * Creates instance of RingCaptchaClient
	 * @param app_key - Your application key
	 * @param api_key - Your API key
	 * @param secret_key
	 */
	constructor(app_key, api_key, secret_key ) {
		this._app_key = app_key;
		this._api_key = api_key;
		this._secret_key = secret_key;
	}

	get app_key() { return this._app_key; }
	set app_key(val) { this._app_key = val; }

	get api_key() { return this._api_key; }
	set api_key(val) { this._api_key = val; }

	get secret_key() { return this._secret_key; }
	set secret_key(val) { this._secret_key = val; }

	/**
	 * Gets a RingCaptcha session token
	 * @param locale - The locale/language to send the SMS (optional, defaults to 'en')
	 */
	getToken(language_code = 'en', country_code) {
		const uri = API_HOSTNAME + '/' + this.app_key + '/captcha';
		const locale = getLocale(language_code , country_code);

		return sendRequest('POST', uri, {
			app_key: this.app_key,
			api_key: this.api_key,
			locale: locale
		});
	}

	/**
	 * generate a new SMS verification code. Verification will be provided to the mobile number
	 * @param token - Should you have a token already created and valid, send it thru this parameter
	 * @param phone - Phone number in international format as described in E.123. It also accepts a comma-separated list of phones for multiple verifications.
	 * @param locale - The locale/language to send the SMS (optional, defaults to 'en')
	 */
	sendVerificationCodeSMS(token, phone, language_code = 'en' , country_code) {
		const uri = API_HOSTNAME + '/' + this.app_key + '/code/sms';
		const locale = getLocale(language_code , country_code);

		return sendRequest('POST', uri , {
			app_key: this.app_key,
			api_key: this.api_key,
			service: 'SMS',
			phone: phone,
			token: token,
			locale: locale
		});
	}

	/**
	 * generate a new Voice verification. Verification will be provided to the mobile number
	 * @param token - Should you have a token already created and valid, send it thru this parameter
	 * @param phone - Phone number in international format as described in E.123.
	 * @param locale - The locale/language to send the Voice call in (optional, defaults to 'en')
	 */
	sendVerificationCodeVoice(token, phone, language_code = 'en' , country_code) {
		let uri = API_HOSTNAME + '/' + this.app_key + '/code/voice';
		const locale = getLocale(language_code , country_code);

		return sendRequest('POST', uri , {
			app_key: this.app_key,
			api_key: this.api_key,
			service: 'Voice',
			token: token,
			phone: phone,
			locale: locale
		});
	}

	/**
	 * Validates the verification code the user recieved
	 * @param token - The token received by the code endpoint when requesting a PIN code to be sent.
	 * @param phone - Phone number in international format as described in E.123.
	 * @param code - The 4 digit PIN code to verify with the one sent in the code endpoint
	 */
	verifyCode(token, phone, code) {
		if (!code || code.length < 4) { //ringcaptcha is at least a 4 digit code
			throw new Error('RINGCAPTCHA_CODE_INVALID');
		}
		//either the token or phone must be provided
		if (!token && !phone) {
			throw new Error('RINGCAPTCHA_TOKEN_OR_PHONE_REQUIRED');
		}

		let uri = API_HOSTNAME + '/' + this.app_key + '/verify';

		return sendRequest('POST', uri, {
			app_key: this.app_key,
			api_key: this.api_key,
			token: token,
			phone: phone,
			code: code
		});
	}

	/**
	 * Obtains information on a phone number (e.g.: country, area, block, subscriber number, type of line, carrier name, etc)
	 * @param phone - Phone number in international format as described in E.123.
	 */
	getPhoneInfo(phone) {
		let uri = API_HOSTNAME + '/' + this.app_key + '/normalize';

		return sendRequest( 'POST', uri, {
			app_key: this.app_key,
			api_key: this.api_key,
			phone: phone
		});
	}
}

module.exports = RingCaptchaClient;