/**
 * Created by mponomarets on 7/4/17.
 */
import {
	MEAL_PLAN_GET_FAIL,
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
	LOAD_NUTRITION,
	NUTRITION_FAIL,
	NUTRITION_SUCCESS,
	SET_UPC_DATA,
	REMOVE_DIET_RESTRICTION,
	GET_MEAL_PLAN_NOTES_SUCCESS,
	SET_DIET_RESTRICTION,
	SET_NUTRITION_TARGETS,
	EDIT_INGREDIENT,
	LOAD_INGREDIENT_SUGGESTIONS,
	LOAD_INGREDIENT_SUGGESTIONS_SUCCESS,
	LOAD_INGREDIENT_SUGGESTIONS_FAIL,
	VERIFY_UNITS,
	VERIFY_UNITS_SUCCESS,
	VERIFY_UNITS_SUGGESTIONS,
	VERIFY_UNITS_FAIL,
	CHANGE_ACTIVE_TAB,
	SET_TAB_FOR_MEALPlANSCREEN,
	SEARCH_SUCCESS,
	SET_NUTRITION_REMAIN,
	SHOW_TOAST
} from './types';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
	HOST,
	timeoutMessage,
	getAuthString,
	getAuthParams,
	clearAsyncStorage,
	prettyDate
} from './const';
import { sendRequest, createOptions, createJson } from './http';
import { Crashlytics } from 'react-native-fabric';
import { isEmpty } from 'lodash';
import moment from 'moment';

const getUtcOffset = () => {
	return -1 * new Date().getTimezoneOffset() / 60;
};

export const setTabForMealPlanScreen = tab => dispatch => {
	dispatch({
		type: SET_TAB_FOR_MEALPlANSCREEN,
		tab
	});
};

export const setUPCData = data => dispatch =>
	dispatch({ type: SET_UPC_DATA, upcData: data });

const loadingMealFail = (dispatch, message) =>
	dispatch({
		type: MEAL_PLAN_GET_FAIL,
		error: message || ''
	});

const savingMealFail = (dispatch, message) =>
	dispatch({
		type: MEAL_SAVE_FAIL,
		error: message || ''
	});

export const changeDate = date => dispatch =>
	dispatch({
		type: CHANGE_CURRENT_DATE_IN_MEAL_PLAN,
		date: date
	});

const loadingMealByDateSuccess = (dispatch, meals, date) =>
	dispatch({
		type: MEAL_PLAN_GET_BY_DATE_SUCCESS,
		meals,
		date
	});

const loadingMealNotesSuccess = (dispatch, mealNotes) =>
	dispatch({
		type: GET_MEAL_PLAN_NOTES_SUCCESS,
		mealNotes
	});

