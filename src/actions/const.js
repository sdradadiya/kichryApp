/**
 * Created by mponomarets on 6/25/17.
 
 */
 
import { DatePickerAndroid, AsyncStorage, Animated, Platform, Alert } from 'react-native';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import {
	GoogleAnalyticsTracker
} from 'react-native-google-analytics-bridge';
import _, {mapValues, mergeWith} from 'lodash';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { fromJS } from 'immutable';


// const that depends on appVersion.
export const HOST = 'https://dev.kitchry.com/'; // https://app.kitchry.com/

//export const HOST = 'http://localhost:5000/'; // https://app.kitchry.com/

export const timeoutMessage = 'Cannot connect, please try again later';
export const google_API_KEY = 'AIzaSyAFgySkiASdFaG7WYS1oRulGwUVJnNkPD4';

export const appPlatform = Platform.OS === 'ios' ? 'ios' : 'droid';
// App Version needs for back-end side
export const appVersion = HOST === 'https://app.kitchry.com/' ? 'prod' : 'dev';
// iOS Google Sign-in OAuth2 API key
export const iosClientId = HOST === 'https://app.kitchry.com/' ? '285156575211-eien0p73k8lc6fef0ajcv68q8jqpqbhu.apps.googleusercontent.com' : '285156575211-be5lmvhtpb9fpvblrjkif9vkr1lo86o8.apps.googleusercontent.com';
// Android Google Sign-in OAuth2 API key
export const webClientId = '285156575211-7ioj4p26hg7r7tnurc1bf5mne35ucpug.apps.googleusercontent.com';
// App version that displays on the login screen
export const version = '2.0.5D';

// Code-push keys
export const IOS_KEY = HOST === 'https://app.kitchry.com/' ? 'nTSj2yi7H3VjJWKyISTdQd6zz6X4b6b6ef06-fcbe-4508-8319-e74a5a159092' : 'dbkF0OfREga9yW-S0UGMW7QMnL1Ub6b6ef06-fcbe-4508-8319-e74a5a159092';
export const ANDROID_KEY = HOST === 'https://app.kitchry.com/' ? 'jnkea-PA4f7Cc2nlDdyvSxMXmIkLb6b6ef06-fcbe-4508-8319-e74a5a159092' : 'Nd6yeUFfWyl7Kv_OPn3kUQytt8wHb6b6ef06-fcbe-4508-8319-e74a5a159092';

// Pusher push notifications
export const PUSHER_APP_KEY = HOST === 'https://app.kitchry.com/' ? '7e82395b9bb0be8e5b8a' : '1d0473266d98c79dbc3e';
export const PUSHER_PUSH_API = 'https://nativepushclient-cluster1.pusher.com/client_api';

export const DEFAULT_RECIPE_IMG_URL = HOST + 'static/images/default-recipe.jpg';

export const tracker = new GoogleAnalyticsTracker('UA-101607603-1');

//const that do not depend on appVersion
export const colors = {
	primaryOrange: 'rgb(234, 98, 80)',
	primaryGreen: 'rgb(57, 192, 111)',
	darkGrey: '#c9cacc',
	lightGrey: '#eaeaea',
	primaryBlue: '#00a9e8',
	primaryGrey: '#999999',
	primaryBlack: '#282c36',
	mainBackground: '#f2f5f9',
	lightBlue: '#ADD8E6'
};

export const tabStyles = {	
	container: {
		backgroundColor: colors.primaryBlue,
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 1,  
		shadowOpacity: 0.5		
	},
	activeTabTitle: {
		color: '#fff'
	},
	inactiveTabTitle: {
		color: colors.lightBlue
	}
};

export const headerBackIcon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';

export const loaderStyles = {
    loadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,.3)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export const marginStyles = {
	m1: 25,
	m2: 15,
	m3: 5,	
	sectionMargin: {
		marginLeft: 5,
		marginRight: 5,
		marginTop: 25,
		marginBottom: 0
	},
	descriptionMargin: {
		marginLeft: 5,
		marginRight: 5,
		marginTop: 5,
		marginBottom: 15
	},
	titleMargin: {
		marginLeft: 5,
		marginRight: 5,
		marginTop: 15,
		marginBottom: 0
	}

};

