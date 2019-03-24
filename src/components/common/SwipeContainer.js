import React, {Component} from 'react';
import {
	PanResponder,
	Animated,
	TouchableOpacity,
	View,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../actions/const';
import {connect} from 'react-redux';
import {changeMealOpenId, changeActiveScroll, closeAllMenu, getRecipeById} from '../../actions/index';
import {Actions} from 'react-native-router-flux';

class SwipeContainer extends Component {
	constructor (props) {
		super(props);
		this.state = {
			contentHeight: 0,
			id: this.props.id,
			planId: this.props.planId,
			isOpen: false,
			widthDevice: this.props.widthDevice
		};
		this.animatedValue = new Animated.Value(0);
		this.onPressSearch = this.onPressSearch.bind(this);
		this.onPressCustom = this.onPressCustom.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.openMealId !== this.state.id && nextProps.openMealId !== this.props.openMealId && this.state.isOpen) {
			this.manuallySwipeRow(0);
		}
		if (nextProps.closeAllShortMenu === true && this.state.isOpen) {
			this.manuallySwipeRow(0);
		}
		if (nextProps.widthDevice !== this.props.widthDevice) {
			this.setState({widthDevice: nextProps.widthDevice});
			if (this.state.isOpen) {
				this.manuallySwipeRow(-(nextProps.widthDevice / 4 * 3));
			}
		}
	}


	componentWillMount () {
		this.state.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (e, gestureState) => {
				if (gestureState.dx === 0 || gestureState.dy === 0) {
					return false;
				} else {
					return true;
				}
			},
			onPanResponderMove: (evt, gestureState) => this.handlerPanResponderMove(evt, gestureState),
			onPanResponderTerminate: (e, gs) => this.handlePanResponderEnd(e, gs),
			onPanResponderEnd: (e, gs) => this.handlePanResponderEnd(e, gs),
			onShouldBlockNativeResponder: () => true
		});
	}

	handlerPanResponderMove (e, gestureState) {
		const {widthDevice} = this.state;
		const {dx, dy} = gestureState;
		let newDX = dx;
		let isSwipeToLeft = dx >= 0 ? false : dx;
		if (newDX < -(widthDevice / 4 * 3)) {
			newDX = -(widthDevice / 4 * 3);
		}

		if ((dy > -5 || dy < 5) && isSwipeToLeft !== false && this.state.isOpen === false) {
			this.props.changeMealOpenId(this.props.id);

			this.props.changeActiveScroll(false);
			this.animatedValue.setValue(newDX);
		}
		if (isSwipeToLeft === false) {
			this.animatedValue.setValue(0);
		}

		if (dx > 0 && this.state.isOpen === true) {
			this.animatedValue.setValue(-(widthDevice / 4 * 3) + newDX);
		}
		if (dx === 0 && dy === 0 && this.state.isOpen === false) {
			this.props.getRecipeById();
		}
	}

	handlePanResponderEnd () {
		const {widthDevice} = this.state;
		let toValue = 0;
		if (this.animatedValue._value <= -15 && this.state.isOpen !== true) {
			if (this.animatedValue._value <= -50) {
				toValue = -(widthDevice / 4 * 3);
			}
		} else {
			if (this.state.isOpen === true) {
				toValue = 0;
			}
		}
		this.manuallySwipeRow(toValue);
	}

	manuallySwipeRow (toValue) {
		Animated.timing(this.animatedValue,
			{
				toValue: toValue,
				duration: 500
			}
		).start(() => {
			if (toValue === 0) {
				this.setState({
					isOpen: false
				}, () => this.props.changeMealOpenId(''));
			} else {
				this.setState({
					isOpen: true
				});
				this.props.changeMealOpenId(this.state.id);
			}
			this.props.closeAllMenu(false);
			this.animatedValue.setValue(toValue);
		});
		this.props.changeActiveScroll(true);
	}

	onPressSearch () {
		this.manuallySwipeRow(0);
		Actions.recipeBook({mealType: this.props.mealType, planId: this.props.recipe.plan_id});
	}

	onPressCustom () {
		this.manuallySwipeRow(0);
		const { id, image: recipeImg, plan_id: planId } = this.props.recipe;
		this.props.getRecipeById(id, {recipeImg, isFromCustom: true, planId, planMealType: this.props.mealType});
	}

	renderButtons () {
		const {widthDevice} = this.state;
		
		return (
			<View style={[{height: this.state.contentHeight}, style.buttonsContainer, {
				width: (widthDevice / 4) * 3,
				left: widthDevice
			}]}>
				<TouchableOpacity
					style={[style.touchableContainer, {width: (widthDevice / 4.3)}]}
					onPress={this.onPressCustom}>
					<Icon name="sliders" style={style.iconStyle}/>
					<Text style={style.buttonText}>Create</Text>
				</TouchableOpacity>
				{/*<TouchableOpacity
				 style={[style.touchableContainer, {width: (widthDevice / 4.3)}]}
				 onPress={() => this.manuallySwipeRow(0)}>
				 <Icon name="repeat" style={style.iconStyle}/>
				 <Text style={style.buttonText}>Refresh</Text>
				 </TouchableOpacity>*/}
				<TouchableOpacity
					style={[style.touchableContainer, {width: (widthDevice / 4.3)}]}
					onPress={this.onPressSearch}>
					<Icon name="search" style={style.iconStyle}/>
					<Text style={style.buttonText}>Change</Text>
				</TouchableOpacity>
			</View>
		);
	}

	render () {
		const {widthDevice} = this.state;
		return (
			<Animated.View
				{...this.state.panResponder.panHandlers}
				style={
					[{width: widthDevice + (widthDevice / 4) * 3}, {transform: [{translateX: this.animatedValue}]}]
				}
			>
				{React.Children.map(this.props.children, (element) =>
					<View style={[{width: widthDevice}]}>
						{element}
					</View>
				)}
				{this.renderButtons()}
			</Animated.View>
		);
	}
}

const style = {
	buttonsContainer: {
		flex: 1,
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'stretch',
		backgroundColor: 'rgba(242,242,242,1)',
		paddingHorizontal: 10,
		height: '100%'
	},
	touchableContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	buttonText: {
		color: colors.primaryOrange
	},
	iconStyle: {
		color: colors.primaryOrange,
		fontSize: 25,
		marginVertical: 10
	}
};

const mapStateToProps = ({main}) => {
	const {isMealPlanScrollActive, openMealId, closeAllShortMenu} = main;
	return {isMealPlanScrollActive, openMealId, closeAllShortMenu};
};
export default connect(mapStateToProps, {
	changeMealOpenId,
	getRecipeById,
	changeActiveScroll,
	closeAllMenu
})(SwipeContainer);
