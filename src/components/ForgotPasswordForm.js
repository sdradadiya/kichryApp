/**
 * Created by mponomarets on 8/29/17.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native';
import {BackHeader, Input}from './common';
import {colors, tracker}from '../actions/const';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import {resetPassword, emailChanged} from '../actions';
import SafeAreaView from 'react-native-safe-area-view';


class ForgotPasswordForm extends Component {
	constructor (props) {
		super(props);
		this.state = {
			error: '',
			loading: this.props.loading,
			email: this.props.email
		};
		this.onButtonPress = this.onButtonPress.bind(this);
		this.writeEmail = this.writeEmail.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps !== this.props) {
			this.setState({
				loading: nextProps.loading,
				error: nextProps.error,
				email: nextProps.email
			});
		}
	}

	writeEmail (text) {
		this.setState({
			email: text,
			error: ''
		});
	}

	componentDidMount() {
		tracker.trackScreenView('ForgotPasswordScreen');
	}

	renderButtonSubmit () {
		const {loading} = this.state;
		const {buttonContainer, button, buttonTitle} = styles;
		if (loading) {
			return <ActivityIndicator color={colors.primaryGrey} size={'large'}/>;
		} else {
			return (
				<View style={buttonContainer}>
					<TouchableOpacity style={button} onPress={this.onButtonPress}>
						<Text style={buttonTitle}>REQUEST</Text>
					</TouchableOpacity>
				</View>
			);
		}
	}

	onButtonPress () {
		const {email} = this.state;
		if (email === '') {
			this.setState({
				error: 'Please input valid email'
			});
		} else {
			let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (pattern.test(email)) {
				this.props.resetPassword(email);
			} else {
				this.setState({
					error: 'Email not valid'
				});
			}
		}

	}

	renderFormInput () {
		const {formContainer, inputsContainer, inputWrap, iconStyle, wrapper, lastInput, inputTitle} = styles;
		return (
			<View style={formContainer}>
				<View style={inputsContainer}>
					<Text style={inputTitle}>Request password reset</Text>
					<View style={[inputWrap, lastInput]}>
						<Icon style={iconStyle} name="ios-mail-outline" size={25} color={colors.primaryGreen}/>
						<View style={wrapper}>
							<Input
								placeholder='Your email'
								keyboardType='email-address'
								changeText={this.writeEmail}
								value={this.state.email}
								returnKeyType='go'
								secureTextEntry={false}
								onSubmitEditing={this.onButtonPress}
								autoFocus={true}
							/>
						</View>
					</View>
				</View>
				{this.renderButtonSubmit()}
				<Text style={{color: 'red', marginHorizontal: 20, textAlign: 'center'}}>{this.state.error}</Text>
			</View>
		);
	}

	render () {
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<BackHeader
					title={'Password'}
					leftButtonPress={() => {
						this.props.emailChanged('');
						Actions.auth({type: 'replace'});
					}}/>
				{this.renderFormInput()}
			</SafeAreaView>
		);
	}
}

const styles = {
	formContainer: {
		flex: 1,
		padding: 10,
		flexDirection: 'column',
		marginBottom: 50,
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
		borderColor: 'rgba(0,0,0,0.3)',
		borderWidth: 1,
		borderRadius: 20,
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
		color: 'rgba(0,0,0,0.5)',
		fontSize: 18,
		paddingVertical: 5,
		paddingLeft: 10
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		width: Dimensions.get('window').width - 60,
		height: 50,
		borderRadius: 25,
		backgroundColor: colors.primaryOrange,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 16
	}
};

const mapStateToProps = ({auth}) => {
	const {
		error,
		loading,
		email
	} = auth;
	return {
		error,
		loading,
		email
	};
};

export default connect(mapStateToProps, {emailChanged, resetPassword})(ForgotPasswordForm);

