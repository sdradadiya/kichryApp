/**
 * Created by mponomarets on 6/25/17.
 */
import {
	CHANGE_ACTIVE_TAB,
    CHANGE_ACTIVE_SLIDE,
	CHANGE_ACTIVE_MEAL_ID,
	CHANGE_SCROLL_ACTIVE,
	CLOSE_ALL_SHORT_MENU,
	IS_SHORT_MENU_OPEN,
	OPEN_CLOSE_WELCOME,
	OPEN_CLOSE_ONBOARDING,
	SHOW_RELEASE_NOTES,
	CLOSE_RELEASE_NOTES,
	GET_WELCOME_SUCCESS,
	GET_WELCOME_FAIL,
	RESET_STATE,
	SHOW_TOAST,
	IS_BOTTOM_SHEET_OPEN,
	SET_ACTIVE_MEAL,
	IS_BOTTOM_SHEET_FOR_OPTION_OPEN,
	IS_BOTTOM_SHEET_FOR_OPTION_GROCERY_OPEN,
    IS_BOTTOM_SHEET_FOR_OPTION_SWAP_OPEN,
    IS_BOTTOM_SHEET_FOR_OPTION_TRACK_OPEN
} from '../actions/types';

const INITIAL_STATE = {
	title: 'Home',
	activeTabId: 0,
	activeSlideId: 0,
	isMealPlanScrollEnable: true,
	openMealId: '',
	prevID: '',
	closeAllShortMenu: false,
	isShortMenuOpen: false,
	isOnboardingOpen: false,
	isWelcomeOpen: false,
	isReleaseNotesOpen: false,
	greeting: '',
	messageToast: {},
	isBottomSheetOpen: false,
	isBottomSheetForOptionOpen: false,
	isBottomSheetForOptionGroceryOpen: false,
	activeMeal: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CHANGE_ACTIVE_TAB:
			return { ...state, activeTabId: action.activeTabId, title: action.title };
        case CHANGE_ACTIVE_SLIDE:
            return { ...state, activeSlideId: action.activeSlideId };
		case CHANGE_ACTIVE_MEAL_ID:
			return { ...state, openMealId: action.openMealId };
		case CHANGE_SCROLL_ACTIVE:
			return { ...state, isMealPlanScrollEnable: action.isMealPlanScrollEnable };
		case CLOSE_ALL_SHORT_MENU:
			return { ...state, closeAllShortMenu: action.closeAllShortMenu };
		case IS_SHORT_MENU_OPEN:
			return { ...state, isShortMenuOpen: action.isShortMenuOpen };
		case OPEN_CLOSE_WELCOME:
			return { ...state, isWelcomeOpen: action.isWelcomeOpen };
		case GET_WELCOME_SUCCESS:
			return { ...state, isWelcomeOpen: true, greeting: action.greeting };
		case GET_WELCOME_FAIL:
			return { ...state, isWelcomeOpen: false };
		case OPEN_CLOSE_ONBOARDING:
			return { ...state, isOnboardingOpen: action.isOnboardingOpen };
		case CLOSE_RELEASE_NOTES:
			return { ...state, isReleaseNotesOpen: action.isReleaseNotesOpen }; 
		case SHOW_RELEASE_NOTES:
			return { ...state, isReleaseNotesOpen: action.isReleaseNotesOpen };
		case SHOW_TOAST:
			return { ...state, messageToast: action.messageToast };
		case IS_BOTTOM_SHEET_OPEN:
			return { ...state, isBottomSheetOpen: action.isBottomSheetOpen };
		case IS_BOTTOM_SHEET_FOR_OPTION_OPEN:
			return { ...state, isBottomSheetForOptionOpen: action.isBottomSheetForOptionOpen };
		case IS_BOTTOM_SHEET_FOR_OPTION_GROCERY_OPEN:
			return { ...state, isBottomSheetForOptionGroceryOpen: action.isBottomSheetForOptionGroceryOpen };
        case IS_BOTTOM_SHEET_FOR_OPTION_SWAP_OPEN:
            return { ...state, isBottomSheetForOptionSwapOpen: action.isBottomSheetForOptionSwapOpen };
        case IS_BOTTOM_SHEET_FOR_OPTION_TRACK_OPEN:
            return { ...state, isBottomSheetForOptionTrackOpen: action.isBottomSheetForOptionTrackOpen };
		case SET_ACTIVE_MEAL:
			return { ...state, activeMeal: action.activeMeal };
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};