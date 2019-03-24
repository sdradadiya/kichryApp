/**
 * Created by mponomarets on 6/25/17.
 */
import {combineReducers} from 'redux';
import MainScreenReducer from './MainScreenReducer';
import AuthReducer from './AuthReducer';
import MealPlanReducer from './MealPlanReducer';
import GroceryListReducer from './GroceryListReducer';
import ChatReducer from './ChatReducer';
import RecipeDetailReducer from './RecipeDetailReducer';
import HomeReducer from './HomeReducer';
import ProfileReducer from './ProfileReducer';
import ChangePasswordReducer from './ChangePasswordReducer';
import SearchReducer from './SearchReducer';
import PointsAwardsReducer from './PointsAwardsReducer';
import ClientPermissionsReducer from './ClientPermissionsReducer';
import ReferFormReducer from './ReferFormReducer';
import RecipeBookReducer from './RecipeBookReducer';
import TrackersReducer from './TrackersReducer';
import RestaurantReducer from './RestaurantReducer';
import MeetingReducer from './MeetingReducer'; 

export default combineReducers({
	main: MainScreenReducer,
	auth: AuthReducer,
	mealPlan: MealPlanReducer,
	grocery: GroceryListReducer,
	chat: ChatReducer,
	recipeDetail: RecipeDetailReducer,
	home: HomeReducer,
	profile: ProfileReducer,
	changePassword: ChangePasswordReducer,
	search: SearchReducer,
	pointsAwards: PointsAwardsReducer,
	clientPermissions: ClientPermissionsReducer,
	referForm: ReferFormReducer,
	recipeBook: RecipeBookReducer,
	trackers: TrackersReducer,
	restaurant: RestaurantReducer,
	meetingCalendar: MeetingReducer
});