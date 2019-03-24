/**
 * Created by mponomarets on 6/25/17.
 */

import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    PushNotificationIOS,
    Platform,
    Alert,
    Keyboard,
    PermissionsAndroid,
    StyleSheet,
    FlatList

} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import {UpcomingMeals, Goals, PointsBanner, CloseDayButton} from './common';
import DayMeals from './common/DayMeals';
import TrackerWellNess from './common/TrackWellNess';
import MealJournal from './Home/MealJournal';
import Banner from './common/Banner';
import {AddButton} from './Home/AddButton';
import {AdditionalMenu} from './Home/AdditionalMenu';
import {SelectMealModal} from './Home/SelectMealModal';
import {BannerData} from './BannerData';
import {
    getDataForHomePage,
    openRecipe,
    getPoints,
    getDailyChecklist,
    setLockTab,
    getRestaurant,
    getMealPlan,
    changeDate,
    toggleBottomSheetMenuForSwapOption,
    toggleBottomSheetMenuForTrackOption,
    setImageForMeal,
    getRecipeById
} from '../actions';
import {Spinner} from './Home/common';
import NutritionSummary from './common/NutritionChart';
import BottomSheetMenuForOption from './BottomSheet/BottomSheetMenuForOption';
import {
    textStyles,
    colors,
    color_arr,
    getKeyFromStorage,
    prettyDate,
    showImagePicker,
    typeMeal,
    tracker,
    IOS_KEY,
    ANDROID_KEY,
    trackerIcon,
    sortChecklist,
    marginStyles,
} from '../actions/const';
import moment from "moment/moment";
import codePush from 'react-native-code-push';
let orderedChecklist = [];

