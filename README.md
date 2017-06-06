# RingCaptcha (ES6 and Promise version)

## Overview

`ringcaptcha/ringcaptcha-es6` is a Node.js module for communicating with the RingCaptcha API, which simplifies the Onboarding and Verification of Users. This project is forked from https://github.com/ringcaptcha/ringcaptcha-node which uses callbacks.
This version is redesigned for codes that requires promises and does not want to be forced to implement the original version's strict configuration style.

## Getting Started

Make sure you are runing at least NodeJS version 6.7
Run the following in the terminal
```
npm install ringcaptcha-es6
```

Add a reference to your code.
```
const RingCaptcha = require('ringcaptcha-es6');
```

Make sure you have registered in RingCaptcha (http://www.ringcaptcha.com/) and created an app. You should have an APP_KEY, API_KEY and SECRET_KEY generated. You will need these to create a new instance of the RingCaptchaClient.
```
const rc = RingCaptcha.init(APP_KEY, API_KEY, SECRET_KEY, OPTIONS);
```
*for now options is pretty useless, just leave it blank.

##Functions 
 * **getToken(language_code, country_code)** - Gets a RingCaptcha session token
  * @param language_code - The locale/language to send the Voice call in (optional, defaults to 'en')
  * @param country_code - The country code to send the Voice call in (optional)
  ```
  rc.getToken('en_gb')
  .then((data) => {
     if (!data.token) {
         throw new Error('NO_TOKEN_CREATED');
     }
     //store this token somewhere in your session for later use
     req.session.ringcaptcha.token = data.token;
  });
  ```
  
 * **sendVerificationCodeSMS(token, phone, language_code, country_code)** - generate a new SMS verification code. Verification will be provided to the mobile number 
  * @param token - Should you have a token already created and valid, send it thru this parameter
  * @param phone - Phone number in international format as described in E.123.
  * @param language_code - The locale/language to send the Voice call in (optional, defaults to 'en')
  * @param country_code - The country code to send the Voice call in (optional)
  ```
  rc.sendVerificationCodeSMS("mytoken-qwertyuiop", '+639171234567')
  .then((data) => {
     if (data.status === "ERROR") {
         throw new Error("RINGCAPTCHA_ERROR");
     }
     //data will contain lots of information so check it
  });
  ```
  
 * **sendVerificationCodeVoice(token, phone, language_code, country_code)** - generate a new Voice verification. Verification will be provided to the mobile number 
  * @param token - Should you have a token already created and valid, send it thru this parameter
  * @param phone - Phone number in international format as described in E.123.
  * @param language_code - The locale/language to send the Voice call in (optional, defaults to 'en')
  * @param country_code - The country code to send the Voice call in (optional)
  ```
  rc.sendVerificationCodeVoice("mytoken-qwertyuiop", '+639171234567')
  .then((data) => {
     if (data.status === "ERROR") {
         throw new Error("RINGCAPTCHA_ERROR");
     }
     //data will contain lots of information so check it
  });
  ```
  
 * **verifyCode(token, phone, code)** - Validates the verification code the user recieved.
  * @param token - The token received by the code endpoint when requesting a PIN code to be sent.
  * @param phone - Phone number in international format as described in E.123.
  * @param code - The 4 digit PIN code to verify with the one sent in the code endpoint
  ```
  rc.verifyCode("mytoken-qwertyuiop", "+639171234567", 'WXYZ')
  .then((data) => {
     if (data.status === "ERROR") {
         throw new Error("RINGCAPTCHA_ERROR");
     }
     //data will contain lots of information so check it
  });
  ```
  
 * **getPhoneInfo(phone)** - Obtains information on a phone number (e.g.: country, area, block, subscriber number, type of line, carrier name, etc).
  * @param phone - Phone number in international format as described in E.123.
  ```
  rc.getPhoneInfo("+639171234567")
  .then((data) => {
     if (data.status === "ERROR") {
         throw new Error("RINGCAPTCHA_ERROR");
     }
     //data will contain lots of information so check it
  });
  ```

## Learn More
- Read the [HTML & JS Guides](https://my.ringcaptcha.com/docs/web)
