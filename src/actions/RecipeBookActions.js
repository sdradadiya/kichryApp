import {
	START_SEARCH,
	CONTINUE_SEARCH,
	SEARCH_SUCCESS,
	SEARCH_FAIL,
	PIN_BUTTON_PRESS,
	PINNED_SUCCESS,
	PIN_FAIL,
	SEND_UPC,
	SEND_UPC_SUCCESS,
	SEND_UPC_FAIL,
	DELETE_RECIPE,
	DELETE_RECIPE_SUCCESS,
	DELETE_RECIPE_FAIL,
	START_ADD_NEW_CASTOM_RECIPE,
	ADD_NEW_CASTOM_RECIPE_FAIL,
	SET_LOCK_TAB
} from './types';
import { Alert, AsyncStorage } from 'react-native';
import {
	HOST,
	getAuthString,
	getAuthParams,
	version
} from './const';
import { Actions } from 'react-native-router-flux';
import { sendRequest, createOptions, createJson } from './http';
import { isEmpty } from 'lodash';

// depends on passing params: liked, pinned, viewed, created, searched
export const getRecipeBook = (page, route, text, nutrient = [], orderBy = '', size = 20) => {
	
	
	return (dispatch, store) => {
		if (page === 1) {
			dispatch({type: START_SEARCH});
		} else {
			dispatch({type: CONTINUE_SEARCH});
		}

		let nutrition_filter = '';

		if(nutrient.length > 0) {
			nutrient.map(data=>{
				nutrition_filter += `&${data}`;
			});
		}

		let filters = filters ? filters : store().search.filters;
		let searchBefore = store().search.searchResult;

		getAuthString().then(authString => {

			const url = `${HOST}api/v2/mobile/recipe/book/${route}`;

			let body = authString + '&page=' + page + '&size=' + size + nutrition_filter;

            if(orderBy) {
                body += '&orderBy=' + orderBy + '&desc=' + true;
            }

			if (text) {
				body += '&title=' + text;
			}

			for (let filterKey in filters) {

				if (filters[filterKey].length > 0) {

					let filterValue = filters[filterKey].join();

					body += '&' + filterKey + '=' + filterValue;

				}
			}

			const recipeBookOption = createOptions('POST', body);

			sendRequest(url, recipeBookOption).then(result => {


				if (result.status === 'success') {

					

					let res = page === 1 ? result.recipes : [...searchBefore, ...result.recipes];

					dispatch({type: SEARCH_SUCCESS, searchResult: res, pages: result.pages});

				} else {

					dispatch({type: SEARCH_FAIL, error: 'Sorry, your request could not be processed'});

				}

			});

		});

	};

};


export const getProductBySearch = query => dispatch => {
	return getAuthString().then(authString => {
		const url = HOST + 'api/v2/mobile/recipe/ingredient/search';
		const body = authString + '&query=' + query;

		dispatch({type: CONTINUE_SEARCH});

		return sendRequest(url, createOptions('POST', body)).then(
			({ status, result }) => {
				if (status === 'success') {
					dispatch({
						type: SEARCH_SUCCESS,
						searchResult: result
					});
					return Promise.resolve(true);
				} else {
					dispatch({
						type: SEARCH_FAIL,
						error: 'No results found'
					});
					return Promise.reject();
				}
			}
		);
	});
};

export const getGlobalRecipes = (query, from, to, nutrition) => {
	return (dispatch, store) => {
		dispatch({type: CONTINUE_SEARCH});
		let searchBefore = store().search.searchResult;
		let tmp = ['kitchry', 'userKitchry'];
		return AsyncStorage.multiGet(tmp, (err, stores) => {
			if (!err) {
				return stores;
			}
		}).then(stores => {
			let data = {
				token: stores[0][1],
				email: stores[1][1]
			};


			const url = HOST + 'api/v2/mobile/recipe/search/external';
			const body =
			{
				'dietLabels': [
					'balanced'
				],
				'from': from,
				'healthLabels': [
					'peanut-free'
				],
				'maxIngredients': 10,
				'nutrients': nutrition,
				'query': query,
				'source': 'edamam',
				'to': to,
				'token': data.token,
				'userName': data.email,
				'v': version
			};

			sendRequest(url, createJson('POST', body)).then(result => {
				if(query) {

					if (result.status === 'success') {

						let res = from === 0 ? result.result.hits : [...searchBefore, ...result.result.hits];


						return dispatch({type: SEARCH_SUCCESS, searchResult: res, pages: from});

					} else {

						if(from === 0) {
							dispatch({type: SEARCH_FAIL, error: 'Sorry, your request could not be processed'});
						}
						else{
							dispatch({type: SEARCH_FAIL, error: ''});
						}


					}
				}else{
					if (result.status === 'success') {

						let res = from === 0 ? result.result.hits : [...searchBefore, ...result.result.hits];


						return dispatch({type: SEARCH_SUCCESS, searchResult: res, pages: from});

					} else {

						if(from === 0) {
							dispatch({type: SEARCH_FAIL, error: 'Sorry, your request could not be processed'});
						}
						else{
							dispatch({type: SEARCH_FAIL, error: ''});
						}


					}
				}



			});


		});
	};
};


