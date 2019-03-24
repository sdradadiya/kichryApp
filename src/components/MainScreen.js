import React, { PureComponent } from 'react';
import {
	Text,
	View,
	Platform,
	PanResponder,
	Dimensions,
	Keyboard,
	Alert,
	Image,
    PermissionsAndroid
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
    changeActiveTab,
    getChatMessage,
    getMealPlan,
    getRecipeById,
    getRecipeByIdForEditing,
    regeneratePlan,
    getDailyChecklist,
    getGroceryList,
    changeDate,
    changeDateForGroceryList,
    changeGroupBy,
    closeOnboardingScreen,
    closeReleaseNotes,
    closeWelcomeScreen,
    toggleBottomSheetMenuForOption,
    toggleBottomSheetMenuForGroceryOption,
    toggleBottomSheetMenuForSwapOption,
    toggleBottomSheetMenuForTrackOption,
    loadNutritionForUPC,
	setUPCData

} from '../actions';
import { Header, Tabs, SideMenu, OnboardingScreen, WelcomeScreen, ReleaseNotes } from './common';
import {showAndroidCalendar, colors, tracker, prettyDate} from '../actions/const';
import HomePage from './HomePage';
import Progress from './Progress';
import MealPlan from './MealPlan';
import GroceryList from './GroceryList';
import RecipeBook from './RecipeBook';
import ListTitle from './common/ListTitle';
const { width, height } = Dimensions.get('window');
import PushService from '../PushService';
import BottomSheetMenu from './BottomSheet/BottomSheetMenu';
import BottomSheetMenuForOption from './BottomSheet/BottomSheetMenuForOption';
import Toast from 'react-native-another-toast';
import Emojicon from 'react-native-emojicon';
let toastMessage,toastSubMessage;
import _ from 'lodash'

