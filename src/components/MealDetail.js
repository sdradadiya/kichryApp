import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Button,
    ScrollView,
    FlatList,
    Alert,
    PermissionsAndroid,
    Platform,
    ActivityIndicator
} from 'react-native';
import {InputRow, PhotoRow} from './common/Rows';
import {colors, showImagePicker, prettyDate, sumNutritionToString, textStyles, loaderStyles} from '../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import SafeAreaView from 'react-native-safe-area-view';
import NutritionSummary from './common/NutritionChart';
import { Header } from './common';
import BottomSheetMenuForOption from './BottomSheet/BottomSheetMenuForOption';
import EditIngredientModal from './AddMeal/EditIngredientModal';
import moment from 'moment';
import {Spinner} from './Home/common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    toggleBottomSheetMenuForTrackOption,
    getRecipeByIdForEditing,
    replaceMealNewRecipe,
    createCustomRecipe,
    replaceMealExistingRecipe,
    sendReview,
    updateIngredientToEditRecipe,
    createEmptyEditRecipe,
    reviewMeal,
    setActiveMeal
} from '../actions';
import {connect} from "react-redux";
import {Actions} from 'react-native-router-flux/index';
import RNFetchBlob from "react-native-fetch-blob";
import { editIngredient } from '../actions';
import { formatQuantity } from '../lib/formerQuantity';
import { fromJS } from 'immutable';


const guantityToFractional = (quantity) => {
    let parsedQty = quantity % 1 ? quantity.toFixed(1) : quantity;
    return formatQuantity(parsedQty);
};

const IngredientRow = ({
                           name = '',
                           unit = '',
                           quantity,
                           onPress,
                           onPressDelete
                       }) => (
    <TouchableOpacity onPress={onPress} style={styles.ingredientRowContainer}>
        <Text numberOfLines={4} style={[textStyles.description14Regular, styles.ingredientNameText]}>
            {name}
        </Text>
        <View style={styles.quantityContainer}>
            <Text style={[textStyles.description12Regular]}>{guantityToFractional(+quantity)}</Text>
        </View>
        <Text numberOfLines={5} style={[textStyles.description12Regular]}>
            {unit}
        </Text>
        <TouchableOpacity onPress={onPressDelete}>
            <Icon name="trash" color={'#f25639'} size={20} style={{marginLeft: 10}}/>
        </TouchableOpacity>
    </TouchableOpacity>
);


class MealDetail extends Component {

    constructor(props) {
        super(props);
        const { imgUri } = this.props;

        var initialElement = [
            {
                title: 'Add an Ingredient',
                icon: 'md-arrow-dropright-circle',
                onPress: () => {
                    this.props.toggleBottomSheetMenuForTrackOption(false);
                    this.newIngredient();
                }
            },
            {
                title: 'Copy from a Recipe',
                icon: 'md-search',
                onPress: () => {
                    this.props.toggleBottomSheetMenuForTrackOption(false);
                    const {activeMeal} = this.props;
                    let date = prettyDate();
                    Actions.recipeBook({
                        planId: activeMeal.plan_id,
                        mealType: activeMeal.type,
                        date,
                        add: this.props.add,
                        replace: this.props.replace,
                        removeOption: true,
                        nutrition:this.state.nutrition
                    });
                }
            }
        ];

        this.state = {
            title: (this.props.navigationState.recommended) ? `${this.props.activeMeal.title}` : '' ,
            imgUri:this.props.activeMeal.image,
            planId:this.props.activeMeal.plan_id,
            id:this.props.activeMeal.id,
            date:this.props.activeMeal.date,
            recommended: this.props.navigationState.recommended,
            imgData:'',
            ingredients: this.props.ingredients,
            nutrition: null,
            recipeName: '',
            isLike: null,
            isDisLike: null,
            comment:'',
            ingredientMenuItem: true,
            scanBarCodeMenuItem: true,
            pickFromRecipeBookMenuItem: true,
            lookUpARestaurantMenuItem: true,
            bottomSheetButtonsForTrack: initialElement,
            loading: false,
        };

        if(imgUri && !imgUri.endsWith('default-recipe.jpg'))
            this.setBase64ForExistingImage(imgUri)
    }

