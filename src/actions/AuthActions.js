/**
 * Created by mponomarets on 7/2/17.
 */
import {Actions} from 'react-native-router-flux';
import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	LOGIN_USER,
	LOGIN_USER_FAIL,
	LOGIN_USER_SUCCESS,
	RESET_STATE,
	SEND_RESET_REQUEST,
	SEND_RESET_SUCCESS,
	SEND_RESET_FAIL,
	OPEN_CLOSE_WELCOME,
	OPEN_CLOSE_ONBOARDING,
	SHOW_RELEASE_NOTES,
	CLOSE_RELEASE_NOTES,
	GET_WELCOME_SUCCESS,
	GET_WELCOME_FAIL,
	SET_CLIENT_PERMISSIONS
} from './types';
import {AsyncStorage, Alert, Platform} from 'react-native';
import {
	HOST,
	timeoutMessage,
	getKeyFromStorage,
	clearAsyncStorage,
	PUSHER_APP_KEY,
	PUSHER_PUSH_API,
	savePusherClientId,
	getPusherClientId,
	version,
	appPlatform
} from './const';
import {sendRequest, createOptions, createJson} from './http';
import {Crashlytics} from 'react-native-fabric';
import {GoogleSignin} from 'react-native-google-signin';
import PushService from '../PushService';
import { Sentry } from 'react-native-sentry';
// import { checkForReleaseNotes } from './ReleaseNotesActions';

export const emailChanged = (text) => {
	return {
		type: EMAIL_CHANGED,
		payload: text
	};
};

export const passwordChanged = (text) => {
	return {
		type: PASSWORD_CHANGED,
		payload: text
	};
};

export const closeOnboardingScreen = () => {
	return dispatch => dispatch({type: OPEN_CLOSE_ONBOARDING, isOnboardingOpen: false});
};

export const closeWelcomeScreen = () => {
	return dispatch => dispatch({type: OPEN_CLOSE_WELCOME, isWelcomeOpen: false});
};

export const closeReleaseNotes = () => {
	return dispatch => dispatch({type: CLOSE_RELEASE_NOTES, isReleaseNotesOpen: false});
};

const pusherRegisterDevice = (token) =>
	getPusherClientId().then(pusherClientId => {
		const body = {
			app_key: PUSHER_APP_KEY,
			platform_type: Platform.OS === 'ios' ? 'apns' : 'fcm',
			token
		};
		if (pusherClientId) {
			Crashlytics.log('Existing Pusher Client ID found in storage: ' + pusherClientId);
			// update client token instead of making new
			const url = PUSHER_PUSH_API + '/v1/clients/' + pusherClientId + '/token';
			sendRequest(url, createJson('PUT', body));
			return { pusherClientId };
		} else {
			Crashlytics.log('Pusher Client ID not found in storage; will request new.');
			const url = PUSHER_PUSH_API + '/v1/clients';
			return sendRequest(url, createJson('POST', body)).then(result => {
				Crashlytics.log('Result from Pusher registration: ' + JSON.stringify(result));
				savePusherClientId(result.id);
				return { pusherClientId: result.id };
			});
		}
	});

const pusherRegisterInterests = (pusherClientId, interests) => {
	if(pusherClientId) {
		const body = {
			app_key: PUSHER_APP_KEY,
			interests
		};
		const url = PUSHER_PUSH_API + '/v1/clients/' + pusherClientId + '/interests';
		sendRequest(url, createJson('PUT', body));
		return { pusherClientId };
	}
};

const pusherSubscribe = userId => {
	if (PushService.token)
		pusherRegisterDevice(PushService.token)
			.then(({ pusherClientId }) =>
				pusherRegisterInterests(pusherClientId, [
					'chat_' + userId,
					'diet_' + userId,
					'gift_' + userId,
					'referactivation_' + userId,
					'recipe_share_' + userId
				])
			)
			.catch(err =>
				Crashlytics.log(
					'Exception when registering for Pusher push notifications: ' +
						JSON.stringify(err)
				)
			);
};

const pusherClearInterests = pusherClientId =>
	pusherRegisterInterests(pusherClientId, []);

const pusherUnsubscribe = () =>
	getPusherClientId().then(pusherClientId =>
		pusherClearInterests(pusherClientId)
	);

