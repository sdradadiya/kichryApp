/**
 * Created by mponomarets on 8/8/17.
 */

import { Crashlytics } from 'react-native-fabric';


export const createOptions = (type, body) => {
	return {
		method: type,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json'
		},
		body: body
	};
};
export const createJson = (type, json) => {
	return {
		method: type,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(json)
	};
};
export const request = (url, options) => {
	return fetch(url, options).then(result => {
		Crashlytics.log('****');
		Crashlytics.log('processed server response');
		Crashlytics.log('url:');
		Crashlytics.log(JSON.stringify(url));
		Crashlytics.log('options:');
		Crashlytics.log(JSON.stringify(options));
		Crashlytics.log('response:');
		Crashlytics.log(JSON.stringify(result));
		Crashlytics.log('-------end of server response log section');
		switch (result.status) {
			case 200:
				return result.json();
			case 204:
				return { status: 'emptyOK' };
			case 400:
				return result.json();
			case 401:
				return { status: 'notActivated' };
			case 403:
				return { status: 'unauthorized' };
			case 500:
				return result.json();
			default:
				return result.json();
		}
	});
};

export const responseTimeout = (value) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject({ status: 'timeout' });
		}, value);
	});
};

export const sendRequest = (url, options, time = 30000) => {

	return Promise.race([responseTimeout(time), request(url, options)])
		.then(result => {
			return result;
		})
		.catch((e) => {
			return { status: 'fail', message: 'Something went wrong, please try again later' };
		});
};