    componentWillMount(){
        const {recipeBookActionError, activeMeal, mealPlans, nutrition, ingredients} = this.props;

        if(this.props.recommended) {
            this.setState({
                ingredients: ingredients,
                nutrition: nutrition,
            });

        }else{

            const { date,ingredients} = this.state;
            const recipe = {
                date,
                planMealType:this.props.activeMeal.type,
                title:'',
                description:'',
                brand:'',
                location:'',
                base64: '',
                ingredients,
                nutrition: sumNutritionToString(ingredients) //include whole-meal nutrition data.
            };
            this.props.createEmptyEditRecipe(recipe);

        }
    }

    componentWillReceiveProps (nextProps) {

        if (nextProps === this.props) {
          return;
        }

        const { editRecipe, activeMeal, mealPlans } = nextProps;

        if(editRecipe){

            const { ndb, nutrition } = editRecipe;

            ingredients = ndb.map(

                (obj) => ({
                    name: obj.name || obj.food || obj.base,
                    ndb: obj.ndb || null,
                    quantity: (obj.qty) && obj.qty|| obj.quantity,
                    grams: obj.qty_g || obj.weight || obj.grams,
                    unit: obj.unit || obj.measure,
                    nutrition: obj.usda || obj.nutrition || null
                })
            );


            this.setState({
                ingredients: ingredients,
                nutrition: nutrition,
                planId: activeMeal.plan_id
            });

        }

    }

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
            console.warn(err)
        }
    }

    renderInputRow = ({field, ...inputRowProps}) => {

        const defaults = {
            title: {
                title: 'Save as',
                description: 'Let’s get creative',
                placeholder: 'required',
                maxLength: 100
            }
        };

        const value = this.state[field] ;
        return (
            <InputRow
                numberOfLines={3}
                multiline={true}
                {...defaults[field]}
                value={value}
                onChangeText={text =>
                    this.setState({ [field]: text, validationError: false })
                }
                keyboardType={field === 'url' ? 'url' : undefined}
                autoCorrect={field === 'url' ? false : undefined}
               {...inputRowProps}
            />
        );
    };

    setBase64ForExistingImage = imgUri =>
        RNFetchBlob.config({
            fileCache: true
        })
            .fetch('GET', imgUri)
            .then(resp => {
                imagePath = resp.path();
                return resp.readFile('base64');
            })
            .then(imgData => {
                this.setState({ imgData, imgUri });
                return RNFetchBlob.fs.unlink(imagePath);
            });

    showPicker = () =>
        showImagePicker(({base64, uri}) =>
            this.setState({imgUri: uri, imgData: base64})
        );

    newIngredient = () => {
        const {ingredients} = this.state;
        this.editIngredient(ingredients ? ingredients.length : 0);
    };

    saveIngredient = ingredient => {

        let {ingredients = [], selected_ingredient_index: index} = this.state;
        if (ingredients[index]) ingredients[index] = ingredient;
        else ingredients.push(ingredient);

        this.setState({ingredients}, () =>{
            this.props.updateIngredientToEditRecipe(ingredients);
            this.closeIngredient()}
    );};

    editIngredient = index => {

        const { ingredients } = this.state;

        this.props.editIngredient(ingredients && ingredients[index]);

        this.setState({
            selected_ingredient_index: index,
            editing_ingredient: true
        });
    };


    removeIngredient = index => {

        const { ingredients } = this.state;

        this.setState(({ingredients}) => ({
            ingredients: [
                ...ingredients.slice(0, index),
                ...ingredients.slice(index + 1)
            ]
        }),() => {
            this.props.updateIngredientToEditRecipe(this.state.ingredients);
        });
    };

    closeIngredient = () =>
        this.setState({
            selected_ingredient_index: undefined,
            editing_ingredient: false
        });


    renderIngredientRow = ({item, index}) => (
        <IngredientRow
            onPress={() => this.editIngredient(index)}
            onPressDelete={() => this.removeIngredient(index)}
            {...item}
        />
    );

    renderNoIngredients = () => (
        <View style={styles.noIngredientsContainer}>
            <Text style={styles.noIngredientsText}>
                Press the + above to add the first ingredient
            </Text>
        </View>
    );

     provideFeedback = (activeMeal) => {
         const {leftButton} = this.state;
         this.setState({ loading: false });
         Actions.reviewMeal({activeMeal,leftButton:false});
     };

    onDone = () => {

        const { editRecipe } = this.props;

        const {
            createCustomRecipe, activeMeal
        } = this.props;

        const {
            title,
            date,
            ingredients,
            imgData = '',
        } = this.state;

        const recipe = {
            date,
            planMealType: editRecipe.recipe.type,
            title: title,
            description: editRecipe.recipe.description,
            brand: editRecipe.recipe.brand,
            location: editRecipe.recipe.location,
            base64: imgData,
            ingredients: ingredients,
            nutrition: editRecipe.nutrition //include whole-meal nutrition data.
        };

        this.setState({ loading: true });

        createCustomRecipe(recipe).then((result)=>{

            const { activeMeal } = this.props;

            this.props.replaceMealExistingRecipe(
              {recipeId:result.recipeId, planId:activeMeal.plan_id, mealType:activeMeal.type,
                date: prettyDate()}).then(() => {

                const { activeSlideId,mealPlans } = this.props;

                let planId = mealPlans.mealplan[activeSlideId].plan_id;
                this.props.setActiveMeal(mealPlans.mealplan[activeSlideId]);
                this.provideFeedback(mealPlans.mealplan[activeSlideId]);

            }).catch((error) => {
                this.setState({ loading: false });

                console.log('error' + error.message)
            });
        });
    };

    render() {

        const {
            ingredients,
            editing_ingredient,
            selected_ingredient_index,
            bottomSheetButtonsForTrack,
            imgUri,
            nutrition,
            loading
        } = this.state;

        const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
        const {isBottomSheetForOptionTrackOpen, activeMeal, showNutrients, editRecipe } = this.props;

        let date = moment( new Date(prettyDate())).format("MMM DD");

        return (
            <SafeAreaView forceInset={{bottom: 'never'}} style={{flex: 1, backgroundColor: colors.primaryBlack}}>

                <View style={styles.outerContainer}>
                    <Header
                        title={`${activeMeal.type} on ${date}`}
                        leftIcon={icon}
                        leftButtonPress={() => Actions.pop()}
                    />
                    <KeyboardAwareScrollView style={{flex:1}}>

                        <Text style={[textStyles.description14, styles.headerTitle]} numberOfLines={5}>
                            {
                                (this.state.recommended)
                                &&
                                `${activeMeal.title}'s foods are shown below. Adapt it and click done to track.`
                                ||
                                `Build your own meal by adding ingredients below`
                            }

                        </Text>

                        {
                            showNutrients &&
                            <View>
                                <Text style={[textStyles.l2Text, styles.Title]}>Nutritional Information</Text>
                                <Text style={[textStyles.description14, styles.subTitle]}>Automatically updates as food products are modified below. </Text>
                                <View style={styles.nutritionContainer}>
                                    <NutritionSummary visible={showNutrients}
                                                      dailyMeal={false}
                                                      data={nutrition}
                                                      originalServing={1}/>
                                </View>
                            </View>
                        }

                        <View>
                            <View style={styles.ingredientView}>
                                <View style={{flex:0.9}}>
                                    <Text style={[textStyles.l2Text, styles.Title]}>Foods & Beverages</Text>
                                    <Text style={[textStyles.description14, styles.subTitle]}>List of individual foods & drinks in this meal</Text>
                                </View>
                                <View style={{flex:0.1,justifyContent: 'center',marginRight: 5}}>
                                <TouchableOpacity onPress={() => this.props.toggleBottomSheetMenuForTrackOption(true)}>
                                    <SimpleLineIcon name={'plus'} size={23} color='#f25639'/>
                                </TouchableOpacity>
                                </View>
                            </View>


                        </View>



                        <View style={styles.ingredientContainer}>
                            <View style={{flex: 1}}>
                                <FlatList
                                    data={ingredients}
                                    renderItem={this.renderIngredientRow}
                                    ListEmptyComponent={this.renderNoIngredients}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index}
                                />
                                {editing_ingredient && (
                                    <EditIngredientModal
                                        title="Enter Ingredient Details"
                                        nutrition={nutrition}
                                        onSave={ingredient => this.saveIngredient(ingredient)}
                                        onClose={this.closeIngredient}
                                        servings={(editRecipe) && ((editRecipe.recipe.total_servings) && (editRecipe.recipe.total_servings) || 1)}
                                    />
                                )}
                            </View>

                        </View>

                        <Text style={[textStyles.l2Text, styles.Title]}>Meal Information</Text>
                        <Text style={[textStyles.description14, styles.subTitle]}>Make it yours by giving a name and a picture</Text>
                        <View style={styles.mealContainer}>
                            <View>
                                {this.renderInputRow({field: 'title'})}
                                <PhotoRow onPress={this.showPicker} uri={imgUri}/>
                           </View>
                       </View>


                        <TouchableOpacity onPress={this.onDone}>
                            <View style={{
                                flex: 1,
                                marginTop: 20,
                                backgroundColor: colors.primaryGreen,
                                height: 60,
                                width: null,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={textStyles.description14White}>
                                    DONE
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {loading && <View style={loaderStyles.loadingContainer}>
        					<ActivityIndicator size={'large'} color={colors.primaryGrey}/>
        				</View>}

                </KeyboardAwareScrollView>
                    {isBottomSheetForOptionTrackOpen &&
                    <BottomSheetMenuForOption buttons={bottomSheetButtonsForTrack}/>}

                </View>

            </SafeAreaView>
        )

    }


}


