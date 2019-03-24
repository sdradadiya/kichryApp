import moment from 'moment';
import { processColor } from 'react-native';
import { colors }from '../../actions/const';
import { parseRecordTime } from '../../actions/const';
import { fromJS } from 'immutable';

export const dateFormating = ( todayDate, item ) => {

	if(item.isCompleted) {
		for(let i = 0; i < item.eligibleRecords.length; i++) {
			let recordDate = moment(item.eligibleRecords[i].created_date_time_utc).format('l');
			if(recordDate === todayDate) {
				return moment(item.eligibleRecords[i].created_date_time_utc).format('dddd, MMM Do, h:mm A');
			}
		}
	} else {
		const time = parseRecordTime(new Date());
		return moment(todayDate, 'MMDDYYYY').format('dddd, MMM Do, ') + time;
	}

};

export const getLastTrack = (item, todayDate) => {

	for(let i = 0; i < item.eligibleRecords.length; i++) {
		let recordDate = moment(item.eligibleRecords[i].created_date_time_utc).format('l');
		if(recordDate === todayDate) {
			return(JSON.parse(item.eligibleRecords[i].record).value.toString());
		}
	}

};

export const getLastComment = (item, todayDate) => {

	for(let i = 0; i < item.eligibleRecords.length; i++) {
		let recordDate = moment(item.eligibleRecords[i].created_date_time_utc).format('l');
		if(recordDate === todayDate) {
			let comment = JSON.parse(item.eligibleRecords[i].record).comment;
			if(comment)
				return comment;
			else 
				return '';
		}
	}

};

export const getFrequency = ({item}) => {

	let frequency = JSON.parse(item.frequency);

	return Object.keys(frequency)[0];

};

const scaleFormating = (dataValue, scale) => {
	
	let momentCalendar;
	let visibleRange;
	let axisMaximum;

	switch (scale) {
		case '1week':
			momentCalendar = {
				sameDay: '[Today]',
				lastDay: '[Yesterday]',
				lastWeek: 'ddd',
				sameElse: 'M/D'
			};
			visibleRange = 7;
			axisMaximum = dataValue.length !== 7 ? 7 : dataValue.length;
			break;
		case '2weeks':	
			momentCalendar = {
				sameDay: '[Today]',
				lastDay: '[Yesterday]',
				lastWeek: 'ddd',	
				sameElse: 'M/D'
			};
			visibleRange = 14;
			axisMaximum = dataValue.length !== 14 ? 14 : dataValue.length;
			break;
		case '1month':
			momentCalendar = {
				sameDay: 'M/D',
				lastDay: 'M/D',
				lastWeek: 'M/D',	
				sameElse: 'M/D'
			};
			visibleRange = 31;
			axisMaximum = dataValue.length !== 31 ? 31 : dataValue.length;
			break;
		case '3months':
			momentCalendar = {
				sameDay: 'MMM D',
				lastDay: 'MMM D',
				lastWeek: 'MMM D',
				sameElse: 'MMM D'
			};
			visibleRange = 31 * 3;
			axisMaximum = dataValue.length !== 31 * 3 ? 31 * 3 : dataValue.length;
			break;
		case 'year':
			momentCalendar = {
				sameDay: 'M/D',
				lastDay: 'M/D',
				lastWeek: 'M/D',
				sameElse: 'M/D'
			};
			visibleRange = 365;
			axisMaximum = dataValue.length;
			break;
		case 'All':
			momentCalendar = {
				sameDay: 'M/D',
				lastDay: 'M/D',
				lastWeek: 'M/D',
				sameElse: 'M/D'
			};
			visibleRange = dataValue.length;
			axisMaximum = dataValue.length;
			break;
		default:
			momentCalendar = {
				sameDay: '[Today]',
				lastDay: '[Yesterday]',
				lastWeek: 'ddd',
				sameElse: 'M/D'
			};
			visibleRange = 7;
			axisMaximum = dataValue.length;
			break;
	}

	let formaredScale = {
		momentCalendar,
		visibleRange,
		axisMaximum
	};

	return formaredScale;

};

