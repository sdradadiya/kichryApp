import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {
	Alert,
	View,
	Keyboard,
	Platform,
	TouchableOpacity,
	Text,
	FlatList,
	ActivityIndicator,
	ScrollView,
	Dimensions,
	AsyncStorage,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafeAreaView from 'react-native-safe-area-view';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Input, Header, InfoBox} from './common';
import MealPreview from './common/MealPreview';
import FilterPopUp from './common/FilterPopUp';
import {colors, DEFAULT_RECIPE_IMG_URL, prettyDate, tracker, tabStyles, textStyles} from '../actions/const';
import {connect} from 'react-redux';
import _ from 'lodash';
import {
    searchMeal,
    getRecipeById,
    getRecipeByIdForEditing,
    setFiltersList,
    resetSearchScreen,
    removeDietRestrictions,
    getRecipeBook,
    recipeDelete,
    getProductBySearch,
    getGlobalRecipes,
    setLockTab
} from '../actions';
import BottomSheetMenuForOption from './BottomSheet/BottomSheetMenuForOption';
import { SelectMealModalRecipeBook } from './RecipeBook/SelectMealModalRecipeBook';
import { omitBy, isNull } from 'lodash';
import Permissions from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-another-toast';
import Emojicon from 'react-native-emojicon';
let renderAlert = false;
let isCancel = false;
let toastMessage, toastImage;
let onlyOnce = false;
let isCancelClick = false;

const AlertPopup = ({
	cancelButton = 'Cancel',
	confirmButton = 'OK',
	onPressCancel,
	onPressConfirm,
	title,
	message,
	cancelable = true
}) => {
	let buttons = [];
	if (onPressCancel)
		buttons.push({ text: cancelButton, onPress: onPressCancel });
	buttons.push({ text: confirmButton, onPress: onPressConfirm });
	Alert.alert(title, message, buttons);
};


const tabs = [
    {name: 'By Dietitians', indicator: 'all'},
    {name: 'Recents', indicator: 'viewed'},
    {name: 'Favorites', indicator: 'pinned'},
    {name: 'Mine', indicator: 'created'},
];