export const GoogleOauth = (email, token, appPlatform, appVersion) => {

	return (dispatch) => {

		dispatch({type: LOGIN_USER});

		let url = HOST + 'api/v2/mobile/login/oauthGoogle';
		let body = 'userName=' + email + '&googleToken=' + token + '&appPlatform=' + appPlatform + '&appVersion=' + appVersion + '&v=' + version;
		let oauthOptions = createOptions('POST', body);

		let usedEmail = email.toString();

		sendRequest(url, oauthOptions).then(result => {

			if(result.status === 'success') {

				if(!__DEV__) {

					Sentry.setUserContext({

						'user': usedEmail,

						'platform': appPlatform,

						'version': version,

						'host': HOST
					});

				}


				let token = result.token;
				let email = result.client.email;
				let doctorId = result.client.doctor_id;
				let doctorName = result.client.doctorName;
				let diet = result.client.diet;
				let userId = result.client.user_id;
				let profile = result.client.profile || '';
				let name = result.client.name;
				let show_goals = result.client.show_goals;
				let show_nutrients = result.client.show_nutrients;
				let show_points = result.client.show_points;
				let allow_mealplan_regeneration = result.client.allow_mealplan_regeneration;

				AsyncStorage.getItem('releaseNote').then((releaseNote) => {
					if(!releaseNote || releaseNote !== version) {
						AsyncStorage.setItem('releaseNote', version);
						dispatch({type: SHOW_RELEASE_NOTES, isReleaseNotesOpen: true }); 
					}
				});

				pusherSubscribe(userId);

				dispatch({type: SET_CLIENT_PERMISSIONS, showGoals: show_goals, showNutrients: show_nutrients, showPoints: show_points, allowMealplanRegeneration: allow_mealplan_regeneration});

				if (result.client.isFirstLogin) {

					dispatch({type: OPEN_CLOSE_ONBOARDING, isOnboardingOpen: true});
					return setDataToStorage(dispatch, email, token, userId, doctorId, profile, name, doctorName, diet);

				} else {

					getWelcomeData(dispatch, email, token).then(res => {
						if (res.status === 'success') {
							dispatch({type: GET_WELCOME_SUCCESS, greeting: res.message});
						} else {
							dispatch({type: GET_WELCOME_FAIL});
						}
						return setDataToStorage(dispatch, email, token, userId, doctorId, profile, name, doctorName, diet);
					});

				}

			} else {

				GoogleSignin.signOut();
				processResponse(dispatch, result, loginUserFail, 'Wrong email or password. Try again.');
			}
		});
	};
};

export const loginUser = ({email, password}) => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('loginUser() in AuthActions.js');

	return dispatch => {
		Crashlytics.log('dispatching');
		dispatch({ type: LOGIN_USER });
		Crashlytics.log('dispatched');

		let url = HOST + 'api/v2/mobile/login';
		let body = 'userName=' + encodeURIComponent(email) + '&password=' + password + '&v=' + version;
		let loginOptions = createOptions('POST', body);

		// Set user info to crashlytics
		Crashlytics.setUserEmail(email);
		let usedEmail = email.toString();

		Crashlytics.log(JSON.stringify(url));
		Crashlytics.log(JSON.stringify(loginOptions));

		if (!email && !password)
			return loginUserFail(dispatch, 'Enter an email and password to continue.').catch(()=>{return Promise.reject();});
		if (!email)
			return loginUserFail(dispatch, 'Enter an email to continue.').catch(()=>{return Promise.reject();});
		if (!password)
			return loginUserFail(dispatch, 'Enter a password to continue.').catch(()=>{return Promise.reject();});

		Crashlytics.log('attempting to send request with sendRequest()');

		return sendRequest(url, loginOptions).then(result => {
			Crashlytics.log('response received');
			Crashlytics.log(JSON.stringify(result));

			if (!__DEV__)
				Sentry.setUserContext({

					'user': usedEmail,

					'platform': appPlatform,

					'version': version,

					'host': HOST
				});
			if (result.status === 'success') {
				
				Crashlytics.log('calling setDataToStorage()');
				const {
					token,
					client: {
						email,
						doctor_id: doctorId,
						doctorName,
						user_id: userId,
						name,
						show_goals: showGoals,
						show_nutrients: showNutrients,
						show_points: showPoints,
						allow_mealplan_regeneration: allowMealplanRegeneration,
						isFirstLogin,
						diet,
						needsPaymentSource,
						hasTelehealth
					}
				} = result;
				

				AsyncStorage.getItem('releaseNote').then((releaseNote) => {
					if(!releaseNote || releaseNote !== version) {
						AsyncStorage.setItem('releaseNote', version);
						dispatch({type: SHOW_RELEASE_NOTES, isReleaseNotesOpen: true }); 
					}
				});

				//don't assign profile's default value with destructuring assignment, since result.client.profile can be *null*
				const profile = result.client.profile || '';
				
				pusherSubscribe(userId);

				dispatch({ type: SET_CLIENT_PERMISSIONS, showGoals,	showNutrients, showPoints, allowMealplanRegeneration, needsPaymentSource, hasTelehealth});

				if (isFirstLogin) {
					dispatch({ type: OPEN_CLOSE_ONBOARDING, isOnboardingOpen: true });
					return setDataToStorage(
						dispatch,
						email,
						token,
						userId,
						doctorId,
						profile,
						name,
						doctorName,
						diet
					);
				} else {
					getWelcomeData(dispatch, email, token).then(res => {
						if (res.status === 'success') {
							dispatch({ type: GET_WELCOME_SUCCESS, greeting: res.message });
						} else {
							dispatch({ type: GET_WELCOME_FAIL });
						}
						return setDataToStorage(
							dispatch,
							email,
							token,
							userId,
							doctorId,
							profile,
							name,
							doctorName,
							diet
						);
					});
				}
			} else {
				Crashlytics.log('calling processResponse()');

				processResponse(
					dispatch,
					result,
					loginUserFail,
					'Wrong email or password. Try again.'
				);
				return Promise.reject();
			}
		});

	};
};

