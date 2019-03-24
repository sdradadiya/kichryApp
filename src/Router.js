/**
 * Created by mponomarets on 6/25/17.
 */
import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import MainScreen from './components/MainScreen';
import LoginScreen from './components/LoginScreen';
import DatePicker from'./components/DatePicker';
import GroceryList from './components/GroceryList';
import Chat from'./components/Chat';
import RecipeDetail from'./components/RecipeDetail';
import MeasurementsPage from './components/Measurements/MeasurementsPage';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import TasteProfile from './components/TasteProfile';
import DietAllergies from './components/DietAllergies';
import Profile from './components/Profile';
import ChangePasswordForm from './components/ChangePasswordForm';
import AddMeal from './components/AddMeal';
import NutritionScanResult from './components/NutritionScanResult';
import BarCodeScreen from './components/BarCodeScreen';
import PointsScreen from './components/PointsScreen';
import RDNotes from './components/RDNotes';
import ReviewMeal from './components/ReviewMeal';
import MeasurementsRecordData from './components/Measurements/MeasurementsRecordData';
import AddNewMeasurements from './components/Measurements/AddNewMeasurements';
import SelectMeasurementsForm from './components/Measurements/SelectMeasurementsForm';
import OtherMeasurements from './components/Measurements/OtherMeasurements';
import MeasurementsCategoryData from './components/Measurements/MeasurementsCategoryData';
import QuestionsHistory from './components/Measurements/QuestionsHistory';
import ReferForm from './components/ReferForm';
import OpenDays from './components/CloseDays/OpenDays';
import SelectedDay from './components/CloseDays/SelectedDay';
import ReviewMeals from './components/CloseDays/ReviewMeals';
import RecipeBook from './components/RecipeBook';
import MealPlan from './components/MealPlan';
import FingerPrint from './components/FingerPrintScanner';
import TrackItem from './components/Trackers/TrackItem';
import ProductDetail from './components/ProductDetail';
import GlobalRecipeDetail from './components/GlobalRecipeDetail';
import Restaurants from './components/Restaurants';
import RestaurantMenu from './components/RestraurantMenu';
import RestaurantMenuList from './components/RestaurantMenuList';
import MeetingCalendar from './components/MeetingCalendar/MeetingCalendar';
import MeetingDay from './components/MeetingCalendar/MeetingDay';
import MeetingInfo from './components/MeetingCalendar/MeetingInfo';
import mealDetail from './components/MealDetail';


class RouterComponent extends Component {
	render () {
		return (
			<Router style={{ backgroundColor: '#fff' }}>
				<Scene key='scanner' hideNavBar>
					<Scene key='fingerPrint' component={FingerPrint} panHandlers={null}/>
				</Scene>
				<Scene key='auth' hideNavBar initial>
					<Scene key='login' component={LoginScreen} panHandlers={null}/>
				</Scene>
				<Scene key="main">
					<Scene key="mainScreen" hideNavBar component={MainScreen} title=""/>
				</Scene>
				<Scene key="picker" hideNavBar component={DatePicker}/>
                <Scene key="groceryList" hideNavBar component={GroceryList}/>
				<Scene key="chat" hideNavBar component={Chat}/>
				<Scene key="mealPlan" hideNavBar component={MealPlan}/>
				<Scene key="recipeDetail" hideNavBar component={RecipeDetail}/>
				<Scene key="measurements" direction="vertical" hideNavBar component={MeasurementsPage}/>
				<Scene key="tasteprofile" hideNavBar component={TasteProfile}/>
				<Scene key="DietAllergies" hideNavBar component={DietAllergies}/>
				<Scene key="profile" hideNavBar component={Profile}/>
				<Scene key="changePassword" hideNavBar component={ChangePasswordForm}/>
				<Scene key="forgotForm" hideNavBar component={ForgotPasswordForm}/>
				<Scene key="addMeal" hideNavBar component={AddMeal}/>
				<Scene key="scanBarCodeResult" hideNavBar component={NutritionScanResult}/>
				<Scene key="barCodeScan" hideNavBar component={BarCodeScreen}/>
				<Scene key="pointsScreen" hideNavBar component={PointsScreen}/>
				<Scene key="rdNotes" hideNavBar component={RDNotes}/>
				<Scene key="reviewMeal" hideNavBar component={ReviewMeal}/>
				<Scene key="measurementsDetail" hideNavBar component={MeasurementsRecordData}/>
				<Scene key="addMeasurements" hideNavBar component={AddNewMeasurements}/>
				<Scene key="selectMeasurementsForm" hideNavBar component={SelectMeasurementsForm}/>
				<Scene key="otherMeasurements" hideNavBar component={OtherMeasurements}/>
				<Scene key="referForm" hideNavBar component={ReferForm}/>
				<Scene key="recipeBook" hideNavBar component={RecipeBook}/>
				<Scene key="measurementsCategoryData" hideNavBar component={MeasurementsCategoryData}/>
				<Scene key="questionHistory" hideNavBar component={QuestionsHistory}/>


				<Scene key="openDays" hideNavBar component={OpenDays}/>
				<Scene key="selectedDay" hideNavBar component={SelectedDay}/>
				<Scene key="reviewMeals" hideNavBar component={ReviewMeals}/>

				<Scene key="trackItem" hideNavBar component={TrackItem} />

				<Scene key="productDetail" hideNavBar component={ProductDetail}/>
				<Scene key="globalRecipeDetail" hideNavBar component={GlobalRecipeDetail}/>
				<Scene key="mealDetail" hideNavBar component={mealDetail}/>

				<Scene key="restaurant" hideNavBar component={Restaurants}/>
				<Scene key="restaurantMenu" hideNavBar component={RestaurantMenu}/>
				<Scene key="restaurantMenuList" hideNavBar component={RestaurantMenuList}/>

				<Scene key="meetingInfo" hideNavBar component={MeetingInfo} />
				<Scene key="meetingCalendar" hideNavBar component={MeetingCalendar} />
				<Scene key="meetingDay" hideNavBar component={MeetingDay} />

			</Router>
		);
	}
}

export default RouterComponent;