// pin / unpin recipe. Сhange request method ('DELETE' / 'PUT') depends on is_pinned (true / false);
export const pinRecipe = (recipe_id, is_pinned) => {

	return dispatch => {

		dispatch({type: PIN_BUTTON_PRESS});

		getAuthString().then(authString => {

			const url = HOST + 'api/v2/mobile/recipe/pin';
			const body = authString + '&recipeId=' + recipe_id;

			const method = is_pinned ? 'DELETE' : 'PUT';

			const pinOption = createOptions(method, body);

			sendRequest(url, pinOption).then(result => {

				if(result.status === 'success') {

					dispatch({type: PINNED_SUCCESS, is_pinned: is_pinned ? false : true});

				} else {

					dispatch({type: PIN_FAIL, is_pinned: false});

				}

			});

		});

	};

};

export const createCustomRecipe = ({
	planMealType, 
	title, 
	ingredients, 
	nutrition, 
	description,
	brand, 
	location, 
	base64
}) => dispatch => {
	dispatch({ type: START_ADD_NEW_CASTOM_RECIPE });
	const hasIngredients = isEmpty(ingredients) ? 0 : 1;
	return getAuthParams().then(({ token, userName, version }) => {
		
		let missingNDB = false;
		
		ingredients.map((ndb) => {
			if (ndb.ndb < 1) { 
				missingNDB = true; 				
			}
		});
		
		const url = HOST + (missingNDB ? 'api/v2/mobile/recipe/new/custom/sansndb' : 'api/v2/mobile/recipe/new/custom');
	
		const body = {
			token,
			userName,
			version,
			mealType: planMealType ? planMealType.charAt(0).toLowerCase() : undefined,
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

		const recipeOptions = createJson('PATCH', body);
		return sendRequest(url, recipeOptions).then(result => {

			if(result.status === 'success') {

				return Promise.resolve(result);
				//Actions.main({ type: 'replace' });

			} else {
				Alert.alert('Failed to add meal', null);
				dispatch({ type: ADD_NEW_CASTOM_RECIPE_FAIL });

			}
				
		});
	});
};

export const addMealToBookUPC = (upc) => {
	return (dispatch) => {
		dispatch({ type: SEND_UPC });
		getAuthString().then(authString => {
			
			const url = HOST + 'api/v2/mobile/recipe/new/upc';

			const body = authString +
				'&upc=' + upc;
			const mealOptions = createOptions('PATCH', body);

			sendRequest(url, mealOptions).then(result => {

				if (result.status === 'success') {

					dispatch({ type: SEND_UPC_SUCCESS });

					Actions.main({ type: 'replace' });
					
				} else {
					Alert.alert('Unable to add meal from scanned UPC', null);
					dispatch({ type: SEND_UPC_FAIL });
				}
			});
		});
	};
};

export const recipeDelete = (recipeId) => {
	return (dispatch) => {
		dispatch({ type: DELETE_RECIPE });
		return getAuthString().then(authString => {
			const url = HOST + 'api/v2/mobile/recipe';
			const body = authString +	'&recipeId=' + encodeURIComponent(recipeId);
			const options = createOptions('DELETE', body);
			return sendRequest(url, options).then(result => {
				if (result.status === 'success') {
					dispatch({ type: DELETE_RECIPE_SUCCESS });
					return recipeId;
				} else {
					dispatch({ type: DELETE_RECIPE_FAIL, error: result.message });
				}
			});
		});
	};
};

export const setLockTab = lockTab => dispatch => {
	AsyncStorage.getItem('lockTab').then(res=>{
		if(res) {
			dispatch({ type: SET_LOCK_TAB, lockTab: JSON.parse(res)});
		}
	});
};
