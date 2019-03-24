/**
 * Created by mponomarets on 8/16/17.
 */
import {
	SET_PROFILE_IMAGE,
	SET_PROFILE_IMAGE_FAIL,
	SET_PROFILE_IMAGE_SUCCESS,
	USER_LOCATION,
	RESET_STATE,
	SET_SERVINGS,
	SET_SERVINGS_FAIL,
	SET_SERVINGS_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: false,
	photo: '',
	location: '',
	numServings: '',
	loadingServing: false
};
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_PROFILE_IMAGE:
			return {...state, loading: true, error: ''};
		case SET_PROFILE_IMAGE_SUCCESS:
			return {...state, loading: false, photo: action.photo};
		case SET_PROFILE_IMAGE_FAIL:
			return {...state, loading: false, error: action.error};
		case USER_LOCATION:
			return {...state, location: action.location};
		case SET_SERVINGS:
			return {...state, numServings: action.numServings, loadingServing: true, error: ''};
		case SET_SERVINGS_SUCCESS:
			return {...state, numServings: action.numServings, loadingServing: false, error: ''};
		case SET_SERVINGS_FAIL:
			return {...state, error: action.error, loadingServing: false};
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};