import React, { PureComponent } from 'react';
import { View, Text, Platform, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import { parseRecordDate, parseRecordTime, colors } from '../../actions/const';
import { saveNewMeasurements, clearError } from '../../actions';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';

class AddNewMeasurements extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			title: this.props.measurementData.title,
			amount: this.props.measurementData.amount,
			unit: this.props.measurementData.unit,
			time: this.props.measurementData.recordDateUTC,
			loading: true,
			error: this.props.error
		};
	}

	componentWillMount () {
		const { measurementData } = this.props;

		const time = new Date();

		this.setState({
			title: measurementData.title,
			amount: measurementData.amount,
			unit: measurementData.unit,
			time
		});
	}

	componentWillUnmount () {
		this.props.clearError();
	}

	handleChangeText = (text) => {
		this.setState({
			amount: text,
			error: ''
		});
	};

	handlePressSaveButton = () => {
		Keyboard.dismiss();
		const { day, saveNewMeasurements } = this.props;
		const { title, amount, unit } = this.state;
		const date = moment(new Date(day)).format('L')
		let data = {
			title,
			amount,
			unit,
			date,
		};
		
		if (amount.length <= 0) {
			return this.setState({ error: `${title} is required` });
		}
		if (/[0-9]/.test(amount) === false) {
			return this.setState({ error: `${title} should contain numbers` });
		}
		
		saveNewMeasurements(data);
	};

	render () {
		const { container, input, inputTextContainer, errorStyle, loadingContainer } = styles;
		const { measurementData, loading } = this.props;
		const { title, time, amount, error } = this.state;
		
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		return (
			<View style={{ flex: 1 }}>
				<Header
					title={title}
					leftIcon={icon}
					leftButtonPress={() => Actions.pop()}
					rightButtonPress={this.handlePressSaveButton}
					rightIcon={'check'}
				/>
				<View style={container}>
					<Text>Data</Text>
					<Text>{this.props.day}</Text>
				</View>
				<View style={container}>
					<Text>Time</Text>
					<Text>{parseRecordTime(time)}</Text>
				</View>
				<View style={container}>
					<Text>{title}</Text>
					<View style={inputTextContainer}>
						<TextInput
							style={input}
							value={amount.toString()}
							underlineColorAndroid={'transparent'}
							keyboardType={'numeric'}
							placeholder={'Input new value'}
							autoCorrect={false}
							autoCapitalize="none"
							onChangeText={this.handleChangeText}
							maxLength={5}
						/>
						<Text style={{ paddingLeft: 10, fontSize: 16 }}>{measurementData.unit}</Text>
					</View>
				</View>
				<Text style={errorStyle}>{error}</Text>
				{loading && <View style={loadingContainer}>
					<ActivityIndicator size={'large'} color={'#fff'}/>
				</View>}
			</View>
		);
	}
}

const styles = {
	container: {
		height: 60,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		borderBottomColor: 'rgba(0,0,0,.1)',
		borderBottomWidth: 1
	},
	input: {
		flex: 1,
		backgroundColor: '#fff',
		fontWeight: 'bold',
		height: 40,
		color: colors.primaryOrange,
		textAlign: 'right'
	},
	inputTextContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1
	},
	errorStyle: {
		textAlign: 'center',
		fontSize: 16,
		color: 'red',
		paddingHorizontal: 20,
		paddingVertical: 20
	},
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,.3)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
};

AddNewMeasurements.defaultProps = {
	title: 'Add new goals',
};

const mapStateToProps = ({ measurements }) => {
	return measurements
};


export default connect(mapStateToProps, { saveNewMeasurements, clearError })(AddNewMeasurements);
