/**
 * Created by mponomarets on 7/23/17.
 */
import {
	START_LOAD_RECIPE,
	LOAD_RECIPE_SUCCESS,
	LOAD_RECIPE_FAIL,
	LOAD_RECIPE_FOR_EDITING,
	LOAD_RECIPE_FOR_EDITING_SUCCESS,
	LOAD_RECIPE_FOR_EDITING_FAIL,
	SEND_CONFIRM,
	SEND_CONFIRM_SUCCESS,
	SEND_CONFIRM_FAIL,
	LOAD_REVIEW_MEAL_LIST_SUCCESS,
	START_LOAD_DATA,
	SET_WARNINGS,
	ADD_SUCCESS,
	ADD_FAIL,
	SWAP_SUCCESS,
	SWAP_FAIL,
	SHOW_TOAST,
	LOAD_MY_POINTS_SUCCESS,
	CHANGE_ACTIVE_TAB,
	LOAD_RECIPE_FROM_CHAT
} from './types';
import { Platform, Alert } from 'react-native';
import {
	HOST,
	clearAsyncStorage,
	getAuthParams,
	getAuthString,
	sumPointsOfEvents,
	prettyDate,
	timeoutMessage,
	utcOffsetHours,
	scaledRecipeServingSize,
	scaledIngredientsServingSize,
	ndbToNewObject
} from './const';
import { getMealPlan, mealDelete } from './MealPlanActions';
import { Actions } from 'react-native-router-flux';
import { sendRequest, createOptions, createJson } from './http';
import { Crashlytics } from 'react-native-fabric';
import { sumNutritionToString } from './const';

const loadingRecipeSuccess = (dispatch, {
	recipe,
	ndb,
	servings,
	recipeImg,
	recipePhoto,
	isConfirmed,
	showTab = false,
	add = false,
	replace = false,
	planId = -1,
	planMealType = 'none'
}) => {
	dispatch({
		type: LOAD_RECIPE_SUCCESS,
		recipe,
		ndb,
		recipeImg,
		recipePhoto,
		isConfirmed,
		showTab,
		planId,
		planMealType
	});
	Actions.recipeDetail({ add, replace, servings });
};

export const changeMealList = id => {
	return (dispatch, getState) => {
		const { reviewMealList } = getState().home;
		for (let i = 0; i < reviewMealList.length; i++) {
			if (reviewMealList[i].plan_id === id) {
				reviewMealList.splice(i, 1);
				changeList(dispatch, reviewMealList);
			}
		}
	};
};

const changeList = (dispatch, list) => {
	dispatch({
		type: LOAD_REVIEW_MEAL_LIST_SUCCESS,
		reviewMealList: [...list]
	});
};

export const openRecipeFromChat = (open) => {
	return dispatch => {
		dispatch({
			type: LOAD_RECIPE_FROM_CHAT,
			open
		});
	};
};

export const openRecipe = (recipe, recipeImg) => {
	return dispatch =>
		loadingRecipeSuccess(dispatch, { recipe, recipeImg, showTab: true });
};

const loadingRecipeFail = (dispatch, error) => {
	dispatch({
		type: LOAD_RECIPE_FAIL,
		error: error
	});
};

const addFail = (dispatch, error) => {
	dispatch({
		type: ADD_FAIL,
		error
	});
};

const swapSuccess = dispatch => {
	dispatch({
		type: SWAP_SUCCESS
	});
	//Actions.main({ type: 'replace' });
};

const swapFail = (dispatch, error) => {
	dispatch({
		type: SWAP_FAIL,
		error
	});
};

export const getRecipeById = (id, servings, {
	recipeImg,
	recipePhoto,
	isConfirmed,
	add,
	replace,
	isFromCustom = false,
	planId = -1,
	planMealType = 'none'
}) => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('getRecipeById() in RecipeDetailActions.js');

	return dispatch => {
		
		dispatch({ type: START_LOAD_RECIPE });

		getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/recipe';
			const body = authString + '&recipeId=' + id;

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(body));

			Crashlytics.log('attempting to send request with sendRequest()');

			sendRequest(url, createOptions('POST', body)).then(result => {
				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {

					if (isFromCustom) {
						return Actions.editMeal({ meal: result, planId, planMealType });
					}

					Crashlytics.log('calling loadingRecipeSuccess()');

					loadingRecipeSuccess(dispatch, {
						recipe: scaledRecipeServingSize(result.recipe, servings),
						// in this case preferredServingSize is going from recipe object, to display ingredients at recipeDetail screen equal to preferredServingSize
						ndb: scaledIngredientsServingSize(result.ndb, result.recipe.total_servings, result.preferredServingSize, servings),
						servings,
						recipeImg,
						recipePhoto,
						isConfirmed,
						add,
						replace,
						planId,
						planMealType
					});
				} else {
					Crashlytics.log('calling processResponse()');

					processResponse(dispatch, result, loadingRecipeFail);
				}
			});
		});
	};
};