export const textStyles = {
	l1Text: {
		fontSize: responsiveFontSize(3),
		color: colors.primaryBlack,
		fontFamily: 'Montserrat-Bold'
	},
	l2Text: {
		fontSize: responsiveFontSize(3),
		color: colors.primaryBlack,
		fontFamily: 'Montserrat-Bold'
	},
	l3Text: {
		fontSize: responsiveFontSize(2.5),
		color: colors.primaryBlack,
		fontFamily: 'Montserrat-SemiBold'
	},
	l4Text: {
		fontSize: responsiveFontSize(2.2),
		color: colors.primaryBlack,
		fontFamily: 'Montserrat-SemiBold'
	},
	l5Text: {
		fontSize: responsiveFontSize(2),
		color: colors.primaryBlack,
		fontFamily: 'Montserrat-Regular'
	},
	l5TextWhite: {
		fontSize: responsiveFontSize(2),
		color: '#fff',
		fontFamily: 'Montserrat-SemiBold'
	},
	l4TextWhite: {
		fontSize: responsiveFontSize(2.2),
		color: '#fff',
		fontFamily: 'Montserrat-SemiBold'
	},
	description14White: {
		fontSize: responsiveFontSize(2.2),
		color: '#fff',
		fontFamily: 'Montserrat-SemiBold'
	},
	description14: {
		fontSize: responsiveFontSize(2.2),
		color: '#999999',
		fontFamily: 'Montserrat-SemiBold'
	},
	description14Regular: {
		fontSize: responsiveFontSize(2.2),
		color: '#999999',
		fontFamily: 'Montserrat-Regular'
	},
	description12: {
		fontSize: responsiveFontSize(1.8),
		color: '#999999',
		fontFamily: 'Montserrat-SemiBold'
	},
	description12Regular: {
		fontSize: responsiveFontSize(1.8),
		color: '#999999',
		fontFamily: 'Montserrat-Regular'
	},
	description12White: {
		fontSize: responsiveFontSize(1.8),
		color: '#fff',
		fontFamily: 'Montserrat-SemiBold'
	},
	description16White: {
		fontSize: responsiveFontSize(2.5),
		color: '#ffffff',
		fontFamily: 'Montserrat-SemiBold'
	},
	description16: {
		fontSize: responsiveFontSize(2.5),
		color: '#999999',
		fontFamily: 'Montserrat-SemiBold'
	},
	description10White: {
		fontSize: responsiveFontSize(1.5),
		color: '#fff',
		fontFamily: 'Montserrat-Regular'
	},
	description10: {
		fontSize: responsiveFontSize(1.5),
		color: '#999999',
		fontFamily: 'Montserrat-Regular'
	},
    textInputStyleIOS: {
        flex: 0.7,
        alignItems: 'stretch',
        borderRadius: 5,
        paddingBottom: 5,
        paddingTop: 5,
        fontSize: responsiveFontSize(2),
        color: colors.black,
		fontFamily: 'Montserrat-Regular',        
    },
    textInputStyleAD: {
        flex: 0.7,
        alignItems: 'stretch',
        backgroundColor: '#fff',
        borderRadius: 5,
        fontSize: 14,
        paddingBottom: 10,
        paddingTop: 10,
        paddingVertical: 0,
        fontSize: responsiveFontSize(2),
		color: colors.black,
		fontFamily: 'Montserrat-Regular',     
    },
};

export const color_arr = ['rgb(121,200,166)', 'rgb(255,77,60)', 'rgb(130,197,230)', 'rgb(9,107,145)'];

export const typeMeal = [
	'Breakfast',
	'Morning Snack',
	'Lunch',
	'Evening Snack',
	'Dinner'
];

export const scaledRecipeServingSize = (recipe, servings) => {

	let updateRecipe = fromJS(recipe);

	let scaledRecipe = updateRecipe.update('kcal', val => Math.round(val * servings));

	return scaledRecipe.toJS();

};

