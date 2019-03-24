import React, {Component} from 'react';
import {View, Text, processColor, ActivityIndicator, Image, Dimensions} from 'react-native';
import { colors }from '../../actions/const';
import { connect } from 'react-redux';
import { getChecklistRecords, cleanHistory } from '../../actions';
import { getItemHistory, optimalAxisMin, optimalAxisMax } from './TrackItemHelper';
import TrendChartTabs from './TrendChartTabs';
import { LineChart } from 'react-native-charts-wrapper';


class TrendChart extends Component {

	constructor() {
		super();
		this.state = {
			type: 'Chart',
			scale: '1week',
			isEmpty: true,
			data: {},
			xAxis: {},
			yAxis: {},
			visibleRange: {},
			marker: {
				enabled: true,
				markerColor: processColor(colors.primaryBlue),
				textColor: processColor('white'),
				markerFontSize: 14
			}
		};

		this.dataSelect = this.dataSelect.bind(this);

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.checklistRecords !== this.props.checklistRecords) {
			this.createChartDate(nextProps.checklistRecords);
		}
	}

	componentDidMount() {	
		
		const { getChecklistRecords, itemId } = this.props;
		const { type, scale } = this.state;
	
		const recordsFor = {
			itemId,
			type,
			scale
		};

		getChecklistRecords(recordsFor);
		this.createChartDate(this.props.checklistRecords);

	}

	componentWillUnmount() {
		this.props.cleanHistory();
	}


	dataSelect(name) {

		const { getChecklistRecords, itemId } = this.props;
		const { type } = this.state;

		this.setState({
			scale: name
		});
		
		const recordsFor = {
			itemId,
			type,
			scale: name
		};

		getChecklistRecords(recordsFor);

	}

	createChartDate(dataValue = this.props.checklistRecords) {

		const { frequency } = this.props;
		const { scale } = this.state;
		const dataForChart = true;

		let frequencyKey = Object.keys(JSON.parse(frequency))[0];

		let inputData = {
			dataValue,
			scale,
			frequencyKey,
			dataForChart
		};

		let itemHistory = getItemHistory(inputData);

		let value = itemHistory['value'];
		let valuexAxis = itemHistory['xAxis'];
		let visibleRange = itemHistory['visibleRange'];
		let axisMaximum = itemHistory['axisMaximum'];
		
		if(value.length === 0) {
			return this.setState({isEmpty: true});
		}
		
		this.setState({
			isEmpty: false,
			data: itemHistory['data'],
			xAxis: {
				valueFormatter: valuexAxis,
				centerAxisLabels: false,
				position: 'BOTTOM',
				axisMinimum: -1,
				axisMaximum: axisMaximum,
				textSize: 11,
				labelCountForce: true,
				granularityEnabled: true,
				drawGridLines: false
			},
			yAxis: {
				left: {
					drawAxisLine: false,
					granularity: 1,
					granularityEnabled: true,
					labelCount: 15,
					axisMinimum: optimalAxisMin(value),
					axisMaximum: optimalAxisMax(value)
				}, 
				right: {
					enabled: false
				}
			},
			visibleRange: {
				x: {
					min: 0,
					max: visibleRange
				}
			},
			legend: {
				enabled: frequencyKey == 'daily' ? false : true
			}
		});

	}


	handleSelect(event) {
		let entry = event.nativeEvent;
		if (entry == null) {
			this.setState({...this.state, selectedEntry: null});
		} else {
			this.setState({...this.state, selectedEntry: JSON.stringify(entry)});
		}
	}

	renderChart() {

		if(!this.state.isEmpty) {
			return(
				<View>		
					<View style={styles.container}>
						<LineChart
							data={this.state.data}
							xAxis={this.state.xAxis}
							yAxis={this.state.yAxis}
							onSelect={this.handleSelect.bind(this)}
							visibleRange={this.state.visibleRange}
							chartDescription={{ text: '' }}
							legend={this.state.legend}
							marker={this.state.marker}
							highlights={this.state.highlights}
							style={styles.container}/>
					</View>
				</View>
			);
		} else {
			return(
				<View style={styles.trendContainer}>
					<Image
						source={require('../common/img/Chart-icon.png')}
						style={styles.imgStyle}
						resizeMode={'cover'}
					/>
					<Text style={{ color: colors.darkGrey, fontSize: 16 }}>No records yet...</Text>
				</View>
			);
		}

	}

	render() {
		
		// console.log(this.state.data.dataSets.values);
		return (
			<View style={{flex: 1}}>

				<TrendChartTabs onDataSelect={this.dataSelect}/>
				{this.renderChart()}

				{this.props.loading && <View style={styles.loadingContainer}>
					<ActivityIndicator size={'large'} color={colors.primaryGrey}/>
				</View>}

			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		height: Dimensions.get('window').height - 260,
		justifyContent: 'center',
		alignItems: 'stretch',
		backgroundColor: 'transparent'
	},
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(255,255,255,1)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	trendContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	},
	imgStyle: {
		flex: 1,
		width: 200,
		height: 200
	}
};

const mapStateToProps = ({ trackers }) => {
	const { loading, error, checklistRecords } = trackers;
	return {
		loading,
		error,
		checklistRecords
	};
};

export default connect(mapStateToProps, {getChecklistRecords, cleanHistory})(TrendChart);