let data;
let currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let date = month + '/' + day + '/' + year;

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            additionalMenu: false,
            selectMealModal: false,
            selectedOption: '',
            randomNumber: 0,
        };
        this.handleVisibility = this.handleVisibility.bind(this);
    }

    componentWillMount() {

        codePush.sync({
            deploymentKey: Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY,
            updateDialog: {
                title: 'Update available!',
                mandatoryUpdateMessage: 'An update is available that must be installed.',
                mandatoryContinueButtonLabel: 'Update'
            },
            installMode: codePush.InstallMode.IMMEDIATE
        });

        this.props.getDataForHomePage();
        getKeyFromStorage().then(({name}) => this.setState({userName: name}));

        if (this.props.showPoints) {
            this.props.getPoints();
        }
        this.props.getDailyChecklist(date);
        this.props.setLockTab();

    }

    componentDidMount() {
        const {date, changeDate, getMealPlan} = this.props;
        tracker.trackScreenView("HomePage");
        changeDate(date || prettyDate());
        getMealPlan();
        this.setState({
            randomNumber: Math.floor(Math.random() * 3)
        });
    }


    componentWillReceiveProps(nextProps){
        const { dailyChecklist } = nextProps;
        this.setOrder(sortChecklist(dailyChecklist));
    }

    setTime = (time) => {

        let tempArray = JSON.parse(time);
        if (tempArray.hasOwnProperty('daily')) {

            let data = _.find(tempArray.daily, function (item) {
                return item.dayOfWeek === 'wednesday';
            });

            let d1 = moment(data.timestamp, 'HH:mm:ss');
            let newTime = moment();
            let duration = moment.duration(d1.diff(newTime));
            let hours = duration.asHours();

            if(hours >= 0 && hours <= 1) {
                hours =  1
            }else if (hours > 0) {
                hours = parseInt(duration.asHours());
            }else{
                hours = 0;
            }

            return hours

        }else {

            for(i = 0; i < tempArray.intradaily.length; i++){

                let d1 = moment(tempArray.intradaily[i].timestamp, 'HH:mm:ss');
                let newTime = moment();
                let duration = moment.duration(d1.diff(newTime));
                let hours = duration.asHours();


                if(hours >= 0 && hours <= 1) {
                    return 1
                }else if (hours > 0) {
                    return parseInt(duration.asHours());
                }else{
                    hours = 0;
                }
            }
            return  0
        }

    };


    setOrder = (dailyCheckList) => {

        if(dailyCheckList.length > 0){
            dailyCheckList = dailyCheckList.map((item)=>{
                if(item.isCompleted){
                    item.time = 0
                }else{
                    item.time  = this.setTime(item.item.frequency);
                }

                return item
            });

            orderedChecklist = _.cloneDeep(dailyCheckList);
            orderedChecklist = _.orderBy(orderedChecklist, ['time'], ['asc']);
            let temp = _.remove(orderedChecklist, ['time', 0]);
            temp.map((item) => {
                orderedChecklist.push(item);
            });
        }

    };

    onPressPointsBanner = () => {
        Actions.pointsScreen();
        this.props.getPoints();
    };

    onSwapMeal = () => {
        this.props.toggleBottomSheetMenuForSwapOption(true)
    };

    onImageOpen = (plan_id, isAssigned) => {
        showImagePicker(({base64, type: imageType}) =>

            this.props
                .setImageForMeal({planId: plan_id, base64, isAssigned, imageType})
                .then(() => console.log('done'))
        )
    };

    onMealPress = () => {
        const {getRecipeById, activeMeal} = this.props;
        getRecipeById(id = activeMeal.id, servings = activeMeal.servings, {
            recipeImg: activeMeal.image,
            recipePhoto: activeMeal.photo,
            isConfirmed: activeMeal.isConfirmed
        });
    };

    onTrack = () => {
        this.props.toggleBottomSheetMenuForTrackOption(true)
    };

    onPressBanner = (title) => {
        switch (title) {
            case 1:
                alert('Education Pressed');
                break;
            case 2:
                this.onReferPress();
                break;
            case 3:
                alert('Your Kitchry Award Points is Pressed');
                break;
            case 4:
                alert('You need more tracker Pressed');
                break;

        }
    };

    onReferPress = () => {
        Actions.referForm();
    };

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'Aplication needs to access your location.'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return Promise.resolve();
            } else {
                return Promise.resolve();
            }
        } catch (err) {

        }
    }

    renderTitle() {
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }, marginStyles.sectionMargin]}>
                <Text style={textStyles.l1Text}>YOUR CARE PLAN TODAY</Text>
            </View>

        )
    }

    renderNutritionTitle() {
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }, marginStyles.sectionMargin]}>
                <Text style={textStyles.l2Text}>Nutrition</Text>
            </View>

        )
    }

    renderMealTitle() {
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }, marginStyles.sectionMargin]}>
                <Text style={textStyles.l1Text}>Meals</Text>
                <TouchableOpacity onPress={() => Actions.mealPlan()}>
                    <Text style={textStyles.description12}>See All</Text>
                </TouchableOpacity>

            </View>

        )
    }

    renderMealDescription() {
      return (
          <View style={[{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
          }, marginStyles.descriptionMargin]}>
              <Text style={textStyles.description12}>Recommended based on your nutrition needs.</Text>
          </View>
      )
    }


    renderWellnessTitle() {
        return (
            <View style={[{
                flexDirection: 'row',
                height: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }, marginStyles.sectionMargin]}>
                <Text style={textStyles.l2Text}>Wellness</Text>
            </View>
        )
    }

    renderNutritionDescription() {
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                
            }], marginStyles.descriptionMargin}>
                <Text style={textStyles.description12}>Your nutrition consumption so far today</Text>
            </View>
        )
    }

    renderWellnessDescription() {
        return (
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }, marginStyles.descriptionMargin]}>

                <Text style={textStyles.description12}>You are requested to track the following information based on your wellness needs.</Text>
            </View>
        )
    }

    findIndexArr() {
        const {loadingUpcoming, upcomingMeal, activeMeal} = this.props;
        let current = typeMeal.indexOf(activeMeal.type);
        let upcoming = typeMeal.indexOf(upcomingMeal.type);

        if (current >= upcoming) {
            return true
        } else {
            return false
        }
    };

    renderBanner() {
        const {showPoints, sumAllPoints} = this.props;
        bannerColor = 'black';
        if (BannerData[this.state.randomNumber].id === 3) {
            headerText = BannerData[this.state.randomNumber].title + " " + sumAllPoints;
            bannerColor = 'red';
        } else if (BannerData[this.state.randomNumber].id === 4) {
            headerText = BannerData[this.state.randomNumber].title.replace("num", "4");
            bannerColor = 'yellow';
        } else {
            headerText = BannerData[this.state.randomNumber].title;
            bannerColor = 'orange';
        }
        return (
            <View>
                <Banner
                    header={headerText}
                    description={BannerData[this.state.randomNumber].description}
                    onPress={() => this.onPressBanner(BannerData[this.state.randomNumber].id)}
                    icon={BannerData[this.state.randomNumber].icon}
                    color={bannerColor}/>
            </View>
        )
    }


    renderUpcoming() {
        const {loadingUpcoming, upcomingMeal} = this.props;
        if (!loadingUpcoming && upcomingMeal)
            return <UpcomingMeals meal={upcomingMeal.title ? upcomingMeal : 'default'}/>;
        else return <Spinner/>;
    }

    renderWellnessTrackers() {

            return(
            <View style={{flex:1,justifyContent: 'center'}}>
                <FlatList
                    data={orderedChecklist}
                    keyExtractor={(item, index) => index}
                    renderItem={({item}) =>
                        <TrackerWellNess item={item}
                                        title={item.item.sub_topic}
                                        description={item.item.title}
                                        icon={trackerIcon(item.item.sub_topic)}
                                        time={item.item.frequency}
                                        tracked={item.isCompleted}/>
                    }
                />
            </View>
            )
        }


    
    renderDayMeals() {
        const {loading, mealPlans, upcomingMeal} = this.props;
        
        if (!loading && mealPlans) {
            index = _.findIndex(mealPlans.mealplan, {type: upcomingMeal.type});
            return <DayMeals meal={mealPlans.mealplan ? mealPlans.mealplan : []}
                             activeSlide={index}
                             onSwapMealClicked={this.onSwapMeal}
                             onImageClicked={this.onImageOpen}
                             onSelectMeal={this.onMealPress}
                             onTrackClicked={this.onTrack}/>;
        }
        else return <Spinner/>;
    }

    renderPointsBanner() {
        const {showPoints, sumAllPoints} = this.props;
        if (showPoints)
            return (
                <PointsBanner
                    userName={this.state.userName}
                    points={sumAllPoints}
                    onPress={this.onPressPointsBanner}
                />
            );
    }

    renderAdditionalMenuButton() {
        return (
            <AddButton onPress={() => {
                this.handleVisibility('open');
                tracker.trackEvent("Click On + ", "HomePage");
            }
            } inModal={false}/>
        );
    }

    handleVisibility(button) {

        if (button === 'open') {
            this.setState({
                additionalMenu: true,
                selectMealModal: true
            })
        } else if (button === 'close') {
            this.setState({
                additionalMenu: false,
                selectMealModal: false,
                selectedOption: ''
            })
        } else {
            this.setState({
                additionalMenu: !this.state.additionalMenu,
                selectMealModal: true,
                selectedOption: button
            })
        }

    }

    handleSelectedMeal({title, add, replace, planId}) {
        const {selectedOption} = this.state;
        let date = prettyDate();

        if (selectedOption === 'addmeal') {
            Actions.recipeBook({planId, mealType: title, date, add, replace});
        } else if (selectedOption === 'barcode') {
            Actions.barCodeScan({planMealType: title, add, replace});
        } else if (selectedOption === 'nearby') {
            {
                this.requestLocationPermission().then(() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                            let latitude = position.coords.latitude;
                            let longitude = position.coords.longitude;
                            Actions.restaurant({date, planId, add, replace, title, latitude, longitude});
                        },
                        (error) => alert(error.message)
                    );
                })
            }
        }

    }

    render() {
        const {bottomSheetButtons} = this.state;
        const {showNutrients} = this.props;
        return (
            <View style={{flex: 1, marginBottom: 60, backgroundColor: colors.mainBackground}}>
                <ScrollView style={{flex: 1}}>
                    {this.renderBanner()}
                    {this.renderTitle()}
                    {(showNutrients) && this.renderNutritionTitle()}
                    {this.renderNutritionDescription()}
                    <View style={{flex: 0.2, backgroundColor: '#fff'}}>
                        <NutritionSummary visible={showNutrients} dailyMeal={true} data={null} servings={null}/>
                    </View>
                    {this.renderMealTitle()}
                    {this.renderMealDescription()}
                    {this.renderDayMeals()}
                    {this.renderWellnessTitle()}
                    {this.renderWellnessDescription()}
                    {this.renderWellnessTrackers()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        main: {title, listDish, newsList, isBottomSheetForOptionSwapOpen, activeMeal},
        home: {
            error,
            loadingUpcoming,
            upcomingMeal,
        },
        clientPermissions: { showGoals, showPoints, showNutrients },
        pointsAwards: { sumAllPoints, loadingPoints },
        mealPlan: { mealPlans, loading },
        trackers: { dailyChecklist },
    } = state;

    return {
        title, listDish, newsList, error,
        loadingUpcoming,
        upcomingMeal,
        sumAllPoints,
        loadingPoints,
        showGoals,
        showPoints,
        mealPlans,
        loading,
        dailyChecklist,
        isBottomSheetForOptionSwapOpen,
        activeMeal,
        showNutrients
    };
};

export default connect(mapStateToProps, {
    getDataForHomePage,
    openRecipe,
    getPoints,
    getDailyChecklist,
    setLockTab,
    getMealPlan,
    changeDate,
    toggleBottomSheetMenuForSwapOption,
    toggleBottomSheetMenuForTrackOption,
    setImageForMeal,
    getRecipeById
})(HomePage);
