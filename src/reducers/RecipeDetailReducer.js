/**
 * Created by mponomarets on 7/23/17.
 */
import {
	START_LOAD_RECIPE,
	LOAD_RECIPE_SUCCESS,
	LOAD_RECIPE_FAIL,
	SEND_CONFIRM,
	SEND_CONFIRM_SUCCESS,
	SEND_CONFIRM_FAIL,
	ADD_SUCCESS,
	ADD_FAIL,
	SWAP_SUCCESS,
	RESET_STATE,
	SET_WARNINGS,
	SWAP_FAIL,
	PIN_BUTTON_PRESS,
	PINNED_SUCCESS,
	PIN_FAIL,
	LOAD_RECIPE_FROM_CHAT
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: false,
	recipe: {},
	ndb: [],
	recipeImg: '',
	recipePhoto: '',
	isConfirmed: null,
	showTab: false,
	confirm: false,
	planId: -1,
	planMealType: '',
	warnings: null,
	buttonProcessed: false,
	is_pinned: null,
	loadRecipeFromChat: false
};
export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case START_LOAD_RECIPE:
			return {...state, loading: true, error: ''};
		case LOAD_RECIPE_SUCCESS:
			return {
				...state,
				loading: false,
				recipe: action.recipe,
				ndb: action.ndb,
				recipeImg: action.recipeImg,
				recipePhoto: action.recipePhoto,
				isConfirmed: action.isConfirmed,
				showTab: action.showTab,
				error: '',
				planId: action.planId, //it's no longer messed like that
				planMealType: action.planMealType //it's no longer messed like that
			};
		case LOAD_RECIPE_FAIL:
			return {...state, loading: false, error: action.error};
		case SEND_CONFIRM:
			return {...state, confirm: true, error: ''};
		case SEND_CONFIRM_SUCCESS:
			return {...state, confirm: false, error: ''};
		case SEND_CONFIRM_FAIL:
			return {...state, confirm: false, error: action.error};
		case ADD_SUCCESS:
			return {...state, loading: false, error: ''};
		case ADD_FAIL:
			return {...state, loading: false, error: action.error, warnings: null};
		case SWAP_SUCCESS:
			return {...state, loading: false, error: ''};
		case SWAP_FAIL:
			return {...state, loading: false, error: action.error, warnings: null};
		case SET_WARNINGS:
			return {...state, warnings: action.warnings, error: action.error};
		case PIN_BUTTON_PRESS:
			return {...state, buttonProcessed: true};
		case PINNED_SUCCESS:
			return {...state, buttonProcessed: false, is_pinned: action.is_pinned};
		case PIN_FAIL: 
			return {...state, buttonProcessed: false, is_pinned: action.is_pinned};
		case LOAD_RECIPE_FROM_CHAT:
			return {...state, loadRecipeFromChat: action.open };
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};
