import {
	GET_DAILY_CHECKLIST,
	GET_CHECKLIST_RECORDS,
	GET_DAILY_CHECKLIST_SUCCESS,
	GET_CHECKLIST_RECORDS_SUCCESS,
	GET_CHECKLIST_RECORDS_FAIL,
	GET_DAILY_CHECKLIST_FAIL,
	TRACK_CHECKLIST,
	TRACK_CHECKLIST_SUCCESS,
	TRACK_CHECKLIST_FAIL,
	TRACK_CHECLIST_ERROR_CLEAN,
	CLEAN_CHECKLIST_RECORDS
} from '../actions/types';

const INITIAL_STATE = {
	dailyChecklist: {},
	checklistRecords: {},
	loading: false,
	error: ''
}; 

export default (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case GET_DAILY_CHECKLIST:
			return { ...state, loading: true };
		case GET_CHECKLIST_RECORDS:
			return { ...state, loading: true };
		case GET_DAILY_CHECKLIST_SUCCESS: 
			return { ...state, loading: false, dailyChecklist: action.dailyChecklist };
		case GET_CHECKLIST_RECORDS_SUCCESS:
			return { ...state, loading: false, checklistRecords: action.checklistRecords };
		case GET_CHECKLIST_RECORDS_FAIL: 
			return { ...state, loading: false, error: action.error };
		case GET_DAILY_CHECKLIST_FAIL:
			return { ...state, loading: false, error: action.error };
		case TRACK_CHECKLIST:
			return { ...state, loading: true };
		case TRACK_CHECKLIST_SUCCESS: 
			return { ...state, loading: false };
		case TRACK_CHECKLIST_FAIL: 
			return { ...state, loading: false, error: action.error };
		case TRACK_CHECLIST_ERROR_CLEAN:
			return { ...state, error: '' };
		case CLEAN_CHECKLIST_RECORDS: 
			return { ...state, checklistRecords: {} };
		default:
			return state;
	}

};