const getWelcomeData = (dispatch, email, token) => {
	let url = HOST + 'api/v2/mobile/welcome';
	let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;
	let options = createOptions('POST', body);
	return sendRequest(url, options);
};

const loginUserSuccess = (dispatch, email, token, profile, doctorName, userId, diet) => {
	dispatch({
		type: LOGIN_USER_SUCCESS,
		email: email,
		token: token,
		doctorPhoto: profile,
		doctorName,
		userId,
		diet
	});
	return Promise.resolve(true);

};

const loginUserFail = (dispatch, error = '') => {
	dispatch({ type: LOGIN_USER_FAIL,	error });
	return Promise.reject();
};


export const checkAuth = () => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('checkAuth() in AuthActions.js');

	return dispatch => {

		Crashlytics.log('dispatching');

		dispatch({type: LOGIN_USER});

		Crashlytics.log('dispatched');

		return getKeyFromStorage().then((stores) => {
			const {token, email, profile, releaseNote} = stores;
			let url = HOST + 'api/v2/mobile/login/confirm';
			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;
			// Set user info to crashlytics
			Crashlytics.setUserName(stores.name);
			Crashlytics.setUserEmail(stores.email);
			Crashlytics.setUserIdentifier(stores.token);

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(email));
			Crashlytics.log(JSON.stringify(token));

			Crashlytics.log('attempting to send request with sendRequest()');
			
			if (email && token) {
				return sendRequest(url, createOptions('POST', body))

					.then(result => {
						Crashlytics.log('response received');
						Crashlytics.log(JSON.stringify(result));
						if (result.status === 'success') {
							const {
								client: {
									doctorName,
									show_goals: showGoals,
									show_nutrients: showNutrients,
									show_points: showPoints,
									allow_mealplan_regeneration: allowMealplanRegeneration,
									user_id: userId,
									diet,
									needsPaymentSource,
									hasTelehealth
								}
							} = result;
				
							if(!releaseNote || releaseNote !== version) {
								AsyncStorage.setItem('releaseNote', version);
								dispatch({type: SHOW_RELEASE_NOTES, isReleaseNotesOpen: true }); 
							}

							pusherSubscribe(userId);

							Crashlytics.log('calling logingUserSuccess()');
							
							dispatch({type: SET_CLIENT_PERMISSIONS, showGoals, showNutrients, showPoints, allowMealplanRegeneration, needsPaymentSource, hasTelehealth});

							return loginUserSuccess(dispatch, email, token, profile, doctorName, userId, diet).then(()=> {
								return Promise.resolve(true);
							});

						} else {

							Crashlytics.log('calling processResponse()');

							processResponse(dispatch, result, loginUserFail, '');
						}
					});
			} else {
				return loginUserFail(dispatch).catch((e) => { });
			}
		});
	};
};