class SearchScreen extends Component {
    constructor (props) {
        super(props);
        this.state = {
            text: '',
            error: '',
            page: 1,
            activeTab: 'viewed',
            activeTabId: this.props.activeTabId,
            pages: this.props.pages,
            searchList: this.props.searchResult,
            loading: this.props.loading,
            showSearchFilters: false,
            filters: this.props.filters,
            showNutrients: this.props.showNutrients,
            deletedRecipeIds: [],
            selectMealModal: false,
            AddOrScan: '',
            otherProduct:false,
            from:0,
            to:20,
            nutrition_targets:this.props.nutrition_targets,
            nutrition_search:[],
            lockTab:this.props.lockTab,
            renderToast:false,
            nutritionLock: true
        };
        onlyOnce = false;
        this.goBack = this.goBack.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    componentWillReceiveProps (newProps) {

        if (newProps.searchResult !== this.props.searchResult) {
            this.setState({
                error: newProps.error,
                searchList: newProps.searchResult,
            });
        }

        if (newProps.loading !== this.state.loading) {
            this.setState({
                error: newProps.error,
                searchList: newProps.searchResult,
                loading: newProps.loading,
                loadingMore: false,
                pages: newProps.pages
            });
        }
        if (newProps.error !== this.props.error) {
            this.setState({ error: newProps.error });
        }
        if (newProps.filters !== this.state.filters) {
            this.setState({
                    filters: newProps.filters,
                    isSearchStart: true,
                    page: 1
                },
                () => {
                    this.props.resetSearchScreen();
                    this.tabHandler(this.state.activeTab, this.state.text)
                }
            );
        }
    }

    componentDidMount()
    {
        tracker.trackScreenView("RecipeBook");
    }

    componentWillMount () {
        const {text, page, activeTab} = this.state;
		const {mealType, restrictions} = this.props;


		if (this.props.mealType) {
			let activeFilters = this.props.filters;
			// TODO: fix shallow copy and consequent modification of props through activeFilters' array modification
			activeFilters['mealTypes'].push(this.props.mealType);

                if(restrictions[0] != "") {

                    for(let i = 0; i < restrictions.length; i ++) {

                        if (restrictions[i] == 'Vegetarian' || restrictions[i] == 'Paleo' || restrictions[i] == 'Vegan') {
                            activeFilters['dietTypes'].push(restrictions[i]);
                        } else {
                            activeFilters['restrictions'].push(restrictions[i]);
                        }

                    }

                }

                this.tabHandler(activeTab, text);
            } else {
                this.props.removeDietRestrictions();
            }

            this.tabHandler(activeTab, text)
    }

    componentWillUnmount () {
        this.props.setFiltersList({
            'dietTypes': [],
            'mealTypes': [],
            'restrictions': [],
            'tags': [],
            'cookingTime': [],
            'preparationTime': []
        });
        this.props.resetSearchScreen();
        this.props.setLockTab();
    }

    goBack () {
        Keyboard.dismiss();
        Actions.pop();
    }

    toggleSearchFilters = () => {
        this.setState({showSearchFilters: !this.state.showSearchFilters});
    };

    showOptionsForRecipeId = id => this.setState({ showOptionsForRecipeId: id });

    hideRecipeId = id =>
        this.setState(state => {
            let { deletedRecipeIds } = state;
            deletedRecipeIds.push(id);
            return { deletedRecipeIds };
        });

	tabHandler(tab, text, page) {
		// do not destructuring this.state.page in switch statement!
		// page: page ? page + 1 : 1 --- in case tabHadler is called from hendleLoadMore method
		// we should increase page by 1, else it always should be 1.
		this.setState({
			page: page ? page + 1 : 1,
            loading: true
		}, () => {
            isCancel = false;
			switch(tab) {
				case 'viewed':
                    if(this.props.activeTabId !==2 ){  //change while applying nutrition lock.(this is old tabID)
                        if(_.includes(this.state.lockTab,'viewed')){
                            this.manageSearchByNutrition().then(res=>{
                                if(res){
                                    if(isCancelClick){
                                        return this.handleNutritionLockCancel()
                                    }
                                    return this.props.getRecipeBook(this.state.page, tab, text, this.state.nutrition_search,'kcal');
                                }
                            }).catch(()=>{
                                if(this.state.nutritionLock)
                                    alert("Nutrition lock is not Possible");
                                this.setState({
                                    searchList:[],
                                    nutritionLock:false
                                },()=>{
                                    return this.handleNutritionLockCancel()
                                });
                            });
                        }else{
                            return this.props.getRecipeBook(this.state.page, tab, text);
                        }
                    }else{
                        return this.props.getRecipeBook(this.state.page, tab, text);
                    }
                    break;
				case 'pinned':
                    if(this.props.activeTabId !==2 ){ //change while applying nutrition lock.(this is old tabID)
                        if(_.includes(this.state.lockTab,'pinned')){
                            this.manageSearchByNutrition().then(res=>{
                                if(res){
                                    if(isCancelClick){
                                        return this.handleNutritionLockCancel()
                                    }
                                    return this.props.getRecipeBook(this.state.page, tab, text, this.state.nutrition_search,'kcal');
                                }
                            }).catch(()=>{
                                this.setState({
                                    searchList:[]
                                });
                                return this.handleNutritionLockCancel()
                            });
                        }else{
                            return this.props.getRecipeBook(this.state.page, tab, text);
                        }
                    }else{
                        return this.props.getRecipeBook(this.state.page, tab, text);
                    }
                    break;
				case 'created':
                    if(this.props.activeTabId !==2 ){ //change while applying nutrition lock.(this is old tabID)
                        if(_.includes(this.state.lockTab,'created')){
                            this.manageSearchByNutrition().then(res=>{
                                if(res){
                                    if(isCancelClick){
                                        return this.handleNutritionLockCancel()
                                    }
                                    return this.props.getRecipeBook(this.state.page, tab, text, this.state.nutrition_search,'kcal');
                                }
                            }).catch(()=>{
                                this.setState({
                                    searchList:[]
                                });
                                return this.handleNutritionLockCancel()
                            });
                        }else{
                            return this.props.getRecipeBook(this.state.page, tab, text)
                        }
                    }else{
                        return this.props.getRecipeBook(this.state.page, tab, text);
                    }
                    break;
				case 'all':
                    if(this.props.activeTabId !==2 ){ //change while applying nutrition lock.(this is old tabID)
                        if(_.includes(this.state.lockTab,'all')){
                            this.manageSearchByNutrition().then(res=>{
                                if(res){
                                    if(isCancelClick){
                                        return this.handleNutritionLockCancel()
                                    }
                                    return this.props.searchMeal(text, this.state.page,this.state.nutrition_search,'kcal');
                                }
                            }).catch(()=>{
                                this.setState({
                                    searchList:[]
                                });
                                return this.handleNutritionLockCancel()
                            });
                        }else{
                            return this.props.searchMeal(text, this.state.page);
                        }
                    } else {
                        return this.props.searchMeal(text, this.state.page);
                    }
                    break;
				case 'others':
					return this.props.getProductBySearch(text).then(res=>{
						this.setState({otherProduct:false});
					}).catch(e=>{
						this.setState({otherProduct:true});
					});
                    break;
                case 'global':
                    this.setState({searchList:[]});
                    if(text===''){
                        if(this.props.activeTabId !==2 ){ //change while applying nutrition lock.(this is old tabID)
                            if(_.includes(this.state.lockTab,'global')){
                                this.manageSearchByNutrition().then(res=>{
                                    if(res){

                                        return this.props.getGlobalRecipes("",0,20,this.state.nutrition_search);
                                    }
                                });
                            }else{
                                return this.props.getGlobalRecipes("",0,20,[{"max":2000,"min":0,"nutrient":"CA"}]);
                            }
                        } else {
                            return this.props.getGlobalRecipes("",0,20,[{"max":2000,"min":0,"nutrient":"CA"}]);
                        }
                    }else{
                        if(this.props.activeTabId !== 2){ //change while applying nutrition lock.(this is old tabID)
                            if(_.includes(this.state.lockTab,'global')){
                                this.manageSearchByNutrition().then(res=>{
                                    return this.props.getGlobalRecipes(text,0,10,this.state.nutrition_search);
                                });
                            }else{
                                return this.props.getGlobalRecipes(text,0,10,[{"max":2000,"min":0,"nutrient":"CA"}]);
                            }
                        } else {
                            return this.props.getGlobalRecipes(text,0,10,[{"max":2000,"min":0,"nutrient":"CA"}]);
                        }
                    }
                    break;
                default:
                    this.setState({
                        searchList: []
                    })
            }
        })

    }

    onTabPress(tab) {

        const { text, activeTab } = this.state;
        // clean up search results when leaving 'all' tab
        if(tab !== activeTab) {
            this.props.resetSearchScreen()
        }

        this.setState({
            activeTab: tab
        },()=>{
            onlyOnce = false;
            this.props.resetSearchScreen();
            this.tabHandler(tab, text);
        });




    }

    onSearchButtonPress = () => {
        const {text, page, activeTab} = this.state;

        Keyboard.dismiss();


        this.tabHandler(activeTab, text);
        this.setState({error: '', text});
    }

    onUpcButtonPress = () => {
        const {planId, mealType: planMealType, add, replace} = this.props;
        const { activeTabId } = this.state;

        let scannedRecipeForBook = activeTabId === 2 ? true : undefined;

        if(scannedRecipeForBook) {
            this.setState({
                selectMealModal: true,
                AddOrScan: 'Scan'
            });
        } else {
            Permissions.check('camera').then(response => {
                if(response === 'denied') {
                    Alert.alert('Alert', 'Camera access denied. Please check Settings > Privacy > Camera.');
                } else {
                    Actions.barCodeScan({ add, replace, scannedRecipeForBook });
                }
            })

        }
    }

    onAddButtonPress = () => {
        const {planId, mealType: planMealType, date, add, replace} = this.props;
        const { activeTabId } = this.state;
        let createRecipeForBook = activeTabId === 2 ? true : undefined;

        if(createRecipeForBook) {
            this.setState({
                selectMealModal: true,
                AddOrScan: 'Add'
            });
        } else {
            Actions.addMeal({ planId, planMealType, date, add, replace, createRecipeForBook});
        }
    }

    handleSelectedMeal(selectedMeal) {
        const {planId, add, replace} = this.props;
        const { AddOrScan } = this.state;
        let date = prettyDate();

        if(AddOrScan === 'Add') {
            Actions.addMeal({ planId, planMealType: selectedMeal, date, add, replace, createRecipeForBook: true});
        } else if(AddOrScan === 'Scan') {
            Permissions.check('camera').then(response => {
                if(response === 'denied') {
                    Alert.alert('Alert', 'Camera access denied. Please check Settings > Privacy > Camera.');
                } else {
                    Actions.barCodeScan({planMealType: selectedMeal, add, replace, scannedRecipeForBook: true });
                }
            });
        };
    };

    handleSelectMealModalVisibility(button) {
        if(button === 'close') {
            this.setState({
                selectMealModal: false
            })
        }
    }

    onTextChange (text) {
        const {page, activeTab} = this.state;
        this.setState({error: '', text});
    }

    renderError () {
        const {error} = this.state;
        if (error) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <Text style={{
                        color: 'red',
                        textAlign: 'center',
                        paddingVertical: 5,
                        paddingHorizontal: 20
                    }}>{error}</Text>
                </View>
            );
        } else {
            return null;
        }
    }

    onMealPress (id, servings, recipeImg) {
        Keyboard.dismiss();
        const { add, replace, mealType: planMealType, planId } = this.props;
        this.props.getRecipeById(id, servings, {recipeImg, add, replace, planMealType, planId});
    }

    onPressEditRecipe = () => {
        this.props
            .getRecipeByIdForEditing(this.state.showOptionsForRecipeId)
            .then(recipeId => {
                const { recipeBookActionError } = this.props;
                if (recipeBookActionError)
                    Alert.alert('Failed to load recipe', recipeBookActionError);
                else {
                    const { editRecipe } = this.props;
                    Actions.addMeal({ editRecipe, screenTitle: 'Edit Meal' });
                }
            });
        this.showOptionsForRecipeId();
    }

    onPressDeleteRecipe = () =>
        AlertPopup({
            title: 'Are you sure you want to delete this recipe?',
            onPressCancel: () => {},
            onPressConfirm: () => {
                this.props
                    .recipeDelete(this.state.showOptionsForRecipeId)
                    .then(recipeId => {
                        const { recipeBookActionError } = this.props;
                        if (recipeBookActionError)
                            Alert.alert('Delete Failed', recipeBookActionError);
                        else this.hideRecipeId(recipeId);
                    });
                this.showOptionsForRecipeId();
            }
        });

    renderFooter = () => {
        if (this.state.loading) {
            return <ActivityIndicator style={{margin: 20}} color={colors.primaryGrey} size={'large'}/>;
        } else {
            return <View style={{flex: 1, marginBottom: 60}}></View>;
        }
    };

    hendleLoadMore = () => {
        const {text, page, pages, activeTab} = this.state;

        if (!this.onEndReachedCalledDuringMomentum) {
            if (page === pages) {
                return null
            }

            this.tabHandler(activeTab, text, page);
            this.onEndReachedCalledDuringMomentum = true;
        } else {
            return null
        }
    };

    handleNutritionLockCancel(){
        if(this.state.activeTab === "all" || this.state.activeTab === "created" || this.state.activeTab === "viewed" || this.state.activeTab === "pinned"){
            let data;
            if(this.props.add){
                data = [
                    `kcal=${Math.round(0)}-${Math.round(((this.props.nutrition_targets.day_calorie_cap) + ((this.props.nutrition_targets.day_calorie_cap) * (10/100))))}`,
                    `carb_g=${Math.round(0)}-${Math.round(((this.props.nutrition_targets.day_carbohydrate_cap) + ((this.props.nutrition_targets.day_carbohydrate_cap) * (10/100))))}`,
                    `protein_g=${Math.round(0)}-${Math.round(((this.props.nutrition_targets.day_protein_cap) + ((this.props.nutrition_targets.day_protein_cap) * (10/100))))}`,
                    `fat_g=${Math.round(0)}-${Math.round(((this.props.nutrition_targets.day_fat_cap) + ((this.props.nutrition_targets.day_fat_cap) * (10/100))))}`
                ]
            }else if(this.props.replace){
                data = [
                    `kcal=${Math.round(0)}-${Math.round((this.props.activeMeal.kcal) + ((this.props.activeMeal.kcal) * (10/100)))}`,
                    `carb_g=${Math.round(0)}-${Math.round((this.props.activeMeal.carb) + ((this.props.activeMeal.carb) * (10/100)))}`,
                    `protein_g=${Math.round(0)}-${Math.round((this.props.activeMeal.protein) + ((this.props.activeMeal.protein) * (10/100)))}`,
                    `fat_g=${Math.round(0)}-${Math.round((this.props.activeMeal.fat) + ((this.props.activeMeal.fat) * (10/100)))}`

                ]
            }
            if(this.state.activeTab === "all"){
                return this.props.searchMeal(this.state.text, this.state.page,data,'kcal');
            }
            return this.props.getRecipeBook(this.state.page, this.state.activeTab, this.state.text, data,'kcal');

        }else if(this.state.activeTab === "global"){
            let data =
                [
                    {
                        "max": Math.round(((this.props.nutrition_targets.day_calorie_cap) + ((this.props.nutrition_targets.day_calorie_cap) * (10/100)))),
                        "min": 0,
                        "nutrient": "ENERC_KCAL"
                    }
                ];
            return this.props.getGlobalRecipes("",0,20,data);
        }
    }

    hendleEmptyList = () => {

            const {loading, error} = this.state;
            if (!loading || error) {

                if(this.state.activeTab!=='others'){
                    if(this.props.activeTabId !== 2 && !loading) { //change while applying nutrition lock.(this is old tabID)
                        if (_.includes(this.state.lockTab, this.state.activeTab)) {
                            if(!renderAlert && !onlyOnce) {
                                setTimeout(()=>{
                                    if(!this.state.loading && !renderAlert) {
                                        renderAlert = true;
                                        Alert.alert(
                                            '',
                                            'No meal found within the nutritional ranges. Click "Cancel" to see closest matches or "Remove Lock" to remove the nutrition boundaries.',
                                            [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => {
                                                        renderAlert = false;
                                                        isCancel = true;
                                                        onlyOnce = true;
                                                        isCancelClick = true;
                                                        this.handleNutritionLockCancel()
                                                    },
                                                    style: 'cancel'
                                                },
                                                {
                                                    text: 'Remove Lock', onPress: () => {
                                                        renderAlert = false;
                                                        this.setLock(this.state.activeTab);
                                                        toastMessage = "Calories lock is OFF";
                                                        toastImage = "unlock";
                                                        if(this.state.nutritionLock) {
                                                            this.setState({renderToast: true}, () => {
                                                                this.toast.showToast();
                                                                setTimeout(() => {
                                                                    this.setState({
                                                                        renderToast: false,
                                                                    });
                                                                }, 3000)
                                                            });
                                                        }
                                                    }
                                                }
                                            ]
                                        );
                                    }
                                })

                            }else if(!renderAlert && isCancel){
                                return <InfoBox message={'No results matched your search.'}/>
                            }
                            return null;
                        } else {
                            return <InfoBox message={'No results matched your search.'}/>
                        }
                    }else if(!loading){
                        return <InfoBox message={'No results matched your search.'}/>
                    }
                }else{
                    if(this.state.otherProduct){
                        return <InfoBox message={'Sorry, no recipes matched your search.'}/>
                    }else{
                        return <InfoBox message={'Enter search text above to continue'}/>
                    }
                }
            } else {
                return null
            }

    }

    renderList () {
        const { preferredServingSize } = this.props;
        const {searchList, error, deletedRecipeIds, showNutrients} = this.state;
        const isIOS = Platform.OS === 'ios';
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <FlatList
                    data={searchList}
                    renderItem={({item}) => {
                        const { recipe_id } = item;
                        if(deletedRecipeIds.indexOf(recipe_id) > -1)
                            return <View/>
                        else {
                            const meal = omitBy(item, isNull);
                            return (
                                <TouchableOpacity
                                    onPress={() => this.onMealPress(recipe_id, item.servings, meal.image || DEFAULT_RECIPE_IMG_URL)}
                                >
                                    <MealPreview
                                        {...meal}
                                        cookingTime={meal.cook_time}
                                        preferredServingSize={preferredServingSize}
                                        showNutrients={showNutrients}
                                        onPressMenu={
                                            meal.creator_id == this.props.userId
                                                ? () => this.showOptionsForRecipeId(recipe_id)
                                                : undefined
                                        }
                                    />
                                </TouchableOpacity>
                            );
                        }
                    }}
                    disableVirtualization={false}
                    removeClippedSubviews={true}
                    ListEmptyComponent={this.hendleEmptyList}
                    keyExtractor={(item, index) => index}
                    ListHeaderComponent={this.renderSelectedFilters()}
                    ListFooterComponent={this.renderFooter()}
                    onEndReached={this.hendleLoadMore}
                    onEndReachedThreshold={isIOS ? 0 : 0.5}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false
                    }}
                />
            </View>
        );
    }

    removeFilter (filterTitle, filterValue) {
        let activeFilters = this.state.filters;

        for (let i = 0; i < this.props.restrictions.length; i++) {
            if (filterValue == this.props.restrictions[i]) {
                return;
            }
        }

        for (let i = 0; i < activeFilters[filterTitle].length; i++) {
            if (activeFilters[filterTitle][i] === filterValue) {
                activeFilters[filterTitle].splice(i, 1);
            }
        }
        this.setState({ filters: activeFilters }, () =>
            this.props.setFiltersList(activeFilters)
        );
    }

    renderSelectedFilters () {
        const {filters, activeTab} = this.state;


        if (Object.keys(filters).length > 0) {
            const {filtersContainer, filterButton, filterTitleInclude, filterTitleExclude, filterButtonRest} = filtersStyles;
            return (
                <View
                    style={filtersContainer}>
                    {Object.keys(filters).map((item) => {
                        return filters[item].map((elem) => {

                            if (item == 'restrictions' || item == 'dietTypes') {
                                for(let i = 0; i < this.props.restrictions.length; i ++) {
                                    if(this.props.restrictions[i] === elem){
                                        return <TouchableOpacity
                                            onPress={this.removeFilter.bind(this, item, elem)}
                                            key={elem}
                                            style={filterButtonRest}>
                                            <Text style={filterTitleExclude}>{elem}</Text>
                                        </TouchableOpacity>;
                                    }
                                }
                                return <TouchableOpacity
                                    onPress={this.removeFilter.bind(this, item, elem)}
                                    key={elem}
                                    style={filterButton}>
                                    <Text style={filterTitleExclude}>{elem}</Text>
                                </TouchableOpacity>;

                            }

                            else {

                                let title=elem;

                                if (item === 'cookingTime'){

                                    title = 'Cooking Time ' + elem;
                                }

                                if (item === 'preparationTime'){

                                    title = 'Preparation Time ' + elem;
                                }

                                return <TouchableOpacity
                                    onPress={this.removeFilter.bind(this, item, elem)}
                                    key={elem}
                                    style={filterButton}>
                                    <Text style={filterTitleInclude}>{title}</Text>
                                </TouchableOpacity>;
                            }
                        });
                    })
                    }
                </View>
            );
        } else {
            return null;
        }

    }

    renderBookTabs() {

        const {tabsContainer, tabStyle} = styles;
        const { activeTab } = this.state;

        const displayTabs = tabs.map((item, index) => {
            return(
                <TouchableOpacity key={index} style={styles.tabContainer} onPress={() => this.onTabPress(item.indicator)}>
                    <View style={activeTab == item.indicator ? styles.tabSubContainerActive : undefined}>
                        <Text style={activeTab == item.indicator ? styles.tabTextActive : styles.tabText}>
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });
        return(
            <View style={{height: 40, backgroundColor: colors.primaryBlue}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={[tabsContainer, tabStyles.container]}>
                        {displayTabs}
                    </View>
                </ScrollView>
            </View>
        );

    }

	calculateTotalMealNutrition () {
		
		let nutritionMealArray = ['kcal', 'carbohydrate', 'protein', 'fat'];

		const {activeMeal, nutrition } = this.props;

		let total = 0;
		let nutrition_arr = [];

		nutritionMealArray.map((item, index) => {
			if (activeMeal && (Object.keys(activeMeal).length !== 0) && nutrition) {

				let tempActiveMeal = _.cloneDeep(activeMeal);
				tempActiveMeal['carbohydrate'] = tempActiveMeal['carb'];
				delete tempActiveMeal['carbs'];
				total = parseInt(tempActiveMeal[item]);
				
				nutrition_arr[nutritionMealArray[index]] = total;
			}
		});	
		
		return nutrition_arr;
	}


	calculateRemainingMealNutrition () {
		
		let nutritionMealArray = ['kcal', 'carbohydrate', 'protein', 'fat'];

		const {activeMeal, nutrition } = this.props;

		let remaining = {};
		let total = 0;
		let consumed = 0;
		let nutrition_arr = [];

		nutritionMealArray.map((item, index) => {
			if (activeMeal && (Object.keys(activeMeal).length !== 0) && nutrition) {

			    let tempActiveMeal = _.cloneDeep(activeMeal);
				tempActiveMeal['carbohydrate'] = tempActiveMeal['carb'];
				delete tempActiveMeal['carbs'];
				total = parseInt(tempActiveMeal[item]);
				consumed = parseInt((nutrition[item]) ? nutrition[item] : 0);
				remaining.value = (Math.abs(total - consumed) === (total * 0.05) ? 0 : total - consumed);

				nutrition_arr[nutritionMealArray[index]] = remaining.value;

			}
		});	
		
		return nutrition_arr;
	}
	
    manageSearchByNutrition() {

		let nutrition_arr = this.calculateTotalMealNutrition();

        let data=[{}];
        if(this.state.activeTab === "all" || this.state.activeTab === "created" || this.state.activeTab === "viewed" || this.state.activeTab === "pinned") {
                
				if (nutrition_arr.kcal > 0 && nutrition_arr.carbohydrate && nutrition_arr.protein && nutrition_arr.fat) {
                    data = [
                        `kcal=${Math.round((nutrition_arr.kcal) - ((nutrition_arr.kcal) * (10/100)))}-${Math.round((nutrition_arr.kcal) + ((nutrition_arr.kcal) * (10/100)))}`,
                        `carb_g=${Math.round((nutrition_arr.carbohydrate) - ((nutrition_arr.carbohydrate) * (10/100)))}-${Math.round((nutrition_arr.carbohydrate) + ((nutrition_arr.carbohydrate) * (10/100)))}`,
                        `protein_g=${Math.round((nutrition_arr.protein) - ((nutrition_arr.protein) * (10/100)))}-${Math.round((nutrition_arr.protein) + ((nutrition_arr.protein) * (10/100)))}`,
                        `fat_g=${Math.round((nutrition_arr.fat) - ((nutrition_arr.fat) * (10/100)))}-${Math.round((nutrition_arr.fat) + ((nutrition_arr.fat) * (10/100)))}`
                    ]
                } else {
					return Promise.reject(); // meal is balanced already               
				}
            }
			this.setState({
				nutrition_search:data
			});
			return Promise.resolve(true);
		}
		
		// LEAVE HERE FOR NOW SINCE WE MIGHT COME BACK AND IMPLEMENT GLOBAL
        // } else if(this.state.activeTab === "global") {
        //     if (this.props.add) {
        //         data =
        //             [
        //                 {
        //                     "max": Math.round(((this.props.nutrition_targets.day_calorie_cap) + ((this.props.nutrition_targets.day_calorie_cap) * (10/100)))),
        //                     "min": Math.round(((this.props.nutrition_targets.day_calorie_floor) - ((this.props.nutrition_targets.day_calorie_floor) * (10/100)))),
        //                     "nutrient": "ENERC_KCAL"
        //                 }
        //             ]
        //     } else if (this.props.replace) {
        //         data =
        //             [
        //                 {
        //                     "max": Math.round((this.props.activeMeal.kcal) + ((this.props.activeMeal.kcal) * (10/100))),
        //                     "min": Math.round((this.props.activeMeal.kcal) - ((this.props.activeMeal.kcal) * (10/100))),
        //                     "nutrient": "ENERC_KCAL"
        //                 }
        //             ]
        //     }
        // }
		
    renderOtherFood(){
        const { add ,date , mealType , replace ,planId,activeTabId} = this.props;
        const {searchList} = this.state;
        const isIOS = Platform.OS === 'ios';
        return(
            <FlatList
                data={searchList}
                renderItem={({item}) => {
                    const { name,ndb } = item;
                    return (
                        <TouchableOpacity
                            onPress={() => Actions.productDetail({ndb,add,replace,planId,date,activeTabId,'planMealType':mealType})}
                        >
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:15,borderBottomWidth:1,borderBottomColor: 'rgb(57, 192, 111)',height:50}}>
                                <Text style={{fontSize:20}} numberOfLines={1}>
                                    {name}
                                </Text>
                                <Icon name={'angle-right'} size={22} color={colors.primaryOrange}/>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                disableVirtualization={false}
                removeClippedSubviews={true}
                ListEmptyComponent={this.hendleEmptyList}
                keyExtractor={(item, index) => index}
                ListHeaderComponent={this.renderSelectedFilters()}
                ListFooterComponent={this.renderFooter()}
                keyboardShouldPersistTaps={'always'}
                onEndReachedThreshold={isIOS ? 0 : 0.5}
                onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false
                }}
                style={{backgroundColor: '#fff'}}
            />
        )

    }

    setLock(key)
    {
		tabs.map((item, index) => {
			if(_.includes(this.state.lockTab, item.indicator)){
				this.setState({
					lockTab:_.without(this.state.lockTab, item.indicator)
				},() => {
	                AsyncStorage.setItem('lockTab',JSON.stringify(this.state.lockTab));
				});
	        }else{
	            this.state.lockTab.push(item.indicator);
	            AsyncStorage.setItem('lockTab',JSON.stringify(this.state.lockTab));
	        }
		});
		
        this.tabHandler(this.state.activeTab, this.state.text);
    }

    renderMoreGlobalRecipes()
    {
        if (!this.onEndReachedCalledDuringMomentum) {
            if (this.state.from === this.props.pages) {
                this.setState({
                    from:this.state.from + 20,
                    to:this.state.to + 20
                });
                if(this.state.text===''){
                    if(_.includes(this.state.lockTab,this.state.activeTab)){
                        this.manageSearchByNutrition().then(res=> {
                            return this.props.getGlobalRecipes(this.state.text, this.state.from + 20, this.state.to + 20, this.state.nutrition_search);
                        });
                    } else {
                        return this.props.getGlobalRecipes(this.state.text,this.state.from+20,this.state.to+20,[{"max":2000,"min":0,"nutrient":"CA"}]);
                    }
                }else{
                    if(_.includes(this.state.lockTab,this.state.activeTab)){
                        this.manageSearchByNutrition().then(res=> {
                            return this.props.getGlobalRecipes(this.state.text, this.state.from + 20, this.state.to + 20, this.state.nutrition_search);
                        });
                    } else {
                        return this.props.getGlobalRecipes(this.state.text,this.state.from+20,this.state.to+20,[{"max":2000,"min":0,"nutrient":"CA"}]);
                    }
                }
            }
            return null
        } else {
            return null
        }
    }

    renderGlobalRecipe(){
        const { add ,date , mealType , replace ,planId,activeTabId} = this.props;
        const {searchList, error} = this.state;
        const isIOS = Platform.OS === 'ios';
        const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
            const paddingToBottom = 100;
            return layoutMeasurement.height + contentOffset.y >=
                contentSize.height - paddingToBottom;
        };

        return(

            <ScrollView
                style={{backgroundColor: '#fff'}}
                onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                    this.renderMoreGlobalRecipes();
                }
            }} scrollEventThrottle={400}
                onScrollBeginDrag={
                    onEndReachedCalledDuringMomentum=false
                }
            >

                <View style={{flexWrap:'wrap', flexDirection:'row', flex:1}}>

                    {
                         ((searchList) && searchList.length > 0)
                         &&
                         (searchList[0].hasOwnProperty('recipe')) &&

                        searchList.map((GlobalRecipes,index)=>{
                            return (<View key={index}><TouchableOpacity onPress={() => Actions.globalRecipeDetail({GlobalRecipes,add,replace,planId,date,activeTabId,'planMealType':mealType})}>
                                <View style={{ height: 250,width:Dimensions.get('window').width/2,borderWidth:1,borderColor:'#fff',backgroundColor: 'rgba(0,0,0,0.5)'}}>
                                    <Image
                                        source={(GlobalRecipes.recipe.image) ? {uri: GlobalRecipes.recipe.image} : require('../components/common/img/default-recipe.jpg')}
                                        style={styles.imgStyle}
                                        sizeMode={'contain'}
                                    >
                                    </Image>
                                    {
                                        Platform.OS === 'ios' ?
                                            <LinearGradient colors={['rgba(255,255,255, 0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']} style={styles.shadowGradient}>
                                                <Text style={styles.imgTitle} numberOfLines={2}>{GlobalRecipes.recipe.label}</Text>
                                            </LinearGradient>
                                            :
                                            <View style={styles.shadowGradient}>
                                                <Text style={styles.imgTitle} numberOfLines={2}>{GlobalRecipes.recipe.label}</Text>
                                            </View>
                                    }
                                </View>
                            </TouchableOpacity></View>);
                        })||
                         this.hendleEmptyList()
                         ||
                             this.hendleEmptyList()
                    }
                </View>
                {
                    this.renderFooter()
                }
            </ScrollView>
        )
    }

    renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        const { toastStyle, toastTitle } = styles;
        if(this.state.renderToast && this.state.nutritionLock){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10,padding:5}}>
                        <Emojicon name={toastImage} size={60} />
												<Text style={toastTitle}></Text>
                        <Text style={toastTitle}>{toastMessage}</Text>
                    </View>
                }
                animationType={'fade'}
                animationDuration={200}
                topBottomDistance={Height}
                toastStyle={toastStyle}
                autoCloseTimeout={3000}
                ref={(c) => { this.toast = c }}
            />);
        }else{
            return null;
        }
    }


    render () {
        const {inputWrapper, searchContent, separator} = styles;
        let list;
        if(this.state.activeTab === "others"){
            list = this.renderOtherFood()
        }else if(this.state.activeTab === "global"){
            list = this.renderGlobalRecipe();
        }else{
            list = this.renderList();
        }
        let addReplaceBy = {
            innerRightIcon: 'md-barcode',
            innerRightButtonPress: this.onUpcButtonPress,
            rightIcon: 'md-add',
            rightButtonPress: this.onAddButtonPress
        };
        if(this.props.removeOption){
            addReplaceBy = {};
        }

        const leftIcon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const iconProfile = Platform.select({
			ios: 'md-menu',
			android: 'md-menu'
		});
        const renderLeftIcon = this.state.activeTabId === 2 ? iconProfile: leftIcon;
        const buttonsForMenu = [
            {
                title: 'Edit Recipe',
                onPress: this.onPressEditRecipe
            },
            {
                title: 'Delete Recipe',
                onPress: this.onPressDeleteRecipe
            }
        ];
        let Height=Dimensions.get('window').height/2;

		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={'Recipe Book'}
					leftIcon={renderLeftIcon}
					leftButtonPress={this.state.activeTabId === 2 ? Actions.profile: this.goBack}
					{...addReplaceBy}
                    mapIcon
                    {...this.props}
                    displayLock
				/>
				<View style={inputWrapper}>
					<View style={{flex: 1}}>
						<Input
							autoFocus={false}
							placeholder='Search...'
							returnKeyType='search'
							keyboardType='default'
							onSubmitEditing={this.onSearchButtonPress}
							changeText={this.onTextChange}
						/>
					</View>
					{
            (this.props.activeTabId != 2 && this.state.activeTab != 'others') ? //change while applying nutrition lock.(this is old tabID)
						(_.includes(this.state.lockTab, this.state.activeTab)) ?
							(<TouchableOpacity
								style={{justifyContent: 'center', alignItems: 'center',marginRight:7}}
								onPress={()=>{
									this.setLock(this.state.activeTab);
									toastMessage = "Calories lock is OFF";
                                    toastImage= "unlock";
                                      this.setState({renderToast:true},()=>{
                                          if(this.state.nutritionLock){
                                              this.toast.showToast();
                                              setTimeout(() => {
                                                  this.setState({
                                                      renderToast: false,
                                                  });
                                              },3000);
                                          }
                                      });
								}}>
								<Icon name='lock' size={30} color={'rgb(57, 192, 111)'}/>
							</TouchableOpacity>)
						:
							(<TouchableOpacity
								style={{justifyContent: 'center', alignItems: 'center',marginRight:7}}
								onPress={() => {
                                    this.setLock(this.state.activeTab);
                                    toastMessage = "Calories lock is ON";
                                    toastImage= "lock";
                                    this.setState({renderToast:true},()=>{
                                        if(this.state.nutritionLock) {
                                            this.toast.showToast();
                                            setTimeout(() => {
                                                this.setState({
                                                    renderToast: false,
                                                });
                                            }, 3000)
                                        }
                                    });
								}}>
								<Icon name='lock' size={30} color={'rgba(0,0,0,0.4)'}/>
							</TouchableOpacity>): null
					}
					<TouchableOpacity
						style={{justifyContent: 'center', alignItems: 'center'}}
						onPress={this.toggleSearchFilters}>
						<Icon name='sliders' size={25} color={'rgba(0,0,0,0.4)'}/>
					</TouchableOpacity>
				</View>
				{this.renderBookTabs()}
				{this.renderError()}
				{this.renderError()}
				{list}
				{this.state.showOptionsForRecipeId &&
				<BottomSheetMenuForOption
					buttons={buttonsForMenu}
					doNotRenderCancelButton={true}
					onCancel={() => this.showOptionsForRecipeId()}
				/>}
				<FilterPopUp
					showSearchFilters={this.state.showSearchFilters}
					toggleSearchFilters={this.toggleSearchFilters}/>
				<SelectMealModalRecipeBook
					isVisible={this.state.selectMealModal}
					onClose={(button) => this.handleSelectMealModalVisibility(button)}
					selectMeal={(selectedMeal) => this.handleSelectedMeal(selectedMeal)}
				/>
                {this.state.nutritionLock &&
                this.renderToast()}
			</SafeAreaView>
		);
	}
}
const styles = {
    headerContainer: {
        height: 60,
        backgroundColor: '#ffa227'
    },
    swapContainer: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
        borderTopColor: colors.primaryGreen,
        borderTopWidth: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.primaryGreen
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    textInput: {
        height: 20,
        color: '#000',
        marginRight: 10
    },
    touchableButton: {
        flex: 0.2,
        paddingVertical: 12
    },
    searchBarStyles: {
        backgroundColor: '#fff',
        borderRadius: 3,
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 30

    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        backgroundColor: '#fff'
    },
    iconStyle: {
        flex: 0.1,
        marginHorizontal: 5
    },
    searchContent: {
        backgroundColor: '#fff',
        flex: 1
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.3)',
        width: '100%',
        height: 2
    },
    tabsContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 5,
    },
    tabContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width:(Dimensions.get('window').width-10)/4,
    },
    tabSubContainerActive: {
        paddingVertical: 5,
        alignItems:'center'
    },
    tabText: {
        fontSize: responsiveFontSize(1.8),
        color: colors.lightBlue,
    },
    tabTextActive: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: '#fff'
    },
    shadowGradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 70,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    imgStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: colors.imgBg,
        width: undefined,
        height: undefined
    },
    imgTitle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        top: 10,
        left: 10,
        right: 10,
        width: undefined,
        height: undefined
    },
    infoContainer: {
        flex: 1,
        margin: 5,
        borderRadius: 5,
        borderColor: colors.primaryGreen,
        borderWidth: 1,
        padding: 10,
        flexDirection: 'column',
        //justifyContent: 'center',
        //alignItems: 'center'
    },
    infoTitle: {
        flex: 0.8,
        color: colors.primaryOrange,
        fontSize: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    infoLink: {
        //flex: 0.8,
        color: colors.primaryOrange,
        fontSize: 15,
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    infoLinkContainer: {
        borderWidth:1,
        borderColor:"rgb(57, 192, 111)",
        borderRadius:10,
        padding:10,
        width:140,
        marginHorizontal:5
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

const filtersStyles = {
    filtersContainer: {
        paddingVertical: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    filterButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
        borderColor: colors.lightGrey,
        borderWidth: 1,
        borderRadius: 16,
        margin: 5,
        height: 30

    },

    filterButtonRest: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255,0,0,.5)',
        borderColor: 'rgba(255,0,0,.5)',
        borderWidth: 1,
        borderRadius: 16,
        margin: 5,
        height: 30
    },

    filterTitleInclude: {

        color: 'rgba(0,0,0,0.5)'
    },

    filterTitleExclude: {

        color: 'rgba(0,0,0,0.5)',

        textDecorationLine: 'line-through'

    }
};

const mapStateToProps = ({
	main: { activeTabId },
	search: { error, searchResult, loading, filters, restrictions, pages },
	clientPermissions: { showNutrients },
	auth: { userId },
	recipeBook: {
		loading: recipeBookActionLoading,
		error: recipeBookActionError,
		editRecipe,
        lockTab
	},
	mealPlan: { preferredServingSize, nutrition_targets},
    main :{
	    activeMeal
    }
}) => ({
	error,
	searchResult,
	loading,
	filters,
	restrictions,
	pages,
	showNutrients,
	activeTabId,
	recipeBookActionLoading,
	recipeBookActionError,
	editRecipe,
	userId,
	preferredServingSize,
    nutrition_targets,
    activeMeal,
    lockTab
});

export default connect(mapStateToProps, {
    searchMeal,
    getRecipeById,
    getRecipeByIdForEditing,
    setFiltersList,
    resetSearchScreen,
    getRecipeBook,
    removeDietRestrictions,
    recipeDelete,
    getProductBySearch,
    getGlobalRecipes,
    setLockTab
})(SearchScreen);
