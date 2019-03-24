import React, { Component } from 'react';
import {View, Platform, Text, ActivityIndicator, Alert, Dimensions, Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { mapValues, mergeWith } from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob';
import SafeAreaView from 'react-native-safe-area-view';
import {
	addMealNewRecipe,
	replaceMealNewRecipe,
	recipeDelete,
	createCustomRecipe
} from '../actions';
import { colors, showImagePicker, tracker, sumNutritionToString } from '../actions/const';
import { Header } from './common';
import ListIngredientsModal from './AddMeal/ListIngredientsModal';
import NutritionModal from './AddMeal/NutritionModal';
import { SwitchRow, InputRow, ArrowRow, PhotoRow } from './common/Rows';
import Toast from 'react-native-another-toast';
import Emojicon from 'react-native-emojicon';

const ValidationError = ({ visible, message }) =>
	!!visible && <Text style={styles.errorStyle}>{message}</Text>;

const ServerError = ({ visible, message }) =>
	!!visible && <Text style={styles.errorStyle}>{message}</Text>;


class AddMeal extends Component {
	constructor(props) {
		super(props);
		this.state = { validationError: false, automaticLookup: true, renderToast:false, padding:5 };
        const { editRecipe,addCustomRecipe,isClone } = this.props;

        if(editRecipe) {
            const {
                recipe: { title, description, brand, location, url, image: imgUri },
                ndb
            } = editRecipe;
            ingredients = ndb.map(
                ({ name, ndb, qty, qty_g, unit, usda }) => ({
                    name,
                    ndb,
                    quantity: qty.toString(),
                    grams: qty_g,
                    unit,
                    nutrition: usda
                })
            );

            this.state = {
                ...this.state,
                title,
                description,
                brand,
                location,
                url,
                ingredients,
                nutrition: sumNutritionToString(ingredients)
            };

            if(imgUri && !imgUri.endsWith('default-recipe.jpg'))
                this.setBase64ForExistingImage(imgUri)
        }else if(addCustomRecipe){
            const {
                recipe: { title, description, brand, location, url, image: imgUri },
                ndb
            } = addCustomRecipe;
            ingredients = ndb.map(
                ({ name, ndb, qty, qty_g, unit, usda }) => ({
                    name,
                    ndb,
                    quantity: qty.toString(),
                    grams: qty_g,
                    unit,
                    nutrition: usda
                })
            );

            this.state = {
                ...this.state,
                title:(isClone)? "Copy of" + title : title,
                description,
                brand,
                location,
                url,
                ingredients,
                nutrition: sumNutritionToString(ingredients)
            };

            if(imgUri && !imgUri.endsWith('default-recipe.jpg'))
                this.setBase64ForExistingImage(imgUri)
        }
	}

	componentDidMount()
	{
        tracker.trackScreenView("AddMeal");
	}


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
		showImagePicker(({ base64, uri }) =>
			this.setState({ imgUri: uri, imgData: base64 })
		);

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
			ingredients = [],
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
			nutrition //include whole-meal nutrition data.
		};


		if (title) {
			this.setState({ validationError: false });
			if (add) {
				addMealNewRecipe(recipe).then(()=>{
					this.setState({
                        renderToast: true,
					},()=>{
                        this.toast.showToast();
                        setTimeout(()=>{
                            this.setState({
                                renderToast: false,
                            });
                            Actions.main({type:'replace'});
                        },3000)
					});
                });
			} else if (createRecipeForBook) {
				createCustomRecipe(recipe);
			} else if (replace) {
				replaceMealNewRecipe({ ...recipe, planId }).then(()=>{
                    this.setState({
                        renderToast: true,
                    },()=>{
                        this.toast.showToast();
                        setTimeout(()=>{
                            this.setState({
                                renderToast: false,
                            });
                            Actions.main({type:'replace'});
                        },3000)
                    });
				});
			} else if (editRecipe) {
				recipeDelete(editRecipe.recipe.recipe_id)
				.then((recipeId)=>{
					const { recipeBookActionError } = this.props;
					if(recipeBookActionError) {
						const alertOptions = [
							{ text: 'Cancel' },
							{ text: 'Create New Recipe', onPress: () => createCustomRecipe(recipe) }
						];
						Alert.alert(
							'Could not edit recipe',
							recipeBookActionError,
							alertOptions
						);
					}
					else {
						createCustomRecipe(recipe);
					}
				})
			} else
				console.warn(
					'did not specify add/replace/createRecipeForBook/editRecipe when adding new recipe'
				);
		} else {
			this.setState({
				validationError: true,
				errorMessage: 'Title is required'
			});
		}
	};

	closeIngredientsModal = () =>
		this.setState({ validationError: false, ingredientsModalVisible: false });

	saveIngredients = ingredients => {
		this.setState({ ingredientsModalVisible: false, ingredients });
		if (this.state.automaticLookup)
			this.setState({ nutrition: sumNutritionToString(ingredients) });
	};

	saveNutrition = nutrition =>
		this.setState({ nutritionModalVisible: false, nutrition });

	// renderAutomaticLookupSwitchRow() {
	// 	const { automaticLookup: value } = this.state;
	// 	const description = value
	// 		? 'Select from Kitchry database'
	// 		: 'Add your own ingredients';
	// 	return (
	// 		<SwitchRow
	// 			title={'Automatic Ingredient Lookup'}
	// 			description={description}
	// 			value={value}
	// 			disabled={true} // to be removed when non-USDA/custom ingredients are supported
	// 			onValueChange={() => this.setState({ automaticLookup: !value })}
	// 		/>
	// 	);
	// }

	renderInputRow = ({ field, ...inputRowProps }) => {
		const defaults = {
			title: {
				title: 'Title',
				description: 'Let’s get creative',
				placeholder: 'required',
				maxLength: 100
			},
			description: {
				title: 'Description',
				description: 'What’s healthy about it',
				placeholder: 'optional',
				multiline: true,
				maxLength: 255
			},
			brand: {
				title: 'Brand',
				description: 'Store or the brand name',
				placeholder: 'optional',
				maxLength: 255
			},
			location: {
				title: 'Location',
				description: 'Link to the recipe',
				placeholder: 'optional',
				maxLength: 300
			},
			url: {
				title: 'Web Link',
				description: 'description',
				placeholder: 'optional',
				maxLength: 300
			}
		};
		const value = this.state[field];
		return (
			<InputRow
				{...defaults[field]}
				value={value}
				onChangeText={text =>
					this.setState({ [field]: text, validationError: false })
				}
				keyboardType={field == 'url' ? 'url' : undefined}
				autoCorrect={field == 'url' ? false : undefined}
				{...inputRowProps}
			/>
		);
	};

	renderRows() {
		const {
			automaticLookup,
			imgUri,
			ingredients = [],
			nutrition: { kcal } = {}
		} = this.state;

		let nutritionDescription = '';
		if (automaticLookup) {
			if (kcal) nutritionDescription = kcal + ' Calories';
		} else {
			if (ingredients.length > 0)
				nutritionDescription = 'Required since ingredients have been entered';
			else nutritionDescription = 'optional';
		}

		return (
			<View>
				{this.renderInputRow({ field: 'title' })}
				<PhotoRow onPress={this.showPicker} uri={imgUri} />
				{this.renderInputRow({ field: 'description' })}
				{this.renderInputRow({ field: 'brand' })}
				{this.renderInputRow({ field: 'location' })}
				{/* {this.renderInputRow({ field: 'url' })} */}
				{/* {this.renderAutomaticLookupSwitchRow()} */}
				<ArrowRow
					title={'Ingredients'}
					description={'Add your ingredients here'}
					onPress={() => this.setState({ ingredientsModalVisible: true })}
				/>
				<ArrowRow
					title={automaticLookup ? 'View Nutrition' : 'Enter Nutrition'}
					description={nutritionDescription}
					onPress={() => this.setState({ nutritionModalVisible: true })}
				/>
			</View>
		);
	}

	renderContents() {
		const {
			ingredients,
			ingredientsModalVisible,
			nutrition,
			nutritionModalVisible,
			automaticLookup,
			validationError,
			errorMessage
		} = this.state;
		const { loading, planMealType, date, serverError, editRecipe, createRecipeForBook } = this.props;

		const addReplaceMealTitle =
			planMealType + ' on ' + moment(date, 'MM/DD/YYYY').format('MMM DD');
		const newRecipeTitle = 'Add recipe to your book';
		const editRecipeTitle = 'Edit Recipe';
		const formTitle = createRecipeForBook ? newRecipeTitle : planMealType ? addReplaceMealTitle : editRecipeTitle;

		if (loading)
			return (
				<View style={styles.spinnerContainer}>
					<ActivityIndicator color={colors.primaryGrey} size={'large'} />
				</View>
			);
		else
			return (
				<View style={{flex: 1, backgroundColor: '#fff'}}>
					<KeyboardAwareScrollView>
						<View style={styles.sectionContainer}>
							<Text style={styles.sectionTitle}>{formTitle}</Text>
						</View>
						<ValidationError visible={validationError} message={errorMessage} />
						<ServerError visible={serverError} message={serverError} />
						{this.renderRows()}
					</KeyboardAwareScrollView>
					{ingredientsModalVisible && (
						<ListIngredientsModal
							onSave={this.saveIngredients}
							onClose={() => this.setState({ ingredientsModalVisible: false })}
							data={ingredients}
							custom={automaticLookup}
						/>
					)}
					{nutritionModalVisible && (
						<NutritionModal
							onSave={this.saveNutrition}
							onClose={() => this.setState({ nutritionModalVisible: false })}
							data={nutrition}
							editable={!automaticLookup}
						/>
					)}
				</View>
			);
	}

    renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        const { toastStyle, toastTitle } = styles;
        if(this.state.renderToast){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
                        <Emojicon name={'thumbsup'} size={60} />
                        <Text style={toastTitle}>Well Done!</Text>
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

	render() {

		const { screenTitle, add, replace } = this.props;

		const title = screenTitle ? screenTitle : replace ? 'Replace Meal' : 'Add Meal';

		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={title}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
					rightIcon={'check'}
					rightButtonPress={this.onPressSave}
				/>
				{this.renderContents()}
				{this.renderToast()}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = ({ main, mealPlan, recipeBook }) => {
	const { activeTabId } = main;
	const { error: serverError, loading } = mealPlan;
	const { error: recipeBookActionError } = recipeBook;
	return { serverError, activeTabId, loading, recipeBookActionError };
};

export default connect(mapStateToProps, {
	addMealNewRecipe,
	replaceMealNewRecipe,
	createCustomRecipe,
	recipeDelete
})(AddMeal);

const styles = {
	sectionContainer: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingHorizontal: 20,
		marginVertical: 10,
		height: 40
	},
	sectionTitle: {
		color: colors.primaryOrange,
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'left',
		width: '100%'
	},
	spinnerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	errorStyle: {
		paddingVertical: 10,
		textAlign: 'center',
		color: 'red'
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
