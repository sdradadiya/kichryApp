/**
 * Created by mponomarets on 7/5/17.
 */
import {
	START_LOAD_CHAT_MESSAGE,
	LOAD_CHAT_MESSAGE_SUCCESS,
	LOAD_CHAT_MESSAGE_FAIL,
	CHANGE_MESSAGE_LIST,
	RESET_STATE
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: false,
	chatMessages: [],
	userId: '',
	doctorId: '',
	profile: ''
};
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_LOAD_CHAT_MESSAGE:
			return {...state, loading: true};
		case LOAD_CHAT_MESSAGE_SUCCESS:
			return {
				...state,
				loading: false,
				chatMessages: action.payload,
				userId: action.userId,
				doctorId: action.doctorId,
				profile: action.profile
			};
		case LOAD_CHAT_MESSAGE_FAIL:
			return {...state, loading: false, error: action.error};
		case CHANGE_MESSAGE_LIST:
			return {...state, chatMessages: action.payload};
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};