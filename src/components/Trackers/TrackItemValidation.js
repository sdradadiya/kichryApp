import moment from 'moment';

/*
	B Breakfast: 7 - 10
	M Morning Snack: 10 - 12
	L Lunch: 12 - 14
	E Evening Snack: 14 - 17
	D Dinner: 17 - 23   
*/

export const validateItem = (item, isCompleted, data_type, value, todayDate) => {

	if(isCompleted) {
		return 'this record is already updated';
	}

	if(moment().format('l') !== todayDate) {
		return 'you can only record the current day';
	}

	// if ( JSON.parse(item.item.frequency).intradaily ) {

	// 	let currentHour = new Date().getHours();
	// 	let recordItems = item.eligibleRecords;
	// 	let range = JSON.parse(item.item.frequency).intradaily;

	// 	console.log('currentHours: ', currentHour);
	// 	console.log('recordItems: ', recordItems);
	// 	console.log('range: ', range);

	// 	let dietitianRangeArr = [];
	// 	let recordedRange = [];
	// 	let currentHourRange; 

	// 	// convert the current time to Kitchry range
	// 	if(currentHour >= 7 && currentHour < 10) {
	// 		currentHourRange = 'B';
	// 	} else if(currentHour >= 10 && currentHour <= 12) {
	// 		currentHourRange = 'M';
	// 	} else if(currentHour > 12 && currentHour <= 14) {
	// 		currentHourRange = 'L';
	// 	} else if(currentHour > 14 && currentHour <= 16) {
	// 		currentHourRange = 'E';
	// 	} else if(currentHour >= 17) {
	// 		currentHourRange = 'D';
	// 	}

	// 	// convert the dietitianRange to Kitchry range
	// 	for(let i = 0; i < range.length; i++) {
	// 		let t = Number(range[i].timestamp.split(':')[0]);
	// 		if(t >= 7 && t < 10) {
	// 			dietitianRangeArr.push('B');
	// 		} else if(t >= 10 && t <= 12) {
	// 			dietitianRangeArr.push('M');
	// 		} else if(t > 12 && t <= 14) {
	// 			dietitianRangeArr.push('L');
	// 		} else if(t > 14 && t <= 16) {
	// 			dietitianRangeArr.push('E');
	// 		} else if(t >= 17) {
	// 			dietitianRangeArr.push('D');
	// 		}
	// 	}

	// 	// convert the recorded items to Kitchry range
	// 	for(let i = 0; i < recordItems.length; i++) {
	// 		let get_t = (recordItems[i].created_date_time_utc.split(':')[0]); 

	// let t = moment(dataValueF[i].created_date_time_utc).hour(); // !!!!!

	// 		let t = Number(get_t.substr(get_t.length - 2));
	// 		if(t >= 7 && t < 10) {
	// 			recordedRange.push('B');
	// 		} else if(t >= 10 && t <= 12) {
	// 			recordedRange.push('M');
	// 		} else if(t > 12 && t <= 14) {
	// 			recordedRange.push('L');
	// 		} else if(t > 14 && t <= 16) {
	// 			recordedRange.push('E');
	// 		} else if(t >= 17) {
	// 			recordedRange.push('D');
	// 		}
	// 	}

	// }

	if(data_type === 'float') {

		if (value.length <= 0) {
			return 'value is required';
		}
		if (/[0-9]/.test(value) === false) {
			return 'value should contain numbers';
		}

	}

	if(data_type === 'str' || data_type === 'bool') {
		if (value.length <= 0) {
			return 'value is required';
		}
	}

};