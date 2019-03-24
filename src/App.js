/**
 * Created by mponomarets on 6/25/17.
 */
import React, {Component} from 'react';
import { Text, Platform } from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import RouterComponent from './Router';
import PushService from './PushService';

// Initalize the PushService once, outside React components
PushService.init();

// if (!__DEV__) {
// 	require('./actions/log.js');
// }


const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
export default class App extends Component {
	constructor() {
		super();
		PushService.configure();
		Text.defaultProps.style = { fontFamily: 'Montserrat-Bold' }
	}

	componentWillUnmount() {
		PushService.unconfigure();
	}

	render() {
		return (
			<Provider store={store}>
				<RouterComponent/>
			</Provider>
		);
	}
}