const loadingMealDietSuccess = (dispatch, { diet }) => {
	const {
		day_calorie_cap,
		day_calorie_floor,
		day_carbohydrate_cap,
		day_carbohydrate_floor,
		day_fat_cap,
		day_fat_floor,
		day_fiber_cap,
		day_fiber_floor,
		day_potassium_cap,
		day_potassium_floor,
		day_phosphorus_cap,
		day_phosphorus_floor,
		day_protein_cap,
		day_protein_floor,
		day_sodium_cap,
		day_sodium_floor,
		day_sugar_cap,
		day_sugar_floor,
		restrictions = ''
	} = diet;
	dispatch({
		type: SET_DIET_RESTRICTION,
		dietRest: restrictions
			.slice(1, -1)
			.replace(/\s*,\s*/g, ',')
			.replace(/'/g, '')
			.split(',')
	});
	dispatch({
		type: SET_NUTRITION_TARGETS,
		targets: {
			day_calorie_cap,
			day_calorie_floor,
			day_carbohydrate_cap,
			day_carbohydrate_floor,
			day_fat_cap,
			day_fat_floor,
			day_fiber_cap,
			day_fiber_floor,
			day_potassium_cap,
			day_potassium_floor,
			day_phosphorus_cap,
			day_phosphorus_floor,
			day_protein_cap,
			day_protein_floor,
			day_sodium_cap,
			day_sodium_floor,
			day_sugar_cap,
			day_sugar_floor
		}
	});
};

const saveMealSuccess = dispatch => dispatch({ type: MEAL_SAVE_SUCCESS });

export const removeDietRestrictions = () => dispatch =>
	dispatch({ type: REMOVE_DIET_RESTRICTION });

export const getMealPlan = () => (dispatch, getState) => {
	dispatch({ type: MEAL_PLAN_START_LOAD });

	const date = getState().mealPlan.currentDateMealPlan;
	const diet = getState().auth.diet;

	// in case not diet
	if(Object.keys(diet).length !== 0) {

		return getAuthString().then(authString => {
			const urlMealplan = HOST + 'api/v2/mobile/mealplan';
			const bodyMealplan = authString + '&date=' + encodeURIComponent(date);

			const urlMealplanNotes = HOST + 'api/v2/mobile/mealplan/notes';
			const bodyMealplanNotes = authString;

			const urlMealplanDiet = HOST + 'api/v2/mobile/mealplan/diet';
			const bodyMealplanDiet = authString;

			const arrRequest = [
				sendRequest(urlMealplan, createOptions('POST', bodyMealplan)),
				sendRequest(urlMealplanNotes, createOptions('POST', bodyMealplanNotes)),
				sendRequest(urlMealplanDiet, createOptions('POST', bodyMealplanDiet))
			];

			Crashlytics.log('attempting to send request with sendRequest()');
			return Promise.all(arrRequest)
				.then(result => {

					let success = true;

					for (let i = 0; i < result.length; i++) {
						if (result[i].status !== 'success') {

							success = false;
						}
					}

					if (success) {
						Promise.all([
							loadingMealByDateSuccess(dispatch, result[0], date),
                        	loadingMealNotesSuccess(dispatch, result[1]),
                        	loadingMealDietSuccess(dispatch, result[2])
						]).then(res=>{
							return Promise.resolve(true);
						});

					} else {
						processResponse(dispatch, result, loadingMealFail);
					}


				})
				.catch(error => {
					Crashlytics.log(error);
				});
		});

	} else {
		loadingMealFail(dispatch);
	}
};

export const replaceAssignedMealNewRecipe = ({
	planId,
	planMealType,
	title,
	ingredients,
	nutrition,
	description,
	brand,
	location,
	base64
}) => dispatch => {
	dispatch({ type: MEAL_PLAN_START_UPDATING });


	const hasIngredients = isEmpty(ingredients) ? 0 : 1;
	return getAuthParams().then(({ token, userName, version }) => {
		const url = HOST + 'api/v2/mobile/mealplan/edit/recipe/new';

		const body = {
			token,
			userName,
			version,
			planId,
			mealType: planMealType.charAt(0).toLowerCase(),
			title,
			hasIngredients,
			ingredients: hasIngredients ? ingredients : undefined,
			...nutrition,
			description,
			brand,
			location,
			image: base64,
			imageType: base64 ? 'image/jpeg' : undefined
		};
		const mealOptions = createJson('PATCH', body);
		sendRequest(url, mealOptions).then(result => {

			if (result.status === 'success') {
				saveMealSuccess(dispatch);
				Actions.main({ type: 'replace' });
			} else {
				processResponse(dispatch, result, savingMealFail);
			}
		});
	});
};

export const replaceMealNewRecipe = props => (dispatch, getState) => {
	const { planId } = props;
	const { isAssigned } = getState().mealPlan.mealPlans.mealplan.find(
		({ plan_id }) => plan_id == planId
	);


	if (isAssigned) {
		dispatch(replaceAssignedMealNewRecipe(props)).then(
			dispatch(getMealPlan())
		);
		//return Promise.resolve();
	}

	else {
		dispatch(mealDelete(planId))
			.then(dispatch(addMealNewRecipe(props)))
			.then(dispatch(getMealPlan()));
		//return Promise.resolve();
	}


};

export const addMealNewRecipe = ({
	activeTabId,
	date,
	planMealType,
	title,
	ingredients,
	nutrition,
	description,
	brand,
	location,
	base64
}) => dispatch => {
	dispatch({ type: MEAL_PLAN_START_ADD_NEW });
	const hasIngredients = isEmpty(ingredients) ? 0 : 1;
	return getAuthParams().then(({ token, userName, version }) => {
		const url = HOST + 'api/v2/mobile/mealplan/add/recipe/new';
		const body = {
			token,
			userName,
			version,
			date,
			mealType: planMealType.charAt(0).toLowerCase(),
			title,
			hasIngredients,
			ingredients: hasIngredients ? ingredients : undefined,
			...nutrition,
			description,
			brand,
			location,
			image: base64,
			imageType: base64 ? 'image/jpeg' : undefined
		};
		const mealOptions = createJson('PATCH', body);
		return sendRequest(url, mealOptions).then(result => {
			if (result.status === 'success') {
				saveMealSuccess(dispatch);

				if (activeTabId !== 0) {
					// in case add new recipe from Meal Plan screen
					return Promise.resolve();
					//Actions.main({ type: 'replace' });
				} else {
					// in case add new recipe to the current meal plan from Home screem
					dispatch({
						type: CHANGE_ACTIVE_TAB,
						activeTabId: 2,
						title: 'Meal Plan'
					});
					return Promise.resolve();
					//Actions.main({ type: 'replace' });
				}
			} else {
				if (result.status === 'fail') {
					Alert.alert('Add Failed', result.message, [
						{ text: 'OK', onPress: () => Actions.main({ type: 'replace' }) }
					]);
					dispatch({ type: MEAL_SAVE_FAIL });
					return Promise.reject();
				} else {
					processResponse(dispatch, result, savingMealFail);
				}
			}
		});
	});
};

export const editIngredient = ingredient => dispatch =>
	dispatch({ type: EDIT_INGREDIENT, ingredient });

export const loadIngredientSuggestions = query => dispatch => {
	dispatch({ type: LOAD_INGREDIENT_SUGGESTIONS });
	return getAuthString().then(authString => {
		const url = HOST + 'api/v2/mobile/recipe/ingredient/search';
		const body = authString + '&query=' + query;
		return sendRequest(url, createOptions('POST', body)).then(
			({ status, result }) => {
				status === 'success'
					? dispatch({
						type: LOAD_INGREDIENT_SUGGESTIONS_SUCCESS,
						ingredientSuggestions: result
					})
					: dispatch({
						type: LOAD_INGREDIENT_SUGGESTIONS_FAIL,
						error: 'No results found'
					});
			}
		);
	});
};


export const verifyUnit = ({ ndb, unit, quantity, name }) => dispatch => {
	dispatch({ type: VERIFY_UNITS });

	if (isNaN(quantity))
		return dispatch({
			type: VERIFY_UNITS_FAIL,
			error: 'Unparseable quantity entered'
		});

	return getAuthString().then(authString => {
		const url = HOST + 'api/v2/mobile/recipe/ingredient/nutrition';
		const body =
			authString +
			'&ndb=' + ndb +
			'&unit=' +
			encodeURIComponent(unit || '') +
			(quantity ? '&quantity=' + encodeURIComponent(quantity) : '') +
			(name ? '&name=' + encodeURIComponent(name) : '');
		return sendRequest(url, createOptions('POST', body)).then(res => {
			const { status, message, units, grams } = res;
			if (status === 'success') {
				return message == 'found'
					? dispatch({ type: VERIFY_UNITS_SUCCESS, grams })
					: dispatch({
						type: VERIFY_UNITS_SUGGESTIONS,
						unitSuggestions: units.trim().split('\n')
					});
			} else {
				return dispatch({ type: VERIFY_UNITS_FAIL, error: 'No results found' });
			}
		});
	});
};

export const loadNutritionForUPC = ({

	upc,
	add,
	replace,
	planMealType,
	scannedRecipeForBook
}) => {
	return dispatch => {
		dispatch({ type: LOAD_NUTRITION });
		return getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/mealplan/upc';
			const body = authString + '&upc=' + upc;
			const options = createOptions('POST', body);
			return sendRequest(url, options).then(barcodeResult => {
				const { status, message } = barcodeResult;

				if (status === 'success') {
					dispatch({ type: NUTRITION_SUCCESS, barcodeResult });
					return Actions.scanBarCodeResult({
						barcodeResult,
						upc,
						add,
						replace,
						planMealType,
						scannedRecipeForBook
					});
				} else {
					return dispatch({
						type: NUTRITION_FAIL,
						error: message + ': ' + upc || 'Barcode not found'
					});
				}
			});
		});
	};
};