const sendLogout = (dispatch) => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('sendLogout() in AuthActions.js');

	getKeyFromStorage().then((stores) => {
		const {token, email} = stores;
		let url = HOST + 'api/v2/mobile/logout';
		let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;
		Crashlytics.log(JSON.stringify(url));
		Crashlytics.log(JSON.stringify(email));
		Crashlytics.log(JSON.stringify(token));

		Crashlytics.log('attempting to send request with sendRequest()');

		sendRequest(url, createOptions('POST', body)).then(result => {

			Crashlytics.log('response received');
			Crashlytics.log(JSON.stringify(result));

			if (result.status === 'success') {

				Crashlytics.log('calling AsyncStorage.clear()');

				pusherUnsubscribe();

				clearAsyncStorage().then(() => {
					dispatch({type: RESET_STATE});
					Actions.auth({type: 'replace'});
				});
			} else {
				if (result.status === 'unauthorized') {

					Crashlytics.log('calling Actions.auth()');
					dispatch({type: RESET_STATE});

				} else {

					Crashlytics.log('calling processResponse()');

					processResponse(dispatch, result, loginUserFail, '');
				}
			}
		});
	});
};

export const logOutUser = () => {
	return (dispatch) => Alert.alert(
		'Confirmation:',
		'Are you sure you want to logout?',
		[
			{text: 'Yes', onPress: () => sendLogout(dispatch)},
			{text: 'No', style: 'cancel'}
		]
	);

};

const setDataToStorage = (dispatch, email, token, user_id, doctor_id, profile, name, doctorName, diet) => {
	let store = [['kitchry', token], ['userKitchry', email], ['name', name]];
	if (user_id) {
		store = [
			['kitchry', token],
			['userKitchry', email],
			['name', name.toString()],
			['profile', profile],
			['userId', user_id.toString()],
			['doctorId', doctor_id.toString()],
			['doctorName', doctorName.toString()]
		];
	}
	return AsyncStorage.multiSet(store, (err) => {
		if (err) {
			return loginUserFail(dispatch).catch((e) => {});
		} else {
			return loginUserSuccess(dispatch, email, token, profile, doctorName, user_id, diet).then(()=> {
				return Promise.resolve(true);
			});
		}
	});
};

export const resetPassword = (email) => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('resetPassword() in AuthActions.js');

	return (dispatch) => {

		Crashlytics.log('dispatching');

		dispatch({type: SEND_RESET_REQUEST});
		dispatch({
			type: EMAIL_CHANGED,
			payload: email
		});

		Crashlytics.log('dispatched');

		let url = HOST + 'api/v2/mobile/reset';
		let body = 'userName=' + encodeURIComponent(email) + '&v=' + version;
		let loginOptions = createOptions('POST', body);

		Crashlytics.log(JSON.stringify(url));
		Crashlytics.log(JSON.stringify(loginOptions));

		Crashlytics.log('attempting to send request with sendRequest()');

		sendRequest(url, loginOptions)
			.then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {

					Crashlytics.log('calling Actions.auth()');

					dispatch({type: SEND_RESET_SUCCESS});
					Alert.alert(
						null,
						result.message,
						[
							{text: 'OK', onPress: () => Actions.auth({type: 'replace'})}
						]
					);

				} else {

					Crashlytics.log('calling processResponse');

					processResponse(dispatch, result, resetPasswordFail, 'Request could not be processed');
				}
			});
	};
};

const resetPasswordFail = (dispatch, message) => {
	dispatch({
		type: SEND_RESET_FAIL,
		error: message
	});
};

const processResponse = (dispatch, response, onFail, message) => {
	switch (response.status) {
		case 'timeout':
			return onFail(dispatch, timeoutMessage);
		case 'clientError':
			return onFail(dispatch, message);
		case 'unauthorized':
			return onFail(dispatch, message);
		case 'serverError':
			return onFail(dispatch, 'Sorry, your request could not be processed');
		case 'notActivated':
			return onFail(dispatch, 'You need an invitation from your Dietitian or Nutrition Provider to access Kitchry. Kindly contact them for your activation link');
		case 'fail':
			return onFail(dispatch, response.message || message || 'We are currently updating Kitchry for you to benefit from our latest features. Please try again in a couple of minutes. We sincerely apologize for the inconvenience.');
		default:
			return onFail(dispatch, 'Cannot establish connection');
	}
};
