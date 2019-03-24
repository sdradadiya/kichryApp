import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Platform,
    Keyboard,
    ActivityIndicator,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    FlatList,
    Alert,
    Image,
    Animated, Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-another-toast';
import {omitBy, isNull, debounce} from 'lodash';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Header,
    showAnimation,
    RecipeDescriptionContainer,
    ShareButton,
    IconRowsForRecipeDetail,
    WarningModalView
} from './common';
import LikeButton from './common/LikeButton';
import RNFetchBlob from 'react-native-fetch-blob'
import {
    addMealNewRecipe,
    replaceMealNewRecipe,
    createCustomRecipe,
    recipeDelete,
    pinRecipeFromGlobal,
    scaledIngredientsServingSizeForGlobal,
    addIngredientToEditRecipe
} from '../actions';
import {
    colors,
    tracker,
    sumNutritionToStringGlobalRecipe,
    nutrientUnits
} from '../actions/const';
import {formatQuantity} from "../lib/formerQuantity";
import SafeAreaView from 'react-native-safe-area-view';
import Emojicon from 'react-native-emojicon';
const fs = RNFetchBlob.fs;
let imagePath = null;
let ingredientsByServing,toastSubMessage,toastImage,toastMessage;

class GlobalRecipeDetail extends Component {
	constructor (props) {
		super(props);
        this.state = { ...this.props.editIngredient};
        const { GlobalRecipes } = this.props;
        this.state=({
            name:GlobalRecipes.recipe.label,
            image:GlobalRecipes.recipe.image,
            ingredients:GlobalRecipes.recipe.ingredients,
            ingredientsShow:false,
            nutrition:GlobalRecipes.recipe.totalNutrients,
            grams:this.props.GlobalRecipes.recipe.totalWeight,
            description:this.props.GlobalRecipes.recipe.url,
            base64:'',
            modalVisible: false,
            warnings: null,
            showWarningList: false,
            renderModalButton: true,
            renderToast:false
        });
        this.animatedValue = new Animated.Value(0);
	}

    getBase64Image(img) {
        RNFetchBlob
            .config({
                fileCache : true
            })
            .fetch('GET', img)
            .then((resp) => {
                imagePath = resp.path();
                return resp.readFile('base64')
            })
            .then((base64Data) => {
                this.setState({
                    base64: base64Data
                });
                return fs.unlink(imagePath)
            })
    }

	componentWillMount()
	{
        tracker.trackScreenView('GlobalRecipe Detail');
        this.getBase64Image(this.state.image);
        ingredientsByServing=scaledIngredientsServingSizeForGlobal(this.state.ingredients,this.props.GlobalRecipes.recipe.yield,this.props.preferredServingSize);
	}

	componentWillUnmount () {
		Keyboard.dismiss();
	}