export const scaledIngredientsServingSize = (ingredients, originalServing, prefereServing, servings) => {

	let updateIngredients = fromJS(ingredients);
    
    if (!originalServing) {
        originalServing = 1;
    }
    if (!prefereServing) {
        prefereServing = 1;
    }
    if (!servings) {
        servings = 1;
    }
	
	let scaledIngredients = updateIngredients.map(item => 
		item.set('qty', 
			(item.get('qty') / originalServing * prefereServing) * servings
		)        
	);
    
    let scaledGrams = scaledIngredients.map(item => 
        item.set('qty_g', 
            (item.get('qty_g') / originalServing * prefereServing) * servings
        )
    );


	return scaledGrams.toJS();

};

export const scaledIngredientsServingSizeRevert = (ingredients, prefereServing) => {

	let updateIngredients = fromJS(ingredients);
	
	let scaledIngredients = updateIngredients.map(item => 
		item.set('qty', 
			item.get('qty') / prefereServing
		)
	);

	return scaledIngredients.toJS();

};

export const ndbToNewObject = ndb => {
	
	let ingredients = ndb.map(
		({name, ndb, qty, qty_g, unit, usda, base}) => ({
			name: name || base,
			ndb,
			quantity: qty,
			grams: qty_g,
			unit,
			nutrition: usda
		})
	);

	return ingredients;

};

export const sumNutritionToString = (ingredients, originalServing) => {
	if (!ingredients) return;
	
	const NUTRITION_PER_GRAMS = 100;
	const selectedNutrition = ingredients.map(({ nutrition, grams }) => 
		mapValues(
			{
				kcal: (nutrition) ? nutrition.Energ_Kcal : '0',
				calcium: (nutrition) ? nutrition.Calcium : '0',
				carbohydrate: (nutrition) ? nutrition.Carbohydrt : '0',
				cholesterol: (nutrition) ? nutrition.Cholestrl : '0',
				fat: (nutrition) ? nutrition.Lipid_Tot : '0',
				fat_sat: (nutrition) ? nutrition.FA_Sat : '0',
				fiber: (nutrition) ? nutrition.Fiber_TD : '0',
				iron: (nutrition) ? nutrition.Iron : '0',
				phosphorus: (nutrition) ? nutrition.Phosphorus : '0',
				potassium: (nutrition) ? nutrition.Potassium : '0',
				protein: (nutrition) ? nutrition.Protein : '0',
				sodium: (nutrition) ? nutrition.Sodium : '0',
				sugar: (nutrition) ? nutrition.Sugar_Tot : '0'
			},
			val => (val * grams / NUTRITION_PER_GRAMS) / originalServing
		)
	);

	accumulate = (acc, src) => (acc || 0) + src;
	const combinedNutrition = mergeWith({}, ...selectedNutrition, accumulate);

	reducePrecision = (num, name) =>
		Number(num.toFixed(name === 'kcal' ? 0 : 1)).toString();

	return mapValues(combinedNutrition, reducePrecision);
};


export const sumNutritionToStringGlobalRecipe = (nutrition, serving) => {
	if (!nutrition) return;
	const selectedNutrition = {
		kcal: nutrition.ENERC_KCAL ? ((nutrition.ENERC_KCAL.quantity) / serving).toFixed(1) : '0',
		calcium: nutrition.CA ? ((nutrition.CA.quantity) / serving).toFixed(1) : null,
		carbohydrate: nutrition.CHOCDF ? ((nutrition.CHOCDF.quantity) / serving).toFixed(1) : '0',
		cholesterol: nutrition.CHOLE ? ((nutrition.CHOLE.quantity) / serving).toFixed(1) : '0',
		fat: nutrition.FAT ? ((nutrition.FAT.quantity) / serving).toFixed(1) : null,
		fat_sat: nutrition.FASAT ? ((nutrition.FASAT.quantity) / serving).toFixed(1) : '0',
		fiber: nutrition.FIBTG ? ((nutrition.FIBTG.quantity) / serving).toFixed(1) : '0',
		iron: nutrition.FE ? ((nutrition.FE.quantity) / serving).toFixed(1) : '0',
		phosphorus: nutrition.P ? ((nutrition.P.quantity) / serving).toFixed(1) : '0',
		potassium: nutrition.K ? ((nutrition.K.quantity) / serving).toFixed(1) : '0',
		protein: nutrition.PROCNT ? ((nutrition.PROCNT.quantity) / serving).toFixed(1) : '0',
		sodium: nutrition.NA ? ((nutrition.NA.quantity) / serving).toFixed(1) : '0',
		sugar: nutrition.SUGER ? ((nutrition.SUGER.quantity) / serving).toFixed(1) : '0',
		vitamin_d: nutrition.VTID ? ((nutrition.VTID.quantity) / serving).toFixed(1) : '0'
	};
	return selectedNutrition;
};

