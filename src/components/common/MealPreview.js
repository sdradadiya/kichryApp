import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setActiveMeal } from '../../actions';
import moment from 'moment';
import {textStyles} from "../../actions/const";

const IconLabel = ({ icon, value, visible = true }) => {
	const { iconTitle, columnIconsContainer, emptyColumn } = styles;
	if (visible)
		return (
			<View style={columnIconsContainer}>
				<FAIcon name={icon} color={colors.iconColor} size={18} />
				<Text style={iconTitle}>{value}</Text>
			</View>
		);
	else return <View style={[columnIconsContainer, emptyColumn]} />;
};

const FeedbackButton = ({ icon, onPress }) => {
	const { innerBlockImg, buttonStyle } = styles;
	return(
		<View style={innerBlockImg}>
			<TouchableOpacity onPress={onPress}>
				<View style={buttonStyle}>
					<MIcon size={30} name={icon} color={'#fff'}/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

class MealPreview extends PureComponent {
	renderMealTitle() {
		const { title, onPressMenu } = this.props;
		const showMenuButton = !!onPressMenu;
		return (
			<View style={styles.mealTitleContainer}>
				<Text
					style={[
						styles.mealTitleText,
						{ marginRight: showMenuButton ? 40 : undefined }
					]}
				>
					{title}
				</Text>
			</View>
		);
	}

	renderIconArea() {
		const {
			cuisine = 'Other',
			cookingTime = '',
			kcal = 0,
			preferredServingSize,
			showNutrients
		} = this.props;

		return (
			<View style={styles.iconRowContainer}>
				<View style={styles.iconsColumn}>
					<IconLabel icon="globe" value={cuisine} />
					<IconLabel icon="clock-o" value={cookingTime.replace(/min/g, 'm')} />
				</View>
				<View style={styles.iconsColumn}>
					<IconLabel
						icon="cutlery"
						value={kcal + ' cal'}
						visible={showNutrients}
					/>
					<IconLabel icon="child" value={preferredServingSize} />
				</View>
			</View>
		);
	}

	renderMenuButton() {
		const { onPressMenu } = this.props;
		const showMenuButton = !!onPressMenu;
		if (showMenuButton)
			return (
				<TouchableOpacity onPress={onPressMenu} style={styles.menuButton}>
					<MCIcon
						name={'dots-horizontal'}
						size={30}
						color={'#FFF'}
					/>
				</TouchableOpacity>
			);
	}

	provideFeedback = () => {
		let activeMeal = this.props;
		this.props.setActiveMeal(activeMeal);
		Actions.reviewMeal();
	}

	renderProvideFeedbackButton() {
		const { innerBlockImg, buttonStyle } = styles;
		const { date, isConfirmed, isLiked, onPressMenu, isAssigned } = this.props;
		const showMenuButton = !!onPressMenu;
		// isAssigned !== undefined - show provideFeedback button only on MealPlan screen.
		if(showMenuButton && isAssigned !== undefined) {
			if (isConfirmed === undefined && moment().isSameOrAfter(date, 'day')) {
				return(
					<FeedbackButton
						icon='feedback'
						onPress={this.provideFeedback}
					/>
				);
			}
			// feedback was skipped
			if(isLiked === undefined) {
				return(
					<FeedbackButton icon='feedback' />
				);
			}
			
			// if recipe was liked
			if(isConfirmed !== undefined && isLiked) {
				return(
					<FeedbackButton icon='thumb-up' />
				);
			}
			// if recipe was disliked
			if(isConfirmed !== undefined && !isLiked) {
				return(
					<FeedbackButton icon='thumb-down' />
				);
			}
			// if didn't try
			if(isConfirmed === false) {
				return(
					<FeedbackButton icon='feedback' />
				);
			}
		}
	}

	render() {

		const { image, type, title, photo, isConfirmed, kcal, carb_g, fat_g, protein_g } = this.props;
		
		const { container, mealTypeText, imgTitle, imgStyle, shadowGradient, innerBlockText } = styles;
		const defaultImageFromServer = 'https://app.kitchry.com/static/images/default-recipe.jpg';
	
		const displayImage = defaultImageFromServer === image ? require('./img/default-recipe.jpg') : {uri: image};
		const nutritionInfo = (parseInt(kcal) + ' Cal . ' + parseInt(carb_g) + 'g Carbs . ' + parseInt(protein_g) + 'g Protein . ' + parseInt(fat_g) + 'g Fat'); 
		
		// ${parseInt(item.carb)}g Carbs  .  ${parseInt(item.protein)}g Protein  .  ${parseInt(item.fat)}g Fat`}

		return (
			<View style={container}>
				<View style={{ height: 250 }}>
					<Image
							source={isConfirmed !== undefined ? photo ? {uri: photo} : displayImage : displayImage}
							style={imgStyle}
							onLoad={() => this.setState({ loadingImage: false })}
					>
					</Image>

					{
						Platform.OS === 'ios' ?
							<LinearGradient colors={['rgba(255,255,255, 0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']} style={shadowGradient}>
								<View style={innerBlockText}>
                                    <Text style={textStyles.l4TextWhite} numberOfLines={1}>{title.replace(/copy of/g,'')}</Text>
									<Text style={mealTypeText}>{type}</Text>
									<Text style={textStyles.description10White} numberOfLines={1}>{nutritionInfo}</Text>
								</View>
								{this.renderProvideFeedbackButton()}
							</LinearGradient>
							:
							<View style={shadowGradient}>
								<View style={innerBlockText}>
                                    <Text style={textStyles.l4TextWhite} numberOfLines={1}>{title.replace(/copy of/g,'')}</Text>
									<Text style={mealTypeText}>{type}</Text>
								</View>
								{this.renderProvideFeedbackButton()}
							</View>
					}
				</View>
			</View>
		);
	}
}

const colors = {
	imgBg: '#847e7e',
	iconColor: 'rgb(203, 75, 63)',
	textColorWhite: '#fff',
	textColorBlack: '#000',
	primaryGreen: 'rgb(57, 192, 111)'
};

const styles = {
	container: {
		flex: 1,
		borderTopWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)'
	},
	shadowGradient: {
		flex: 1,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: 70,
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
	innerBlockText: {
		flex: 1,
		margin:5,
		marginTop:10,
		// flexDirection: 'row'
	},
	innerBlockImg: {
		flex: .2
	},
	buttonStyle: {
		width: 50,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center'
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
		flex: 1,
		flexWrap: 'wrap',
		position: 'absolute',
		backgroundColor: 'transparent',
		color: '#fff',
		fontSize: 20,
		fontWeight: '600',
		top: 10,
		left: 15,
		paddingRight: 5,
		width: undefined,
		height: undefined
	},
	mealTypeText: {
		position: 'absolute',
		color: '#fff',
		fontSize: 14,
		paddingVertical: 5,
		top: 35,
		left: 15
	},
	menuButton: {
		backgroundColor: 'rgba(0,0,0,0.4)',
		position: 'absolute',
		right: 5,
		top: 5,
		width: 35,
		height: 35,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	mealTitleContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	descriptionContainer: {
		flex: 0.8,
		paddingVertical: 5,
		paddingHorizontal: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch'
	},
	mealTitleText: {
		flex: 1,
		flexWrap: 'wrap',
		fontSize: 16,
		textAlign: 'left'
	},
	iconRowContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	iconsColumn: {
		flexDirection: 'column',
		marginBottom: 3,
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		flex: 1
	},
	iconTitle: {
		paddingHorizontal: 2,
		fontSize: 12
	},
	columnIconsContainer: {
		flexDirection: 'row',
		padding: 0,
		marginBottom: 2,
		marginLeft: 5
	},
	topColumnIconsContainer: {
		flexDirection: 'row',
		padding: 0,
		marginBottom: 2,
		marginLeft: 5
	},
	bottomColumnIconsContainer: {
		flexDirection: 'row',
		padding: 0,
		marginLeft: 5
	},
	emptyColumn: {
		height: 18
	}
};

export default connect(null, {setActiveMeal})(MealPreview);
