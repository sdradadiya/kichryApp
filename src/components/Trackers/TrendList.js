import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { InfoBox } from '../common';
import { connect } from 'react-redux';
import { getItemHistory } from './TrackItemHelper';
import { getChecklistRecords, cleanHistory } from '../../actions';
import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const dataFormating = (data) => {

	return moment(data).calendar(null, {
		sameDay: '[Today]',
		lastDay: '[Yesterday]',
		lastWeek: 'ddd',
		sameElse: 'M/D'
	})

}

const recordValueFormating = (value) => {
	
	if(value == 'true') {
		return (
			<Icon
				size={40}
				name='thumbs-o-up'
				color={colors.primaryGreen}
			/>
		)
	}
	if(value == 'false') {
		return (
			<Icon
				size={40}
				name='thumbs-o-down'
				color={colors.primaryOrange}
			/>
		)
	}
	
	return (
		<Text style={styles.itemValue}>{value}</Text>
	)

}

class TrendList extends Component {

	constructor() {
		super();

		this.state = {
			data: [],
			type: 'List',
		};

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.checklistRecords !== this.props.checklistRecords) {
			this.createChartDate(nextProps.checklistRecords);
		}
	}

	componentDidMount() {

		const { getChecklistRecords, itemId } = this.props;
		const { type } = this.state;
		
		const recordsFor = {
			itemId,
			type
		}; 

		getChecklistRecords(recordsFor);
		this.createChartDate();

	}

	componentWillUnmount() {
		this.props.cleanHistory();
	}

	createChartDate(dataValue = this.props.checklistRecords) {

		const dataForChart = false;
		
		let inputData = {
			dataValue,
			scale: '',
			frequency: '',
			dataForChart
		};
		
		this.setState({
			data: getItemHistory(inputData)
		});

	}

	renderEmptyList = () => {
		return(
			<InfoBox message={'No records yet.'}/>
		);
	}

	renderItem = ({item}) => {

		const { container, separator, separatorText, itemContainer, dateContainer, valueContainer, itemDate, itemValue } = styles;

		if(item.record) {
			return(
				<View style={container}>
					<View style={itemContainer}>
						<View style={dateContainer}>
							<Text style={itemDate}>{dataFormating(item.created_date_time_utc)}</Text>
						</View>
						<View style={valueContainer}>
							{/* <Text style={itemValue}>{recordValueFormating(item.record)}</Text> */}
							{recordValueFormating(item.record)}
						</View>
					</View>
				</View>
			);
		} else {
			return(
				<View style={container}>
					<View style={separator}>
						<Text style={separatorText}>{item.week}</Text>
					</View>
				</View>
			);
		}
		
	}

	render() {

		return(
			<View style={{flex: 1}}>
				<FlatList
					data={this.state.data}
					renderItem={this.renderItem}
					ListEmptyComponent={this.renderEmptyList}
					keyExtractor={(item, index) => index}
				/>

				{this.props.loadingRecords && <View style={styles.loadingContainer}>
					<ActivityIndicator size={'large'} color={colors.primaryGrey}/>
				</View>}
				
			</View>
		); 

	}

}
const styles = {
	container: {
		// alignItems: 'center',
		// borderBottomColor: 'rgba(0,0,0,0.1)',
		// borderBottomWidth: 1
	},
	separator: {
		height: 25,
		paddingHorizontal: 10,
		backgroundColor: 'rgba(57, 192, 111, .9)',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	itemContainer: {
		minHeight: 60,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: 'rgba(0,0,0,0.1)',
		borderBottomWidth: 1
	},
	dateContainer: {
		flex: .3,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	valueContainer: {
		flex: .7,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	itemDate: {
		fontSize: 16,
		color: colors.darkGrey,
		paddingHorizontal: 10
	},
	itemValue: {
		fontSize: 20,
		paddingVertical: 5
	},
	separatorText: {
		fontSize: 16,
		color: '#fff'
	},
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(255,255,255,1)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
};

const mapStateToProps = ({ trackers }) => {
	const { loadingRecords, error, checklistRecords } = trackers;
	return {
		loadingRecords,
		error,
		checklistRecords
	};
};

export default connect(mapStateToProps, {getChecklistRecords, cleanHistory})(TrendList);