export const mealDelete = planId => dispatch => {
	dispatch({ type: DELETE_MEAL });
	return getAuthString().then(authString => {
		const url = HOST + 'api/v2/mobile/mealplan/delete';
		const body = authString + '&planId=' + encodeURIComponent(planId);
		const mealOptions = createOptions('PATCH', body);
		return sendRequest(url, mealOptions).then(result => {
			if (result.status === 'success') {
				dispatch({ type: DELETE_MEAL_SUCCESS });
				//Actions.main({ type: 'replace' });
				return dispatch(getMealPlan());
			} else {
				Alert.alert('Failed to delete meal', null);
				dispatch({ type: DELETE_MEAL_FAIL });
			}
		});
	});
};

export const mealDeleteAndRefresh = planId => dispatch => {
	dispatch(mealDelete(planId)).then(dispatch(getMealPlan()));
};

export const replaceAssignedMealUPC = upc => (dispatch, getState) => {
	dispatch({ type: SEND_UPC });
	return getAuthString()
		.then(authString => {
			const { planId, planMealType } = getState().mealPlan.upcData;
			const url = HOST + 'api/v2/mobile/mealplan/edit/upc';
			const body =
				authString +
				'&planId=' +
				encodeURIComponent(planId) +
				'&mealType=' +
				planMealType.charAt(0).toLowerCase() +
				'&upc=' +
				upc;
			const mealOptions = createOptions('PATCH', body);

			return sendRequest(url, mealOptions);
		})
		.then(result => {
			if (result.status === 'success') {
				dispatch({ type: SEND_UPC_SUCCESS });
				Actions.main({ type: 'replace' });
			} else {
				Alert.alert('Unable to replace meal with scanned UPC', null);
				dispatch({ type: SEND_UPC_FAIL });
			}
		});
};

