/**
 * Created by mponomarets on 7/4/17.
 */
import {
	CHANGE_ACTIVE_TAB,
    CHANGE_ACTIVE_SLIDE,
	CHANGE_ACTIVE_MEAL_ID,
	CHANGE_SCROLL_ACTIVE,
	CLOSE_ALL_SHORT_MENU,
	IS_BOTTOM_SHEET_OPEN,
	SET_ACTIVE_MEAL,
	IS_BOTTOM_SHEET_FOR_OPTION_OPEN,
	IS_BOTTOM_SHEET_FOR_OPTION_GROCERY_OPEN,
	IS_BOTTOM_SHEET_FOR_OPTION_SWAP_OPEN,
	IS_BOTTOM_SHEET_FOR_OPTION_TRACK_OPEN,
	TRACK_CHECLIST_ERROR_CLEAN
} from './types';

export const changeActiveTab = (id, title) => {
	return dispatch => dispatch({ type: CHANGE_ACTIVE_TAB, activeTabId: id, title: title });
};

export const changeActiveSlide = (id) => {
    return dispatch => dispatch({ type: CHANGE_ACTIVE_SLIDE, activeSlideId: id });
};

export const changeMealOpenId = (id) => {
	return dispatch => dispatch({ type: CHANGE_ACTIVE_MEAL_ID, openMealId: id });
};

export const changeActiveScroll = (scroll) => {
	return dispatch => dispatch({ type: CHANGE_SCROLL_ACTIVE, isMealPlanScrollEnable: scroll });
};

export const closeAllMenu = (status) => {
	return dispatch => dispatch({ type: CLOSE_ALL_SHORT_MENU, closeAllShortMenu: status });
};
export const toggleBottomSheetMenu = (status) => {
	return dispatch => dispatch({ type: IS_BOTTOM_SHEET_OPEN, isBottomSheetOpen: status });

};
export const toggleBottomSheetMenuForOption = (status) => {
	return (dispatch, getState) => {
		if(getState().main.isBottomSheetForOptionOpen !== status) {
			dispatch({ type: IS_BOTTOM_SHEET_FOR_OPTION_OPEN, isBottomSheetForOptionOpen: status });
		}
	};
   // return dispatch => dispatch({ type: IS_BOTTOM_SHEET_FOR_OPTION_OPEN, isBottomSheetForOptionOpen: status });
};

export const toggleBottomSheetMenuForGroceryOption = (status) => {
	return (dispatch, getState) => {
		if (getState().main.isBottomSheetForOptionGroceryOpen !== status) {
			dispatch({type: IS_BOTTOM_SHEET_FOR_OPTION_GROCERY_OPEN, isBottomSheetForOptionGroceryOpen: status});
		}
	};
	//return dispatch => dispatch({ type: IS_BOTTOM_SHEET_FOR_OPTION_GROCERY_OPEN, isBottomSheetForOptionGroceryOpen: status });

};

export const toggleBottomSheetMenuForSwapOption = (status) => {
	return (dispatch, getState) => {
		if (getState().main.isBottomSheetForOptionSwapOpen !== status) {
			dispatch({type: IS_BOTTOM_SHEET_FOR_OPTION_SWAP_OPEN, isBottomSheetForOptionSwapOpen: status});
		}
	};
	//return dispatch => dispatch({ type: IS_BOTTOM_SHEET_FOR_OPTION_SWAP_OPEN, isBottomSheetForOptionSwapOpen: status });
};

export const toggleBottomSheetMenuForTrackOption = (status) => {
	return (dispatch, getState) => {
		if (getState().main.isBottomSheetForOptionTrackOpen !== status) {
			dispatch({type: IS_BOTTOM_SHEET_FOR_OPTION_TRACK_OPEN, isBottomSheetForOptionTrackOpen: status});
		}
	};
	// return dispatch => dispatch({ type: IS_BOTTOM_SHEET_FOR_OPTION_TRACK_OPEN, isBottomSheetForOptionTrackOpen: status });
};

export const setActiveMeal = (activeMeal) => {
	return dispatch => {dispatch({ type: SET_ACTIVE_MEAL, activeMeal: activeMeal });};
};

export const clearError = () => {
	return dispatch => {
		dispatch({ type: TRACK_CHECLIST_ERROR_CLEAN });
	};
		
};



