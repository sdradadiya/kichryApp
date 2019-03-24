/**
 * Created by mponomarets on 7/23/17.
 */
import React, { Component } from 'react';
import {
	View,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { omitBy, isNull } from 'lodash';
import {connect} from 'react-redux';
import SafeAreaView from 'react-native-safe-area-view';
import {
	Header,
	IconRowsForRecipeDetail,
	RecipeDescriptionContainer,
	RecipeListIngredientsContainer,
	PopUpMenu,
	ShareButton,
	WarningModalView
} from './common';
import LikeButton from './common/LikeButton';
import DecisionComponent from './common/DecisionComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	sendConfirm,
	replaceMealExistingRecipe,
	addMealExistingRecipe,
	mealDelete,
	checkNutritionalCompliance,
	resetNutritional,
	setFiltersList,
	openRecipeFromChat,
    addIngredientToEditRecipe
} from '../actions';
import {
	formatServerDate,
	colors,
	getKeyFromStorage,
	showImagePicker,
	prettyDate,
	tracker,
	nutrientUnits,
	textStyles,
	scaledIngredientsServingSize,
	scaledIngredientsServingSizeRevert
} from '../actions/const';
import Toast from 'react-native-another-toast';
import Emojicon from 'react-native-emojicon';
let toastMessage,toastSubMessage;

class RecipeDetail extends Component {
	constructor (props) {
		super(props);
		this.state = {
			scrollTo: 0,
			isPopUpShow: false,
			loading: false,
			modalVisible: false,
			warnings: null,
			showWarningList: false,
			renderModalButton: true,
			recipeImg: '',
			recipePhoto: null,
			base64: '',
			error: '',
			renderToast:false
		};

		this.decisionApproved = this.decisionApproved.bind(this);

	}

	componentDidMount() {
        tracker.trackScreenView("RecipeDetail");
	}

	componentWillMount() {
		if(this.props.recipePhoto) {
			this.setState({
				recipeImg: this.props.recipeImg,
				recipePhoto: this.props.recipePhoto
			});
		} else {
			this.setState({recipeImg: this.props.recipeImg});
		}
		
	}

	componentWillUnmount () {
		this.props.resetNutritional();
		Keyboard.dismiss();
	}

	componentWillReceiveProps (nextProps) {

		if (nextProps.messageToast !== this.props.messageToast && nextProps.messageToast && nextProps.messageToast.placeToShow === 'feedback') {
			//this.refs.toast.show(nextProps.messageToast.text, 100);
            toastMessage = nextProps.messageToast.text;
            this.setState({renderToast:true},()=>{
                this.toast.showToast();
                setTimeout(()=>{
                    this.setState({
                        renderToast: false,
                    });
                },3000)
            });
		}

		if (nextProps.error) {
			this.setState({
				loading: false,
				error: nextProps.error,
				modalVisible: false
			});
		}

		if (nextProps.warnings !== null) {
			if (nextProps.warnings === 'not found') {
				this.decisionApproved();
			} else {
                if(this.state.renderToast){
                	this.setState({
                        modalVisible: false
					});
                }else {
                    this.setState({
                        warnings: nextProps.warnings,
                        modalVisible: true,
                        loading: false
                    });
				}
			}
		} else {
			this.setState({
				loading: false,
				error: nextProps.error
			});
		}

	}

	onImageAdd = ({ base64, uri }) => {
		this.setState({
			recipeImg: uri,
			base64: base64,
		});
	};

	onImageRemove = () => {
		this.setState({
			recipeImg: '',
			base64: '',
		});
	};

	renderSmallOriginalImage() {
		
		const { recipeImg, recipePhoto } = this.state;
		const { isConfirmed } = this.props;

		const defaultImageFromServer = 'https://app.kitchry.com/static/images/default-recipe.jpg';

		if( isConfirmed !== null ) {
			if(recipePhoto && recipeImg !== defaultImageFromServer) {
				return(
					<View style={styles.smallImageStyle}>
						<Image source={{ uri: recipeImg }} style={{width: '100%', height: '100%', borderRadius: 5}} />
					</View>
				)
			}
		}
		
	}

