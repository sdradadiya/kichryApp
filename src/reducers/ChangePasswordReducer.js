/**
 * Created by mponomarets on 7/29/17.
 */
import {
	SEND_NEW_PASSWORD,
	SEND_NEW_PASSWORD_SUCCESS,
	SEND_NEW_PASSWORD_FAIL,
	RESET_STATE
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: false,
	newPass: '',
	verifyPass: '',
	currentPass: ''
};

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		case SEND_NEW_PASSWORD:
			return {...state, loading: true, error: ''};
		case SEND_NEW_PASSWORD_SUCCESS:
			return {...state, loading: false, error: action.error, newPass: '', verifyPass: '', currentPass: ''};
		case SEND_NEW_PASSWORD_FAIL:
			return {...state, loading: false, error: action.error};
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};




















