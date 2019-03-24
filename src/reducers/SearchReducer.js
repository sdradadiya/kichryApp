/**
 * Created by mponomarets on 9/21/17.
 */

import {
	START_SEARCH,
	CONTINUE_SEARCH,
	SEARCH_SUCCESS,
	SEARCH_FAIL,
	SET_FILTERS,
	SET_DIET_RESTRICTION,
	RESET_STATE,
	REMOVE_DIET_RESTRICTION
} from '../actions/types';

const INITIAL_STATE = {
	searchResult: [],
	loading: false,
	error: '',
	filters: {
		'dietTypes': [],
		'mealTypes': [],
		'restrictions': [],
		'tags': [],
		'cookingTime': [],
		'preparationTime': []
	},
	restrictions: [],
	pages: 0
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_SEARCH:
			return {...state, loading: true, searchResult: action.searchResult};
		case CONTINUE_SEARCH:
			return {...state, loading: true};
		case SEARCH_SUCCESS:
			return {
				...state,
				searchResult: action.searchResult,
				loading: false,
				error: '',
				pages: action.pages
			};
		case SEARCH_FAIL:
			return {...state, loading: false, error: action.error};
		case SET_FILTERS:
			return {
				...state,
				filters: action.filters
			};
		case SET_DIET_RESTRICTION:
			return { ...state, restrictions: action.dietRest };
		case REMOVE_DIET_RESTRICTION:
			return { ...state, restrictions: []};
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
}
;
