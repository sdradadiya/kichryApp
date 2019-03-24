/**
 * Created by mponomarets on 9/28/17.
 */
import React, {PureComponent} from 'react';
import {
	View,
	TextInput,
	Text,
	Platform,
	KeyboardAvoidingView,
	TouchableOpacity,
	Animated,
	Dimensions,
	Keyboard,
	PanResponder,
	ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../actions/const';

class AddIngredientPopUp extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			onFocus: false,
			screenHeight: Dimensions.get('window').height,
			screenWidth: Dimensions.get('window').width
		};
		this.animatedValue = new Animated.Value(Dimensions.get('window').height);
		this.closePopUp = this.closePopUp.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
		this.onChangeQty = this.onChangeQty.bind(this);
		this.onChangeUnit = this.onChangeUnit.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
	}

	componentWillMount () {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => true,
			onPanResponderRelease: () => {
				this.closePopUp();
			},
			onPanResponderTerminate: () => {
				this.closePopUp();
			},
			onShouldBlockNativeResponder: () => false
		});
	}

	componentDidMount () {
		this.showAnimation(0);
	}

	showAnimation (value) {
		Animated.timing(this.animatedValue,
			{
				toValue: value,
				duration: 800
			}
		).start(() => {
			if (value === 0) {
				this._input.focus();
			} else {
				this.props.onClose();
			}
		});

	}

	closePopUp () {
		Keyboard.dismiss();
		this.showAnimation(Dimensions.get('window').height);
	}

	onChangeQty (text) {
		this.props.onChangeIngQty(text);
	}

	onChangeUnit (text) {
		this.props.onChangeIngUnit(text);
	}

	onChangeName (text) {
		this.props.onChangeIngName(text);
	}

	saveChanges () {
		this.props.saveChanges();
		Keyboard.dismiss();
		this.showAnimation(Dimensions.get('window').height);
	}


	createTextInput () {
		const {inputContainer, textInputStyle, innerInputContainerIos, innerInputContainerAd} = styles;

		let textInputStylePlatform = Platform.OS === 'ios' ? innerInputContainerIos : innerInputContainerAd;
		
		return (
			<View style={inputContainer}>

				<View style={textInputStylePlatform}>
					<TextInput
						style={textInputStyle}
						ref={e => this._input = e}
						multiline={true}
						editable={true}
						autoCorrect={false}
						onChangeText={this.onChangeName}
						numberOfLines={1}
						placeholder={'Name'}
					/>
				</View>

				<View style={textInputStylePlatform}>
					<TextInput
						style={textInputStyle}
						ref={e => this._input = e}
						multiline={true}
						editable={true}
						autoCorrect={false}
						onChangeText={this.onChangeQty}
						numberOfLines={1}
						placeholder={'Qty'}
					/>
				</View>

				<View style={textInputStylePlatform}>
					<TextInput
						style={textInputStyle}
						ref={e => this._input = e}
						multiline={true}
						editable={true}
						autoCorrect={false}
						onChangeText={this.onChangeUnit}
						numberOfLines={1}
						placeholder={'Unit'}
					/>
				</View>

			</View>
		);
	}

	animatedView () {
		const {animContainer, titleContainer, contentContainer, headerStyle} = styles;
		return (
			<Animated.View style={[animContainer,
				{
					transform: [{
						translateY: this.animatedValue
					}]
				}
			]}>
				<View style={contentContainer}>
					<View style={titleContainer}>

						<TouchableOpacity onPress={this.closePopUp}>
							<Icon name="times" size={25} color={'#fff'}/>
						</TouchableOpacity>

						<Text style={headerStyle}>{this.props.title}</Text>

						<TouchableOpacity onPress={this.saveChanges}>
							<Icon name="check" size={25} color={'#fff'}/>
						</TouchableOpacity>

					</View>
					{this.createTextInput()}
				</View>
			</Animated.View>
		);
	}

	popUp () {
		if (Platform.OS === 'ios') {
			return (
				<KeyboardAvoidingView behavior='position' style={{width: '100%'}}>
					{this.animatedView()}
				</KeyboardAvoidingView>
			);
		}
		else {
			return (
				<View style={[{width: '100%'}]}>
					{this.animatedView()}
				</View>
			);
		}
	}

	render () {
		const {container} = styles;
		return (
			<View
				style={container}
				onLayout={e => this.setState({
					screenWidth: e.nativeEvent.layout.width,
					screenHeight: e.nativeEvent.layout.height
				})}
				{...this._panResponder.panHandlers}
			>
				{this.popUp()}
			</View>
		);
	}
}

const styles = {
	container: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.4)',
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	animContainer: {
		width: '100%',
		backgroundColor: '#fff'
	},
	contentContainer: {
		width: '100%',
		backgroundColor: '#fff'
	},
	titleContainer: {
		width: '100%',
		height: 50,
		backgroundColor: colors.primaryGreen,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	inputContainer: {
		margin: 10,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	innerInputContainerIos: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderRadius: 50,
		borderColor: 'rgba(0,0,0,0.4)',
		paddingLeft: 30,
		paddingRight: 30,
		paddingTop: 13,
		margin: 5
	},
	innerInputContainerAd: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderRadius: 50,
		borderColor: 'rgba(0,0,0,0.4)',
		paddingLeft: 30,
		paddingRight: 30,
		paddingTop: 0,
		margin: 5
	},
	textInputStyle: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff',
		fontSize: 18,
		lineHeight: 23
	},
	headerStyle: {
		color: '#fff',
		fontSize: 16
	}
};

export {AddIngredientPopUp};