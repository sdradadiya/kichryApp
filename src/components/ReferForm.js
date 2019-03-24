import React, {Component} from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import {BackHeader, Input}from './common';
import SafeAreaView from 'react-native-safe-area-view';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { sendReferForm } from '../actions';
import {colors, tracker, textStyles} from '../actions/const';

let nextInput;

class ReferForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			error: '',
			loading: this.props.loading,
			name: '',
			referEmail: ''
		};

		this.referName = this.referName.bind(this);
		this.referEmail = this.referEmail.bind(this);
		this.changeFocus = this.changeFocus.bind(this);
		this.onButtonPress = this.onButtonPress.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps !== this.props) {
			this.setState({
				loading: nextProps.loading,
				error: nextProps.error,
				name: nextProps.name,
				referEmail: nextProps.referEmail
			});
		}
	}

	componentDidMount() {
		tracker.trackScreenView('ReferFrom');
	}

	onButtonPress () {
		
		const { name, referEmail } = this.state;

		let pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i; 

		if( !name.length || name.length < 1 ) {
			this.setState({
				error: 'Name length should be more than 1 character'
			});
			return;
		}
		
		if(!pattern.test(referEmail)) {
			this.setState({
				error: 'Email is not valid'
			});
			return;
		} 

		this.props.sendReferForm(name, referEmail);

	}
	
	getNextInput (data) {
		nextInput = data;
	}

	changeFocus () {
		if (nextInput !== undefined) {
			nextInput.focus();
		}
	}

	referName (text) {
		this.setState({
			name: text,
			error: ''
		});
	}

	referEmail (text) {
		this.setState({
			referEmail: text,
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
					<Text style={textStyles.description14White}>REFER</Text>
				</TouchableOpacity>
			);
		}
	}
    
	renderFormInput() {

		const {formContainer, inputsContainer, inputTitle, inputWrap, wrapper} = styles;

		return(
			<ScrollView style={formContainer}>
				<Text style={[textStyles.description14, inputTitle]}>Know someone who could benefit from Kates help? Provide their details below and Kate will reach out to them. They are blessed to have you in their life!</Text>
				<View style={inputsContainer}>

					<Text style={[textStyles.l2Text, inputTitle]}>Name</Text>
					<View style={inputWrap}>
						<View style={wrapper}>
							<Input
								placeholder='Name'
								keyboardType='default'
								returnKeyType='next'
								changeText={this.referName}
								value={this.state.name}
								onSubmitEditing={this.changeFocus}
							/>
						</View>
					</View>

					<Text style={[textStyles.l2Text, inputTitle]}>Email</Text>
					<View style={inputWrap}>
						<View style={wrapper}>
							<Input
								rel={this.getNextInput.bind(this)}
								placeholder='Email'
								keyboardType='default'
								returnKeyType='next'
								changeText={this.referEmail}
								value={this.state.referEmail}
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

	render() {

		return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<BackHeader title={'Refer Friends'} leftButtonPress={() => Actions.pop()}/>
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
		marginBottom: 10,
		borderRadius: 5,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	inputTitle: {
		paddingVertical: 5,
		paddingLeft: 10,
		marginTop: 10,
	},
	inputWrap: {
		borderColor: colors.primaryGrey,
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 5,
		marginVertical: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	wrapper: {
		flex: 1.5
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
	}
};

const mapStateToProps = ({ referForm }) => {
	const {
		error,
		loading,
		name,
		referEmail
	} = referForm;
	return {
		error,
		loading,
		name,
		referEmail
	};
};

export default connect(mapStateToProps, { sendReferForm })(ReferForm);