export const getRecipeByIdForEditing = (recipeId, servings)=> dispatch => {
	dispatch({ type: LOAD_RECIPE_FOR_EDITING });

	return getAuthString().then(authString => {

		const url = HOST + 'api/v2/mobile/recipe';
		const body = authString + '&recipeId=' + recipeId;
		return sendRequest(url, createOptions('POST', body));

	}).then(result => {

		if (result.status === 'success') {
			
			// in this case preferredServingSize is always equal 1, to display ingredients at MealDetail screen for 1 serving 
			let ndb = scaledIngredientsServingSize(result.ndb, result.recipe.total_servings, 1, servings ? servings : 1);

			let nutrition = ndb.map(({name, ndb, qty, qty_g, unit, usda, base}) => ({
				name: name || base,
				ndb,
				quantity: qty,
				grams: qty_g,
				unit,
				nutrition: usda
			})); 

			dispatch({
				type: LOAD_RECIPE_FOR_EDITING_SUCCESS,
				recipe: scaledRecipeServingSize(result.recipe, servings),
				ndb,
				nutrition: sumNutritionToString(nutrition, 1) // at this point nutrition is already
			});
			return recipeId;
		} else {
			dispatch({ type: LOAD_RECIPE_FOR_EDITING_FAIL, error: result.message });
		}

	});
};

export const createEmptyEditRecipe = recipe => dispatch => {

	dispatch({
		type: LOAD_RECIPE_FOR_EDITING_SUCCESS,
		recipe: recipe,
		ndb: []
	});

};

export const addIngredientToEditRecipe = ndb => (dispatch, getState) => {

	dispatch({ type: LOAD_RECIPE_FOR_EDITING });
	
	const pre_ndb = getState().recipeBook.editRecipe.ndb;
	const recipe = getState().recipeBook.editRecipe.recipe;
	// to correctly calculate value we need to convert object to similar that we use in MealDetail.js
	let new_ndb = ndbToNewObject(pre_ndb.concat(ndb));

	dispatch({
		type: LOAD_RECIPE_FOR_EDITING_SUCCESS,
		recipe: recipe,
		ndb: new_ndb,
		nutrition: sumNutritionToString(new_ndb, 1) // should be 1 now
	});
	
};

export const updateIngredientToEditRecipe = ingredient => (dispatch, getState) => {

	dispatch({ type: LOAD_RECIPE_FOR_EDITING });
	const recipe = getState().recipeBook.editRecipe.recipe;

	dispatch({
		type: LOAD_RECIPE_FOR_EDITING_SUCCESS,
		recipe: recipe,
		ndb: ingredient,
		nutrition: sumNutritionToString(ingredient, 1)
	});

};

export const replaceAssignedMealExistingRecipe = ({ recipeId, planId, mealType }) => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('replaceAssignedMealExistingRecipe() in RecipeDetailActions.js');
	return dispatch => {
		return getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/mealplan/edit/recipe/existing';

			const body = authString +
				'&mealType=' + mealType.charAt(0).toLowerCase() +
				'&recipeId=' + recipeId +
				'&planId=' + encodeURIComponent(planId);

			const swapOptions = createOptions('PATCH', body);

			Crashlytics.log(JSON.stringify(url));
			Crashlytics.log(JSON.stringify(swapOptions));
			Crashlytics.log('attempting to send request with sendRequest()');
			return sendRequest(url, swapOptions).then(result => {
				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));

				if (result.status === 'success') {
					Crashlytics.log('calling swapSuccess()');
					return swapSuccess(dispatch);
				} else {
					Crashlytics.log('calling processResponse()');
					return processResponse(dispatch, result, swapFail);
				}
			});
		});
	};
};

