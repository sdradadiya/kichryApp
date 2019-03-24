/**
 * Created by mponomarets on 7/24/17.
 */
import {
	START_LOAD_DATA,
	LOAD_UPCOMING_MEAL_SUCCESS,
	LOAD_UPCOMING_MEAL_FAIL,
	LOAD_REVIEW_MEAL_LIST_SUCCESS,
	LOAD_REVIEW_MEAL_LIST_FAIL,
	LOAD_MEASUREMENT_FAIL,
	RESET_STATE,
	SET_CLOSE_DAYS_LIST,
	SET_SELECTED_DAY
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loadingUpcoming: true,
	loadingReviewList: true,
	loadingMeasurements: true,
	upcomingMeal: {},
	reviewMealList: [],
	allGoals: {},
	selectedDay: null
};
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_LOAD_DATA:
			return { ...state, loading: true };
		case LOAD_UPCOMING_MEAL_SUCCESS:
			return { ...state, loadingUpcoming: false, upcomingMeal: action.upcomingMeal, error: '' };
		case LOAD_UPCOMING_MEAL_FAIL:
			return { ...state, loadingUpcoming: false, error: action.error };
		case LOAD_REVIEW_MEAL_LIST_SUCCESS:
			return { ...state, loadingReviewList: false, reviewMealList: action.reviewMealList, error: '' };
		case LOAD_REVIEW_MEAL_LIST_FAIL:
			return { ...state, loadingReviewList: false, error: action.error };
		case LOAD_MEASUREMENT_FAIL:
			return { ...state, error: action.error, loadingMeasurements: false };
		case SET_SELECTED_DAY:
			return { ...state, selectedDay: action.selectedDay };
		case SET_CLOSE_DAYS_LIST:
			return { ...state, closeDaysList: action.closeDaysList };
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};