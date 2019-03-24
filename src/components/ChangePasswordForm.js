/**
 * Created by mponomarets on 8/16/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	Dimensions,
	ScrollView
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {BackHeader, Input}from './common';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {colors, tracker, textStyles} from '../actions/const';
import {sendNewPass} from '../actions';
import Icon from 'react-native-vector-icons/Ionicons';

let nextInput;

class ChangePasswordForm extends Component {
	constructor (props) {
		super(props);
		this.state = {
			error: '',
			loading: this.props.loading,
			newPass: '',
			verifyPass: '',
			currentPass: ''
		};
		this.writeCurrentPass = this.writeCurrentPass.bind(this);
		this.writeNewPass = this.writeNewPass.bind(this);
		this.onButtonPress = this.onButtonPress.bind(this);
		this.writeVerifyPass = this.writeVerifyPass.bind(this);
		this.changeFocus = this.changeFocus.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps !== this.props) {
			this.setState({
				loading: nextProps.loading,
				error: nextProps.error,
				newPass: nextProps.newPass,
				currentPass: nextProps.currentPass,
				verifyPass: nextProps.verifyPass
			});
		}
	}

	componentDidMount()
	{
        tracker.trackScreenView("ChangePasswordForm");
	}

	onButtonPress () {
		const {verifyPass, newPass, currentPass} = this.state;

		if (verifyPass === '' || newPass === '' || currentPass === '') {
			this.setState({
				error: 'Please fill all values'
			});
			return;
		}

		if (verifyPass !== newPass) {
			this.setState({
				error: 'Passwords do not match'
			});
		} else {
			this.checkPassword();
		}
	}

	writeVerifyPass (text) {
		this.setState({
			verifyPass: text,
			error: ''
		});
	}

	getNextInput (data) {
		nextInput = data;
	}

	changeFocus () {
		if (nextInput !== undefined) {
			nextInput.focus();
		}
	}

	checkPassword () {
		let pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,25}$/;
		const {newPass, currentPass} = this.state;
		if (pattern.test(newPass)) {

			this.props.sendNewPass(newPass, currentPass);

		} else {
			let message = 'Password does not meet strength requirements: at least 8 symbols, ' +
				'1 capital letter, 1 non-capital letter, 1 digit, 1 special character from ' + '~`.!@#$%^&*()_-={}[]:>;,</?*-';
			this.setState({
				error: message
			});
		}
	}

	writeNewPass (text) {
		this.setState({
			newPass: text,
			error: ''
		});
	}

	writeCurrentPass (text) {
		this.setState({
			currentPass: text,
			error: ''
		});
	}

	renderButtonSubmit () {
		const {loading} = this.state;
		const {button, buttonTitle} = styles;
		if (loading) {
			return <ActivityIndicator color={colors.primaryGrey} size={'large'}/>;
		} else {
			return (
				<TouchableOpacity style={button} onPress={this.onButtonPress}>
					<Text style={textStyles.description14White}>SUBMIT</Text>
				</TouchableOpacity>
			);
		}
	}

	renderFormInput () {
		const {formContainer, inputsContainer, inputWrap, firstInput, iconStyle, wrapper, lastInput, inputTitle} = styles;
		return (
			<ScrollView style={formContainer}>
				<View style={inputsContainer}>

					<Text style={[textStyles.l2Text, inputTitle]}>Current password</Text>
					<View style={[inputWrap, firstInput]}>
						<Icon style={iconStyle} name="md-unlock" size={25} color={colors.primaryGrey}/>
						<View style={wrapper}>
							<Input
								placeholder='Current password'
								keyboardType='default'
								returnKeyType='next'
								changeText={this.writeCurrentPass}
								value={this.state.currentPass}
								secureTextEntry={true}
								onSubmitEditing={this.changeFocus}
							/>
						</View>
					</View>

					<Text style={[textStyles.l2Text, inputTitle]}>New password</Text>
					<View style={[inputWrap, firstInput]}>
						<Icon style={iconStyle} name="md-unlock" size={25} color={colors.primaryGrey}/>
						<View style={wrapper}>
							<Input
								placeholder='New password'
								keyboardType='default'
								returnKeyType='next'
								changeText={this.writeNewPass}
								value={this.state.newPass}
								secureTextEntry={true}
								onSubmitEditing={this.changeFocus}
							/>
						</View>
					</View>
					<Text style={[textStyles.l2Text, inputTitle]}>Repeat new password</Text>
					<View style={[inputWrap, lastInput]}>
						<Icon style={iconStyle} name="md-lock" size={25} color={colors.primaryGrey}/>
						<View style={wrapper}>
							<Input
								rel={this.getNextInput.bind(this)}
								placeholder='Repeat new password'
								changeText={this.writeVerifyPass}
								value={this.state.verifyPass}
								returnKeyType='go'
								secureTextEntry={true}
								onSubmitEditing={this.onButtonPress}
							/>
						</View>
					</View>
				</View>
				{this.renderButtonSubmit()}
				<Text style={{color: 'red', marginHorizontal: 20, textAlign: 'center'}}>{this.state.error}</Text>
			</ScrollView>
		);
	}

	render () {
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<BackHeader title={'Password'} leftButtonPress={() => Actions.pop()}/>
				{this.renderFormInput()}
			</SafeAreaView>
		);
	}
}
const styles = {
	formContainer: {
		padding: 10,
		flexDirection: 'column',
		backgroundColor: '#fff'
	},
	inputsContainer: {
		marginHorizontal: 5,
		marginBottom: 5,
		borderRadius: 5,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	inputWrap: {
		borderColor: colors.primaryGrey,
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 3,
		marginVertical: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	wrapper: {
		flex: 1.5
	},
	iconStyle: {
		flex: 0.15,
		marginHorizontal: 5,
		paddingLeft: 10
	},
	lastInput: {},
	checkboxWrapper: {
		marginTop: 15
	},
	inputTitle: {
		paddingVertical: 5,
		paddingLeft: 10
	},
	button: {
		flex: 1,
		height: 50,
		borderRadius: 5,
		backgroundColor: colors.primaryGreen,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20,
		marginHorizontal: 5
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 16
	}
};

const mapStateToProps = ({changePassword}) => {
	const {
		error,
		loading,
		newPass,
		verifyPass,
		currentPass
	} = changePassword;
	return {
		error,
		loading,
		newPass,
		verifyPass,
		currentPass
	};
};

export default connect(mapStateToProps, {sendNewPass})(ChangePasswordForm);
