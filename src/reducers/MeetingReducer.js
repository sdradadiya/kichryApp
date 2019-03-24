import {
	GET_MEETINGS,
	GET_MEETINGS_SUCCESS,
	CREATE_MEETING,
	CREATE_MEETING_SUCCESS,
	CREATE_MEETING_FAIL,
	GET_MEETINGS_CALENDAR,
	GET_MEETINGS_CALENDAR_SUCCESS,
	GET_MEETINGS_CALENDAR_FAIL,
	HANDLING_CC,
	HANDLING_CC_SUCCESS,
	CC_DISABEL
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: true,
	loadingCC: false,
	loadingMeetingDay: true,
	meetings: {},
	meetingsQuota: {},
	busyTime: [],
	confirmButtonStatus: false,
	cc: true
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_MEETINGS:
			return { ...state, loading: true };
		case GET_MEETINGS_SUCCESS:
			return { ...state, meetings: action.meetings, meetingsQuota: action.meetingsQuota, loading: false };
		case CREATE_MEETING:
			return { ...state, confirmButtonStatus: true };
		case CREATE_MEETING_SUCCESS:
			return { ...state, confirmButtonStatus: false };
		case CREATE_MEETING_FAIL:
			return { ...state, confirmButtonStatus: false };
		case GET_MEETINGS_CALENDAR:
			return { ...state, loadingMeetingDay: true };
		case GET_MEETINGS_CALENDAR_SUCCESS: 
			return { ...state, loadingMeetingDay: false, busyTime: action.busyTime };
		case GET_MEETINGS_CALENDAR_FAIL:
			return { ...state, loadingMeetingDay: false };
		case HANDLING_CC:
			return { ...state, loadingCC: true };
		case HANDLING_CC_SUCCESS: 
			return { ...state, loadingCC: false };
		case CC_DISABEL: 
			return { ...state, cc: false};
		default:
			return state;
	}
};