export const replaceMealExistingRecipe = (props) => {
	const { planId } = props;
	return (dispatch, getState) => {
		const { isAssigned } = getState().mealPlan.mealPlans.mealplan.find(
			({ plan_id }) => plan_id == planId
		);
		if (isAssigned) {
			return dispatch(replaceAssignedMealExistingRecipe(props))
				.then(() => {
					 return dispatch(getMealPlan());
				}).then(res=>{

                	return Promise.resolve(true);
				}).catch(err=>{
					return Promise.reject(true);
				});
		} else {
			return dispatch(mealDelete(planId))
				.then(() => {
					return dispatch(addMealExistingRecipe(props));
				})
				.then(() => {
					 return dispatch(getMealPlan());
				}).then(res=>{

					return Promise.resolve(true);
				}).catch(err=>{
					return Promise.reject(true);
				});
		}
	};
};

export const addMealExistingRecipe = ({ recipeId, mealType, date, activeTabId }) => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('addMealExistingRecipe() in RecipeDetailActions.js');
	return dispatch => {
		return getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/mealplan/add/recipe/existing';
			// adjust the date if user add existing recipe through '+' button (HomeSreen).
			let necessaryDate = activeTabId !== 0 ? date : prettyDate();

			const body = authString +
				'&mealType=' + mealType.charAt(0).toLowerCase() +
				'&date=' + necessaryDate +
				'&recipeId=' + recipeId;
			const options = createOptions('PATCH', body);

			 return sendRequest(url, options).then(result => {
				if (result.status === 'success') {

					dispatch({ type: ADD_SUCCESS });

					if(activeTabId !== 0) {
						return Promise.resolve('true');
						//Actions.main({ type: 'replace' });
					} else {
						dispatch({ type: CHANGE_ACTIVE_TAB, activeTabId: 2, title: 'Meal Plan' });
						return Promise.resolve('true');
						//Actions.main({ type: 'replace' });
					}

				} else {

					if(result.status === 'fail') {
						Alert.alert('Add Failed', result.message, [
							{text: 'OK', onPress: () => Actions.main({ type: 'replace' })}
						]);
						dispatch({ type: ADD_FAIL });
					} else {
						processResponse(dispatch, result, addFail);
					}
					
				}
			});
		});
	};
};

export const sendConfirm = (
	planId,
	liked,
	isConfirm,
	isAssigned,
	comment,
	id,
	base64,
	single = false
) => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('sendConfirm() in RecipeDetailActions.js');
	return (dispatch, getState) => {
		let list = getState().home.reviewMealList;
		const { showPoints } = getState().clientPermissions;
		const { sumAllPoints } = getState().pointsAwards;
		let next = false;
		if (list.length > 1) {
			for (let i = 0; i < list.length; i++) {
				if (list[i].id === id) {
					if (i + 1 < list.length && list.length > 1) {
						next = list[i + 1];
					} else {
						next = list[0];
					}
					list.splice(i, 1);
					dispatch({ type: LOAD_REVIEW_MEAL_LIST_SUCCESS, reviewMealList: [...list] });
				}
			}
		}

		Crashlytics.log('dispatching');

		dispatch({ type: SEND_CONFIRM });
		dispatch({ type: START_LOAD_DATA });

		Crashlytics.log('dispatched');
		getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/mealplan/review';

			let body = authString +
				'&utcOffsetHours=' + utcOffsetHours +
				'&planId=' + planId +
				'&isAssigned=' + +isAssigned;


			if (isConfirm === 0 || isConfirm === 1) {
				body += '&isConfirmed=' + isConfirm;
			}
			if (liked === 0 || liked === 1) {
				body += '&isLiked=' + liked;
			}
			if (base64.length > 0) {
				body += '&image=' + encodeURIComponent(base64) + '&imageType=image/jpeg';
			}
			body += '&comment=' + encodeURIComponent(comment.trim());
			// Crashlytics.log(JSON.stringify(url));
			// Crashlytics.log(JSON.stringify(body));
			Crashlytics.log('attempting to send request with sendRequest()');
			sendRequest(url, createOptions('PATCH', body)).then(result => {
				Crashlytics.log('response received');
				//	Crashlytics.log(JSON.stringify(result));
				if (result.status === 'success') {
					const res = sumPointsOfEvents(result.events);
					Crashlytics.log('calling sendConfirmSuccess()');
					if (next) {
						dispatch({
							type: LOAD_RECIPE_SUCCESS,
							recipe: { recipe: next },
							recipeImg: next.image,
							showTab: true
						});
					} else {
						sendConfirmSuccess(dispatch);
					}
					if (showPoints) {
						const text = 'Congratulations! You just earned ' + res + ' award points.';
						if (single) {
							dispatch({ type: SHOW_TOAST, messageToast: { text, placeToShow: 'main' } });
						} else {
							dispatch({ type: SHOW_TOAST, messageToast: { text, placeToShow: 'feedback' } });
						}
						dispatch({
							type: LOAD_MY_POINTS_SUCCESS,
							sumAllPoints: res + sumAllPoints
						});
					}
				} else {
					Crashlytics.log('calling processResponse()');

					processResponse(dispatch, result, sendConfirmFail);

					Platform.OS === 'ios'
						? Crashlytics.recordError(JSON.stringify(result))
						: Crashlytics.logException(JSON.stringify(result));
				}
			});
		});
	};
};

