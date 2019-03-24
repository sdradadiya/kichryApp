import {
	START_SEARCH,
	CONTINUE_SEARCH,
	SEARCH_SUCCESS,
	SEARCH_FAIL,
	LOAD_RECIPE_BOOK,
	LOAD_RECIPE_BOOK_SUCCESS,
	DELETE_RECIPE,
	DELETE_RECIPE_SUCCESS,
	DELETE_RECIPE_FAIL,
	LOAD_RECIPE_FOR_EDITING,
	LOAD_RECIPE_FOR_EDITING_SUCCESS,
	LOAD_RECIPE_FOR_EDITING_FAIL,
	SET_LOCK_TAB
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: true,
	pages: 0,
	searchResult: [],
	lockTab: []
};

export default (state = INITIAL_STATE, action) => {
	switch(action.type) {
		case LOAD_RECIPE_BOOK:
			return {...state, loading: true};
		case LOAD_RECIPE_BOOK_SUCCESS:
			return {...state, loading: false, recents: action.recents, myMeals: action.myMeals, favorites: action.favorites};
		case START_SEARCH:
			return {...state, loading: true, searchResult: action.searchResult};
		case CONTINUE_SEARCH:
			return {...state, loading: true};
		case SEARCH_SUCCESS:
			return {
				...state,
				searchResult: action.searchResult,
				loading: false,
				error: '',
				pages: action.pages
			};
		case SEARCH_FAIL:
			return {...state, loading: false, error: action.error};
		case DELETE_RECIPE:
			return {...state, loading: true};
		case DELETE_RECIPE_SUCCESS:
			return {...state, loading: false, error: ''};
		case DELETE_RECIPE_FAIL:
			return {...state, loading: false, error: action.error};
		case LOAD_RECIPE_FOR_EDITING:
			return {...state, loading: true, error: '' };
		case LOAD_RECIPE_FOR_EDITING_SUCCESS:
			return {...state, loading: false, error: '', editRecipe: { recipe: action.recipe, ndb: action.ndb, nutrition: action.nutrition } };
		case LOAD_RECIPE_FOR_EDITING_FAIL:
			return {...state, loading: false, error: action.error};
		case SET_LOCK_TAB:
			return {...state, lockTab: action.lockTab};
		default:
			return state;

	}

};