    renderButtons () {
        const { recipe } = this.props;
            return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {/* <LikeButton recipe={recipe} isFromGlobal={true} onLikeClicked={this.onLikeClicked}/> */}
                    <ShareButton recipe={recipe} />
                </View>

            );
    }

    checkNutritionalCompliance(current_nutrition)
    {
        let res,data;
        let arrNutritionWarnning=[];
        const check_nutrition = sumNutritionToStringGlobalRecipe(this.state.nutrition,this.props.GlobalRecipes.recipe.yield);
        let arrKey=Object.keys(check_nutrition);
        for(let i=0;i<arrKey.length;i++){
            switch (arrKey[i]) {
                case 'kcal' :
                    if(check_nutrition.kcal){
                        res = check_nutrition.kcal - (this.props.add ? ((current_nutrition.day_calorie_cap)+(current_nutrition.day_calorie_floor))/2 : current_nutrition.kcal);
                        data=`daily calorie ${Math.abs(res)} ${(res > 0) ? 'more' : 'les'}`;
                        arrNutritionWarnning.push(data);
                    }
                    break;
                case 'carbohydrate' :
                    if(check_nutrition.carbohydrate){
                        res = check_nutrition.carbohydrate - (this.props.add ? ((current_nutrition.day_carbohydrate_cap)+(current_nutrition.day_carbohydrate_floor))/2 : current_nutrition.carb);
                        data=`daily carbohydrate ${Math.abs(res)} ${(res > 0) ? 'more' : 'les'}`;
                        arrNutritionWarnning.push(data);
                    }
                    break;
                case 'fat':
                    if(check_nutrition.fat){
                        res = check_nutrition.fat - (this.props.add ? ((current_nutrition.day_fat_cap)+(current_nutrition.day_fat_floor))/2 : current_nutrition.fat);
                        data=`daily fat ${Math.abs(res)} ${(res > 0) ? 'more' : 'les'}`;
                        arrNutritionWarnning.push(data);
                    }
                    break;
                case 'protein':
                    if(check_nutrition.protein){
                        res = check_nutrition.protein - (this.props.add ? ((current_nutrition.day_protein_cap)+(current_nutrition.day_protein_floor))/2 : current_nutrition.protein);
                        data=`daily protein ${Math.abs(res)} ${(res > 0) ? 'more' : 'les'}`;
                        arrNutritionWarnning.push(data);
                    }
                    break;
            }
        };
        this.setState({warnings:arrNutritionWarnning,modalVisible:true});
    }

    onLikeClicked = () => {
	    this.setState({
            globalRecipe:true
        },()=>{
	        this.onPressSave()
        })

    }

    cancelDecision = () => this.setState({}, () => {
        this.closeModalWarning();
        Actions.pop()
    });

    closeModalWarning = () => this.setState({ modalVisible: false });
    
    renderWarnings () {
        const { warnings, showWarningList } = this.state;
        let arrString=[],warning;
        if(warnings)
        {
            return (
                <View style={styles.warningContainer}>
                    {
                        warnings.map((item, index) => {
                            arrString=item.split(' ');
                            (arrString[3]=="more") ? toastImage = "confused" : toastImage = "thumbsup";
                            if(index==0){
                                warning=`${(arrString[3]=="more")? "The selected meal exceeds your daily MAX requirement of the following nutrients: " : "The selected meal lowers your daily MIN requirement of the following nutrients: "}
                            \n${((arrString[1]).toUpperCase())} By ${Math.round(arrString[2])}`;
                            } else {
                                warning+=`\n${(arrString[1]).toUpperCase()} By ${Math.round(arrString[2])}${(nutrientUnits((arrString[1])))}`;
                            }
                        })}
                    <Text style={{textAlign:'left'}}>{warning}</Text>
                </View>
            );

        }
    }

    onPressButtonSwap = () => {
        const { nutrition_targets, add, activeMeal} = this.props;
        this.onPressSave();
    }

    renderSwapButton () {

        const { loading, error } = this.state;

        if (this.props.add || this.props.replace) {
            if (loading) {
                return <ActivityIndicator color={colors.primaryGrey} size={'large'}/>;
            } else {
                if(error) {
                    return(
                        <Text style={{
                            color: 'red',
                            textAlign: 'center',
                            paddingVertical: 5,
                            paddingHorizontal: 20
                        }}>{error}</Text>
                    );
                } else {
                    return (
                        <TouchableOpacity style={styles.buttonSwap} activeOpacity={0.9} onPress={this.onPressSave}>
                            <Text style={styles.buttonTitle}>SELECT</Text>
                        </TouchableOpacity>
                    );
                }

            }
        }
    }

    onPressSave = () => {
        this.setState({
            renderModalButton: false
        });
        const {
            replaceMealNewRecipe,
            addMealNewRecipe,
            createCustomRecipe,
            recipeDelete,
            pinRecipeFromGlobal
        } = this.props;
        const {
            planId,
            planMealType,
            date,
            add,
            replace,
            createRecipeForBook,
            editRecipe,
            activeTabId,
            loading
        } = this.props;
        const {
            name,
            description,
            brand,
            location,
            base64,
            ingredients,
            nutrition,
            globalRecipe
        } = this.state;
        
        this.props.addIngredientToEditRecipe(ingredients);
        this.setState({
            renderModalButton: false
        });
        this.closeModalWarning();
        Actions.popTo('mealDetail');
     /*   if (loading) return;
        const recipe = {
            activeTabId,
            date,
            planMealType,
            title: name,
            description,
            brand,
            location,
            base64,
            //don't include per-ingredient 'nutrition' data in the payload:
            ingredients: null,
            //include whole-meal nutrition data.
            nutrition: sumNutritionToStringGlobalRecipe(nutrition,this.props.GlobalRecipes.recipe.yield)
        };
        console.log(ingredients)
        if(globalRecipe) {
            pinRecipeFromGlobal(recipe);
        }else if (add) {
            toastSubMessage = "Added Successfully";
            addMealNewRecipe(recipe).then(()=>{
              this.setState({
                modalVisible: false,
                renderToast:true
              },()=>{
                this.toast.showToast();
                setTimeout(()=>{
                    this.setState({
                        renderToast: false,
                    });
                  Actions.main({ type: 'replace' });
                },3000)
              });
            });
        } else if (replace) {
            toastSubMessage = "Replaced Successfully";
            replaceMealNewRecipe({ ...recipe, planId }).then(()=>{
                this.setState({
                    modalVisible: false,
                    renderToast:true
                },()=>{
                  this.toast.showToast();
                  setTimeout(()=>{
                      this.setState({
                          renderToast: false,
                      });
                    Actions.main({ type: 'replace' });
                  },3000)
                });
            });
        }*/
    }


    renderImage () {
        const { imgContainer, imgStyle } = styles;
        const { image }=this.state;
        return (
            <View style={imgContainer}>
                <Image source={{ uri: image }} style={imgStyle}/>
                <View style={{ position: 'absolute', right: 15, bottom: 15 }}>
                    {this.renderButtons()}
                </View>
            </View>
        );
    }

    onPress() {
        if (!this.state.ingredientsShow) {
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 1,
                    duration: 450
                }
            ).start();
        } else {
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 0,
                    duration: 450
                }
            ).start();
        }
        this.setNewState();
    }

    setNewState () {
        this.setState({
            ingredientsShow: !this.state.ingredientsShow
        });
    }

    renderList()
    {
        const {container, titleStyle, qtyStyle} = styles;


        if(this.state.ingredientsShow){
            return ingredientsByServing.map((item,index)=>{
                let parsedQty = item.quantity % 1 ? item.quantity.toFixed(1) : item.quantity;
                return (<View style={container} key={index}>
                    <Text style={titleStyle}>{item.food}</Text>
                    <Text style={qtyStyle}>{formatQuantity(+parsedQty)} {item.measure}</Text>
                </View>)
            })
        }else{
            return null;
        }
    }

    renderIngredients()
    {
        const {buttonContainer, textContainer, textStyle} = styles;
        const spin = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg']
        });
        return (
            <View style={{flex: 1}}>
                <TouchableOpacity style={buttonContainer} onPress={() => this.onPress()}>
                    <View style={textContainer}>
                        <Text style={textStyle}>Ingredients</Text>
                        <Animated.View style={{transform: [{rotate: spin}]}}>
                            <Icon name={'angle-down'} size={22} color={colors.primaryOrange}/>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
                <View style={{marginLeft: 10}}>
                    {this.renderList()}
                </View>
            </View>
        );
    }

    renderDescription () {

        const {
            showTab
        } = this.props;
        if (!showTab) {
            return (
                <View style={styles.descriptionContainer}>
                    <RecipeDescriptionContainer
                        description=''
                        directions={this.props.GlobalRecipes.recipe.url}
                        isContent={true}/>
                </View>
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
                        <Emojicon name={toastImage} size={60} />
                        <Text style={toastTitle}>{toastImage === 'confused' ? 'If you insist!' : ''}</Text>
                        <Text style={toastSubTitle}>{toastSubMessage}</Text>
                    </View>
                }
                animationType={'fade'}
                animationDuration={200}
                topBottomDistance={Height}
                toastStyle={toastStyle}
                autoCloseTimeout={3000}
                ref={(c) => { this.toast = c }}
            />);
        }
    }

	  render () {
        return (
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
                <Header
                    title={"Recipe"}
                    leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
                    leftButtonPress={() => Actions.pop()}
                />
                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <View>
                        {this.renderImage()}
                        <View style={styles.header}>
                            <IconRowsForRecipeDetail
                                kcal={Math.round((this.props.GlobalRecipes.recipe.calories)/(this.props.GlobalRecipes.recipe.yield))}
                                cookingTime=''
                                totalServings={this.props.preferredServingSize}
                                title={this.props.GlobalRecipes.recipe.label}
                                servings={this.props.GlobalRecipes.recipe.yield}
                                showCookTimeDisclaimer={true}
                                showNutrients={this.props.showNutrients}
                            />
                        </View>
                        {this.renderIngredients()}
                        {this.renderDescription()}
                    </View>
                </ScrollView>
                {this.renderSwapButton()}
                {this.renderToast()}
            </SafeAreaView>
        );
	}
}

