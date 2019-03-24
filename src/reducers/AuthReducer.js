/**
 * Created by mponomarets on 7/2/17.
 */
import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOGIN_USER,
	SEND_RESET_REQUEST,
	SEND_RESET_SUCCESS,
	SEND_RESET_FAIL,
	RESET_STATE
} from '../actions/types';

const INITIAL_STATE = {
	email: '',
	password: '',
	error: '',
	loading: false,
	token: '',
	userId: '',
	doctorPhoto: '',
	doctorName: '',
	diet: {}
};

export default (
	state = INITIAL_STATE,
	{ type, payload, email, token, doctorPhoto, doctorName, userId, error, diet }
) => {
	switch (type) {
		case EMAIL_CHANGED:
			return { ...state, email: payload, error: '' };
		case PASSWORD_CHANGED:
			return { ...state, password: payload, error: '' };
		case LOGIN_USER:
		case SEND_RESET_REQUEST:
			return { ...state, loading: true, error: '' };
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				error: '',
				loading: false,
				password: '',
				email,
				token,
				userId,
				doctorPhoto,
				doctorName,
				diet
			};
		case LOGIN_USER_FAIL:
			return { ...state, error, password: '', loading: false };
		case SEND_RESET_SUCCESS:
			return { ...state, error: '', loading: false };
		case SEND_RESET_FAIL:
			return { ...state, error, loading: false };
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};