export const setImageForMeal = ({ planId, base64, isAssigned, imageType = 'image/jpeg' }) => {
	return (dispatch, getState) => {
		
		return getAuthParams()
			.then(({ token, userName, version }) => {
				const body = {
					token,
					userName,
					version,
					planId,
					isAssigned,
					image: base64,
					imageType
				};
				const url = HOST + 'api/v2/mobile/mealplan/photo';
				return sendRequest(url, createJson('PATCH', body));
			})
			.then(result => {

				if (result.status === 'success') {
					const totalEarned = sumPointsOfEvents(result.events);
					dispatch({ type: SEND_CONFIRM_SUCCESS });
					dispatch(getMealPlan());
					Actions.main({ type: 'replace' });
					const { showPoints } = getState().clientPermissions;
					if (showPoints) {
						dispatch({
							type: SHOW_TOAST,
							messageToast: {
								text: 'Congratulations! You just earned ' + totalEarned + ' award points.',
								placeToShow: 'main'
							}
						});
						const { sumAllPoints } = getState().pointsAwards;
						dispatch({
							type: LOAD_MY_POINTS_SUCCESS,
							sumAllPoints: totalEarned + sumAllPoints
						});
					}
				} else {
					processResponse(dispatch, result, sendConfirmFail);
					dispatch({type: SEND_CONFIRM_FAIL, error: result.error || 'Something went wrong submitting the photo'});
					Platform.OS === 'ios'
						? Crashlytics.recordError(JSON.stringify(result))
						: Crashlytics.logException(JSON.stringify(result));
				}
			});
	};
};

export const sendReview = (planId,	liked,	isConfirm,	isAssigned,	comment, id, base64, imageType = 'image/jpeg') => {
	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('sendConfirm() in RecipeDetailActions.js');
	return (dispatch, getState) => {
		let list = getState().home.reviewMealList;
		const { showPoints } = getState().clientPermissions;
		const { sumAllPoints } = getState().pointsAwards;
		if (list.length > 1) {
			for (let i = 0; i < list.length; i++) {
				if (list[i].id === id) {
					list.splice(i, 1);
					dispatch({ type: LOAD_REVIEW_MEAL_LIST_SUCCESS, reviewMealList: [...list] });
				}
			}
		}

		Crashlytics.log('dispatching');
		dispatch({ type: SEND_CONFIRM });
		dispatch({ type: START_LOAD_DATA });
		Crashlytics.log('dispatched');
		
		return getAuthString()
			.then(body => {
				const url = HOST + 'api/v2/mobile/mealplan/review';

				body += '&utcOffsetHours=' + utcOffsetHours;
				body += '&planId=' + planId;
				body += '&isAssigned=' + +isAssigned;
				body += '&isConfirmed=' + isConfirm;
				if (liked === 0 || liked === 1)
					body += '&isLiked=' + liked;
				if (base64)
					body += '&image=' + encodeURIComponent(base64) + '&imageType=image/jpeg';
				
				body += '&comment=' + encodeURIComponent(comment.trim());

				Crashlytics.log('attempting to send request with sendRequest()');

				return sendRequest(url, createOptions('PATCH', body));

			}).then(result => {

				Crashlytics.log('response received');
				if (result.status === 'success') {
					const res = sumPointsOfEvents(result.events);
					Crashlytics.log('calling sendConfirmSuccess()');
					dispatch({ type: SEND_CONFIRM_SUCCESS });
					// to get uploaded image asap need to call get meal plan 
					dispatch(getMealPlan());
					
					Actions.main({ type: 'replace' });

					if (showPoints) {
						dispatch({
							type: SHOW_TOAST,
							messageToast: {
								text: 'Congratulations! You just earned ' + res + ' award points.',
								placeToShow: 'main'
							}
						});
						dispatch({
							type: LOAD_MY_POINTS_SUCCESS,
							sumAllPoints: res + sumAllPoints
						});
					}
				} else {
					Crashlytics.log('calling processResponse()');
					processResponse(dispatch, result, sendConfirmFail);
					Platform.OS === 'ios'
						? Crashlytics.recordError(JSON.stringify(result))
						: Crashlytics.logException(JSON.stringify(result));
				}
			});
	};
};

