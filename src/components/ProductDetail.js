/**
 * Created by mponomarets on 7/23/17.
 */
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
    FlatList,
    Alert,
    Dimensions,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-another-toast';
import {omitBy, isNull, debounce} from 'lodash';
import {connect} from 'react-redux';
import NutritionModal from './AddMeal/NutritionModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	Header
} from './common';
import {ArrowRow,Row} from './common/Rows';
import {
    addMealNewRecipe,
    replaceMealNewRecipe,
    createCustomRecipe,
    recipeDelete,
    addIngredientToEditRecipe
} from '../actions';
import {
    colors,
    tracker,
    sumNutritionToString
} from '../actions/const';
import {verifyUnit} from "../actions";
import moment from "moment/moment";
import SafeAreaView from 'react-native-safe-area-view';
import Emojicon from 'react-native-emojicon';

const Input = ({
                   title,
                   placeholder,
                   onChangeText,
                   value,
                   ...textInputProps
               }) => (
    <View style={Platform === 'ios' ? styles.inputContainer : styles.inputContainerAndroid }>
        <Text style={Platform === 'ios' ? styles.inputTitle : styles.inputTitleAndroid}>{title}</Text>
        <TextInput
            placeholder={placeholder}
            onChangeText={onChangeText}
            style={styles.inputText}
            value={value}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            autoCorrect={true}
            {...textInputProps}
        />
    </View>
);

const ValidationError = ({ visible, message }) =>
    !!visible && <Text style={styles.errorStyle}>{message}</Text>;

class ProductDetail extends Component {
	constructor (props) {
		super(props);
        this.state = { ...this.props.editIngredient};
        const { searchResult, ndb } = this.props;
        let filtered = searchResult.filter(function(item) {
            return item.ndb == ndb;
        });
        this.state=({name:filtered[0].name,
            title:filtered[0].name,
            nutrition:filtered[0],
            ndb:filtered[0].ndb,
            description:filtered[0].Description,
            renderToast:false,
            loading:false
        });
	}

	componentDidMount()
	{
		tracker.trackScreenView('ProductDetail');
	}

	componentWillUnmount () {
		Keyboard.dismiss();
	}

    saveIngredient = () => {
        const { name, ndb, quantity = '', unit = '', nutrition } = this.state;
        const { grams } = this.props;

        setErrorMessage = (errorMessage, otherState) =>
            this.setState({ showError: true, errorMessage, ...otherState });


        if (quantity.length < 1) setErrorMessage('Please enter a quantity');
        else if (isNaN(quantity) || Number(quantity) <= 0)
            setErrorMessage('Please enter a valid quantity (2, 0.5, etc)');
        else if (unit.length < 1 || !grams)
            setErrorMessage('Please enter a valid unit', {
                showUnitSuggestions: true
            });
        else {
            this.state=({
                ...this.state,
                ingredients:[{ name, ndb, quantity, grams, unit, nutrition }],
            });
            this.onPressSave();
        }
    };

    verifyUnit = debounce(
        () => this.props.verifyUnit(({ ndb, unit, quantity, name } = this.state)),
        400,
        { leading: false, trailing: true }
    );

    onFocusQuantity = () =>
        this.setState({
            showUnitSuggestions: false,
            showError: false
        });

    onChangeQuantity = quantity =>
        this.setState({ quantity, showError: false }, () => {
            if (this.state.unit && quantity) {
                this.verifyUnit();
                this.setState({ showUnitSuggestions: true });
            }
        });

    onEndEditingQuantity = () => {
        const { quantity } = this.state;
        this.setState({ quantity: quantity && quantity.trim() });
    };

    onFocusUnit = () =>{
        this.setState({
            showUnitSuggestions: true,
            showError: false
        });

    }

    onChangeUnit = unit =>{
        this.setState({ unit, showError: false }, () => {
            if (unit && this.state.quantity) this.verifyUnit();
        });
    }

    selectUnit = unit =>{
        this.setState(
            {
                unit,
                showUnitSuggestions: false,
                showError: false
            },
            () => this.verifyUnit()
        );
    }

    renderContents() {
        let {
            nutritionModalVisible,
             ndb, quantity, unit, nutrition
        } = this.state;
        let {grams}=this.props;
        if(!quantity){
            quantity = 1,grams = 100,unit=1
        }

        let ingredients = [{ndb, quantity, grams, unit, nutrition}];
        return (
            <View style={{flex: 1}}>
                {nutritionModalVisible && (
                    <NutritionModal
                        onSave={this.saveNutrition}
                        onClose={() => this.setState({ nutritionModalVisible: false })}
                        data={sumNutritionToString(ingredients)}
                        editable={false}
                    />
                )}
            </View>
        );
    }

