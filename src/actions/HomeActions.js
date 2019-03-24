/**
 * Created by mponomarets on 7/24/17.
 */
import {
	START_LOAD_DATA,
	LOAD_UPCOMING_MEAL_SUCCESS,
	LOAD_UPCOMING_MEAL_FAIL,
	LOAD_REVIEW_MEAL_LIST_SUCCESS,
	LOAD_REVIEW_MEAL_LIST_FAIL,
	SET_CLOSE_DAYS_LIST,
	SET_SELECTED_DAY,
	GET_MEAL_PLAN_FOR_HOMESCREEN_SUCCESS,
	MEAL_PLAN_GET_FAIL
} from './types';
import {
	HOST,
	clearAsyncStorage,
	getAuthString,
	months,
	timeoutMessage,
	utcOffsetHours,
	prettyDate
} from './const';
import { sendRequest, createOptions } from './http';
import { Actions } from 'react-native-router-flux';
import { Crashlytics } from 'react-native-fabric';
import PushService from '../PushService';

const loadingUpcomingSuccess = (dispatch, upcomingMeal) => {
	dispatch({
		type: LOAD_UPCOMING_MEAL_SUCCESS,
		upcomingMeal: { ...upcomingMeal.mealplan }
	});
};

const loadingReviewMealListSuccess = (dispatch, reviewMealList) => {
	if (reviewMealList.mealplan.length > 0) {
		PushService.enqueueReviewReminder();
	} else {
		PushService.dequeueReviewReminer();
	}
	return dispatch({
		type: LOAD_REVIEW_MEAL_LIST_SUCCESS,
		reviewMealList: [...reviewMealList.mealplan]
	});
};

const loadingMealFail = (dispatch, message) =>
	dispatch({
		type: MEAL_PLAN_GET_FAIL,
		error: message || ''
	});

const loadingUpcomingFail = (dispatch, error) => {
	dispatch({
		type: LOAD_UPCOMING_MEAL_FAIL,
		error: error || 'Nothing to show'
	});
};

const loadingReviewMealListFail = (dispatch, error) => {
	dispatch({
		type: LOAD_REVIEW_MEAL_LIST_FAIL,
		error: error || 'Nothing to show'
	});
};

export const getDataForHomePage = () => {
	
	return (dispatch, getState) => {
		dispatch({ type: START_LOAD_DATA });
		getUpcoming(dispatch, getState);
		getReviews(dispatch);
		getMealPlan(dispatch, getState);
	};
};

// for select meal modal. (under '+' button);
const getMealPlan = (dispatch, getState) => {

	const date = prettyDate();
	const diet = getState().auth.diet;

	// in case no diet
	if(Object.keys(diet).length !== 0) {

		return getAuthString().then(authString => {
			const body = authString + '&date=' + encodeURIComponent(date);
			const options = createOptions('POST', body);
			return sendRequest(HOST + 'api/v2/mobile/mealplan', options);
		}).then(result => {
			if(result.status === 'success') {
				dispatch({
					type: GET_MEAL_PLAN_FOR_HOMESCREEN_SUCCESS,
					meals: result
				});
			} else {
				console.warn(result.status);
			}
			
		});

	} else {
		loadingMealFail(dispatch);
	}

};

const getUpcoming = (dispatch, getState) => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('getUpcoming() in HomeActions.js');
	const diet = getState().auth.diet;
	
	// in case no diet
	if(Object.keys(diet).length !== 0) {

		return getAuthString()
			.then(authString => {
				const body = authString + '&utcOffsetHours=' + utcOffsetHours;
				const options = createOptions('POST', body);
				return sendRequest(HOST + 'api/v2/mobile/mealplan/upcoming', options);
			})
			.then(result => {
				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));
				
				if (result.status === 'success') {
					Crashlytics.log('calling loadingUpcomingSuccess()');
					loadingUpcomingSuccess(dispatch, result);
				} else {
					Crashlytics.log('calling processResponse()');
					processResponse(dispatch, result, loadingUpcomingFail);
				}
			})
			.catch(() => {
				Crashlytics.log('calling loadingUpcomingFail()');
				loadingUpcomingFail(dispatch);
			});

	} else {
		loadingUpcomingFail(dispatch);
	}
};


const getReviews = dispatch => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('getReviewList() in HomeActions.js');

	return getAuthString()
		.then(authString => {
			const body = authString + '&utcOffsetHours=' + utcOffsetHours;
			const options = createOptions('POST', body);
			return sendRequest(HOST + 'api/v2/mobile/mealplan/review', options);
		})
		.then(result => {
			Crashlytics.log('response received');
			Crashlytics.log(JSON.stringify(result));
			if (result.status === 'success') {
				Crashlytics.log('calling loadingReviewMealListSuccess()');

				const res = {};
				result.mealplan.forEach(item => {
					let tmp = new Date(item.date);
					item.date = `${months[tmp.getUTCMonth()]} ${tmp.getUTCDate()}, ${tmp.getUTCFullYear()}`;
				});
				result.mealplan.forEach(item => {
					if (res.hasOwnProperty(item.date)) {
						res[item.date].push({ ...item });
					} else {
						res[item.date] = [];
						res[item.date].push({ ...item });
					}
				});
				dispatch({ type: SET_CLOSE_DAYS_LIST, closeDaysList: res });
				return loadingReviewMealListSuccess(dispatch, result);
			} else {
				Crashlytics.log('calling processResponse()');
				return processResponse(dispatch, result, loadingReviewMealListFail);
			}
		})
		.catch(() => {
			Crashlytics.log('calling loadingReviewMealListFail()');
			return loadingReviewMealListFail(dispatch);
		});
};

export const getReviewList = () => dispatch => getReviews(dispatch);

export const setSelectedDay = (day) => {
	return dispatch => {
		dispatch({ type: SET_SELECTED_DAY, selectedDay: day });
		Actions.selectedDay();
	};
};

const processResponse = (dispatch, response, onFail) => {
	switch (response.status) {
		case 'timeout':
			return onFail(dispatch, timeoutMessage);
		case 'clientError':
			return onFail(dispatch, 'Client error');
		case 'unauthorized':
			clearAsyncStorage();
			Actions.auth({ type: 'replace' });
			return onFail(dispatch);
		case 'serverError':
			return onFail(dispatch, 'Sorry, your request could not be processed');
		case 'fail':
		default:
			return onFail(dispatch, 'Unknown error');
	}
};
