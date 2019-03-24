/**
 * Created by mponomarets on 7/4/17.
 */
import {
	MEAL_PLAN_GET_FAIL,
	MEAL_PLAN_GET_SUCCESS,
	MEAL_PLAN_START_LOAD,
	CHANGE_CURRENT_DATE_IN_MEAL_PLAN,
	MEAL_PLAN_GET_BY_DATE_SUCCESS,
	MEAL_PLAN_START_UPDATING,
	MEAL_PLAN_START_ADD_NEW,
	MEAL_SAVE_SUCCESS,
	MEAL_SAVE_FAIL,
	SEND_UPC,
	SEND_UPC_FAIL,
	SEND_UPC_SUCCESS,
	DELETE_MEAL,
	DELETE_MEAL_SUCCESS,
	DELETE_MEAL_FAIL,
	RESET_STATE,
	NUTRITION_SUCCESS,
	SET_UPC_DATA,
	LOAD_NUTRITION,
	NUTRITION_FAIL,
	GET_MEAL_PLAN_NOTES_SUCCESS,
	EDIT_INGREDIENT,
	LOAD_INGREDIENT_SUGGESTIONS,
	LOAD_INGREDIENT_SUGGESTIONS_SUCCESS,
	LOAD_INGREDIENT_SUGGESTIONS_FAIL,
	VERIFY_UNITS,
	VERIFY_UNITS_SUCCESS,
	VERIFY_UNITS_SUGGESTIONS,
	VERIFY_UNITS_FAIL,
	START_ADD_NEW_CASTOM_RECIPE,
	ADD_NEW_CASTOM_RECIPE_FAIL,
	SET_NUTRITION_TARGETS,
	GET_MEAL_PLAN_FOR_HOMESCREEN_SUCCESS,
	UPDATE_SERVINGS_IN_STATE,
	SET_TAB_FOR_MEALPlANSCREEN,
    SET_NUTRITION_REMAIN
} from '../actions/types';

const INITIAL_STATE = {
	error: '',
	loading: false,
	mealPlans: {},
	currentDateMealPlan: '',
	sendingUPC: false,
	upcData: {},
	barcodeResult: {},
	loader: false,
	nutrition_targets: {},
	mealNotes: {},
    nutrition_remain: {},
	preferredServingSize: 1,
	tab: 'Meals'
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case MEAL_PLAN_START_LOAD:
			return {...state, loading: true, error: ''};
		case MEAL_PLAN_GET_SUCCESS:
			return {...state, error: '', loading: false, mealPlans: action.payload};
		case MEAL_PLAN_GET_BY_DATE_SUCCESS:
			return {...state, error: '', loading: false, mealPlans: action.meals, currentDate: action.date, preferredServingSize: action.meals.preferredServingSize};
		case GET_MEAL_PLAN_FOR_HOMESCREEN_SUCCESS:
			return {...state, mealPlans: action.meals, preferredServingSize: action.meals.preferredServingSize};
		case MEAL_PLAN_GET_FAIL:
			return {...state, error: action.error, loading: false};
		case CHANGE_CURRENT_DATE_IN_MEAL_PLAN:
			return {...state, currentDateMealPlan: action.date};
		case MEAL_PLAN_START_UPDATING:
			return {...state, loading: true, error: ''};
		case MEAL_PLAN_START_ADD_NEW:
			return {...state, loading: true, error: ''};
		case MEAL_SAVE_SUCCESS:
			return {...state, loading: false, error: ''};
		case MEAL_SAVE_FAIL:
			return {...state, loading: false, error: action.error};
		case DELETE_MEAL:
			return {...state, loading: true, error: ''};
		case DELETE_MEAL_SUCCESS:
			return {...state, loading: false, error: ''};
		case DELETE_MEAL_FAIL:
			return {...state, loading: false, error: action.error};
		case START_ADD_NEW_CASTOM_RECIPE:
			return {...state, loading: true, error: ''};
		case ADD_NEW_CASTOM_RECIPE_FAIL:
			return {...state, loading: false, error: action.error};
		case SEND_UPC:
			return {...state, sendingUPC: true, error: '', loading: true};
		case SET_UPC_DATA:
			return {...state, upcData: action.upcData};
		case LOAD_NUTRITION:
			return {...state, error: '', loading: true};
		case SEND_UPC_SUCCESS:
			return {...state, sendingUPC: false, error: '', loading: false};
		case SEND_UPC_FAIL:
			return {...state, sendingUPC: false, error: action.error, loading: false, barcodeResult: {}};
		case NUTRITION_SUCCESS:
			return {...state, loading: false, error: '', barcodeResult: action.barcodeResult, loader: false};
		case NUTRITION_FAIL:
			return {...state, loading: false, error: action.error, barcodeResult: {}};
		case GET_MEAL_PLAN_NOTES_SUCCESS:
			return {...state, error: '', loading: false, mealNotes: action.mealNotes};
		case EDIT_INGREDIENT:
			return { ...state, editIngredient: action.ingredient, grams: action.ingredient && action.ingredient.grams, ingredientSuggestions: [] };
		case LOAD_INGREDIENT_SUGGESTIONS:
			return {...state, error: '', loadingIngredientSuggestions: true, ingredientSuggestions: []};
		case LOAD_INGREDIENT_SUGGESTIONS_SUCCESS:
			return {...state, error: '', loadingIngredientSuggestions: false, ingredientSuggestions: action.ingredientSuggestions};
		case LOAD_INGREDIENT_SUGGESTIONS_FAIL:
			return {...state, error: action.error, loadingIngredientSuggestions: false, ingredientSuggestions: []};
		case VERIFY_UNITS:
			return {...state, error: '', verifyingUnits: true, unitSuggestions: []};
		case VERIFY_UNITS_SUCCESS:
			return {...state, error: '', verifyingUnits: false, unitSuggestions: [], grams: action.grams};
		case VERIFY_UNITS_SUGGESTIONS:
			return {...state, error: '', verifyingUnits: false, unitSuggestions: action.unitSuggestions, grams: undefined};
		case VERIFY_UNITS_FAIL:
			return {...state, error: action.error, verifyingUnits: false, unitSuggestions: [], grams: undefined};
		case SET_NUTRITION_TARGETS:
			return { ...state, nutrition_targets: action.targets };
		case UPDATE_SERVINGS_IN_STATE:
			return { ...state, preferredServingSize: action.numServings };
		case SET_TAB_FOR_MEALPlANSCREEN:
			return { ...state, tab: action.tab };
        case SET_NUTRITION_REMAIN:
            return { ...state, nutrition_remain: action.remain };
		case RESET_STATE:
			return INITIAL_STATE;
		default:
			return state;
	}
};