class MainScreen extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			renderTabs: true,
			isMenuOpen: false,
			activeTabId: this.props.activeTabId,
			title: this.props.title,
			isShowOption: false,
			screenWidth: width,
			screenHeight: height,
			groupBy: this.props.groupBy,
			isOnboardingOpen: this.props.isOnboardingOpen,
			isWelcomeOpen: this.props.isWelcomeOpen,
			isReleaseNote: this.props.isReleaseNotesOpen,
			visible: false,
            renderToast:false,
			showGoals: this.props.showGoals,
			bottomSheetButtons: [
				{
					title: 'Select Date',
					onPress: () => {
						this.showCalendar();
						this.props.toggleBottomSheetMenuForOption(false)
					}
				},
				{
					title: 'Notes',
					onPress: () => {
						Actions.rdNotes({ allMealNotes: this.props.mealNotes.notes });
						this.props.toggleBottomSheetMenuForOption(false);
					}
				},
				{
					title: 'Regenerate plan',
					onPress: () => {
						Alert.alert(
							'Are you sure?',
							'',
							[
								{text: 'Yes', onPress: () => this.props.regeneratePlan() },
								{text: 'No', style: 'cancel'}
							]
						);
						
						this.props.toggleBottomSheetMenuForOption(false);
					}
				}
			],
			bottomSheetButtonsForGrocery: [
				{
					title: 'View by Recipes',
					onPress: () => {
						this.onChangeOption('recipe');
						this.props.toggleBottomSheetMenuForGroceryOption(false);
					}
				},
				{
					title: 'View by categories',
					onPress: () => {
						this.onChangeOption('category');
						this.props.toggleBottomSheetMenuForGroceryOption(false);
					}
				},
				{
					title: 'Select Date',
					onPress: () => {
						this.showCalendar();
						this.props.toggleBottomSheetMenuForGroceryOption(false)
					}
				}
			],
            bottomSheetButtonsForTrack: [
                {
                    title: 'Add Ingredients',
                    icon: 'md-arrow-dropright-circle',
                    onPress: () => {
                        this.props.toggleBottomSheetMenuForSwapOption(false);
                        this.props.toggleBottomSheetMenuForTrackOption(false);
                        const { activeMeal } = this.props;
                        let date = prettyDate();
                        this.props
                            .getRecipeByIdForEditing(activeMeal.id)
                            .then(recipeId => {
                                const { recipeBookActionError } = this.props;
                                if (recipeBookActionError)
                                    Alert.alert('Failed to load recipe', recipeBookActionError);
                                else {
                                    const { editRecipe } = this.props;
									const {ndb, nutrition} = editRecipe;

									ingredients = ndb.map(
										({name, ndb, qty, qty_g, unit, usda, base}) => ({
											name: name || base,
											ndb,
											quantity: qty,
											grams: qty_g,
											unit,
											nutrition: usda
										})
									);

                                    Actions.mealDetail({recommended:true,tracked:false,add:false, replace:true, ingredients, nutrition})
                                }
                            });
                    }
                },
				{
						title: 'Create Your Own',
						icon: 'md-add',
						onPress: () => {
								const { activeMeal } = this.props;
								let date = prettyDate();
								this.props.toggleBottomSheetMenuForSwapOption(false);
								this.props.toggleBottomSheetMenuForTrackOption(false);
								Actions.mealDetail({recommended:false,tracked:false,isDirect:false,add:false, replace:true})
							 // Actions.addMeal({ planId:activeMeal.plan_id, planMealType: activeMeal.type, date, add:false, replace:false, createRecipeForBook: true});
						}
				},
                {
                    title: 'Replace by Barcode Scan',
                    icon: 'md-barcode',
                    onPress: () => {
                        this.props.toggleBottomSheetMenuForSwapOption(false);
                        this.props.toggleBottomSheetMenuForTrackOption(false);
                        const {activeMeal} = this.props;
                        let date = prettyDate();
                        this.props.setUPCData({ planId: activeMeal.plan_id, planMealType: activeMeal.type });
                        Actions.barCodeScan({ planMealType: activeMeal.type, add: false, replace: true, scannedRecipeForBook: false});
                        //this.props.loadNutritionForUPC({upc: '829364002464', planMealType: activeMeal.type, add: false, replace: true, scannedRecipeForBook: false});
                    }
                }
            ],
		}
	}

	componentWillMount () {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => true,
			onPanResponderRelease: () => {
				if (this.state.isShowOption) {
					this.setState({
						isShowOption: false
					});
				}
			},
			onPanResponderTerminate: () => {
				if (this.state.isShowOption) {
					this.setState({
						isShowOption: false
					});
				}
			},
			onShouldBlockNativeResponder: () => false
		});
		PushService.setOnNotificationOpenedCallback((notification) =>
			this.handleOnPushNotificationOpened(notification)
		);
		PushService.readQueue();
	}

    componentDidMount() {
        tracker.trackScreenView("HomePage");
    }

	componentWillReceiveProps (newProps) {
		if (newProps.messageToast !== this.props.messageToast && newProps.messageToast.placeToShow === 'main') {
            toastSubMessage = newProps.messageToast.text;
			this.setState({renderToast:true},()=>{
                this.toast.showToast();
                setTimeout(()=>{
                    this.setState({
							renderToast: false,
                    });
                },5000)
			});
		}
		if (newProps.activeTabId !== this.props.activeTabId) {
			this.setState({
				activeTabId: newProps.activeTabId,
				title: newProps.title,
				isShowOption: false
			});
		}
		if (newProps.isFirstLogin !== this.props.isFirstLogin) {
			this.setState({ isOnboardingOpen: newProps.isFirstLogin });
		}

		// hide/show bottom tabs on the recipe book screen when keyboard is visible/hidden (!Android only!)
		if(Platform.OS !== 'ios') {
			if(newProps.activeTabId === 2) { //if going to tab 1:
				Keyboard.addListener('keyboardDidShow', this.hideTabs);
				Keyboard.addListener('keyboardDidHide', this.showTabs);
			} else if(this.props.activeTabId === 2) { //if switching to a different tab from tab 1:
				Keyboard.removeAllListeners('keyboardDidShow');
				Keyboard.removeAllListeners('keyboardDidHide');
			}
		}
	}

	showTabs = () => this.setState({ renderTabs: true });
	hideTabs = () => this.setState({ renderTabs: false });
	openMenu = () => this.setState({ isMenuOpen: true });
	closeMenu = () => this.setState({ isMenuOpen: false });


    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'Aplication needs to access your location.'
                }
            );
            console.log('here', granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return Promise.resolve();
            } else {
                return Promise.resolve();
            }
        } catch (err) {
            console.warn(err)
        }
    }

	handleOnPushNotificationOpened ({ category, payload }) {
		if (category == 'chat') {
			// navigate to chat screen
			this.props.getChatMessage();
			Actions.chat();
		}
		if(category == 'recipe_share') {
			this.props.getRecipeById(+payload.recipe_id, servings=1, {recipeImg: ''});
		}
		if(category == 'feedback') {
			// navigate to latest recipe for review
			Actions.recipeDetail({reviewMostRecent: true});
		}
	}

	showCalendar = () => {

		const { activeTabId } = this.state;
		const { changeDate, getMealPlan, currentDateMealPlan, currentDayForGroceryList, changeDateForGroceryList, getGroceryList } = this.props;
		if (Platform.OS === 'ios') {
			if (activeTabId === 2) {
				Actions.picker({ setNewDate: changeDate, getList: getMealPlan, date: currentDateMealPlan });
			}
			if (activeTabId === 0) {
				Actions.picker({
					setNewDate: changeDateForGroceryList,
					getList: getGroceryList,
					date: currentDayForGroceryList
				});
			}
		}
		else {
			if (activeTabId === 2) {
				showAndroidCalendar(changeDate, getMealPlan, currentDateMealPlan);
			}
			if (activeTabId === 0) {
				showAndroidCalendar(changeDateForGroceryList, getGroceryList, currentDayForGroceryList);
			}
		}
	};

	closeOnbordingScreen = () =>
		this.setState({ isOnboardingOpen: false }, () =>
			this.props.closeOnboardingScreen()
		);

	closeWelcomeScreen = () =>
		this.setState({ isWelcomeOpen: false }, () =>
			this.props.closeWelcomeScreen()
		);


	closeReleaseNotes = () => {
		this.setState({isReleaseNote: false}, () => 
			this.props.closeReleaseNotes()
		);
	};

	renderSideMenu () {
		if (this.state.isMenuOpen) return <SideMenu close={this.closeMenu} />;
	}

	renderContent () {
		switch (this.state.activeTabId) {
			case 0:
				return <HomePage />;
			case 1:
				return <Progress />;
			case 2:
				return <RecipeBook />;
			//case 3:
				//return <GroceryList />;
			case 3:
				return;
		}
	}

	renderListTitle(){
		const { currentDateMealPlan, changeDate, getMealPlan, getDailyChecklist} = this.props;
		const { mealplan = [] } = this.props.meals;
		return(
			<ListTitle needArrow date={currentDateMealPlan} changeDate={changeDate} getList={getMealPlan} getCheckList={getDailyChecklist} mealplan/>
		)
	}

    renderHeader () {
		const iconProfile = Platform.select({
			ios: 'md-menu',
			android: 'md-menu'
		});
		switch (this.state.activeTabId) {
			case 0:
				return <Header
					title={this.props.title}
					leftIcon={iconProfile}
					leftButtonPress={() => Actions.profile({selectDate:this.showCalendar})}
				/>;
	    	case 1:
				return <Header
					title={this.props.title}
                    leftIcon={iconProfile}
                    leftButtonPress={() => Actions.profile()}
					rightButtonPress={() => this.props.toggleBottomSheetMenuForOption(true)}
				/>;
			case 3:
				return <Header
					title={this.props.title}
					leftIcon={iconProfile}
					leftButtonPress={() => Actions.profile()}
					rightIcon={'ellipsis-v'}
					rightButtonPress={() => this.props.toggleBottomSheetMenuForGroceryOption(true)}
				/>;
		}
	}

	renderOnboardingScreen () {
		if (this.state.isOnboardingOpen) {
			return (
				<OnboardingScreen
					height={this.state.screenHeight}
					width={this.state.screenWidth}
					onClose={this.closeOnbordingScreen}/>
			);
		}
	}

	renderWelcomeScreen () {
		if (this.state.isWelcomeOpen) {
			return (<WelcomeScreen
				onClose={this.closeWelcomeScreen}
				doctor={this.props.doctorPhoto}
				greeting={this.props.greeting}
				showGoals={this.state.showGoals}
			/>);
		}
	}

	renderReleaseNotes() {
		if(this.state.isReleaseNote) {
			return (
				<ReleaseNotes
					height={this.state.screenHeight}
					width={this.state.screenWidth}
					onClose={this.closeReleaseNotes}
				/>
			)
		}
	}

	renderTabs() {
		if (this.state.renderTabs) {
			return (
				<Tabs
					id={this.state.activeTabId}
					onChangeTab={this.props.changeActiveTab}
					onPressChat={this.props.getChatMessage}
				/>
			);
		}
	}

    renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        const { toastStyle, toastTitle, toastSubTitle } = styles;
        if(this.state.renderToast){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
                        <Emojicon name={'thumbsup'} size={60} />
                        {/*<Text style={toastTitle}>{toastMessage}</Text>*/}
                        <Text style={toastSubTitle}>{toastSubMessage}</Text>
                    </View>
                }
                animationType={'fade'}
                animationDuration={200}
                topBottomDistance={Height}
                toastStyle={toastStyle}
                autoCloseTimeout={5000}
                ref={(c) => { this.toast = c }}
            />);
        }
    }

	render () {
		const { activeTabId, bottomSheetButtons, bottomSheetButtonsForGrocery, bottomSheetButtonsForTrack } = this.state;
		const { isBottomSheetOpen,
			isBottomSheetForOptionOpen,
			isBottomSheetForOptionGroceryOpen,
			allowMealplanRegeneration,
			isBottomSheetForOptionSwapOpen,
			activeMeal } = this.props;

		if(activeMeal && activeMeal.title){
            bottomSheetButtonsForTrack[0].title = `Adapt this Recommendation`;
		}

		//let tempbottomSheetButtonsForSwap = _.cloneDeep(bottomSheetButtonsForTrack);
        //tempbottomSheetButtonsForSwap.shift();
		const displayButtons = allowMealplanRegeneration ? bottomSheetButtons : bottomSheetButtons.slice(0, -1);
        let Height=Dimensions.get('window').height/2;
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<View style={styles.container} onLayout={(e) => {
					if (e.nativeEvent.layout.width !== this.state.screenWidth) {
						this.setState({
							screenWidth: e.nativeEvent.layout.width,
							screenHeight: e.nativeEvent.layout.height
						});
					}
				}}>
					{this.renderHeader()}
					{this.renderContent()}
					{this.renderTabs()}
					{this.renderSideMenu()}
					{/*{this.showOption()}*/}
					{this.renderOnboardingScreen()}
					{this.renderWelcomeScreen()}
					{this.renderReleaseNotes()}
					{this.renderToast()}
					{isBottomSheetOpen && <BottomSheetMenu/>}
					{isBottomSheetForOptionOpen && <BottomSheetMenuForOption buttons={bottomSheetButtons}/>}
					{isBottomSheetForOptionGroceryOpen &&
					<BottomSheetMenuForOption buttons={bottomSheetButtonsForGrocery}/>}
                    { isBottomSheetForOptionSwapOpen && <BottomSheetMenuForOption buttons={bottomSheetButtonsForTrack}/>}
                    {/* isBottomSheetForOptionTrackOpen && <BottomSheetMenuForOption buttons={bottomSheetButtonsForTrack}/>*/}
				</View>
			</SafeAreaView>
		);
	}
}

