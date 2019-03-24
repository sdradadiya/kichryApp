/**
 * Created by mponomarets on 7/4/17.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    FlatList,
	Platform,
	Alert,
    StatusBar
} from 'react-native';
import { InfoBox, ForegroundNotification, Header }from './common';
import MealPreview from './common/MealPreview';
import ListTitle from './common/ListTitle';
import NutritionSummary from './common/NutritionSummary';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import SafeAreaView from 'react-native-safe-area-view';
import {
    getMealPlan,
    changeDate,
    getRecipeById,
    closeAllMenu,
    toggleBottomSheetMenu,
    setActiveMeal,
    getMealPlanNotes,
    setTabForMealPlanScreen,
    toggleBottomSheetMenuForOption,
	getDailyChecklist,
	regeneratePlan
} from '../actions';
import Toast from 'react-native-easy-toast';
import TrackDay from './Trackers/TrackDay';
import BottomSheetMenuForOption from './BottomSheet/BottomSheetMenuForOption';
import {prettyDate, colors, formatClientDate, formatNotesDate, tracker, tabStyles, textStyles} from '../actions/const';
import { omitBy, isNull } from 'lodash';

class MealPlan extends Component {
	constructor (props) {
		super(props);
		this.state = {
			width: Dimensions.get('window').width,
			isRDNotesvisible: true,
			selectedTab: this.props.tab,
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
		};
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.messageToast !== this.props.messageToast && nextProps.messageToast && nextProps.messageToast.placeToShow === 'mealPlan') {
			this.refs.toast.show(nextProps.messageToast.text, 3000);
		}
	}

	componentDidMount () {
		const { date, changeDate, getMealPlan } = this.props;
		
		this.props.toggleBottomSheetMenu(false);
		changeDate(date || prettyDate());
		getMealPlan();
		tracker.trackScreenView("MealPlan");

	}

	onMealPress (id, servings, recipeImg, recipePhoto, isConfirmed) {
		if (id !== this.props.openMealId) {
			this.props.getRecipeById(id, servings, { recipeImg, recipePhoto, isConfirmed });
			this.props.closeAllMenu(true);
		}
	}

	openBottomSheetMenu = (activeMeal) => {
		this.props.setActiveMeal(activeMeal);
		this.props.toggleBottomSheetMenu(true);
	};

	onCloseForegroundNotification = () =>
		this.setState({ isRDNotesvisible: false });


    renderListTitle(){
        const { currentDateMealPlan, changeDate, getMealPlan, getDailyChecklist, date} = this.props;
        return(
            <ListTitle needArrow date={date} changeDate={changeDate} getList={getMealPlan} getCheckList={getDailyChecklist}/>
        )
    }

    renderStatusBar () {
        return Platform.OS === 'android' ? (
            <StatusBar translucent={true} backgroundColor={'transparent'} />
        ) : (
            <StatusBar barStyle="light-content" />
        );
    }

    renderHeader () {
        const iconBack = Platform.select({
            ios: 'ios-arrow-back',
            android: 'md-arrow-back'
        });
                return <Header
                    title={this.renderListTitle()}
                    leftIcon={iconBack}
                    leftButtonPress={() => Actions.pop()}
                    rightIcon={'ellipsis-v'}
                    rightButtonPress={() => this.props.toggleBottomSheetMenuForOption(true)}
                />;

    }

	renderRDNotes() {
		const {date, mealNotes} = this.props;
		if(mealNotes && mealNotes.length > 0) {
			let mealDate = formatClientDate(date);
			return mealNotes.map((mealNotes, index) => {
				let mealNotesDate = formatNotesDate(mealNotes.date);
				if (mealNotesDate === mealDate) {
					if (this.state.isRDNotesvisible) {
						return (
							<View style={{ backgroundColor: 'rgba(242,242,242,1)' }} key={index}>
								<ForegroundNotification
									mealNotes={mealNotes}
									doctorName={this.props.doctorName}
									closeNotification={this.onCloseForegroundNotification}
								/>
							</View>
						);
					}
				}
			});
		} else {
			return null
		}
	}

	renderMeal = ({item}) => {

		const { preferredServingSize } = this.props.meals;

		if(item.id === -1) {
			return null;
		};
		
		return(
			<TouchableOpacity
				style={{ backgroundColor: 'rgba(242,242,242,1)' }}
				onPress={() => this.onMealPress(item.id, item.servings, item.image, item.photo, item.isConfirmed)}
			>
				<MealPreview
					{...omitBy(item, isNull)}
					showNutrients={this.props.showNutrients}
					preferredServingSize={preferredServingSize}
					onPressMenu={() => this.openBottomSheetMenu(item)}
				/>
			</TouchableOpacity>
		);

	};

	renderEmptyList = () => {
		return (
			<InfoBox message={'No meal plan found for this day'}/>
		);
	};

	renderFooter = () => {
		return <View style={{ marginBottom: 195}}></View>;
	};

	renderMeals(){

		const { meals, loading } = this.props;

		if (!loading) {
			return(
				<FlatList
					data={meals.mealplan}
					renderItem={this.renderMeal}
					ListEmptyComponent={this.renderEmptyList}
					keyExtractor={({plan_id}) => plan_id}
					ListFooterComponent={this.renderFooter}
				/>
			);
		} else {
			return (
				<ActivityIndicator style={{ margin: 20 }} color={colors.primaryGrey} size={'large'}/>
			);
		}

	}

	renderTabs() {

		const { tab } = this.props;
		const {tabsContainer, tabStyle, ativeTabStyle} = styles;

		const tabs = [
			{name: 'Meals', selectedTab: 'Meals'},
			{name: 'Trackers', selectedTab: 'Trackers'}
		];

		const displayTabs = tabs.map((item, index) => {
			return(
				// selectedTab: item.selectedTab
				<TouchableOpacity
					key={index}
					onPress={() => this.props.setTabForMealPlanScreen(item.selectedTab)}
					style={tab == item.selectedTab ? ativeTabStyle : tabStyle}
				>
					<Text style={tab == item.selectedTab ? tabStyles.activeTabTitle : tabStyles.inactiveTabTitle}>{item.name}</Text>
				</TouchableOpacity>
			);
		});

		return (
			<View style={{height: 40}}>
				<View style={[tabsContainer, tabStyles.container]}>
					{displayTabs}
				</View>
			</View>
		);

	}

	renderContent() {

		const { tab } = this.props;
		const { date, changeDate, getMealPlan} = this.props;
		const { mealplan = [] } = this.props.meals;

		if(tab === 'Meals') {
			return(
				<View>
					{/* <ListTitle needArrow date={date} changeDate={changeDate} getList={getMealPlan} mealplan/> */}
					<NutritionSummary visible={mealplan.length>0}/>
					{this.renderRDNotes()}
					{this.renderMeals()}

					<Toast
						ref="toast"
						style={styles.toastStyle}
						position='top'
						positionValue={0}
						fadeInDuration={900}
						fadeOutDuration={900}
						opacity={.9}
						textStyle={styles.toastTitle}
					/>

				</View>
			);
		} else {
			return (
				<TrackDay date={date} />
			);
		}

	}

	render () {

		const { scrollContainer } = styles;
		const { isBottomSheetForOptionOpen } = this.props;
		const { bottomSheetButtons } = this.state;

		return (
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<View style={scrollContainer}>
					{this.renderStatusBar()}
					{this.renderHeader()}
					{this.renderTabs()}
					{this.renderContent()}
					{isBottomSheetForOptionOpen && <BottomSheetMenuForOption buttons={bottomSheetButtons}/>}
				</View>
			</SafeAreaView>
		);
	}
}