    onPressSave = () => {
        const {
            replaceMealNewRecipe,
            addMealNewRecipe,
            createCustomRecipe,
            recipeDelete
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
            title,
            description,
            brand,
            location,
            imgData = '',
            ingredients,
            nutrition
        } = this.state;

        if (loading) return;

        const recipe = {
            activeTabId,
            date,
            planMealType,
            title,
            description,
            brand,
            location,
            base64: imgData,
            //don't include per-ingredient 'nutrition' data in the payload:
            ingredients: ingredients.map(
                ({ nutrition, ...ingredient }) => ingredient
            ),
            nutrition:sumNutritionToString(ingredients) //include whole-meal nutrition data.
        };

        this.props.addIngredientToEditRecipe(ingredients);

        if (add) {
            toastSubMessage = "Meal Added Successfully";
            addMealNewRecipe(recipe).then(()=>{
                this.setState({renderToast:true},()=>{
                  this.toast.showToast();
                  setTimeout(()=>{
                      this.setState({
                          renderToast: false,
                      });
                      Actions.main({ type: 'replace' });
                  },3000)
                });
            }).catch(()=>{

            });
        } else if (replace) {
            toastSubMessage = "Meal Replaced Successfully";

            replaceMealNewRecipe({ ...recipe, planId }).then(()=>{
                this.setState({renderToast:true},()=>{
                  this.toast.showToast();
                  setTimeout(()=>{
                      this.setState({
                          renderToast: false,
                      });
                    Actions.main({ type: 'replace' });
                  },3000)
                });
            }).catch(()=>{

            });
        }

    };

    renderNoUnits = () => {
        const { name, quantity, ndb } = this.state;
        if (this.props.grams) return <View />;

        let hint = '';
        if (name && quantity && ndb) {
            hint = 'Start typing, then select a unit';
        } else {
            hint = 'Enter an quantity to receive unit suggestions';
        }
        return (
            <Text style={styles.hintText}>{hint + ' from the Kitchry database'}</Text>
        );
    };

    onEndEditingUnit = () => {
        const { unit } = this.state;
        this.setState({
            showUnitSuggestions: true,
            unit: unit && unit.trim()
        });
    };

    renderUnitSuggestion = ({ item: unit }) => {
        return (
            <TouchableOpacity
                style={styles.suggestionTextContainer}
                onPress={() => this.selectUnit(unit)}
            >
                <Text style={styles.suggestionText}>{unit}</Text>
            </TouchableOpacity>
        );
    }     ;

    renderSuggestionHeader() {
        const { unitSuggestions } = this.props;
        const { showUnitSuggestions } = this.state;
        if (showUnitSuggestions && unitSuggestions.length > 0){
            return (
                <View style={styles.suggestionHeaderContainer}>
                    <Text style={styles.suggestionHeaderText}>Select a unit:</Text>
                </View>
            );
        }
    }

    renderSuggestionBox() {
        const { unitSuggestions } = this.props;
        const { showUnitSuggestions } = this.state;
        if (showUnitSuggestions) {
            return (
                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    data={unitSuggestions}
                    renderItem={this.renderUnitSuggestion}
                    ListEmptyComponent={this.renderNoUnits}
                    extraData={this.props}
                    keyExtractor={(item, index) => index}
                />
            );
        }
    }

