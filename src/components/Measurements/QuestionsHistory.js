import React from 'react';
import { View, Text, Platform, FlatList } from 'react-native';
import { Header } from '../common';
import { Actions } from 'react-native-router-flux';
import { parseRecordDateTime } from '../../actions/const';
import { connect } from 'react-redux';


const QuestionsHistory = ({ history }) => {

	const { container, listContainer, questionStyle, itemContainer, iconContainer, dateText, unitStyles } = styles;
	const icon = Platform.OS === 'android' ? 'ios-arrow-back' : 'md-arrow-back';

	const renderListItem = ({ item }) => {
		return <View style={itemContainer} key={item.recordDateUTC}>
			<Text style={questionStyle}>{item.question}</Text>
			<Text style={unitStyles}>{`${item.unit} - ${item.amount}`}</Text>
			<View style={iconContainer}>
				<Text
					style={dateText}>{parseRecordDateTime(item.recordDateUTC || item['record_date_time_utc']) || 'N/A'}</Text>
			</View>
		</View>;
	};

	const renderEmptyListComponent = () => {
		return <Text style={[dateText, { textAlign: 'center', paddingVertical: 20 }]}>There is no history found
			for this measurements</Text>;
	};

	return (
		<View style={container}>
			<Header
				leftIcon={icon}
				leftButtonPress={() => Actions.pop()}
				title={'All record data'}
			/>
			<FlatList
				contentContainerStyle={listContainer}
				data={history.slice(0).reverse()}
				initialNumToRender={50}
				maxToRenderPerBatch={50}
				windowSize={100}
				shouldItemUpdate
				removeClippedSubviews={true}
				keyExtractor={(item, index) => index}
				renderItem={renderListItem}
				ListEmptyComponent={renderEmptyListComponent}
			/>
		</View>
	);
};

QuestionsHistory.defaultProps = {
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
	listContainer: {
		flexGrow: 1
	},
	itemContainer: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		borderBottomColor: 'rgba(0,0,0,0.1)',
		borderBottomWidth: 1
	},
	questionStyle: {
		lineHeight: 22,
		fontSize: 18
	},
	unitStyles: {
		lineHeight: 22,
		fontSize: 16
	},
	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	dateText: {
		paddingRight: 10,
		fontSize: 14,
		lineHeight: 22,
		color: 'rgba(0,0,0,.3)'
	}
};

const mapStateToProps = ({ measurements }) => {
	return measurements;
};


export default connect(mapStateToProps, {})(QuestionsHistory);

