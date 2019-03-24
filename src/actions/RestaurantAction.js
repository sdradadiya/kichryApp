import {HOST} from './const';
import {
	GET_RESTAURANT,
	GET_RESTAURANT_SUCCESS,
	GET_RESTAURANT_FAIL,
	GET_RESTAURANT_MENU,
	GET_RESTAURANT_MENU_SUCCESS,
	GET_RESTAURANT_MENU_FAIL
} from './types';
import {sendRequest, createJson} from './http';
import { version } from './const';
import {AsyncStorage} from 'react-native';

export const getRestaurant = (latitude, longitude, search = '') => {
	return (dispatch) => {

		dispatch({type: GET_RESTAURANT});

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
			const url = `${HOST}api/v2/mobile/restaurant/search`;

			let body = {
				userName: data.email,
				token: data.token,
				latitude,
				longitude,
				query: search,
                v: version
			};

			const restaurantBody = createJson('POST', body);

			sendRequest(url, restaurantBody).then(result => {

				if (result.status === 'success') {

					if(result.restaurants.length === 0 ) {
						dispatch({type: GET_RESTAURANT_FAIL, error: 'No Result Fond'});
					}

          			dispatch({type: GET_RESTAURANT_SUCCESS, restaurantResult: result.restaurants});

				} else {

					dispatch({type: GET_RESTAURANT_FAIL, error: 'serverError'});

				}

			});


		});

	};
};



export const getRestaurantMenu = (foursquareVenueId) => {

	
	return (dispatch) => {

		dispatch({type: GET_RESTAURANT_MENU});

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
			const url = `${HOST}api/v2/mobile/restaurant/menu`;

			let body = {
				userName: data.email,
				token: data.token,
				foursquareVenueId,
                v: version
			};

			const restaurantBody = createJson('POST', body);

			sendRequest(url, restaurantBody).then(result => {
				if (result.status === 'success') {

					if(result.menus.length > 0) {

						dispatch({type: GET_RESTAURANT_MENU_SUCCESS, restaurantMenuResult: result.menus});

					}else{

						dispatch({type: GET_RESTAURANT_MENU_SUCCESS, restaurantMenuResult: [], error: 'No Menu Found'});

					}

				} else {

					dispatch({type: GET_RESTAURANT_MENU_FAIL, error: 'Sorry, your request could not be processed'});

				}

			});


		});
	};

};