const styles = {
	scrollContainer: {
		flex: 1,
		backgroundColor:'white'
	},
	rightSwipeItem: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: 20
	},
	listItem: {
		height: 75,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabsContainer: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: 0,
	},
	tabStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	ativeTabStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#fff'
	},
	toastStyle: {
		backgroundColor: 'red',
		width: '100%',
		borderRadius: 0
	},
	toastTitle: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 17
	}
};

const mapStateToProps = (state) => {
	const {
		mealPlan: {
			mealPlans,
			mealNotes: { notes },
			currentDateMealPlan,
			loading,
			error,
			tab
		},
		clientPermissions: { showNutrients },
		main: { openMealId, messageToast, isBottomSheetForOptionOpen },
		auth: { doctorName }
	} = state;
	return {
		meals: mealPlans,
		date: currentDateMealPlan,
		loading,
		error,
		openMealId,
		messageToast,
		mealNotes: notes,
		showNutrients,
		doctorName,
		tab,
        isBottomSheetForOptionOpen
	};
};

export default connect(mapStateToProps, {
	getMealPlan,
	changeDate,
	getRecipeById,
	closeAllMenu,
	toggleBottomSheetMenu,
	setActiveMeal,
	getMealPlanNotes,
	setTabForMealPlanScreen,
    toggleBottomSheetMenuForOption,
	getDailyChecklist,
	regeneratePlan
})(MealPlan);