export const getItemHistory = (inputData) => {
	
	const { dataValue, scale, frequencyKey, dataForChart } = inputData;

	if(dataForChart) {
		
		let data = {dataSets: []};
		let xAxis = [];
		let value = [];
		let averageLine = [];
		let valueSum = 0;

		// create data for the chart with daily frequency
		if(frequencyKey === 'daily') {

			// fill xAxis and value arrays
			for(let i = 0; i < dataValue.length; i++) {
				let recordedDate = moment(dataValue[i].created_date_time_utc).calendar(null, scaleFormating(dataValue, scale).momentCalendar);
				let recordedValue = JSON.parse(dataValue[i].record).value;
				xAxis.push(recordedDate);
				value.push(recordedValue);
			}
			
			// sum of all values of the value array. (needed for avarageLine)
			for(let i = 0; i < value.length; i++) {
				valueSum += value[i];
			}

			// fill avarageLine
			for(let i = 0; i < value.length; i++) {
				averageLine.push(Math.round(valueSum / value.length));
			}

			// create chart lines. 
			data.dataSets.push({
				values: value,
				label: '',
				config: {
					colors: [processColor(colors.primaryGreen)],
					circleColor: processColor(colors.primaryGreen),
					drawCircles: true,
					drawValues: false,
					circleRadius: 4,
					lineWidth: 2
				}
			}, {
				values: averageLine,
				label: '',
				config: {
					colors: [processColor(colors.primaryGreen)],
					circleColor: processColor(colors.primaryGreen),
					drawCircles: false,
					drawValues: false,
					lineWidth: 1,
					dashedLine: {
						lineLength: 10,
						spaceLength: 10
					}
				}
			});

			let hisrotyObj = {
				data: data,
				xAxis: xAxis,
				value: value,
				visibleRange: scaleFormating(dataValue, scale).visibleRange,
				axisMaximum: scaleFormating(dataValue, scale).axisMaximum
			};

			return hisrotyObj;

		// create data for the chart with intradaily frequency
		} else {

			let B = {label: 'Breakfast', color: '#41bf72', values: []};
			let M = {label: 'Morning Snack', color: '#4943be', values: []};
			let L = {label: 'Lunch', color: '#be43a3', values: []};
			let E = {label: 'Evening Snack', color: '#be7a43', values: []};
			let D = {label: 'Dinner', color: '#bdbe43', values: []};
			let data = {dataSets: []};
			let xAxis = [];
			let value = [];
			let displayData = [B, M, L, E, D];

			for(let i = 0; i < dataValue.length; i++) {

				let recordedTime = moment(dataValue[i].created_date_time_utc).format('l');
				
				if(i == 0 || moment(dataValue[i - 1].created_date_time_utc).format('l') !== recordedTime) {
					let recordedDate = moment(dataValue[i].created_date_time_utc).calendar(null, scaleFormating(dataValue, scale).momentCalendar);
					xAxis.push(recordedDate);				
				}

				let t = moment(dataValue[i].created_date_time_utc).hour();
				let recordedValue = JSON.parse(dataValue[i].record).value;
				
				if(t >= 7 && t < 10) {
					B.values.push(recordedValue);
				} else if(t >= 10 && t <= 12) {
					M.values.push(recordedValue);
				} else if(t > 12 && t <= 14) {
					L.values.push(recordedValue);
				} else if(t > 14 && t <= 16) {
					E.values.push(recordedValue);
				} else if(t >= 17) {
					D.values.push(recordedValue);
				}

			}
			
			for(let i = 0; i < displayData.length; i++) {
				for(let j = 0; j < displayData[i].values.length; j++) {
					value.push(displayData[i].values[j]);
				}

				// 'if' statement to prevent pushing empty data 
				if(displayData[i].values.length != 0) {
					data.dataSets.push({
						values: displayData[i].values,
						label: displayData[i].label,
						config: {
							colors: [processColor(displayData[i].color)],
							circleColor: processColor(displayData[i].color),
							drawCircles: true,
							drawValues: false,
							circleRadius: 4,
							lineWidth: 2
						}
					});
				}			
			}

			let hisrotyObj = {
				data: data,
				xAxis: xAxis,
				value: value,
				visibleRange: scaleFormating(dataValue, scale).visibleRange,
				axisMaximum: scaleFormating(dataValue, scale).axisMaximum
			};
	
			return hisrotyObj;

		}

	} else {

		let value = [];

		for(let i = 0; i < dataValue.length; i++) {
					
			let record = fromJS(dataValue[i]);
			let clearRecord = record.deleteAll(['checklist_item_id', 'id', 'is_active', 'last_modified_date_time_utc']);					
			let updatedRecord = clearRecord
				.update('record', val => JSON.parse(val).value.toString());

			value.push(updatedRecord.toJS());
					
		}

		let endValue = value.reverse();

		for(let i = endValue.length - 1; i >= 0; i--) {
			let currentWeek = moment().week();
			let recordedWeek = moment(endValue[i].created_date_time_utc).week();
			let weekDif = currentWeek - recordedWeek;

			if(endValue[i].record) {
				if(i == 0 || moment(endValue[i - 1].created_date_time_utc).week() != recordedWeek) {
					let weekStartDay = moment().subtract(weekDif, 'weeks').startOf('isoWeek').format('MMM D');
					let weekEndDay = moment().subtract(weekDif, 'weeks').endOf('isoWeek').format('D');
					if(weekDif === 0) {
						endValue.splice(i, 0, {week: 'This Week'});
					} else if (weekDif === 1) {
						endValue.splice(i, 0, {week: 'Last Week'});
					} else {
						endValue.splice(i, 0, {week: `${weekStartDay} - ${weekEndDay}`});
					}
				}
			}
		}
	
		return endValue;

	}

};

