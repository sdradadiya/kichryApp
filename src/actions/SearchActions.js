/**
 * Created by mponomarets on 9/21/17.
 */
import {
	START_SEARCH,
	CONTINUE_SEARCH,
	SEARCH_SUCCESS,
	SEARCH_FAIL,
	SET_FILTERS
} from './types';
import {Actions} from 'react-native-router-flux';

import {HOST, timeoutMessage, getKeyFromStorage, version, nutrientUnits} from './const';
import {sendRequest, createOptions} from './http';

export const setFiltersList = (filters) => {
	return {type: SET_FILTERS, filters: {...filters}};
};
export const resetSearchScreen = () => {
	return {type: SEARCH_SUCCESS, searchResult: []};
};

export const searchMeal = (text, page, nutrient = [], orderBy = '', size = 20) => {
	return (dispatch, store) => {
		if (page === 1) {
			dispatch({type: START_SEARCH});
		} else {
			dispatch({type: CONTINUE_SEARCH});
		}
		let nutrition_filter = '';

		if(nutrient.length > 0) {
            nutrient.map(data=>{
                nutrition_filter += `&${data}`;
            });
		}

		let filters = filters ? filters : store().search.filters;
		let searchBefore = store().search.searchResult;

		getKeyFromStorage().then((stores) => {
			const {token, email} = stores;

			let url = HOST + 'api/v2/mobile/recipe/search/advanced';

			let body = 'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version + '&page=' + page + '&size=' + size + nutrition_filter;
			if(orderBy) {
                body += '&orderBy=' + orderBy + '&desc=' + true;
			}
			
			if (text) {

				body += '&title=' + text;

			}
					
			for (let filterKey in filters) {

				if (filters[filterKey].length > 0) {
					let filterValue = filters[filterKey].join();

					body += '&' + filterKey + '=' + filterValue;
					
				}
			}
			return sendRequest(url, createOptions('POST', body))
				.then(result => {
					if (result.status === 'success') {

						let res = page === 1 ? result.recipes : [...searchBefore, ...result.recipes];

						dispatch({type: SEARCH_SUCCESS, searchResult: res, pages: result.pages});

					} else {

						processResponse(dispatch, result, searchFail, '');

					}

				});

		});
	};
};

const searchFail = (dispatch, message) => {
	dispatch({type: SEARCH_FAIL, error: message});
};

const processResponse = (dispatch, response, onFail, message) => {
	switch (response.status) {
		case 'timeout':
			return onFail(dispatch, timeoutMessage);
		case 'clientError':
			return onFail(dispatch, message);
		case 'unauthorized':
			return Actions.auth({type: 'replace'});
		case 'serverError':
			return onFail(dispatch, 'Sorry, your request could not be processed');
		case 'fail':
			return onFail(dispatch, 'Sorry, your request could not be processed');
		default:
			return onFail(dispatch, 'Cannot establish connection');
	}
};