/**
 * Created by mponomarets on 9/28/17.
 */
import React, {Component} from 'react';
import {
	View,
	TextInput,
	Text,
	Platform,
	KeyboardAvoidingView,
	TouchableOpacity,
	Animated,
	Dimensions,
	Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../actions/const';
import {Header}from './Header';

class PopUpWithTextInput extends Component {
	constructor (props) {
		super(props);
		this.state = {
			screenHeight: Dimensions.get('window').height,
			screenWidth: Dimensions.get('window').width,
			minLength: this.props.value.length,
			maxLength: this.props.maxLength - this.props.value.length,
			showError: false,
			value: this.props.value,
			androidHeight: 50
		};
		this.changeText = this.changeText.bind(this);
		this.animatedValue = new Animated.Value(Dimensions.get('window').height);
		this.closePopUp = this.closePopUp.bind(this);
		this.savePopUp = this.savePopUp.bind(this);
	}

	componentDidMount () {
		this._input.focus();
	}

	componentWillUnmount () {
		Keyboard.dismiss();
	}

	closePopUp () {
		this.props.onClose();

	}

	savePopUp () {
		const {minLength, value} = this.state;
		if (minLength < 3) {
			this.setState({
				showError: true
			});
		} else {

			this.props.onChange(value);
			this.props.onClose();
		}

	}

	changeText (text) {
		this.setState({
			minLength: text.length,
			maxLength: this.props.maxLength - text.length,
			showError: false,
			value: text
		});

	}

	createTextInput () {
		const {screenHeight, screenWidth, androidHeight} = this.state;
		const iosInputH = screenHeight > screenWidth ? {maxHeight: 150} : {maxHeight: 80};
		const inputHeight = Platform.OS === 'ios' ? iosInputH : {height: androidHeight};
		const {inputContainer, textInputStyle} = styles;

		return (
			<View style={inputContainer}>
				<TextInput
					style={[textInputStyle, inputHeight]}
					multiline={true}
					value={this.state.value}
					ref={e => this._input = e}
					maxLength={this.props.maxLength}
					editable={true}
					autoCorrect={false}
					onChangeText={this.changeText}
					numberOfLines={10}
					placeholder={'Please start typing..'}
					underlineColorAndroid={'transparent'}
					onChange={(e) => {
						let h = e.nativeEvent.contentSize.height;
						if (screenHeight > screenWidth) {
							let newHeight = h > 20 && (h < 150) ? h : 150;
							this.setState({
								androidHeight: newHeight
							});
						} else {
							let newHeight = h > 20 && (h < 80) ? h : 80;
							this.setState({
								androidHeight: newHeight
							});
						}
					}}
				/>

			</View>

		);
	}

	renderErrorMessage () {
		const {errorStyle} = styles;

		if (this.state.showError) {
			return (
				<Text style={errorStyle}>Too short</Text>
			);
		}
	}

	animatedView () {
		const {contentContainer, inputLengthCount} = styles;
		return (
			<View style={contentContainer}>
				{this.createTextInput()}
				<Text style={inputLengthCount}>
					{this.state.maxLength}
				</Text>
			</View>
		);
	}

	popUp () {
		if (Platform.OS === 'ios') {
			return (
				<KeyboardAvoidingView behavior='padding' style={{width: '100%'}}>
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
			<View style={container}>
				<Header
					title={this.props.title}
					leftIcon={'times'}
					leftButtonPress={this.closePopUp}
					rightIcon={'check'}
					rightButtonPress={this.savePopUp}
				/>
				{this.popUp()}
				{this.renderErrorMessage()}
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	contentContainer: {
		width: '100%',
		backgroundColor: '#fff'
	},
	textInputStyle: {
		minHeight: 50,
		width: '100%',
		alignItems: 'stretch',
		fontSize: 16,
		lineHeight: 20,
		paddingTop: 15,
		paddingBottom: 15,
		paddingHorizontal: 20,
		borderRadius: 20
	},
	inputContainer: {
		flexDirection: 'row',
		borderTopColor: colors.lightGrey,
		borderTopWidth: 1,
		marginHorizontal: 20,
		borderColor: 'rgba(0,0,0,0.1)',
		borderWidth: 1,
		borderRadius: 20,
		marginTop: 10
	},
	inputLengthCount: {
		fontSize: 12,
		color: '#cfd0d2',
		marginHorizontal: 30,
		textAlign: 'right'
	},
	errorStyle: {
		textAlign: 'center',
		color: 'red'
	}
};

export default PopUpWithTextInput;