export const sendReviews = (listReviews) => {
	return (dispatch, getStore) => {
		Crashlytics.log('*********');
		Crashlytics.log('entering action');
		Crashlytics.log('sendReviews() in RecipeDetailActions.js');
		const { showPoints } = getStore().clientPermissions;
		const { sumAllPoints } = getStore().pointsAwards;
		getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/mealplan/review';
			let baseBody = authString + '&utcOffsetHours=' + utcOffsetHours;
			let arrReq = [];
			let points = 0;
			for (let key in listReviews) {
				const {
					decision: { liked, disliked, didntTry, comment },
					meal: { plan_id, isAssigned },
					base64,
					type = 'image/jpeg'
				} = listReviews[key];

				let isConfirmed = (liked || disliked) && !didntTry ? 1 : 0;
				let body = baseBody;
				body += '&planId=' + plan_id;
				body += '&isAssigned=' + (isAssigned ? 1 : 0);
				body += '&isConfirmed=' + isConfirmed;
				if(!didntTry && (liked || disliked))
					body += '&isLiked=' + (liked ? 1 : 0);
				if (base64) {
					body += '&image=' + encodeURIComponent(base64);
					body += '&imageType=' + encodeURIComponent(type);
				}
				body += '&comment=' + encodeURIComponent((comment || '').trim());

				arrReq.push(fetch(url, createOptions('PATCH', body)).then(res => res.json()).then(res => {
					if (res.events) {
						return res.events.forEach(elem => points += elem.amount_of_points_registered);
					}
				}).catch(e => e.message));
			}
			Promise.all(arrReq).then(res => {
				Actions.openDays({ type: 'replace' });
				if (showPoints) {
					dispatch({
						type: SHOW_TOAST,
						messageToast: {
							text: 'Congratulations! You just earned ' + points + ' award points.',
							placeToShow: 'main'
						}
					});
					dispatch({
						type: LOAD_MY_POINTS_SUCCESS,
						sumAllPoints: points + sumAllPoints
					});
				}
			});
		});
	};
};

export const checkNutritionalCompliance = (id, planId, isAssigned, isEdit, planMealType) => {

	Crashlytics.log('*********');
	Crashlytics.log('entering action');
	Crashlytics.log('checkNutritionalCompliance() in RecipeDetailActions.js');

	return dispatch => {
		getAuthString().then(authString => {
			const url = HOST + '/api/v2/mobile/mealplan/check';

			let body = authString +
				'&recipeId=' + id +
				'&isEdit=' + isEdit;
			if(isEdit) {
				body += '&planId=' + encodeURIComponent(planId) + '&isAssigned=' + +isAssigned;
			} else {
				body += '&date=' + prettyDate() + '&mealType=' + planMealType.charAt(0).toLowerCase();
			}

			const nutritionalOptions = createOptions('POST', body);

			sendRequest(url, nutritionalOptions).then(result => {

				Crashlytics.log('response received');
				Crashlytics.log(JSON.stringify(result));
				if (result.status === 'success') {
			
					if (result.warnings.found === true) {
						dispatch({ type: SET_WARNINGS, warnings: result.warnings, error: '' });
					} else {
						dispatch({ type: SET_WARNINGS, warnings: 'not found', error: '' });
					}
					//swapSuccess(dispatch);
				} else {
					processResponse(dispatch, result, () =>
						dispatch({ type: SET_WARNINGS, warnings: null, error: 'Sorry, your request could not be processed' })
					);
				}
			});
		});
	};
};





const sendConfirmSuccess = dispatch => {
	dispatch({
		type: SEND_CONFIRM_SUCCESS
	});
	Actions.pop();
};

const sendConfirmFail = dispatch => {
	dispatch({
		type: SEND_CONFIRM_FAIL,
		error: 'Confirm not send'
	});
};


export const resetNutritional = () => dispatch =>
	dispatch({ type: SET_WARNINGS, warnings: null });

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