const styles = StyleSheet.create({

    outerContainer: {
        flex: 1,
        backgroundColor: colors.mainBackground
    },
    titleContainer: {
        flex: 0.2,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 0.8,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    nutritionContainer: {
        flex: 0.2,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 0,
        margin: 0
    },
    mealContainer: {
        flex: 0.2,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0,
        margin: 0
    },
    ingredientContainer: {
        flex: 0.2,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 0,
        margin: 0
    },
    ingredientRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomColor: '#999999',
        borderBottomWidth: 0
    },
    ingredientNameText: {
        flex: 1,
    },
    quantityContainer: {
        marginLeft: 10
    },
    noIngredientsContainer: {
        flex: 1,
        margin: 20,
    },
    noIngredientsText: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 18
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        marginTop: 40,
        marginLeft: 10,
    },
    Title: {
        marginTop: 20,
        marginLeft: 10
    },
    subTitle: {
        marginLeft: 10,
        marginBottom: 10
    },
    ingredientView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ingredientTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#999999',
        marginTop: 20,
        marginLeft: 10
    },
    ingredientSubTitle: {
        fontSize: 13,
        color: 'rgb(218,218,218)',
        marginLeft: 10
    }
});

const mapStateToProps = ({main,recipeBook,mealPlan,clientPermissions}) => {
    const {isBottomSheetForOptionTrackOpen, activeMeal, activeSlideId} = main;
    const { error: recipeBookActionError,editRecipe} = recipeBook;
    const { showNutrients } = clientPermissions;
    const  { mealPlans, loading } = mealPlan;
    return {
        isBottomSheetForOptionTrackOpen,
        activeMeal,
        recipeBookActionError,
        editRecipe,
        mealPlans,
        activeSlideId,
        showNutrients
    };
};

export default connect(mapStateToProps, {
    toggleBottomSheetMenuForTrackOption,
    getRecipeByIdForEditing,
    replaceMealNewRecipe,
    createCustomRecipe,
    replaceMealExistingRecipe,
    sendReview,
    setActiveMeal,
    updateIngredientToEditRecipe,
    editIngredient,
    createEmptyEditRecipe
})(MealDetail);
