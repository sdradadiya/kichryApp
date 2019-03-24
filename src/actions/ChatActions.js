/**
 * Created by mponomarets on 7/5/17.
 */
import {
	START_LOAD_CHAT_MESSAGE,
	LOAD_CHAT_MESSAGE_SUCCESS,
	LOAD_CHAT_MESSAGE_FAIL,
	CHANGE_MESSAGE_LIST
} from './types';
import {HOST, timeoutMessage, getKeyFromStorage, clearAsyncStorage, version } from './const';
import {sendRequest, createOptions} from './http';
import {Actions} from 'react-native-router-flux';
import {Crashlytics} from 'react-native-fabric';

const loadingChatMessageSuccess = (dispatch, messages, user, doctor, profile) => {
	dispatch({
		type: LOAD_CHAT_MESSAGE_SUCCESS,
		payload: messages,
		userId: user,
		doctorId: doctor,
		profile: profile
	});
};

const loadingChatMessageFail = (dispatch, error) => {
	dispatch({
		type: LOAD_CHAT_MESSAGE_FAIL,
		error: error
	});
};

export const getChatMessage = () => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('getChatMessage() in ChatActions.js');

	return dispatch => {

		Crashlytics.log('dispatching');

		dispatch({type: START_LOAD_CHAT_MESSAGE});

		Crashlytics.log('dispatched');

		getKeyFromStorage('chat').then((store) => {
			const {token, email, userId, doctorId, profile} = store;
			let url = HOST + 'api/v2/mobile/chat';
			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;
			let chatOptions = createOptions('POST', body);

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(chatOptions));

			Crashlytics.log('attempting to send request with sendRequest()');

			sendRequest(url, chatOptions).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {

					Crashlytics.log('calling loadingChatMessageSuccess()');

					loadingChatMessageSuccess(dispatch, result.messages, Number(userId), Number(doctorId), profile);
				} else {

					Crashlytics.log('calling processResponse()');

					processResponse(dispatch, result);

				}
			});
		});
	};
};


const changeMessageArray = (dispatch, messages) => {
	dispatch({
		type: CHANGE_MESSAGE_LIST,
		payload: messages
	});
};

export const sendMessage = (text, allMessage) => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('sendMessage() in ChatActions.js');

	return dispatch => {

		getKeyFromStorage('chat').then((store) => {
			const {token, email} = store;
			let url = HOST + 'api/v2/mobile/chat';
			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version + '&messageType=text&messageBody=' + encodeURIComponent(text);
			let chatOptions = createOptions('PATCH', body);

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(chatOptions));

			Crashlytics.log('attempting to send request with sendRequest()');

			sendRequest(url, chatOptions).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {

					Crashlytics.log('calling changeMessageArray()');

					changeMessageArray(dispatch, allMessage);

				} else {

					Crashlytics.log('calling processResponse()');

					processResponse(dispatch, result);

				}
			});
		});
	};
};

const processResponse = (dispatch, response) => {
	switch (response.status) {
		case 'timeout':
			return loadingChatMessageFail(dispatch, timeoutMessage);
		case 'clientError':
			return loadingChatMessageFail(dispatch, 'Client error');
		case 'unauthorized':
			clearAsyncStorage();
			Actions.auth({type: 'replace'});
			return loadingChatMessageFail(dispatch);
		case 'serverError':
			return loadingChatMessageFail(dispatch, 'Sorry, your request could not be processed');
		case 'fail':
		default:
			return loadingChatMessageFail(dispatch, 'Unknown error');
	}
};
