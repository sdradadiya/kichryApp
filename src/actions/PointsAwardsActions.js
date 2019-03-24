import {
	LOAD_MY_POINTS,
	LOAD_MY_POINTS_SUCCESS,
	LOAD_MY_POINTS_FAIL,
	LOAD_ALL_AWARDS,
	LOAD_ALL_AWARDS_SUCCESS,
	LOAD_ALL_AWARDS_FAIL,
	LOAD_MY_AWARDS,
	LOAD_MY_AWARDS_SUCCESS,
	LOAD_MY_AWARDS_FAIL
} from './types';

import { HOST, timeoutMessage, getKeyFromStorage, version } from './const';
import { sendRequest, createOptions } from './http';
import { Crashlytics } from 'react-native-fabric';

// Get all points available in the platformn / Get client's points
export const getPoints = () => {
	return dispatch => {
		Crashlytics.log('*********');
		Crashlytics.log('entering action');
		Crashlytics.log('get all points');

		dispatch({type: LOAD_MY_POINTS});
		getKeyFromStorage().then((stores) => {

			const { token, email } = stores;

			let urlAll = HOST + 'api/v2/mobile/points/all';
			let urlMy = HOST + 'api/v2/mobile/points/my';
			let urlExchang = HOST + 'api/v2/mobile/points/exchanges';

			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;
			let options = createOptions('POST', body);

			Promise.all([
				sendRequest(urlAll, options), 
				sendRequest(urlMy, options), 
				sendRequest(urlExchang, options)
			]).then(([allPoints, myPoints, clientExchang]) => {

				if (allPoints.status === 'success' && myPoints.status === 'success' && clientExchang.status === 'success') {

					let result = allPoints.points;
					let sumAllPoints = 0;
					let sumExchang = 0;
					let exchang = clientExchang.exchanges;

					for (let i = 0; i < result.length; i++) {
						result[i].myPoints = 0;
						for (let k = 0; k < myPoints.points.length; k++) {
							if (result[i].id === myPoints.points[k].awardable_event_id) {
								result[i].myPoints += result[i].points;
								sumAllPoints += result[i].points;
							}
						}

					}
					
					if(exchang.length > 0) {
					
						for(let i = 0; i < exchang.length; i++) {
							sumExchang += exchang[i].points_exchanged;
							sumAllPoints -= exchang[i].points_exchanged;
						}
						
					}

					Crashlytics.log('response received');
					Crashlytics.log(JSON.stringify(result));
					dispatch({ type: LOAD_MY_POINTS_SUCCESS, myPoints: result, sumAllPoints: sumAllPoints, exchang: sumExchang });
				}
				else {
					Crashlytics.log('calling processResponse()');
					processResponse(dispatch, allPoints, onFailPoints, 'Something was wrong');
				}
			});
		});
	};
};

const onFailPoints = (dispatch, message) => {
	dispatch({ type: LOAD_MY_POINTS_FAIL, error: message });
};

export const getAllAwards = () => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('get all awards');

	return dispatch => {
		dispatch({ type: LOAD_ALL_AWARDS });
		getKeyFromStorage().then((stores) => {
			const { token, email } = stores;
			let url = HOST + 'api/v2/mobile/awards/platform/all';
			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(body));

			sendRequest(url, createOptions('POST', body)).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {
					dispatch({ type: LOAD_ALL_AWARDS_SUCCESS });

				} else {
					if (result.status === 'unauthorized') {
						Crashlytics.log('calling all points');
						dispatch({ type: LOAD_ALL_AWARDS_FAIL });
					} else {
						Crashlytics.log('calling processResponse()');
						dispatch({ type: LOAD_ALL_AWARDS_FAIL });
						//processResponse(dispatch, result, loginUserFail, '');
					}
				}
			});

		});
	};
};

export const getMyAwards = () => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('get my awards');

	return dispatch => {
		dispatch({ type: LOAD_MY_AWARDS });
		getKeyFromStorage().then((stores) => {
			const { token, email } = stores;
			let url = HOST + 'api/v2/mobile/awards/platform/my';
			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version;

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(body));

			sendRequest(url, createOptions('POST', body)).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {
					dispatch({ type: LOAD_MY_AWARDS_SUCCESS });

				} else {
					if (result.status === 'unauthorized') {
						Crashlytics.log('calling all points');
						dispatch({ type: LOAD_MY_AWARDS_FAIL });
					} else {
						Crashlytics.log('calling processResponse()');
						dispatch({ type: LOAD_MY_AWARDS_FAIL });
						//processResponse(dispatch, result, loginUserFail, '');
					}
				}
			});

		})
	};
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
			return onFail(dispatch, 'We are currently updating Kitchry for you to benefit from our latest features. Please try again in a couple of minutes. We sincerely apologize for the inconvenience.');
		default:
			return onFail(dispatch, 'Cannot establish connection');
	}
};
