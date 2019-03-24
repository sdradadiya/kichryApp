import React, { PureComponent } from 'react';
import {
	Animated,
	Dimensions,
	Platform,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import {
	toggleBottomSheetMenu,
	setUPCData,
	mealDeleteAndRefresh
} from '../../actions/index';
import { colors, isDayToday, prettyDate,tracker } from '../../actions/const';
const { height } = Dimensions.get('window');

class BottomSheetMenu extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			backgroundColor: new Animated.Value(0),
			backgroundPosition: 0,
			buttons: [
				{
					title: 'Add to Meal',
					onPress: () =>{ this.openSearch({add: true}); tracker.trackEvent("Click On", "Add To Meal");}
				},
				{
					title: 'Replace Meal',
					onPress: () =>{ this.openSearch({replace: true}); tracker.trackEvent("Click On", "Replace Meal");}
				}
			],
			deleteButton: {
				title: 'Delete Meal',
				onPress: this.deleteMeal,
			}
		};
		this.menuAnimatedValue = new Animated.Value(height);
	}

	componentWillMount() {
		const { plan_id, type } = this.props.activeMeal;
		this.showDecisionMenu();
		this.props.setUPCData({ planId: plan_id, planMealType: type });
	}

	openSearch = ({add, replace}) => {
		const { plan_id, type } = this.props.activeMeal;
		let date = this.props.date;
		Actions.recipeBook({ mealType: type, planId: plan_id, date, add, replace });
		this.hideDecisionMenu();
	};

	deleteMeal = () => {
		const { plan_id } = this.props.activeMeal;
		this.props.mealDeleteAndRefresh(plan_id);
		this.hideDecisionMenu();
	}

	changeBackgroundPosition(position) {
		this.setState({
			backgroundPosition: position
		});
	}

	showDecisionMenu() {
		this.changeBackgroundPosition(0);
		this.state.backgroundColor.setValue(0);
		Animated.parallel([
			Animated.timing(this.menuAnimatedValue, {
				duration: 300,
				toValue: 0
			}),
			Animated.timing(this.state.backgroundColor, {
				duration: 300,
				toValue: 300
			})
		]).start(() => {});
	}

	hideDecisionMenu = () => {
		this.state.backgroundColor.setValue(300);
		Animated.parallel([
			Animated.timing(this.menuAnimatedValue, {
				duration: 300,
				toValue: height
			}),
			Animated.timing(this.state.backgroundColor, {
				duration: 300,
				toValue: 0
			})
		]).start(() => {
			this.changeBackgroundPosition(height);
			this.props.toggleBottomSheetMenu(false);
		});
	};

	renderButtonsIOS() {
		const {
			separator,
			firstButton,
			lastButton,
			buttonContainer,
			buttonTitle
		} = stylesIOS;

		return (
			this.state.buttons &&
			this.state.buttons.map((button, index) => {
				let buttonStyle = buttonContainer;
				if (index === 0) {
					buttonStyle = [buttonStyle, firstButton];
				}
				if (index === this.state.buttons.length - 1) {
					buttonStyle = [buttonStyle, lastButton];
				}

				return (
					<TouchableOpacity
						activeOpacity={0.9}
						key={button.title}
						style={buttonStyle}
						onPress={button.onPress}
					>
						<Text style={buttonTitle}>{button.title}</Text>
					</TouchableOpacity>
				);
			})
		);
	}

	renderButtonsAndroid() {
		const { separator, buttonContainer, buttonTitle } = stylesAndroid;
		return (
			this.state.buttons &&
			this.state.buttons.map(button => {
				return (
					<TouchableOpacity
						activeOpacity={0.9}
						key={button.title}
						style={buttonContainer}
						onPress={button.onPress}
					>
						<View style={separator}>
							<Text style={buttonTitle}>{button.title}</Text>
						</View>
					</TouchableOpacity>
				);
			})
		);
	}

	renderDeleteButtonIOS() {
		const { isAssigned, date: mealDate } = this.props.activeMeal;
		const { title, onPress } = this.state.deleteButton;
		const { reviewButton, buttonContainer, buttonTitle } = stylesIOS;

		if (!isAssigned) {
			return (
				<TouchableOpacity
					activeOpacity={0.9}
					style={[buttonContainer, reviewButton]}
					onPress={onPress}
				>
					<Text style={buttonTitle}>{title}</Text>
				</TouchableOpacity>
			);
		}
	}

	renderDeleteButtonAndroid() {
		const { isAssigned, date: mealDate } = this.props.activeMeal;
		const { title, onPress } = this.state.deleteButton;
		const { separator, buttonContainer, buttonTitle } = stylesAndroid;

		if (!isAssigned) {
			return (
				<TouchableOpacity
					activeOpacity={0.9}
					style={buttonContainer}
					onPress={onPress}
				>
					<View style={separator}>
						<Text style={buttonTitle}>{title}</Text>
					</View>
				</TouchableOpacity>
			);
		}
	}

	renderCancelButtonIOS() {
		const {
			cancelButton,
			buttonContainer,
			buttonTitle,
			buttonCancelTitle
		} = stylesIOS;
		return (
			<TouchableOpacity
				activeOpacity={0.9}
				style={[buttonContainer, cancelButton]}
				onPress={this.hideDecisionMenu}
			>
				<Text style={[buttonTitle, buttonCancelTitle]}>Cancel</Text>
			</TouchableOpacity>
		);
	}

	renderCancelButtonAndroid() {
		const { buttonContainer, buttonTitle } = stylesAndroid;
		return (
			<TouchableOpacity
				activeOpacity={0.9}
				style={buttonContainer}
				onPress={this.hideDecisionMenu}
			>
				<Text style={buttonTitle}>Cancel</Text>
			</TouchableOpacity>
		);
	}

	renderButtons() {
		if (Platform.OS === 'ios') {
			return (
				<View style={stylesIOS.contentContainer}>
					{this.renderButtonsIOS()}
					{this.renderDeleteButtonIOS()}
					{this.renderCancelButtonIOS()}
				</View>
			);
		} else {
			return (
				<View style={stylesAndroid.contentContainer}>
					{this.renderButtonsAndroid()}
					{this.renderDeleteButtonAndroid()}
					{this.renderCancelButtonAndroid()}
				</View>
			);
		}
	}

	render() {
		let opacityBgColor = this.state.backgroundColor.interpolate({
			inputRange: [0, 300],
			outputRange: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)']
		});
		const { opacityAnimContainer, moveAnimContainer } = styles;
		const {
			buttonTitle,
			buttonCancelTitle,
			firstButton,
			lastButton,
			cancelButton,
			buttonContainer,
			contentContainer
		} = stylesIOS;
		const opacityContainer = [
			opacityAnimContainer,
			{ backgroundColor: opacityBgColor }
		];
		const moveContainer = [
			moveAnimContainer,
			{
				transform: [{ translateY: this.menuAnimatedValue }]
			}
		];

		return (
			<Animated.View style={opacityContainer}>
				<TouchableWithoutFeedback onPress={this.hideDecisionMenu}>
					<Animated.View style={moveContainer}>
						{this.renderButtons()}
					</Animated.View>
				</TouchableWithoutFeedback>
			</Animated.View>
		);
	}
}

