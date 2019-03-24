/**
 * Created by mponomarets on 7/28/17.
 */
import React, { Component } from 'react';
import moment from 'moment';
import {
	View,
	Text,
	TextInput,
	ScrollView,
	Platform,
	TouchableOpacity,
	KeyboardAvoidingView,
	ActivityIndicator,
	Dimensions,
	Keyboard
} from 'react-native';
import { BackHeader }from './common';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { colors, tracker } from '../actions/const';
import { sendMeasurementsToServer, getMeasurementsList } from '../actions';
import MeasurementsButton from './Measurements/MeasurementsButton';
// import {Crashlytics} from 'react-native-fabric';
// import StackTrace from 'stacktrace-js';

let defaultData = {
	'Fat Mass': {
		amount: '',
		recordDataUTC: '',
		unit: '%'
	},
	'Muscle Mass': {
		amount: '',
		recordDataUTC: '',
		unit: '%'
	},
	'Weight': {
		amount: '',
		recordDataUTC: '',
		unit: 'lbs'
	},
	'Wellness': {
		amount: '',
		recordDataUTC: '',
		unit: 'pts'
	}
};

class MeasurementsForm extends Component {
	constructor (props) {
		super(props);
		this.state = {
			data: this.checkAllFieldsInData(),
			loading: this.props.loading,
			error: '',
			isSaveButtonActive: false
		};
	}

	componentDidMount () {
		this.props.getMeasurementsList();
        tracker.trackScreenView("MeasurementForm");
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps !== this.props) {
			this.setState({
				loading: nextProps.loading,
				error: nextProps.error
			});
		}
	}

	onTextChange (text, name) {
		let data = this.state.data;
		data[name].amount = text;
		this.setState({
			data: data,
			isSaveButtonActive: true
		});
	}

	parseRecordDateTime (dateString) {
		if (dateString) {
			return moment(new Date(dateString)).local().format('MMM Do, YYYY (hh:mm A)');
		} else {
			return null;
		}
	}

	rowItem (item, index) {
		const { data } = this.state;
		const { inputContainer, unitStyle, titleContainer, title, timestamp, input, unitAmountContainer } = styles;

		let recordDateTimeLocal = this.parseRecordDateTime(data[item].recordDateUTC);
		const time = recordDateTimeLocal ? <Text style={timestamp}>As on {recordDateTimeLocal}</Text> : null;
		return (
			<View key={index} style={inputContainer}>
				<View style={titleContainer}>
					<Text style={title}>{item}</Text>
					{time}
				</View>
				<View style={unitAmountContainer}>
					<TextInput
						style={[input]}
						value={data[item].amount.toString()}
						underlineColorAndroid={'transparent'}
						keyboardType={'numeric'}
						placeholder={''}
						autoCorrect={false}
						autoCapitalize="none"
						onChangeText={(text) => {
							this.onTextChange(text, item);
						}}
						maxLength={5}
					/>
					<Text style={unitStyle}>{data[item].unit || 'unit'}</Text>
				</View>
			</View>
		);
	}

	onButtonPress () {

		Keyboard.dismiss();

		this.setState({
			error: ''
		});

		this.props.sendMeasurementsToServer(this.state.data);

	}

	renderButtons () {
		const { buttonContainer, button, buttonDisable, buttonTitleContainer, buttonTitle } = styles;
		if (this.state.loading) {
			return (<ActivityIndicator style={{ margin: 20 }} color={colors.primaryGrey} size={'large'}/>
			);
		} else {
			if (this.state.isSaveButtonActive) {
				return (
					<View style={buttonContainer}>
						<TouchableOpacity
							style={button}
							onPress={() => this.onButtonPress()}
						>
							<View style={buttonTitleContainer}>
								<Text style={buttonTitle}>SAVE CHANGES</Text>
							</View>
						</TouchableOpacity>
					</View>
				);
			}
			return (
				<View style={buttonContainer}>
					<View style={buttonDisable}>
						<View style={buttonTitleContainer}>
							<Text style={buttonTitle}>SAVE CHANGES</Text>
						</View>
					</View>
				</View>
			);

		}
	}

	checkAllFieldsInData () {
		let newObj = { ...this.props.measurementsData };
		for (let key in defaultData) {
			if (!newObj.hasOwnProperty(key)) {
				newObj[key] = defaultData[key];
			}
		}
		return newObj;
	}

	render () {
		const { data } = this.state;
		const list = Object.keys(data).map((item, index) => {
			return this.rowItem(item, index);
		});

		if (Platform.OS === 'ios') {
			return (
				<KeyboardAvoidingView behavior='height' style={{ flex: 1 }}>
					<BackHeader title={'Measurements'} leftButtonPress={() => Actions.pop()}/>
					<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'always'}>
						{list}
						{this.renderButtons()}
						<Text style={styles.error}>{this.state.error}</Text>
						<MeasurementsButton/>
					</ScrollView>
				</KeyboardAvoidingView>
			);
		} else {
			return (
				<View style={{ flex: 1 }}>
					<BackHeader title={'Measurements'} leftButtonPress={() => Actions.pop()}/>
					<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'always'}>
						{list}
						{this.renderButtons()}
						<Text style={styles.error}>{this.state.error}</Text>
					</ScrollView>
				</View>
			);
		}
	}
}
const styles = {

	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderBottomColor: 'rgba(0,0,0,0.3)',
		borderBottomWidth: 1
	},
	titleContainer: {
		width: '70%'
	},
	title: {
		fontSize: 18
	},
	timestamp: {
		lineHeight: 24,
		fontSize: 12
	},
	input: {
		backgroundColor: '#fff',
		fontWeight: 'bold',
		height: 40,
		width: '60%',
		color: colors.primaryOrange,
		textAlign: 'right'
	},
	unitAmountContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	unitStyle: {
		paddingLeft: 3,
		fontSize: 16,
		color: colors.primaryOrange
	},
	buttonContainer: {
		zIndex: 100,
		justifyContent: 'center',
		alignItems: 'center',
		height: 90
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
	buttonDisable: {
		width: Dimensions.get('window').width - 60,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'rgba(0,0,0,0.3)',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20
	},
	buttonTitleContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 16
	},
	error: {
		textAlign: 'center',
		color: 'red'
	}
};

const mapStateToProps = ({ measurements }) => {
	const {
		error,
		loading,
		measurementsData
	} = measurements;
	return {
		error,
		loading,
		measurementsData
	};
};

export default connect(mapStateToProps, { sendMeasurementsToServer, getMeasurementsList })(MeasurementsForm);
