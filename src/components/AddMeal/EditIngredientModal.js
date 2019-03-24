import React, {Component} from 'react';
import {
    View,
    Keyboard,
    Text,
    Modal,
    TextInput,
    FlatList,
    Platform,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import {debounce, findIndex} from 'lodash';
import {loadIngredientSuggestions, verifyUnit} from '../../actions';
import {colors, sumNutritionToString, textStyles, marginStyles} from '../../actions/const';
import {Header, Button} from '../common';
import ProgressBar from './ProgressBar';
import _ from 'lodash';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { formatQuantity } from '../../lib/formerQuantity';

let nutritionMealArray = ['kcal', 'carbohydrate', 'protein', 'fat'];

const Input = ({
                   title,
                   placeholder,
                   onChangeText,
                   value,
                   editable,
                   ...textInputProps
               }) => (
    
    <View style={Platform === 'ios' ? styles.inputContainer : styles.inputContainerAndroid}>
        <View style={{flex:0.3}}>
            <Text style={Platform === 'ios' ? [styles.inputTitle, textStyles.description12Regular] : [styles.inputTitleAndroid, textStyles.description12Regular]}>{title}</Text>
        </View>
        <View style={{flex:0.7}}>
            <TextInput
                placeholder={placeholder}
                onChangeText={onChangeText}
                style={[textStyles.textInputStyleIOS, {marginVertical: 5}]}
                value={(value) ? value.toString() : ''}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                autoCorrect={true}
                editable={editable}
                {...textInputProps}
                returnKeyType={'done'}
            />
        </View>

    </View>
);

const ValidationError = ({visible, message}) =>
    !!visible && <Text style={styles.errorStyle}>{message}</Text>;

class EditIngredientModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.editIngredient,
            nutritionInfo: null,
            nutrition_arr: null,
            data:[]
        };
    }


    componentDidMount() {
        this.getRemainingData();
    }

    componentWillReceiveProps(nextProps) {
        
        if (this.props === nextProps) {
            return;            
        }

        const {name = '', ndb, quantity = '', unit = '', nutrition} = this.state;
        const {grams} = nextProps;

        if (grams) {
            let ingredientData = [{name, ndb, quantity, grams, unit, nutrition}];
            this.setState({
                nutritionInfo: sumNutritionToString(ingredientData, 1) // '1' is the originalServings size in this case always === 1
            }, () => {
                this.renderNutrition(nextProps);
            })
        }
    }

    getRemainingData(){

        const {activeMeal, dailyMeal, nutrition, servings } = this.props;

        let consumedNutrition = 0;
        let remaining = {};
        let more = false;
        let total = 0;
        let consumed = 0;
        let nutrition_arr = [];

        nutritionMealArray.map((item, index) => {
            if (activeMeal && (Object.keys(activeMeal).length !== 0) && nutrition) {
                more = false;
                let tempActiveMeal = _.cloneDeep(activeMeal);
                tempActiveMeal['carbohydrate'] = tempActiveMeal['carb'];
                delete tempActiveMeal['carbs'];
                total = parseInt(tempActiveMeal[item]);
                consumed = parseInt((nutrition[item]) ? nutrition[item] : 0);
                remaining.value = (Math.abs(total - consumed) === (total * 0.05) ? 0 : total - consumed);
                consumedNutrition = (100 * consumed) / total;

                if (remaining.value < 0) {
                    more = true;
                }
                nutrition_arr[nutritionMealArray[index]] = remaining.value;

            }
        });
        this.setState({
            data: [
                {
                    title:'calories',
                    value:0,
                    percentage:0,
                    baseValue:`${nutrition_arr.kcal}`
                },
                {
                    title:'carbs(g)',
                    value:0,
                    percentage:0,
                    baseValue:`${nutrition_arr.carbohydrate}`
                },
                {
                    title:'protein(g)',
                    value:0,
                    percentage:0,
                    baseValue:`${nutrition_arr.protein}`
                },
                {
                    title:'fat(g)',
                    value:0,
                    percentage:0,
                    baseValue:`${nutrition_arr.fat}`
                }
            ],
            nutrition_arr:nutrition_arr
        },()=>{
            this.renderNutrition(this.props)
        })

    }

    saveIngredient = () => {
        const {name = '', ndb, quantity = '', unit = '', nutrition} = this.state;
        const {grams} = this.props;

        setErrorMessage = (errorMessage, otherState) =>
            this.setState({showError: true, errorMessage, ...otherState});

        if (name.length < 3) setErrorMessage('Please enter an ingredient');
        else if (!ndb)
            setErrorMessage('Please select an ingredient from the list', {
                showIngredientSuggestions: true
            });
        else if (quantity.length < 1) setErrorMessage('Please enter a quantity');
        else if (isNaN(quantity) || Number(quantity) <= 0)
            setErrorMessage('Please enter a valid quantity (2, 0.5, etc)');
        else if (unit.length < 1 || !grams)
            setErrorMessage('Please enter a valid unit', {
                showUnitSuggestions: true
            });
        else {
            this.props.onSave({name, ndb, quantity, grams, unit, nutrition});
        }
    };

    loadIngredientSuggestions = debounce(
        () => this.props.loadIngredientSuggestions(this.state.name),
        400,
        {leading: false, trailing: true}
    );

    verifyUnit = debounce(
        () => this.props.verifyUnit(({ndb, unit, quantity, name} = this.state)),
        400,
        {leading: false, trailing: true}
    );

    selectFirstIngredientSuggestion = () => this.selectNthIngredientSuggestion(0);

    selectNthIngredientSuggestion = n => {
        const {ingredientSuggestions} = this.props;
        if (ingredientSuggestions.length > n && n >= 0) {
            const {name, ndb, ...nutrition} = ingredientSuggestions[n];
            this.setState(
                {
                    name,
                    ndb,
                    nutrition,
                    showError: false,
                    showIngredientSuggestions: false,
                    showUnitSuggestions: false
                },
                () => {
                    if (this.state.unit && this.state.quantity) {
                        this.verifyUnit();
                        this.setState({showUnitSuggestions: true});
                    }
                }
            );
        }
    };

    selectIngredientMatchingName = name => {
        if (name) {
            let ind = findIndex(
                this.props.ingredientSuggestions,
                o => o.name.toLowerCase() == name.toLowerCase()
            );
            this.selectNthIngredientSuggestion(ind);
        }
    };

    onFocusName = () =>
        this.setState({
            showIngredientSuggestions: true,
            showUnitSuggestions: false,
            showError: false
        });

    onChangeName = name => {
        this.setState(
            {
                name,
                ndb: undefined,
                nutrition: undefined,
                showError: false,
            },
            () => this.loadIngredientSuggestions()
        );
    };

    onEndEditingName = () => {
        const {name} = this.state;
        this.setState({name: name && name.trim()}, () => {
            }
            // this.selectIngredientMatchingName(name)
        );
    };

    onFocusQuantity = () =>
        this.setState({
            showIngredientSuggestions: false,
            showUnitSuggestions: false,
            showError: false
        });

    onChangeQuantity = quantity =>
        this.setState({quantity, showError: false}, () => {
            if (quantity) {
                this.verifyUnit();
                this.setState({showUnitSuggestions: true},()=>{
                    this.onFocusUnit()
                });
            }
        });

    onEndEditingQuantity = () => {
        const {quantity} = this.state;
        this.setState({quantity: quantity && quantity.trim()});
        this.setState({showUnitSuggestions: true});
    };

    onFocusUnit = () => {
        var dismissKeyboard = require('dismissKeyboard');
            this.setState({
                unit: '...',
                showIngredientSuggestions: false,
                showUnitSuggestions: true,
                showError: false
            },
            () => this.verifyUnit(),
                dismissKeyboard()
        );
    }

    onChangeUnit = unit =>
        this.setState({unit, showError: false}, () => {
            if (unit && this.state.quantity) this.verifyUnit();
        });

    selectUnit = unit => {
        this.setState(
            {
                unit,
                showUnitSuggestions: false,
                showIngredientSuggestions: false,
                showError: false
            },
            () => {
                //this.saveIngredient(),
                this.verifyUnit()
            }
        );
    };

    onEndEditingUnit = () => {
        const {unit} = this.state;
        this.setState({
            showIngredientSuggestions: false,
            showUnitSuggestions: true,
            unit: unit && unit.trim()
        });

    };

    renderIngredientSuggestion = ({item: {name}, index}) => (
        <TouchableOpacity
            style={styles.suggestionTextContainer}
            onPress={() => this.selectNthIngredientSuggestion(index)}
        >
            <Text style={[textStyles.description12Regular, styles.suggestionText, ,{color:colors.primaryBlue}]}>{name}</Text>
        </TouchableOpacity>
    );


    renderUnitSuggestion = ({item: unit}) => (
        <View style={[styles.suggestionTextContainer,styles.unitView]}>
        <TouchableOpacity
            onPress={() => this.selectUnit(unit)}
        >
            <Text style={[styles.suggestionText,textStyles.l4Text,{color:colors.primaryBlue}]}>{unit}</Text>
        </TouchableOpacity>
        </View>
    );

    renderNoIngredients = () => (
        <Text style={textStyles.description12Regular}>
            Start typing, then select an ingredient from the Kitchry database
        </Text>
    );

    renderNoUnits = () => {
        const {name, quantity, ndb} = this.state;
        if (this.props.grams) return <View/>;

        let hint = '';
        if (name && quantity && ndb) {
            hint = 'Start typing, then select a unit';
        } else if (name && quantity) {
            hint = 'Enter or select a valid ingredient to see unit suggestions';
        } else if (name) {
            hint = 'Enter a quantity to receive unit suggestions';
        } else if (quantity) {
            hint = 'Enter a valid ingredient to receive unit suggestions';
        } else {
            hint = 'Enter an ingredient and quantity to receive unit suggestions';
        }
        return (
            <Text style={textStyles.description12Regular}>{hint + ' from the Kitchry database'}</Text>
        );
    };

    renderInputs() {
        const {name, quantity, unit} = this.state;
        return (
            <View>
                <Input
                    value={name}
                    title={'Name'}
                    placeholder={'Name'}
                    onChangeText={this.onChangeName}
                    onEndEditing={this.onFocusName}
                    editable={true}
                />
                <Input
                    value={quantity ? quantity.toString() : ''}
                    title={'Quantity'}
                    placeholder={'2, .8, 1.25, etc'}
                    onFocus={this.onFocusQuantity}
                    onChangeText={this.onChangeQuantity}
                    onEndEditing={this.onEndEditingQuantity}
                    keyboardType={'numeric'}
                    editable={true}
                />
                <Input
                    value={unit}
                    title={'Unit'}
                    placeholder={'select from list below'}
                   // onFocus={this.onFocusUnit}
                    onChangeText={this.onChangeUnit}
                    onEndEditing={this.onEndEditingUnit}
                    editable={false}
                />
            </View>
        );
    }

    renderSuggestionHeader() {
        const {ingredientSuggestions, unitSuggestions} = this.props;
        const {showIngredientSuggestions, showUnitSuggestions} = this.state;
        if (showIngredientSuggestions && ingredientSuggestions.length > 0)
            return (
                <View style={styles.suggestionHeaderContainer}>
                    <Text style={styles.suggestionHeaderText}>Select an ingredient:</Text>
                </View>
            );
        else if (showUnitSuggestions && unitSuggestions.length > 0)
            return (
                <View style={styles.suggestionHeaderContainer}>
                    <Text style={styles.suggestionHeaderText}>Select a unit:</Text>
                </View>
            );
    }

    renderSuggestionBox() {
        const {ingredientSuggestions, unitSuggestions} = this.props;
        const {showIngredientSuggestions, showUnitSuggestions} = this.state;

        if (showIngredientSuggestions && ingredientSuggestions.length > 0 )
            return (
                <FlatList
                    keyboardShouldPersistTaps={'always'} // so a single tap selects the ingredient
                    data={ingredientSuggestions}
                    renderItem={this.renderIngredientSuggestion}
                    extraData={this.props}
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
                    onLayout={() => this.flatList.scrollToEnd({animated: true})}
                    keyExtractor={({ndb}) => ndb}
                />
            );
        else if (showUnitSuggestions)
            return (
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'} // so a single tap selects the unit
                        data={unitSuggestions}
                        renderItem={this.renderUnitSuggestion}
                        extraData={this.props}
                        keyExtractor={(item, index) => index}
                    />
            );
        else if(showIngredientSuggestions)
            return (
                <View style={styles.suggestionHeaderContainer}>
                    <Text style={styles.errorStyle}>No Match Found</Text>
                </View>
            );
    }

    renderSuggestions() {

        return (
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={[styles.suggestionsContainer,{paddingHorizontal:0}]}>
                        {this.renderSuggestionBox()}
                    </View>
                </TouchableWithoutFeedback>
        );
    }

    renderNutrition(nextProps) {

        const { nutritionInfo, nutrition_arr } = this.state;
        const { activeMeal } = nextProps;

        if(nutrition_arr && nutritionInfo){
            data1 = [
                {
                    title:'calories',
                    value:`${nutritionInfo.kcal}`,
                    percentage:(100 * nutritionInfo.kcal)/nutrition_arr.kcal,
                    baseValue:nutrition_arr.kcal
                },
                {
                    title:'carbs(g)',
                    value:`${nutritionInfo.carbohydrate}`,
                    percentage:(100 * nutritionInfo.carbohydrate)/nutrition_arr.carb,
                    baseValue:nutrition_arr.carbohydrate
                },
                {
                    title:'protein(g)',
                    value:`${nutritionInfo.protein}`,
                    percentage:(100 * nutritionInfo.protein)/nutrition_arr.protein,
                    baseValue:nutrition_arr.protein
                },
                {
                    title:'fat(g)',
                    value:`${nutritionInfo.fat}`,
                    percentage:(100 * nutritionInfo.fat)/nutrition_arr.fat,
                    baseValue:nutrition_arr.fat
                }
            ];

            if (!_.isEqual(this.state.data, data1)) {
                this.setState({
                    data: data1
                });
            }
        }


    }

    renderChart() {

        let quantity = this.state.quantity ? this.state.quantity : '';

        return(
            <View style={{height:responsiveHeight(47)}}>
                <Text style={[textStyles.description12, marginStyles.descriptionMargin]}>Nutrition Synopsis* for </Text>
                <Text style={[textStyles.l4Text, marginStyles.descriptionMargin, {color:'orange'}]}>{formatQuantity(quantity)} {this.state.unit} {this.state.name}</Text>
                <View style={styles.chartView}>
                    {
                        this.state.data.map((item, index) => {
                            return(
                                <View key={index} style={{flex: 1, margin: 5, flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={[textStyles.description12, marginStyles.descriptionMargin]}>{item.title}</Text>
                                    <Text style={[textStyles.l3Text, marginStyles.descriptionMargin]}>{item.value}</Text>
                                    <Text style={[textStyles.description14, marginStyles.descriptionMargin]}>{item.baseValue}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.descView}>
                    <View style={{flexDirection:'row', marginBottom:20}}>
                        <View style={{backgroundColor: colors.primaryBlack,height:15,width:12,marginRight:3}}/>
                        <Text style={textStyles.description12}>This Ingredient</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{backgroundColor:colors.primaryGrey,height:15,width:12,marginRight:3}}/>
                        <Text style={textStyles.description12}>Available in the Meal</Text>
                    </View>
                </View>
                <View style={{marginLeft:5}}>
                    <Text style={textStyles.description10}>* Based on USDA Composition Database</Text>
                </View>
            </View>
        );
    }

    render() {
        const {title, onClose} = this.props;
        const {showError, errorMessage, nutrition} = this.state;
        let leftIcon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';

        return (
            <Modal
                animationType="slide"
                transparent={true}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={onClose}>

                <View style={styles.viewContainer}>
                     <View style={styles.container}>
                     <Header
                         title={title}
                         leftIcon={leftIcon}
                         leftButtonPress={onClose}/>
                     <ScrollView>
                        <View>
                            <Text style={Platform === 'ios' ? [styles.inputTitle, textStyles.description12] : [styles.inputTitleAndroid, textStyles.description12]}>Select from thousands of Individual ingredients, beverages, restaurant foods etc.</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            {this.renderInputs()}
                            <ValidationError visible={showError} message={errorMessage}/>
                            {this.renderSuggestions()}
                        </View>

                        {(this.state.data.length > 0) && this.renderChart()}
                        <Button title="DONE" onPress={this.saveIngredient} />    
                        </ScrollView>
                    </View>                
                </View>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    const {
        main: {
            activeMeal,
        },
        mealPlan: {
            error: serverError,
            nutrition_targets,
            ingredientSuggestions = [],
            loadingIngredientSuggestions,
            verifyingUnits,
            unitSuggestions = [],
            grams,
            editIngredient
        }
    } = state;
    return {
        serverError,
        ingredientSuggestions,
        loadingIngredientSuggestions,
        verifyingUnits,
        unitSuggestions,
        grams,
        editIngredient,
        activeMeal,
        nutrition_targets
    };
};

export default connect(mapStateToProps, {
    loadIngredientSuggestions,
    verifyUnit
})(EditIngredientModal);

const styles = {
    viewContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 40
    },
    contentContainer: {
        //flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 20,
        marginRight:20
    },
    textInputContainer: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        flex:1,
        flexDirection:'row'        
    },
    textInput: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        height: responsiveHeight(50),
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingTop: 6
    },
    suggestionsContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        minHeight:40
    },
    suggestionTextContainer: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        padding:5
    },
    suggestionText: {
        marginVertical: 8,
        textAlign: 'left',
        color:colors.primaryBlue
    },
    suggestionHeaderContainer: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    suggestionHeaderText: {
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: colors.lightGrey
    },
    hintText: {
        fontSize: 18,
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
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    inputContainerAndroid: {
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    inputTitle: {
        marginRight: 5
    },
    inputTitleAndroid: {
        paddingVertical: 10,
        paddingLeft: 10
    },
    inputText: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        marginRight:10
    },
    nutritionText: {
        fontSize: 15,
        color: colors.primaryGrey,
        margin: 5,
        fontStyle: 'italic'
    },
    unitView: {
        borderBottomWidth:0,
        borderRightWidth: 1,
        borderColor:colors.primaryGrey,
        justifyContent:'center',
        alignItems: 'center',
        width:Dimensions.get('window').width/3,
        height:60
    },
    idTitle: {
        marginLeft: 5,
        marginRight: 15
    },
    chartView: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    descView: {
        flexDirection:'row',
        marginBottom:50,
        justifyContent:'space-around',
    }


};
