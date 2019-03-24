import {
	SEND_REFER_FORM,
	SEND_REFER_FORM_SUCCESS,
	SEND_REFER_FORM_FAIL,
	RESET_STATE
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: false,
	name: '',
	referEmail: ''
};

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		case SEND_REFER_FORM:
			return {...state, loading: true, name: action.name, referEmail: action.referEmail, error: ''};
		case SEND_REFER_FORM_SUCCESS:
			return {...state, loading: false, error: ''};
		case SEND_REFER_FORM_FAIL:
			return {...state, loading: false, name: action.name, referEmail: action.referEmail, error: action.error};
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};