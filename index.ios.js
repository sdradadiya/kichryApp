/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
	AppRegistry
} from 'react-native';
import App from './src/App';
import { Sentry } from 'react-native-sentry';

if (!__DEV__) {
	//generous mayfly
	Sentry.config('https://9adfd20626174648b6cd4e3c89c8792d:ed7f3a3788ac48d5a6a0266db471263f@sentry.io/266871', {
		handlePromiseRejection: true
	}).install(); // vg: https://docs.sentry.io/clients/react-native/config/
	Sentry.setTagsContext({
		'environment': 'production'
	});
}

export default class kitchryApp extends Component {

	render () {
		return (
			<App />
		);
	}
}



AppRegistry.registerComponent('kitchryApp', () => kitchryApp);