const color = {
	iconColor: '#929292'
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	optionView: {
		position: 'absolute',
		width: 150,
		height: 90,
		backgroundColor: 'white',
		top: (Platform.OS === 'android') ? 50 : 50,
		left: 10,
		borderColor: 'lightgray',
		borderWidth: 1
	},
	option: {
		top: 15,
		height: 35,
		paddingLeft: 20,
		justifyContent: 'center',
		color: color.iconColor,
		fontWeight: 'bold'
	},
	optionActive: {
		top: 15,
		height: 35,
		paddingLeft: 20,
		justifyContent: 'center',
		color: colors.primaryOrange,
		fontWeight: 'bold'
	},
    toastStyle: {
        borderRadius:10,
        height:170,
        width:170
    },
    toastTitle: {
        color: '#fff',
        fontSize:18,
        textAlign: 'center',
        justifyContent:'center'
    },
    toastSubTitle: {
        color: '#fff',
        fontSize:15,
        textAlign: 'center',
        justifyContent:'center'
    }
};

const mapStateToProps = ({ auth, main, grocery, mealPlan, clientPermissions, recipeBook }) => {
	const { isFirstLogin, doctorPhoto } = auth;
	const { title, activeTabId, isOnboardingOpen, isReleaseNotesOpen, isWelcomeOpen, greeting, messageToast, isBottomSheetOpen, setButtonsBottomSheetMenu, isBottomSheetForOptionOpen, isBottomSheetForOptionGroceryOpen, isBottomSheetForOptionSwapOpen, isBottomSheetForOptionTrackOpen, activeMeal } = main;
	const { currentDayForGroceryList, groupBy } = grocery;
	const { currentDateMealPlan, mealNotes, mealPlans } = mealPlan;
	const { showGoals, allowMealplanRegeneration } = clientPermissions;
    const { editRecipe,recipeBookActionError } = recipeBook;
	return {
		isFirstLogin,
		title,
		activeTabId,
		currentDayForGroceryList,
		currentDateMealPlan,
		meals: mealPlans,
		groupBy,
		doctorPhoto,
		isOnboardingOpen,
		isReleaseNotesOpen,
		isWelcomeOpen,
		greeting,
        activeMeal,
		messageToast,
		mealNotes,
		showGoals,
        editRecipe,
		allowMealplanRegeneration,
		isBottomSheetOpen,
        recipeBookActionError,
		setButtonsBottomSheetMenu,
		isBottomSheetForOptionOpen,
		isBottomSheetForOptionGroceryOpen,
        isBottomSheetForOptionSwapOpen,
        isBottomSheetForOptionTrackOpen
	};
};

export default connect(mapStateToProps, {
	changeActiveTab,
	getChatMessage,
	getMealPlan,
	getRecipeById,
    getRecipeByIdForEditing,
	regeneratePlan,
	getDailyChecklist,
	getGroceryList,
	changeDate,
	changeDateForGroceryList,
	changeGroupBy,
	closeOnboardingScreen,
	closeReleaseNotes,
	closeWelcomeScreen,
	toggleBottomSheetMenuForOption,
	toggleBottomSheetMenuForGroceryOption,
    toggleBottomSheetMenuForSwapOption,
    toggleBottomSheetMenuForTrackOption,
    loadNutritionForUPC,
    setUPCData

})(MainScreen);
