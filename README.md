# Node.js Library

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
 * **getToken(locale)** - Creates a new ringcaptcha session token. This token is used to identify the current session so make sure to store it. The locale params is a string which contains a 2-character language code followed by underscore (_) and a 2-character country code (all lower cased). For American English for example, the value would be "en_us"
```
rc.getToken('en_us')
.then((data) => {
   if (!data.token) {
       throw new Error('NO_TOKEN_CREATED');
   }
   //store this token somewhere in your session for later use
   req.session.ringcaptcha.token = data.token;
});
```

 * **normalize(phone)** - Normalizes the phone string such that it follows a valid format.
```
rc.normalize('+639171234567')
.then((data) => {
   if (!data) {
       throw new Error('NO_DATA_CREATED');
   }
   //perform your stuffs on the result data here
});
```
 
 * **generateSMS(phone, token)** - generates an SMS verification code that will be sent to the phone number provided in the parameter. Make sure that the token parameter is the one you retrieved from the getToken() function.
```
rc.generateSMS('+639171234567', req.session.ringcaptcha.token)
.then((data) => {
   if (data.status === "ERROR") {
       throw new Error("RINGCAPTCHA_ERROR");
   }
   //data will contain lots of information so check it
});
```
  
 * **verify(code, token)** - validates the verification code sent to the user. This code is the code sent to the user device.
```
rc.verify('WXYZ', req.session.ringcaptcha.token)
.then((data) => {
   if (data.status === "ERROR") {
       throw new Error("RINGCAPTCHA_ERROR");
   }
   //data will contain lots of information so check it
});
```

## Learn More
- Read the [HTML & JS Guides](https://my.ringcaptcha.com/docs/web)
