import {
	SET_CLIENT_PERMISSIONS
} from '../actions/types';

const INITIAL_STATE = {
	showGoals: false,
	showNutrients: false,
	showPoints: false,
	allowMealplanRegeneration: false,
	needsPaymentSource: false,
	hasTelehealth: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_CLIENT_PERMISSIONS:
			return { ...state, 
				showGoals: action.showGoals, 
				showNutrients: action.showNutrients, 
				showPoints: action.showPoints,
				allowMealplanRegeneration: action.allowMealplanRegeneration,
				needsPaymentSource: action.needsPaymentSource,
				hasTelehealth: action.hasTelehealth
			};
		default:
			return state;
	}
};