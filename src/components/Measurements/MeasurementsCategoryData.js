import React, { Component } from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';
import { Header } from '../common';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import MeasurementsButton from './MeasurementsButton';


class MeasurementsCategoryData extends Component {
	handlePressButtonAdd = () => {
		Actions.otherMeasurements({ params: this.props.params });
	};
	findHistoryMeasurements = (question) => {
		const { measurementsHistory, selectedDay } = this.props;
		let tmpData = [];
		if (measurementsHistory && measurementsHistory.length > 0) {
			for (let i = 0; i < measurementsHistory.length; i++) {
				if (measurementsHistory[i]['question'] && measurementsHistory[i]['question'] === question) {
					let historyDay = '';
					if (measurementsHistory[i].record_date_time_utc) {
						historyDay = new Date(measurementsHistory[i].record_date_time_utc).setHours(0, 0, 0);
					} else {
						historyDay = new Date(measurementsHistory[i].record_date_time_utc_iso).setHours(0, 0, 0);
					}
					let currentDay = new Date(selectedDay.day).setHours(0, 0, 0);
					console.log(historyDay === currentDay);

					if (historyDay === currentDay) {
						tmpData.push(measurementsHistory[i]);
					}
				}
			}
		}
		return tmpData;
	};

	handlePressButton = (question) => {
		const tmpData = this.findHistoryMeasurements(question);
		console.log();
		if (tmpData.length === 0) {
			Actions.otherMeasurements({ params: this.props.params });
		} else {
			Actions.questionHistory({ question, params: this.props.params });
		}
	};

	render () {
		const { params } = this.props;
		const { container, dateText } = styles;
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		return (
			<View style={container}>
				<Header
					leftIcon={icon}
					leftButtonPress={() => Actions.pop()}
					title={params['Category']}
					rightIcon={'plus'}
					rightButtonPress={this.handlePressButtonAdd}
				/>
				<ScrollView>
					{params.Questions.length > 0 ?
						params.Questions.map((item, index) => <MeasurementsButton
							key={item.Question}
							title={item.Question}
							onPress={() => this.handlePressButton(item.Question)}/>) :
						<Text style={[dateText, { textAlign: 'center', paddingVertical: 20 }]}>There is no history found
							for this measurements</Text>
					}
				</ScrollView>
			</View>
		);
	}
}

MeasurementsCategoryData.defaultProps = {
	data: [
		{
			amount: 'N/A', recordDateUTC: 'N/A', unit: 'N/A'
		}
	]
};

const styles = {
	container: {
		flex: 1
	},
	dateText: {
		paddingRight: 10,
		fontSize: 14,
		lineHeight: 22,
		color: 'rgba(0,0,0,.3)'
	}
};

const mapStateToProps = ({ measurements, home }) => {
	const { selectedDay } = home;
	return { ...measurements, selectedDay };
};


export default connect(mapStateToProps, {})(MeasurementsCategoryData);