    renderSuggestions() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.suggestionsContainer}>
                    {this.renderSuggestionHeader()}
                    {this.renderSuggestionBox()}
                </View>
            </TouchableWithoutFeedback>
        );
    }


    onEndEditingUnit = () => {
        const { unit } = this.state;
        this.setState({
            showIngredientSuggestions: false,
            showUnitSuggestions: true,
            unit: unit && unit.trim()
        });
    };

    onChangeQuantity = quantity =>
        this.setState({ quantity, showError: false }, () => {
            if (this.state.unit && quantity) {
                this.verifyUnit();
                this.setState({ showUnitSuggestions: true });
            }
        });

	renderInput()
	{
	    if(this.props.activeTabId === 2) {
            const {quantity, unit} = this.state;
            return (
                <View style={styles.renderInput}>
                    <Input
                        value={quantity}
                        title={'Quantity'}
                        placeholder={'2, .8, 1.25, etc'}
                        onFocus={this.onFocusQuantity}
                        onChangeText={this.onChangeQuantity}
                        onEndEditing={this.onEndEditingQuantity}
                        keyboardType={'numeric'}
                    />
                    <Input
                        value={unit}
                        title={'Unit'}
                        placeholder={'oz, g, grams, cups, etc'}
                        onFocus={this.onFocusUnit}
                        onChangeText={this.onChangeUnit}
                        onEndEditing={this.onEndEditingUnit}
                    />
                </View>
            );
        }
	}
	renderButton()
    {
        if(this.props.activeTabId === 2 && this.state.quantity && this.state.unit) {
            return (<TouchableOpacity style={styles.buttonSwap} activeOpacity={0.9} onPress={this.saveIngredient}>
                <Text style={styles.buttonTitle}>Add</Text>
            </TouchableOpacity>)
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
                        <Text style={toastTitle}></Text>
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
		const { searchResult, ndb ,createRecipeForBook ,screenTitle, add, replace } = this.props;
        const { showError, errorMessage } = this.state;
		let filtered = searchResult.filter(function(item) {
			return item.ndb === ndb;
		});
        let Height=Dimensions.get('window').height/2;

        return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={"Food Details"}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
				/>
                <ScrollView style={{ backgroundColor: '#fff' }}>
                    <View style={{marginTop:10}}>
                        <Text style={styles.foodTitle}>{this.state.name}</Text>
                        <View style={styles.foodDescriptionView}>
                            <Text style={{marginHorizontal:10,fontSize:16,marginBottom:5}}>Food Description</Text>
                            <Text style={styles.foodDetails}>{this.state.description}</Text>
                        </View>
                        {this.renderInput()}
                        <View style={styles.nutritionInfoView}>
                            <TouchableOpacity
                                onPress={() => this.setState({ nutritionModalVisible: true })}>
                                <View style={styles.nutritionInfo}>
                                    <Text style={{fontSize:16}}>View Nutrition</Text>
                                    <Icon name={'angle-right'} size={20} color={'#000'}/>
                                </View>
                            </TouchableOpacity>
                            {this.renderContents()}
                        </View>
                        <ValidationError visible={showError} message={errorMessage} />
                    </View>
                    {this.renderSuggestions()}
                </ScrollView>
                {this.renderButton()}
                {this.renderToast()}
			</SafeAreaView>
		);
	}
}



const mapStateToProps = (state) => {
    const {
        mealPlan: {
            error: serverError,
            verifyingUnits,
            unitSuggestions = [],
            grams,
            editIngredient
        },
        recipeBook:{
            searchResult
        }
    } = state;
    return {
        serverError,
        verifyingUnits,
        unitSuggestions,
        grams,
        editIngredient,
        searchResult,
    };
};

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
        flex: 1,
        backgroundColor: '#fff',
        width: '100%'
    },
    contentContainer: {
        height: 40,
        flex: 1
    },
    textInputContainer: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    textInput: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        height: 50,
        backgroundColor: 'transparent',
        paddingTop: 6
    },
    suggestionsContainer: {
        paddingTop: 10,
        paddingHorizontal: 12,
        flex: 1,
        backgroundColor: '#fff'
    },
    suggestionTextContainer: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    suggestionText: {
        marginVertical: 8,
        textAlign: 'right',
        fontSize: 18
    },
    suggestionHeaderContainer: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    suggestionHeaderText: {
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: colors.darkGrey
    },
    hintText: {
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: colors.darkGrey
    },
    errorStyle: {
        paddingVertical: 7,
        textAlign: 'center',
        color: 'red'
    },
    inputContainer: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    inputContainerAndroid: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    inputTitle: {
        fontSize: 16,
        marginRight: 10
    },
    inputTitleAndroid: {
        fontSize: 16,
        paddingVertical: 10,
        paddingLeft: 10
    },
    inputText: {
        flex: 1,
        textAlign: 'right',
        marginRight:10,
        fontSize: 16
    },
    foodTitle:{
	    color: colors.primaryOrange,
	    fontWeight: 'bold',
	    fontSize: 20,
	    textAlign: 'left',
	    width: '100%',
        marginHorizontal:10
    },
    nutritionInfo:{
	    flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginHorizontal:10,
        borderBottomWidth:1,
        borderBottomColor: colors.lightGrey,
        height:40
    },
    foodDetails:{
        fontSize: 16,
        color:colors.darkGrey,
        marginLeft: 10,
        marginBottom:10
    },
    foodDescriptionView:{
	    flexDirection:'column',
        marginTop:20,
        borderBottomWidth:1,
        borderBottomColor: colors.lightGrey
    },
    nutritionInfoView:{
        flexDirection:'column'
    },
    renderInput: {
        flexDirection: 'column'
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

export default connect(mapStateToProps, {
    verifyUnit,
    addMealNewRecipe,
    replaceMealNewRecipe,
    createCustomRecipe,
    recipeDelete,
    addIngredientToEditRecipe

})(ProductDetail);