const styles = {
	opacityAnimContainer: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		bottom: 0
	},
	moveAnimContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: '100%'
	}
};

const stylesAndroid = {
	separator: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.1)'
	},
	contentContainer: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	buttonContainer: {
		width: '100%',
		height: 55,
		alignItems: 'flex-start',
		backgroundColor: '#fff',
		justifyContent: 'center',
		paddingLeft: 20
	},
	buttonTitle: {
		color: '#797979',
		fontSize: 20,
		fontWeight: '400',
		textAlign: 'left'
	}
};

stylesIOS = {
	reviewButton: {
		borderRadius: 10,
		marginTop: 9
	},
	firstButton: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	},
	lastButton: {
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10
	},
	cancelButton: {
		marginBottom: 10,
		marginTop: 9,
		borderRadius: 10
	},
	buttonTitle: {
		color: '#797979',
		fontSize: 20,
		fontWeight: '600'
	},
	buttonCancelTitle: {
		color: '#457afc'
	},
	contentContainer: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingHorizontal: 10
	},
	buttonContainer: {
		width: '100%',
		height: 55,
		alignSelf: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		justifyContent: 'center',
		marginBottom: 1
	}
};

const mapStateToProps = ({ main, mealPlan }) => {
	const { activeMeal } = main;
	const { currentDate: date } = mealPlan
	return { activeMeal, date };
};

export default connect(mapStateToProps, {
	toggleBottomSheetMenu,
	setUPCData,
	mealDeleteAndRefresh
})(BottomSheetMenu);
