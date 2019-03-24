import React, { PureComponent } from 'react';
import { View, Platform }from 'react-native';
import { Header }from '../common';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import MeasurementsButton from './MeasurementsButton';
import { getMeasurementsHistory } from '../../actions';

class SelectMeasurementsForm extends PureComponent {
	componentDidMount () {
		this.props.getMeasurementsHistory();
	}

	handlePressBodyMeasurements = () => {
		Actions.measurements()
	};

	handlePressOtherMeasurements (measurement) {
		Actions.measurementsCategoryData({ params: measurement });
	}

	render () {
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const { allGoals } = this.props;
		const categories = allGoals && allGoals['Other Measurements'] ? allGoals['Other Measurements']['Categories'] : [];
		return (
			<View>
				<Header
					title={'Make your selection'}
					leftIcon={icon}
					leftButtonPress={() => Actions.pop()}
				/>
				<MeasurementsButton
					key={'Other Measurements'}
					title={'Body Measurements'}
					onPress={this.handlePressBodyMeasurements}/>

				{categories.map(item => {
					return (
						<MeasurementsButton
							key={item['Category']}
							title={item['Category']}
							onPress={() => this.handlePressOtherMeasurements(item)}/>
					);
				})}
			</View>
		);
	}
}

const mapStateToProps = ({ measurements, home }) => {
	const {
		measurementsHistory
	} = measurements;
	const { allGoals } = home;
	return {
		measurementsHistory,
		allGoals
	};
};
export default connect(mapStateToProps, { getMeasurementsHistory })(SelectMeasurementsForm);



