/**
 * Created by mponomarets on 7/4/17.
 */
import {
	GROCERY_LIST_GET_FAIL,
	GROCERY_LIST_START_LOAD,
	CHANGE_CURRENT_DATE_IN_GROCERY_LIST,
	ACTIVE_PERIOD,
	CHANGE_GROUP_BY,
	GROCERY_LIST_GROUP_BY_RECIPE,
	GROCERY_LIST_GROUP_BY_CATEGORY
} from './types';
import {Actions} from 'react-native-router-flux';
import {HOST, timeoutMessage, getKeyFromStorage, prettyDate, clearAsyncStorage, groupArray, version} from './const';
import {sendRequest, createOptions} from './http';
import {Crashlytics} from 'react-native-fabric';

export const changePeriod = (period) => {
	return dispatch => dispatch({type: ACTIVE_PERIOD, period: period === 'day' ? 'day' : 'week'});
};

export const changeGroupBy = () => {
	return (dispatch, store) => {
		let active = store().grocery.groupBy === 'recipe' ? 'category' : 'recipe';
		dispatch({type: CHANGE_GROUP_BY, groupBy: active});
	};
};

const loadingCroceryListFaill = (dispatch) => {
	dispatch({
		type: GROCERY_LIST_GET_FAIL,
		error: 'Houston we have a problem'
	});
};

export const changeDateForGroceryList = (date) => {
	return dispatch => dispatch({
		type: CHANGE_CURRENT_DATE_IN_GROCERY_LIST,
		date: date
	});
};

const loadingGroceryListGroupByRecipeSuccess = (dispatch, data, date) => {
	dispatch({
		type: GROCERY_LIST_GROUP_BY_RECIPE,
		groceryListGroupByRecipe: data,
		date: date
	});
};
const loadingGroceryListGroupByCategorySuccess = (dispatch, data, date) => {
	dispatch({
		type: GROCERY_LIST_GROUP_BY_CATEGORY,
		groceryListGroupByCategory: data,
		date: date
	});
};

export const getGroceryList = () => {
	
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('getGroceryList() in GroceryListActions.js');

	return (dispatch, store) => {

		Crashlytics.log('dispatching');

		dispatch({type: GROCERY_LIST_START_LOAD});

		Crashlytics.log('dispatched');

		let period = store().grocery.period;
		let groupBy = store().grocery.groupBy;
		let date = store().grocery.currentDayForGroceryList;
		getKeyFromStorage().then((stores) => {
			const {token, email} = stores;
			let url = HOST + 'api/v2/mobile/grocery';
			let currentDate = date ? date : prettyDate();

			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version + '&date=' + encodeURIComponent(currentDate) + '&period=' + period + '&groupingType=' + groupBy;
			
			let groceryOptions = createOptions('POST', body);

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(groceryOptions));

			Crashlytics.log('attempting to send request with sendRequest()');

			sendRequest(url, groceryOptions).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {

					if (groupBy === 'recipe') {

						Crashlytics.log('calling loadingGroceryListGroupByRecipeSuccess()');

						loadingGroceryListGroupByRecipeSuccess(dispatch, groupArray(result.grocery), date);
					} else {

						Crashlytics.log('calling loadingGroceryListGroupByCategorySuccess()');

						loadingGroceryListGroupByCategorySuccess(dispatch, groupArray(result.grocery, true), date);
					}
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
			return loadingCroceryListFaill(dispatch, timeoutMessage);
		case 'clientError':
			return loadingCroceryListFaill(dispatch, 'Client error');
		case 'unauthorized':
			clearAsyncStorage();
			Actions.auth({type: 'replace'});
			return loadingCroceryListFaill(dispatch);
		case 'serverError':
			return loadingCroceryListFaill(dispatch, 'Sorry, your request could not be processed');
		case 'fail':
		default:
			return loadingCroceryListFaill(dispatch, 'Unknown error');
	}
};


