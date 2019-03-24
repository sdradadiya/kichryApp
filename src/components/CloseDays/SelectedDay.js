import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Header } from '../common';
import { months, colors }from '../../actions/const';
import MeasurementsButton from '../Measurements/MeasurementsButton';
import moment from 'moment';

class SelectedDay extends Component {
	constructor (props) {
		super(props);
		this.state = {
			selectedDay: this.props.selectedDay
		};
	}

	handleBackButtonPress = () => {
		Actions.pop();
	};

	setUnit(measurement) {
		switch(measurement){
			case 'A1C':
			case 'Muscle Mass':
			case 'Fat Mass':
				return '%';
				break;
			case 'Weight':
				return 'lbs';
				break;
			case 'Wellness':
				return 'pts';
				break;
			case 'Blood Glucose':
				return 'mg/dl';
				break;
		}
	}

	findHistoryMeasurements = (item, param = 'title') => {
		const { measurementsHistory, selectedDay } = this.props;
		let measurementForTheDay = [];
		let clearMeasurement = [{
			title: item,
			amount: '',
			unit: this.setUnit(item)
		}]
		if (measurementsHistory && measurementsHistory.length > 0) {
			let currentDay =  moment(new Date(selectedDay.day)).format('L')
			let historyDay = '';
	
			for (let i = 0; i < measurementsHistory.length; i++) {
				if (measurementsHistory[i][param] && measurementsHistory[i][param] === item || item.Question == measurementsHistory[i][param]) {
					
					if (measurementsHistory[i].record_date_time_utc) {

						historyDay = moment(new Date(measurementsHistory[i].record_date_time_utc)).format('L')

						if (historyDay === currentDay) {
							measurementForTheDay.push(measurementsHistory[i]);
						} else {
							let clearMeasurement = {
								title: item,
								amount: '',
								unit: this.setUnit(item)
							}
						}
					}
					
				}
			}
		}
		
		if(measurementForTheDay.length <= 0) {
			return clearMeasurement;
		} else {
			return measurementForTheDay;
		}
		
	};

	handlePressBodyMeasurements = (item, day) => {
		const { measurementsData } = this.props;

		let measurementsForThisDay = this.findHistoryMeasurements(item);

		Actions.addMeasurements({
			measurementData: {
				title: measurementsForThisDay[measurementsForThisDay.length - 1].title,
				amount: measurementsForThisDay[measurementsForThisDay.length - 1].amount,
				unit: measurementsForThisDay[measurementsForThisDay.length - 1].unit	
			},
			day 
		});

	};

	handlePressOtherMeasurements (measurement) {

		// let tmpData = [];
		// for (let i = 0; i < measurement.Questions.length; i++) {
		// 	let tmp = this.findHistoryMeasurements(measurement.Questions[i], 'question');
		// 	tmpData = [...tmp];
		// }

		// if (tmpData.length === 0) {
		Actions.otherMeasurements({ params: measurement });
		// } else {
		// 	Actions.questionHistory({ history: tmpData });
		// }
	}

	handleButtonMealsPress = () => {
		Actions.reviewMeals();
	};

	render () {
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const { allGoals } = this.props;
		const { day } = this.props.selectedDay;
		const categories = allGoals && allGoals['Other Measurements'] ? allGoals['Other Measurements']['Categories'] : [];
		const bodyMeasurements = allGoals['Body Measurements'];
		const { container } = styles;

		return (<View style={container}>
			<Header
				title={`Close ${day}`}
				leftIcon={icon}
				leftButtonPress={this.handleBackButtonPress}
			/>
			<MeasurementsButton
				title={'Meals'}
				onPress={this.handleButtonMealsPress}/>
			{Object.keys(bodyMeasurements).map(item => {
				return (
					<MeasurementsButton
						key={item}
						title={item}
						icon={'ios-arrow-forward'}
						onPress={() => this.handlePressBodyMeasurements(item, day)}/>
				);
			})}
			{categories.map(item => {
				return (
					<MeasurementsButton
						key={item['Category']}
						title={item['Category']}
						icon={'ios-arrow-forward'}
						onPress={() => this.handlePressOtherMeasurements(item)}/>
				);
			})}

		</View>);
	}
}
const styles = {
	container: {
		flex: 1
	},
	listContainer: {
		flexGrow: 1,
		paddingHorizontal: 20
	},
	buttonContainer: {
		height: 60,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: colors.lightGrey
	},
	buttonTitle: {
		fontSize: 16,
		color: '#000'
	}
};
const mapStateToProps = ({ home, measurements }) => {
	const { selectedDay, allGoals } = home;
	const {
		measurementsHistory,
		measurementsData
	} = measurements;
	return {
		selectedDay,
		allGoals,
		measurementsHistory,
		measurementsData
	};
};

export default connect(mapStateToProps, {})(SelectedDay);

