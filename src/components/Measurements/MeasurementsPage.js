import React, { PureComponent } from 'react';
import {
	View,
	Platform,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { getMeasurementsHistory } from '../../actions';
import MeasurementsButton from './MeasurementsButton';
import { Header } from '../common';

class MeasurementsPage extends PureComponent {
	constructor (props) {
		super(props);
	}

	handlePressButton = (item) => {
		const { measurementsData, measurementsHistory } = this.props;
		let tmpData = [];
		if (measurementsHistory && measurementsHistory.hasOwnProperty(item)) {
			tmpData.push(measurementsHistory[item]);
		} else {
			if ( measurementsHistory && measurementsHistory.length > 0) {
				for (let i = 0; i < measurementsHistory.length; i++) {
					if (measurementsHistory[i]['title'] === item) {
						tmpData.push(measurementsHistory[i]);
					}
				}
			}
		}
		if (tmpData.length < 1) {
			tmpData.push(measurementsData[item]);
		}
		Actions.measurementsDetail({ data: tmpData, title: item });
	};

	render () {
		const { measurementsData } = this.props;
		return (
			<View>
				<Header
					title={'Measurements'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
				/>
				{Object.keys(measurementsData).length > 0 && Object.keys(measurementsData).map(item => {
					return (
						<MeasurementsButton key={item} title={item} onPress={() => this.handlePressButton(item)}/>
					);
				})}
			</View>
		);

	}
}

const mapStateToProps = ({ measurements }) => {
	const {
		measurementsHistory,
		measurementsData
	} = measurements;
	return {
		measurementsHistory,
		measurementsData
	};
};

export default connect(mapStateToProps, { getMeasurementsHistory })(MeasurementsPage);

