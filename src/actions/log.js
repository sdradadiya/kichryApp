/**
 * log wrapper around crashlytics and RN log
 */


import { Platform } from 'react-native';
import { Crashlytics } from 'react-native-fabric';


function convertToString(arg) {
	return typeof arg === 'object' ? JSON.stringify(arg) : `${arg}`;
}


['error', 'warn', 'log'].forEach((methodName) => {
	const origMethod = console[methodName];
	console[methodName] = (...args) => {
		if (args.length > 1) {
			console.warn(`react-native-fabric supports only 1 (one) argument to method and have passed <${args.length}> arguments. Replace this line by "console.trace()" to see stack trace`);
			console.trace(args);
		}
		if (args.some(arg => typeof arg !== 'string')) {
			console.warn(`It seems that some argument type is not <string> on <${JSON.stringify(args)}>. Converting it to string.`);
			console.trace(JSON.stringify(args));
		} 
		const message = convertToString(args.shift());
		if (Platform.OS === 'android') {
			//
            // console.log calls to device log on ios
			// but on android, it's needed to call Crashlytics log
			Crashlytics.log(message);
		}
		origMethod.call(console, message);
	};
	console[methodName].name = `decoratedConsole_${methodName}`;
});


// Copypasted from
// https://github.com/bugsnag/bugsnag-react-native/blob/754008743c17d39f6c6d2bc1a0078e7e1bc3ac96/lib/Bugsnag.js#L36
/*eslint-disable*/
handleUncaughtErrors = () => {
  console.log('App is handling uncaught errors');
  if (ErrorUtils) {
    const previousHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.log(`Handle error. Is fatal? <${isFatal}>`);
      error.message = `ErrorUtils: handled ${isFatal ? 'fatal':'non-fatal'} error: ${error.message}`;
      if (isFatal) {
        Crashlytics.recordError(error); // iOS.
      } else { 
        Crashlytics.logException(error); // Android. 
      }
      if (previousHandler) {
        previousHandler(error, isFatal);
      }
    });
  }
}
handlePromiseRejections = () => {
  console.log('App is handling promise rejections');
  const tracking = require('promise/setimmediate/rejection-tracking');
  tracking.enable({
    allRejections: true,
    onUnhandled: function(id, error) {
      console.log('Handle promise rejection');
      error.message = `handlePromiseRejections: handled promise rejection: ${error.message}`;
      Crashlytics.recordError(error);
    },
    onHandled: function() {}
  });
}

handleUncaughtErrors();
handlePromiseRejections();
/*eslint-enable*/

console.log('App is running decorated console methods');