import {HOST, getKeyFromStorage, timeoutMessage} from './const';
import {
	SET_PROFILE_IMAGE,
	SET_PROFILE_IMAGE_FAIL,
	SET_PROFILE_IMAGE_SUCCESS,
	SEND_NEW_PASSWORD,
	SEND_NEW_PASSWORD_SUCCESS,
	SEND_NEW_PASSWORD_FAIL,
	USER_LOCATION,
	SET_SERVINGS_SUCCESS,
	SET_SERVINGS_FAIL,
	SET_SERVINGS,
	UPDATE_SERVINGS_IN_STATE
} from './types';
import {Actions} from 'react-native-router-flux';
import {createOptions, sendRequest} from './http';
import {Crashlytics} from 'react-native-fabric';
import {version} from './const';


export const getProfileImage = () => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('getProfileImage() in ProfileAction.js');

	return dispatch => {

		Crashlytics.log('dispatching');

		dispatch({type: SET_PROFILE_IMAGE});

		Crashlytics.log('dispatched');

		getKeyFromStorage().then((stores) => {

			const {token, email} = stores;

			let url = HOST + 'api/v2/mobile/profile/photo';

			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;

			let photoOptions = createOptions('POST', body);

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(photoOptions));

			Crashlytics.log('attempting to send request with sendRequest()');

			sendRequest(url, photoOptions).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result === 'timeout') {

					Crashlytics.log('calling timeoutMessage');

					dispatch({type: SET_PROFILE_IMAGE_FAIL, error: timeoutMessage});
				}

				if (result.message && result.message.toLowerCase() === 'access denied' && result.status === 'fail') {

					Crashlytics.log('calling Action.auth()');

					Actions.auth({type: 'replace'});

				} else if (result.status === 'fail') {

					Crashlytics.log('upload image fail');

					dispatch({type: SET_PROFILE_IMAGE_FAIL, error: ''});

				}
				if (result.status === 'success') {
					if (result.photo) {

						Crashlytics.log('upload image success');

						dispatch({type: SET_PROFILE_IMAGE_SUCCESS, photo: result.photo});
					} else {

						Crashlytics.log('upload image fail');

						dispatch({type: SET_PROFILE_IMAGE_FAIL, error: ''});
					}
				}
			});
		});
	};
};

export const getUserLocation = () => {
	//http://maps.googleapis.com/maps/api/geocode/json?latlng=37.785834,-122.406417&sensor=true
	// return dispatch => {
	// 	navigator.geolocation.getCurrentPosition((e) => {
	// 		const {latitude, longitude} = e.coords;
	// 		let url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude;
	// 		fetch(url)
	// 			.then((response) => response.json())
	// 			.then((responseJson) => {
	// 				const adress = responseJson.results[0].address_components;	
	// 				dispatch({
	// 					type: USER_LOCATION,
	// 					location: formatted_address
	// 				});
	// 			})
	// 			.catch((error) => {
	// 				console.error(error);
	// 			});
	//
	// 	}, (e) => {
	// 		console.log('error', e);
	// 	}, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
	// };

	return dispatch => {
		let url = 'https://freegeoip.net/json/';
		fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {
				dispatch({
					type: USER_LOCATION,
					location: resolveLocation(responseJson.city, responseJson.country_name)
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};
};


const resolveLocation = (city, country) => {
	if (city === '' && country === '') {
		return 'Acquiring location..';
	}
	else {
		if (city === '') {
			return country;
		}
		else if (country === '') {
			return city;
		}
		else {
			return city + ', ' + country;
		}

	}
};


export const uploadProfileImage = ({base64}) => {
	return (dispatch) => {
		getKeyFromStorage().then((stores) => {
			dispatch({type: SET_PROFILE_IMAGE});
			const {token, email} = stores;
			let url = HOST + 'api/v2/mobile/profile/photo';

			let body = {
				image: base64,
				imageType: 'image/jpeg',
				userName: email,
				token: token,
				v: version
			};
			let str = [];
			for (let p in body) {
				str.push(encodeURIComponent(p) + '=' + encodeURIComponent(body[p]));
			}
			body = str.join('&');

			sendRequest(url, createOptions('PATCH', body), 10000).then(result => {
				if (result === 'timeout') {
					dispatch({type: SET_PROFILE_IMAGE_FAIL, error: timeoutMessage});
				}

				if (result.status === 'success') {
					dispatch({type: SET_PROFILE_IMAGE_SUCCESS});
				}

				if (result.message && result.message.toLowerCase() === 'access denied' && result.status === 'fail') {

					Actions.auth({type: 'replace'});

				}
				if (result.status === 'fail') {
					dispatch({type: SET_PROFILE_IMAGE_FAIL, error: result.message});
				}

			});
		});

	};

};

export const changeServing = (servings = false) => {
	return dispatch => {
		dispatch({type: SET_SERVINGS});
		getKeyFromStorage().then((stores) => {
			dispatch({type: SET_SERVINGS_SUCCESS, numServings: servings});
			const {token, email} = stores;
			let url = HOST + 'api/v2/mobile/profile/settings';
			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;
			let type = 'POST';
			if (servings) {
				body += '&servingSize=' + servings;
				type = 'PATCH';
			}

			sendRequest(url, createOptions(type, body)).then(result => {
				if (result === 'timeout') {
					dispatch({type: SET_SERVINGS_FAIL, error: timeoutMessage});
				}
				if (result.status === 'success') {
					dispatch({type: SET_SERVINGS_SUCCESS, numServings: result.settings.serving_size});
					dispatch({type: UPDATE_SERVINGS_IN_STATE, numServings: result.settings.serving_size});
				}
				if (result.message && result.message.toLowerCase() === 'access denied' && result.status === 'fail') {
					Actions.auth({type: 'replace'});
				}
				if (result.status === 'fail') {
					dispatch({type: SET_SERVINGS_FAIL, error: result.message});
				}
			});
		});
	};
};

const sendNewPasswordSuccess = (dispatch, message) => {
	dispatch({
		type: SEND_NEW_PASSWORD_SUCCESS,
		error: message,
		newPass: '',
		verifyPass: '',
		currentPass: ''
	});

	Actions.pop();
};

const sendNewPasswordFail = (dispatch, message) => {
	dispatch({
		type: SEND_NEW_PASSWORD_FAIL,
		error: message || ''
	});
};

export const sendNewPass = (newPass, currentPass) => {
	return dispatch => {

		dispatch({type: SEND_NEW_PASSWORD});

		getKeyFromStorage().then((stores) => {

			const {token, email} = stores;

			let url = HOST + 'api/v2/mobile/profile/password';

			let body =
				'userName=' + encodeURIComponent(email) +
				'&token=' + token +
				'&v=' + version +
				'&newPassword=' + newPass +
				'&currentPassword=' + currentPass;

			if (email && token) {

				return sendRequest(url, createOptions('PATCH', body))
					.then(result => {

						if (result.status === 'success' && result.message && result.message === 'Password changed successfully') {

							sendNewPasswordSuccess(dispatch, result.message);
						}

						else {

							if (result.message) {

								sendNewPasswordFail(dispatch, result.message);
							}

							else {

								sendNewPasswordFail(dispatch, 'Sorry, something went wrong');
							}
						}
					});
			} else {

				sendNewPasswordFail(dispatch);
			}
		});

	};
};