	renderImage () {
		const { imgContainer, imgStyle, imageButtonContainer, addButtonStyle, addButton, addButtonTitle } = styles;
		const { showTab, isConfirmed } = this.props;
		const { recipeImg, recipePhoto } = this.state;
		
		const defaultImageFromServer = 'https://app.kitchry.com/static/images/default-recipe.jpg';
		const displayImage = recipeImg === '' ? {uri: this.props.recipe.image} : defaultImageFromServer === recipeImg ? require('./common/img/default-recipe.jpg') : {uri: recipeImg}

		if (showTab) {
			return (
				<View style={imgContainer}>
					<Image source={displayImage} style={imgStyle}/>
					<View style={imageButtonContainer}>
						<TouchableOpacity style={addButtonStyle} onPress={() => showImagePicker(this.onImageAdd)}>
							<View style={addButton}>
								<Icon name={'plus'} size={40} color={'#fff'}/>
							</View>
							<Text style={addButtonTitle}>Click to add recipe image</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		} else {
			return (
				<View style={imgContainer}>
					<Image source={ isConfirmed !== null ? recipePhoto ? {uri: recipePhoto} : displayImage : displayImage } style={[imgStyle, {width: '100%'}]}>
						<View style={{ position: 'absolute', right: 15, bottom: 15 }}>
							{this.renderButtons()}
						</View>
						<View style={{ position: 'absolute', left: 15, bottom: 15 }}>
							{this.renderSmallOriginalImage()}
						</View>
					</Image>
				</View>
			);
		}
	}


	renderNDB () {
		const { ndb } = this.props;
		if(ndb) {
			return <RecipeListIngredientsContainer list={ndb}/>;
		}
	}

	renderDecisionRow () {

		const { recipe: { plan_id, id, isAssigned }, sendConfirm, showTab} = this.props;

		if (showTab) {
			return (
				<DecisionComponent
					sendConfirm={sendConfirm}
					planId={plan_id}
					recipeId={id}
					isAssigned={isAssigned}
					base64={this.state.base64}
					onImageRemove={this.onImageRemove}
				/>
			);
		}
	}

	renderButtons () {
		const { recipe, showTab } = this.props;
		if (!showTab) {
			return (
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<LikeButton recipe={recipe} />
					<ShareButton recipe={recipe} />
				</View>

			);
		}
	}

	renderDescription () {
		const {
			recipe: { directions, description, is_content },
			showTab
		} = this.props;

		if (!showTab) {
			return (
				<View style={styles.descriptionContainer}>
					{this.renderNDB()}
					<RecipeDescriptionContainer
						description={(description) ? description : ""}
						directions={(directions) ? directions : ""}
						isContent={is_content}/>
				</View>
			);
		}
	}

	renderDate () {
		const { recipe: { type, date = '' }, showTab } = this.props;
		const {dateContainer, recipeType, recipeDate} = styles;
		const dateText = date.indexOf("-") > -1 ? formatServerDate(date) : date;
		if (showTab) {
			return (
				<View style={dateContainer}>
					<Text style={recipeType}>{type}</Text>
					<Text style={recipeDate}>{dateText}</Text>
				</View>
			);
		}
	}

	renderCookingTimeDisclaimer () {
		if (!this.props.showTab) {
			return (
				<Text style={[textStyles.description12Regular, styles.cookingTimeContainer]}>*cooking time may vary slightly when serving size is changed.</Text>
			);
		}
	}

	renderServingsSizeAdjustMessage () {
		const { servings } = this.props;

		if (servings % 1 !== 0){
			return (
				<Text style={[textStyles.description12Regular, styles.cookingTimeContainer]}># serving sizes are modified from the original recipe.</Text>
			);
		}
	}

	onPressButtonSwap = () => {
		const { recipe: { recipe_id }, planId, activeMeal, activeTabId, planMealType} = this.props;
		this.setState({ loading: true });

		let isAssigned = activeMeal.isAssigned;
		let isEdit = (this.props.add) ? 0 : 1;

		this.decisionApproved();
		
	};

	decisionApproved = () => {

		const {
			recipe: { recipe_id: recipeId },
			planId,
			planMealType: mealType,
			currentDate: date,
			replace,
			add,
			activeTabId,
			ndb
		} = this.props;
		const {activeMeal} = this.props;
		
		let scaledNdbBack = scaledIngredientsServingSize(ndb, 1, this.props.preferredServingSize);
	
		this.props.addIngredientToEditRecipe(scaledNdbBack);
		this.setState({
			renderModalButton: false
		});
        this.closeModalWarning();
		Actions.popTo('mealDetail');
		
		/* ======================================  DONT UNCOMMENT THIS ==================================== */

		// toastMessage = "If you insist!";

		// if(replace) {
        //     toastSubMessage = "Meal Replaced Successfully";
		// 	this.props.replaceMealExistingRecipe({recipeId, planId, mealType, date: date || prettyDate()});
        //        // this.closeModalWarning();

		// 	this.setState({renderToast:true},()=>{
		// 		this.setState({modalVisible:false},()=> {
		// 			this.toast.showToast();
        //             setTimeout(()=>{
        //                 this.setState({
        //                     renderToast: false,
        //                 });
        //                 Actions.popTo('mealDetail');
        //             },3000);
		// 		})
		// 	})

		// } else if(add) {
        //     toastSubMessage = "Meal Added Successfully";
		// 	this.props.addMealExistingRecipe({recipeId, mealType, date, activeTabId}).then((res)=>{
		// 		if(res === "true") {
        //             this.closeModalWarning();
        //             this.setState({renderToast: true}, () => {
        //                 this.toast.showToast();
        //                 setTimeout(() => {
        //                     this.setState({
        //                         renderToast: false,
        //                     });
        //                     Actions.popTo('mealDetail');
        //                 }, 3000)
        //             });
        //         }

		// 	}).catch(()=>{
        //         this.closeModalWarning();
		// 	});
		// }

		this.props.setFiltersList({
			'dietTypes': [],
			'mealTypes': [],
			'restrictions': [],
			'tags': [],
			'cookingTime': [],
			'preparationTime': []
		});

	};

	cancelDecision = () => this.setState({}, () => {
		this.closeModalWarning();
		Actions.pop()
	});

	closeModalWarning = () => this.setState({ modalVisible: false });

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
						<TouchableOpacity style={styles.buttonSwap} activeOpacity={0.9} onPress={this.onPressButtonSwap}>
							<Text style={styles.buttonTitle}>SELECT</Text>
						</TouchableOpacity>
					);
				}

			}
		}
	}

	hidePopUp () {
		this.setState({ isPopUpShow: false });
	}

	showPopUp () {
		const buttons = [{title: 'Create New'}];

		if (this.state.isPopUpShow) {
			return <PopUpMenu list={buttons} right hideMenu={() => this.hidePopUp}/>;
		}
	}

	getUnit() {

	}

	renderWarnings () {
		const { warnings, showWarningList } = this.state;
		let arrString=[],warning;
		if (warnings && Object.keys(warnings.recipe).length > 0) {
			return (
				<View style={styles.warningContainer}>
					{
						warnings.day.caps.map((item, index) => {
						arrString=item.split(' ');
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

	showWarning = () => this.setState({showWarningList: !this.state.showWarningList});

    renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        const { toastStyle, toastTitle, toastSubTitle } = styles;
        if(this.state.renderToast){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
                        <Emojicon name={'thumbsup'} size={60} />
                        <Text style={toastTitle}>{toastMessage}</Text>
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
		
		// <WarningModalView
		// 	modalVisible={this.state.modalVisible}
		// 	onClose={this.cancelDecision}
		// 	sendConfirm={this.decisionApproved}
		// 	showWarning={this.showWarning}
		// 	warnings={this.state.warnings}
		// 	closeModal={this.closeModalWarning}
		// 	buttonRender={this.state.renderModalButton}
		// >
		// 	{this.renderWarnings()}
		// </WarningModalView>


	render () {
		const { showTab, showSelectButton, recipe, showNutrients, preferredServingSize, servings, loadRecipeFromChat } = this.props;
		const { header, toastStyle, toastTitle } = styles;
		const loading = Object.keys(recipe).length == 0;
		return loading ? <View/> : (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={'Recipe'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => {
						if(loadRecipeFromChat){
							this.props.openRecipeFromChat(false);
							Actions.pop();
						} else {
							Actions.pop();
						}	
					}}
				/>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'position' : undefined}
					style={{flex: 1, backgroundColor: '#fff'}}>
					<ScrollView
						style={{paddingBottom: showSelectButton ? 60 : 0}}
						keyboardShouldPersistTaps={'always'}
						onLayout={() => {
							if (showTab) {
								this.scrollView.scrollToEnd({animated: true});
							}
						}}
						onContentSizeChange={() => {
							if (showTab) {
								this.scrollView.scrollToEnd({animated: false});
							}
						}}
						ref={scrollView => this.scrollView = scrollView}
						scrollEventThrottle={0}
						showsVerticalScrollIndicator={false}>
						<View style={header}>
							{this.renderImage()}
							<IconRowsForRecipeDetail
								kcal={recipe.kcal}
								cookingTime={recipe.cook_time || recipe.cookingTime}
								cuisine={recipe.cuisine}
								totalServings={preferredServingSize}
								title={recipe.title.replace(/copy of/g,'')}
								servings={servings}
								showCookTimeDisclaimer={!showTab}
								showNutrients={showNutrients}
							/>
						</View>
						{this.renderCookingTimeDisclaimer()}
						{this.renderServingsSizeAdjustMessage()}
						{this.renderDate()}
						{this.renderDescription()}
						{this.renderDecisionRow()}
					</ScrollView>
				</KeyboardAvoidingView>
				{this.renderSwapButton()}
				{/* {this.showPopUp()} */}
				{this.renderToast()}
			</SafeAreaView>
		);
	}
}

const styles = {
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
	},
	imgContainer: {
		height: 250,
		alignItems: 'stretch',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.2)'
	},
	imgStyle: {
		flex: 1,
		borderRadius: 0
	},
	header: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.2)',
		paddingBottom: 20
	},
	descriptionContainer: {
		flex: 1,
		marginHorizontal: 10,
		paddingBottom: 10,
		paddingTop: 10
	},
	dateContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.2)'
	},
	recipeType: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	recipeDate: {
		fontSize: 18
	},
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
	cookingTimeContainer: {
		paddingHorizontal: 5,
		justifyContent: 'space-between'
	},
	warningContainer: {
		justifyContent: 'space-around',
		paddingBottom: 20,
		minHeight: 10
	},
	imageButtonContainer: {
		position: 'absolute',
		backgroundColor: 'transparent',
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addButtonStyle: {
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	addButton: {
		backgroundColor: 'rgba(48,194,107, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		borderRadius: 25
	},
	addButtonTitle: {
		paddingVertical: 10,
		color: '#cccccc',
		fontSize: 14,
		flexWrap: 'wrap',
		textAlign: 'center'
	},
	smallImageStyle: {
		height: 250 / 2.5,
		width: Dimensions.get('window').width / 2.5,
		backgroundColor: 'rgba(0,0,0, .1)',
		...Platform.select({
			ios: {
				shadowColor: 'rgba(0,0,0, .8)',
				shadowOffset: { height:0, width: 0 },
				shadowOpacity: 1,
				shadowRadius: 5,
			},
			android: {
				elevation: 5
			},
		})
	}
};

const mapStateToProps = (state, ownProps) => {
	const {
		recipeDetail,
		mealPlan: { currentDate, preferredServingSize},
		home: { reviewMealList },
		main: { messageToast, activeMeal, activeTabId },
		clientPermissions: { showNutrients }
	} = state;
	if(ownProps.reviewMostRecent && reviewMealList.length > 0) {
		// display the most recent recipe from the home key
		const recipe = reviewMealList[reviewMealList.length - 1];
		return {
			loading: false,
			recipe: omitBy(recipe || {}, isNull),
			ndb: recipeDetail.ndb,
			recipeImg: recipe.image,
			warnings: null,
			showTab: true
		}
	} else {
		// use recipe from recipeDetail
		const {
			error,
			loading,
			recipe,
			ndb,
			recipeImg,
			recipePhoto,
			isConfirmed,
			showTab,
			confirm,
			planId,
			planMealType,
			isAssigned,
			warnings,
			loadRecipeFromChat
		} = recipeDetail;
		return {
			error,
			loading,
			recipe: omitBy(recipe || {}, isNull),
			ndb,
			recipeImg,
			recipePhoto,
			isConfirmed,
			showTab,
			confirm,
			planId,
			planMealType,
			isAssigned,
			currentDate,
			warnings,
			loadRecipeFromChat,
			messageToast,
			showNutrients,
			activeMeal,
			activeTabId,
			preferredServingSize,
		};
	}
};

export default connect(mapStateToProps, {
	sendConfirm,
	replaceMealExistingRecipe,
	addMealExistingRecipe,
	mealDelete,
	checkNutritionalCompliance,
	resetNutritional,
	setFiltersList,
	openRecipeFromChat,
    addIngredientToEditRecipe
})(RecipeDetail);
