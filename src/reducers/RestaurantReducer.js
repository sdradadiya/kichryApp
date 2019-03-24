import {
	GET_RESTAURANT,
	GET_RESTAURANT_SUCCESS,
	GET_RESTAURANT_FAIL,
	GET_RESTAURANT_MENU,
	GET_RESTAURANT_MENU_SUCCESS,
	GET_RESTAURANT_MENU_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: true,
	pages: 0,
	restaurantResult: [],
	restaurantMenuResult: []
};

export default (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case GET_RESTAURANT:
			return {...state, loading: true};
		case GET_RESTAURANT_SUCCESS:
			return {...state, loading: false, restaurantResult: action.restaurantResult, error: ''};
		case GET_RESTAURANT_FAIL:
			return {...state, loading: false, error: action.error};
		case GET_RESTAURANT_MENU:
			return {...state, loading: true, error: ''};
		case GET_RESTAURANT_MENU_SUCCESS:
			return {...state, loading: false, restaurantMenuResult: action.restaurantMenuResult, error: action.error};
		case GET_RESTAURANT_MENU_FAIL:
			return {...state, loading: false, error: action.error};
		default:
			return state;

	}

};
