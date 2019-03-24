import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '../common';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { parseRecordDateTime } from '../../actions/const';
import { connect } from 'react-redux';


class MeasurementsRecordData extends Component {
	render () {
		const { data } = this.props;
		let history = data;
		const { container, itemContainer, iconContainer, dateText } = styles;
		const icon = Platform.OS === 'android' ? 'ios-arrow-back' : 'md-arrow-back';
		const handlePressButton = (item) => {
			Actions.addMeasurements({ history: item, change: true });
		};
		return (
			<View style={container}>
				<Header
					leftIcon={icon}
					leftButtonPress={() => Actions.pop()}
					title={'All record data'}
					rightIcon={'plus'}
					rightButtonPress={() => Actions.addMeasurements({ history: data[0] })}
				/>
				<ScrollView>
					{
						history.slice(0).reverse().map((item, index) => <TouchableOpacity
							style={itemContainer} key={index}
							onPress={() => handlePressButton(item)}>
							<Text>{`${item.amount} ${item.unit}`}</Text>
							<View style={iconContainer}>
								<Text
									style={dateText}>{parseRecordDateTime(item.recordDateUTC || item['record_date_time_utc']) || 'N/A'}</Text>
								<Icon name={'ios-arrow-forward'} size={20} color={'rgba(0,0,0,0.3)'}/>
							</View>
						</TouchableOpacity>)
					}
				</ScrollView>
			</View>
		);
	}
}
;

MeasurementsRecordData.defaultProps = {
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
	itemContainer: {
		height: 60,
		flexDirection: 'row',
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: 'rgba(0,0,0,0.1)',
		borderBottomWidth: 1
	},
	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	dateText: {
		paddingRight: 10
	}
};

const mapStateToProps = ({ measurements }) => {
	return measurements
};


export default connect(mapStateToProps, {})(MeasurementsRecordData);