export const replaceMealUPC = upc => (dispatch, getState) => {

	const { upcData: { planId }, mealPlans: { mealplan } } = getState().mealPlan;
	const { isAssigned } = mealplan.find(({ plan_id }) => plan_id == planId);
	if (isAssigned)
		return dispatch(replaceAssignedMealUPC(upc)).then(dispatch(getMealPlan()));
	else
		return dispatch(mealDelete(planId))
			.then(dispatch(addMealUPC(upc)))
			.then(dispatch(getMealPlan()));
};

export const addMealUPC = (upc, activeTabId, customMealType) => (
	dispatch,
	getState
) => {
	dispatch({ type: SEND_UPC });
	getAuthString().then(authString => {
		const {
			upcData: { planMealType },
			currentDateMealPlan
		} = getState().mealPlan;
		const url = HOST + 'api/v2/mobile/mealplan/add/upc';

		let mealType =
			activeTabId !== 0
				? planMealType.charAt(0).toLowerCase()
				: customMealType.charAt(0).toLowerCase();
		let date = activeTabId !== 0 ? currentDateMealPlan : prettyDate();

		const body =
			authString + '&mealType=' + mealType + '&date=' + date + '&upc=' + upc;
		const mealOptions = createOptions('PATCH', body);

		sendRequest(url, mealOptions).then(result => {
			if (result.status === 'success') {
				dispatch({ type: SEND_UPC_SUCCESS });

				if (activeTabId !== 0) {
					// in case add new recipe from Meal Plan screen
					Actions.main({ type: 'replace' });
				} else {
					// in case add new recipe to the current meal plan from Home screem
					dispatch({
						type: CHANGE_ACTIVE_TAB,
						activeTabId: 2,
						title: 'Meal Plan'
					});
					Actions.main({ type: 'replace' });
				}
			} else {
				if (result.status === 'fail') {
					Alert.alert('Add Failed', result.message, [
						{ text: 'OK', onPress: () => Actions.main({ type: 'replace' }) }
					]);
					dispatch({ type: SEND_UPC_FAIL });
				} else {
					Alert.alert('Unable to add meal from scanned UPC', null);
					dispatch({ type: SEND_UPC_FAIL });
				}
			}
		});
	});
};

export const regeneratePlan = () => (dispatch, getState) => {

	dispatch({ type: MEAL_PLAN_START_LOAD });

	const date = moment(getState().mealPlan.currentDateMealPlan, 'MMDDYYYY').format('YYYY-MM-DD');
	
	return getAuthParams().then(({ token, userName, version }) => {

		const url = HOST + 'api/v2/mobile/mealplan/regenerate';
		
		const body = {
			token,
			userName,
			v: version,
			date,
			utcOffsetHours: getUtcOffset()
		};

		const referOptions = createJson('POST', body);

		sendRequest(url, referOptions).then(result => {
			if(result.status === 'success') {
				dispatch(getMealPlan());
			} else {
				
				dispatch({
					type: SHOW_TOAST,
					messageToast: {
						text: result.message,
						placeToShow: 'mealPlan'
					}
				});
				dispatch(getMealPlan());
			}
			
		});

	});

};

export const setNutritionRemain = (nutrition) => (dispatch) => {
	dispatch({ type: SET_NUTRITION_REMAIN, remain: nutrition });
};


const processResponse = (dispatch, response, onFail) => {
	switch (response.status) {
		case 'timeout':
			return onFail(dispatch, timeoutMessage);
		case 'clientError':
			return onFail(dispatch, 'Client error');
		case 'unauthorized':
			clearAsyncStorage();
			Actions.auth({ type: 'replace' });
			return onFail(dispatch);
		case 'serverError':
			return onFail(dispatch, 'Sorry, your request could not be processed');
		case 'fail':
		default:
			return onFail(dispatch, 'Unknown error');
	}
};
