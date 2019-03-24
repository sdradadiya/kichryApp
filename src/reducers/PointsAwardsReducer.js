import {
	LOAD_MY_POINTS,
	LOAD_MY_POINTS_SUCCESS,
	LOAD_MY_POINTS_FAIL,
	LOAD_ALL_AWARDS,
	LOAD_ALL_AWARDS_SUCCESS,
	LOAD_ALL_AWARDS_FAIL,
	LOAD_MY_AWARDS,
	LOAD_MY_AWARDS_SUCCESS,
	LOAD_MY_AWARDS_FAIL,
	RESET_STATE
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loadingPoints: false,
	sumAllPoints: 0,
	myPoints: [],
	exchang: 0
};
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOAD_MY_POINTS:
			return { ...state, loadingPoints: true, error: '' };
		case LOAD_MY_POINTS_SUCCESS:
			return { ...state, loadingPoints: false, myPoints: action.myPoints, sumAllPoints: action.sumAllPoints, exchang: action.exchang, error: '' };
		case LOAD_MY_POINTS_FAIL:
			return { ...state, loadingPoints: false, error: action.error };
		case LOAD_ALL_AWARDS:
			return { ...state, loadingAwards: true, error: '' };
		case LOAD_ALL_AWARDS_SUCCESS:
			return { ...state, loadingAwards: false, allAwards: action.allAwards, error: '' };
		case LOAD_ALL_AWARDS_FAIL:
			return { ...state, loadingAwards: false, error: action.error };
		case LOAD_MY_AWARDS:
			return { ...state, loadingAwards: true, error: '' };
		case LOAD_MY_AWARDS_SUCCESS:
			return { ...state, loadingAwards: false, myAwards: action.myAwards, error: '' };
		case LOAD_MY_AWARDS_FAIL:
			return { ...state, loadingAwards: false, error: action.error };
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};
