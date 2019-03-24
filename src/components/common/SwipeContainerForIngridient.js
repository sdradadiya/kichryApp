/**
 * Created by mponomarets on 9/29/17.
 */
import React, {PureComponent} from 'react';
import {View, Animated, Dimensions, PanResponder, TouchableOpacity} from 'react-native';
import {colors}from '../../actions/const';
import Icon from 'react-native-vector-icons/Ionicons';

class SwipeContainerForIngridient extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			isOpen: false,
			// widthDevice: Dimensions.get('window').width
			widthDevice: this.props.widthDevice
		};
		this.animatedValue = new Animated.Value(0);
		this.onOpenMenu = this.onOpenMenu.bind(this);
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

	componentWillReceiveProps (nextProps) {
		if (nextProps.openIng !== this.state.id && nextProps.openIng !== this.props.ingId && this.state.isOpen) {
			this.manuallySwipeRow(0);
		}
		if (nextProps.isAllShortMenuNeedClose === true && this.state.isOpen) {
			this.manuallySwipeRow(0);
		}
		// if (nextProps.widthDevice !== this.props.widthDevice) {
		// 	this.setState({widthDevice: nextProps.widthDevice});
		// 	if (this.state.isOpen) {
		// 		this.manuallySwipeRow(-(nextProps.widthDevice / 4 * 3));
		// 	}
		// }
	}

	onOpenMenu () {
		this.props.changeOpenIngId(this.props.ingId);
	}

	handlerPanResponderMove (e, gestureState) {
		const widthDevice = Dimensions.get('window').width;
		const {dx, dy} = gestureState;
		let newDX = dx;
		let isSwipeToLeft = dx >= 0 ? dx : false;
		if (newDX >= (widthDevice / 3)) {
			newDX = widthDevice / 3;
		}

		if ((dy > -5 || dy < 5) && isSwipeToLeft !== false && this.state.isOpen === false) {

			this.animatedValue.setValue(newDX);
		}
		if (isSwipeToLeft === false) {
			this.animatedValue.setValue(0);
		}

		if (dx < 0 && this.state.isOpen === true) {

			this.animatedValue.setValue(widthDevice / 3 + newDX);
		}

	}

	handlePanResponderEnd () {
		const {widthDevice} = this.state;
		let toValue = 0;
		if (this.animatedValue._value >= 15 && this.state.isOpen !== true) {
			if (this.animatedValue._value >= 20) {
				toValue = widthDevice / 3;
				this.onOpenMenu();
			}
		} else {
			if (this.state.isOpen === true) {
				toValue = 0;
			}
		}
		this.manuallySwipeRow(toValue);
	}

	manuallySwipeRow (toValue, remove) {
		Animated.timing(this.animatedValue,
			{
				toValue: toValue,
				duration: 500
			}
		).start(() => {
			if (toValue === 0) {
				this.setState({isOpen: false});
			} else {
				this.setState({
					isOpen: true
				});
			}
			//this.props.closeAllMenu(false);
			//this.props.changeScrollActivity(true);
			this.animatedValue.setValue(toValue);
			if (remove) {
				this.props.onPressDelete();
			}
		});

	}

	renderButtonDelete () {
		// const widthDevice = Dimensions.get('window').width;
		const {widthDevice} = this.state;
		return (
			<View style={[{height: '100%', backgroundColor: 'red'}, style.buttonsContainer, {
				width: (widthDevice / 3),
				left: - widthDevice / 3
			}]}>
				<TouchableOpacity
					style={[style.touchableContainer, {width: (widthDevice / 3)}]}
					onPress={() => {
						this.manuallySwipeRow(0, true);
					}}>
					<Icon name="ios-trash" style={style.iconStyle} size={30}/>
				</TouchableOpacity>
			</View>
		);
	}

	render () {
		// const widthDevice = Dimensions.get('window').width;
		const {widthDevice} = this.state;
		return (
			<Animated.View
				{...this.state.panResponder.panHandlers}
				style={[{
					width: widthDevice + (widthDevice / 3)
				}, {
					transform: [{
						translateX: this.animatedValue
					}]
				}
				]}
			>
				{React.Children.map(this.props.children, (element) =>
					<View style={[{width: widthDevice}]}>
						{element}
					</View>
				)}
				{this.renderButtonDelete()}
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
		// borderBottomColor: colors.lightGrey,
		// borderBottomWidth: 1
	},
	touchableContainer: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'column',
		paddingVertical: 5
	},
	iconStyle: {
		color: colors.primaryOrange
	}
};
export {SwipeContainerForIngridient};