export const showAnimation = (animatedVaue, value, callback) => {
	Animated.timing(
		animatedVaue,
		{
			toValue: value,
			duration: 450
		}
	).start(() => callback ? callback() : null);
};

export const prettyDate = (date) => {
	if (!date) {
		date = new Date();
	}
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	return month + '/' + day + '/' + year;
};

export const isDayToday = (str) => {
	let today = new Date();
	let date = new Date(str);
	if (date.getFullYear() === today.getFullYear()) {
		if (date.getMonth() === today.getMonth()) {
			if (date.getDate() === today.getDate()) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export const showAndroidCalendar = (changeDate, getData, currentDate) => {
	let date = new Date();
	if (currentDate) {
		let tmp = new Date();
		date = new Date(currentDate);
		date.setHours(tmp.getHours());
		date.setMinutes(tmp.getMinutes());
		date.setSeconds(tmp.getSeconds());
	}
	try {
		DatePickerAndroid.open({
			date: date
		}).then((event) => {
			if (event.action === DatePickerAndroid.dateSetAction) {
				let chooseDate = event.month + 1 + '/' + event.day + '/' + event.year;
				changeDate(chooseDate);
				getData(chooseDate);
			} else {
				console.log(event);
			}
		});
	} catch ({ code, message }) {
		console.log(code, message);
	}
};

export const groupArray = (arr, gropeBy) => {
	let groups = {};
	for (let i = 0; i < arr.length; i++) {
		let groupName = gropeBy ? arr[i].group : arr[i].recipeTitle;
		if (!groups[groupName]) {
			groups[groupName] = [];
		}
		groups[groupName].push(arr[i]);
	}
	return groups;
};

export const getKeyFromStorage = () => {
	let tmp = ['kitchry', 'userKitchry', 'name', 'userId', 'doctorId', 'profile', 'doctorName', 'releaseNote'];

	const a = AsyncStorage;

	return AsyncStorage.multiGet(tmp, (err, stores) => {
		if (!err) {
			return stores;
		}
	}).then(stores => {
		let data = {
			token: stores[0][1],
			email: stores[1][1],
			name: stores[2][1],
			userId: stores[3][1],
			doctorId: stores[4][1],
			profile: stores[5][1],
			doctorName: stores[6][1],
			releaseNote: stores[7][1]
		};
		return data;
	});
};

export const getAuthString = () =>

	getKeyFromStorage().then(
		({ token, email }) =>
			'userName=' + encodeURIComponent(email) + '&token=' + token + '&v=' + version
	);

export const getAuthParams = () =>
	getKeyFromStorage().then(({ token, email: userName }) => {
		return { token, userName, version };
	});

export const formatNotesDate = (dataString) => {

	return dataString.slice(0, 4) + dataString.slice(7, 12) + dataString.slice(5, 7) + dataString.slice(11, 16);

};

export const formatClientDate = (dateString) => {

	let ticks = Date.parse(dateString);

	let parsedDate = new Date(ticks);

	let formattedDate = parsedDate.toDateString();

	return formattedDate.slice(0, 3) + ',' + formattedDate.slice(3);
};

export const formatServerDate = (dateString) => {

	let dateStringParsed = dateString.split('-');

	let parsedDate = new Date(year = dateStringParsed[0],
		month = dateStringParsed[1] - 1,
		date = dateStringParsed[2]);

	let formattedDate = parsedDate.toDateString();

	return formattedDate.slice(0, 3) + ',' + formattedDate.slice(3);
};

export const utcOffsetHours =
	-1 * parseInt(new Date().getTimezoneOffset() / 60);

export const findMealTypes = (tags = '') => {
	const mealTypes = ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];
	let str = '';
	tags = tags.toLowerCase();
	for (let i = 0; i < mealTypes.length; i++) {
		if (tags.includes(mealTypes[i].toLowerCase())) {
			if (i < mealTypes.length) {
				if (str.length > 0) {
					str = str + ', ' + mealTypes[i];
				} else {
					str = str + mealTypes[i];
				}
			}
		}
	}
	return str;
};

export const clearAsyncStorage = () => {
	return AsyncStorage.getAllKeys().then(res => {
		const itemsToRemove = ['fingerprint', 'once', 'userKitchry', 'password', 'lockTab', 'releaseNote'];
		const result = _.without(res, ...itemsToRemove);
		AsyncStorage.multiRemove(result);
	});
};

export const savePusherClientId = pusherClientId => {
	if (pusherClientId) {
		AsyncStorage.setItem('pusherClientId', pusherClientId);
	}
};

export const getPusherClientId = () => AsyncStorage.getItem('pusherClientId');

export const sumPointsOfEvents = (events = []) => {
	let points = 0;
	for (let i = 0; i < events.length; i++) {
		if (events[i].were_points_registered) {
			points += events[i].amount_of_points_registered;
		}
	}
	return points;
};

export const showImagePicker = (onSuccess, onFail) =>
	ImagePicker.showImagePicker(
		{
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true,
				cameraRoll: true,
				waitUntilSaved: true
			}
		},
		({ didCancel, error, customButton, data, uri, type }) => {
			if (didCancel || customButton) {
				if(onFail) onFail({ didCancel, customButton });
			} else if(error) {
				if (Platform.OS === 'ios') {
					Alert.alert('Alert', 'Camera access denied. Please check Settings > Privacy > Camera.');
				}
			} else {
				onSuccess({ base64: data, uri, type });
			}
		}
	);

export const parseRecordDateTime = (dateString) => {
	if (dateString) {
		return moment(new Date(dateString)).local().format('MMM Do, YYYY (hh:mm A)');
	} else {
		return null;
	}
};

export const parseRecordDate = (dateString) => {
	if (dateString) {
		return moment(new Date(dateString)).local().format('MMM Do, YYYY');
	} else {
		return null;
	}
};

export const parseRecordTime = (dateString) => {
	if (dateString) {
		return moment(new Date(dateString)).local().format('hh:mm A');
	} else {
		return null;
	}
};


export const sortChecklist = (dailyChecklist) => {

	const checklistArr = Object.values(dailyChecklist);

	const sortchecklist = checklistArr.sort(function (a, b) {
		if(a.item.sub_topic > b.item.sub_topic) {
			return 1;
		}
		if(a.item.sub_topic < b.item.sub_topic) {
			return -1;
		}
		return 0;
	});

	return sortchecklist;
};

export const nutrientUnits = (nutrientName) => {
	switch (nutrientName) {
		case 'calorie':
			return '';
		case 'sodium':
			return 'mg';
		case 'potassium':
			return 'mg';
		case 'phosphorus':
			return 'mg';
		default:
			return 'g';
	}
};

export const measurementUnit = {
	'A1C': {
		unit: '%'
	},
	'Blood Glucose': {
		unit: 'mg/DL'
	},
	'Fat Mass': {
		unit: '%'
	},
	'Muscle Mass': {
		unit: '%'
	},
	'Weight': {
		unit: 'lbs'
	},
	'Wellness': {
		unit: 'pts'
	}
};

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];


export const trackerIcon = (tracker) => {
	switch (tracker) {
		case 'Cholesterol':
			return ({
                name:'heart',
                color:'red'
            });
		case 'Diabetes':
            return ({
                name:'medical-bag',
                color:'purple'
            });
		case 'Hydration':
            return ({
                name:'cup-water',
                color:'blue'
            });
		case 'Physical Activity':
            return ({
                name:'walk',
                color:'brown'
            });
		case 'Sleep':
            return ({
                name:'sleep',
                color:'grey'
            });
		case 'Weight':
            return ({
                name:'weight',
                color:'black'
            });
		case 'Stress':
            return ({
                name:'watch-vibrate',
                color:'pink'
            });
		default:
            return ({
                name:'target',
                color:'orange'
            });
	}
};
