import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity, Image, Platform} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions, ActionConst } from 'react-native-router-flux';

import LinearGradient from 'react-native-linear-gradient';

import {connect} from 'react-redux';
import {setActiveMeal, reviewMeal} from '../../actions';

import {textStyles, headerBackIcon} from '../../actions/const';

const FeedbackButton = ({ icon, onPress }) => {
	const { innerBlockImg, menuButton } = styles;
	if (icon === 'feedback') {
		return(
			<View>
				<TouchableOpacity onPress={onPress}>
					<View style={menuButton}>
						<Icon size={24} name={icon} color={'#fff'}/>
					</View>
				</TouchableOpacity>
			</View>
		);
		
	} else {
		return(
			<View>
				<View style={menuButton}>
					<Icon size={24} name={icon} color={'#fff'}/>
				</View>
			</View>
		);
	}
};

class UpcomingMealPreview extends PureComponent {

	constructor(props) {
		super(props);
	}

	renderMealTitle() {
		const {title, onPressMenu} = this.props;
		const showMenuButton = !!onPressMenu;
		return (
			<View style={styles.mealTitleContainer}>
				<Text
					style={[
						textStyles.l3Text,
						{marginRight: showMenuButton ? 20 : undefined}
					]}
				>
					{title}
				</Text>
			</View>
		);
	}

	renderCamera() {
		const {plan_id, isAssigned, onImage} = this.props;
		return (
			<View>
				<TouchableOpacity onPress={() => onImage(plan_id, isAssigned)}>
					<View style={styles.menuButton}>
						<Icon size={24} name={'add-a-photo'} color={'#fff'}/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	renderSwap() {
		const {onSwap} = this.props;
		return (
			<View>
				<TouchableOpacity onPress={onSwap}>
					<View style={styles.menuButton}>
						<Icon size={22} name={'playlist-add'} color={'#fff'}/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	
	renderTrackDone() {
		const {onSwap} = this.props;
		return (
			<View>
				<TouchableOpacity onPress={onSwap}>
					<View style={styles.menuButton}>
						<Icon size={22} name={'playlist-add-check'} color={colors.primaryGreen}/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	
	renderFeedback() {
		const { isConfirmed, isLiked } = this.props;
		
		if (isConfirmed) {
			
			if (isLiked === true) {
				return(
					<FeedbackButton icon='thumb-up' />
				);
				
			} else if (isLiked === false) {
				
				return(
					<FeedbackButton icon='thumb-down' />
				);
			} else if (isLiked === undefined) { // skip
				return(
					<FeedbackButton 
						icon='feedback' 
						onPress={this.provideFeedback}
					/>
				);				
			}			
		}

		return <View />
	}		
		
	provideFeedback = () => {
		let activeMeal = this.props;
		this.props.setActiveMeal(activeMeal);
		Actions.reviewMeal();
	}

	render() {

		const {image, title, photo, description, visible, isConfirmed, isLiked} = this.props;
		const {container, imgStyle, shadowGradient, innerBlockText} = styles;
		const defaultImageFromServer = 'https://app.kitchry.com/static/images/default-recipe.jpg';

		const displayImage = defaultImageFromServer === image ? require('./img/default-recipe.jpg') : {uri: image};

		return (
			<View style={container}>

				<View style={{height: 240, borderRadius: 5}}>
					<Image
						source={photo ? {uri: photo} : displayImage}
						style={imgStyle}
						onLoad={() => this.setState({loadingImage: false})}
					>
						<View style={{
							justifyContent: 'flex-end',
							alignItems: 'flex-end',
							marginRight: 5,
							marginTop: 5
						}}>
							{(visible) && this.renderSwap()}
							{!(visible) && this.renderTrackDone()}
							{this.renderFeedback()}
						</View>

					</Image>

					{
						Platform.OS === 'ios' ?
							<LinearGradient colors={['rgba(255,255,255, 0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)']}
								style={shadowGradient}>
								<View style={innerBlockText}>
									<View style={{flex: 1, marginTop: 10}}>
										<Text style={textStyles.l4TextWhite} numberOfLines={1}>{title}</Text>
										<Text style={textStyles.description10White}
											numberOfLines={2}>{description}</Text>
									</View>
								</View>
							</LinearGradient>
							:
							<View style={shadowGradient}>
								<View style={innerBlockText}>
									<View style={{flex: 1, marginTop: 10}}>
										<Text style={textStyles.l4TextWhite} numberOfLines={1}>{title}</Text>
										<Text style={textStyles.description10White}
											numberOfLines={2}>{description}</Text>
									</View>
								</View>

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
		//flex: 1,
		marginTop: 20,
		height: 250
	},
	shadowGradient: {
		flex: 1,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: 70,
		backgroundColor: 'rgba(0,0,0,0.4)'
	},
	innerBlockText: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 4,
		paddingLeft: 8
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
		flex: 0.7,
		flexDirection: 'column',
		//justifyContent: 'flex-start',
		//alignItems: 'flex-start',
		backgroundColor: colors.imgBg,
		width: undefined,
		height: undefined
	},
	imgTitle: {
		flexWrap: 'wrap',
		fontSize: 14,
		textAlign: 'left',
		color: colors.textColorBlack,
		paddingTop: 1
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
		backgroundColor: 'rgba(0,0,0,0.7)',
		marginTop: 2,
		width: 40,
		height: 40,
		marginRight: 5,
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
	mealDescText: {
		flexWrap: 'wrap',
		fontSize: 12,
		textAlign: 'left',
		color: '#999999',
		paddingTop: 1
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

const mapStateToProps = (state) => {

	const {
		main: {activeMeal},
		home: {
			loadingUpcoming,
			upcomingMeal
		}
	} = state;

	return {
		loadingUpcoming,
		upcomingMeal,
		activeMeal
	};
};

export default connect(mapStateToProps, {setActiveMeal})(UpcomingMealPreview);