const styles = {
    buttonSwap: {
        backgroundColor: colors.primaryGreen,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTitle: {
        fontSize: 16,
        color: '#fff'
    },
    viewContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 3,
        paddingVertical: 10,
        marginBottom: 7,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        borderBottomWidth: 1
    },
    contentContainer: {
        height: 40,
        flex: 1
    },
    imgContainer: {
        height: 250,
        alignItems: 'stretch',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)'
    },
    imgStyle: {
        flex: 1,
        borderRadius: 5
    },
    nameStyle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20
    },
    buttonContainer: {
        height: 60,
        flexDirection: 'column',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.primaryGreen,
        marginTop: 10
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textStyle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 10,
        flex: 0.8
    },
    titleStyle: {
        fontSize: 18,
        flex: 0.6,
        marginRight: 5
    },
    qtyStyle: {
        flex: 0.3,
        textAlign: 'center',
        fontWeight: '500'
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        paddingBottom: 20
    },
    warningContainer: {
        justifyContent: 'space-around',
        paddingBottom: 20,
        minHeight: 10
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

const mapStateToProps = (state) => {
    const {
        mealPlan: {
            error: serverError,
            verifyingUnits,
            unitSuggestions = [],
            grams,
            editIngredient,
            nutrition_targets,
            preferredServingSize
        },
        recipeBook:{
            searchResult
        },
        main : {
            activeMeal,
        },
        clientPermissions: { showNutrients }
    } = state;
    return {
        serverError,
        verifyingUnits,
        unitSuggestions,
        grams,
        editIngredient,
        searchResult,
        activeMeal,
        nutrition_targets,
        preferredServingSize,
        showNutrients
    };
};

export default connect(mapStateToProps, {
    addMealNewRecipe,
    replaceMealNewRecipe,
    createCustomRecipe,
    recipeDelete,
    pinRecipeFromGlobal,
    scaledIngredientsServingSizeForGlobal,
    addIngredientToEditRecipe
})(GlobalRecipeDetail);