export const optimalAxisMin = (value) => {

	let minValue = Math.round(Math.min(...value));
	let maxValue = Math.round(Math.max(...value));
	let valueDif = maxValue - minValue; 
	
	let optimalAxisMin = minValue - valueDif;

	if(value.length == 1) {
		return 0;
	}

	if(optimalAxisMin <= 0) {
		return 0;
	}

	if(optimalAxisMin > 0) {
		return optimalAxisMin;
	}

};

export const optimalAxisMax = (value) => {
	
	let minValue = Math.round(Math.min(...value));
	let maxValue = Math.round(Math.max(...value));
	let valueDif = maxValue - minValue; 
	let optimalAxisMax = maxValue + valueDif;

	if(value.length == 1) {
		return maxValue + (maxValue / 2);
	}

	return optimalAxisMax;

};


// const itemId = item.item.id;

// const itemHistory = [];

// for(let key in weeklyChecklist) {
// 	if(Object.keys(weeklyChecklist[key].items).length > 0) {
// 		for(let key2 in weeklyChecklist[key].items) {
// 			if(weeklyChecklist[key].items[key2].item.id === itemId) {
// 				if(weeklyChecklist[key].items[key2].eligibleRecords.length > 0) {
// 					for(let i = 0; i < weeklyChecklist[key].items[key2].eligibleRecords.length; i++) {
// 						let recordedValue = JSON.parse(weeklyChecklist[key].items[key2].eligibleRecords[i].record);
// 						let obj = {};
// 						obj[key] = recordedValue.value;
// 						itemHistory.push(obj);
// 					}
// 				}
// 			}
// 		}
// 	}
// }
// return itemHistory;

//////=======///////

// export const getDateArray = (startDay) => {


// 	let start = moment(startDay);
// 	let end = moment(startDay).add(-30, 'days');
	
// 	let arrOfDays = [];
// 	let day = start;

// 	while (day >= end) {
// 		arrOfDays.push(day.format('l'));
// 		day = day.clone().add(-1, 'd');
// 	}

// 	return arrOfDays;

// };