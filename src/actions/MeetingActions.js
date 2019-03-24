import {
	GET_MEETINGS,
	GET_MEETINGS_SUCCESS,
	CREATE_MEETING,
	CREATE_MEETING_SUCCESS,
	CREATE_MEETING_FAIL,
	GET_MEETINGS_CALENDAR,
	GET_MEETINGS_CALENDAR_SUCCESS,
	GET_MEETINGS_CALENDAR_FAIL,
	HANDLING_CC,
	HANDLING_CC_SUCCESS,
	CC_DISABEL,
	SHOW_TOAST
} from './types';
import { Actions } from 'react-native-router-flux';
import {
	HOST,
	getAuthParams
} from './const'; 
import { AsyncStorage, Alert, Linking, Platform } from 'react-native';
import { sendRequest, createOptions, createJson } from './http';
import moment from 'moment';

// tpm solution. for users that already installed the app but don't provide credit card info.
// const handleUrlPress = (dispatch, url) => {
// 	dispatch({ type: CC_DISABEL });
// 	Linking.openURL(url);
// };

// tpm solution. for users that already installed the app but don't provide credit card info.
export const connectCC = () => dispatch => {

	dispatch({ type: HANDLING_CC });

	return getAuthParams().then(({ token, userName, version }) => {
		const url = HOST + 'api/v2/mobile/telehealth/cc';

		const body = {
			token,
			userName,
			v: version
		};

		const ccOptions = createJson('PUT', body);

		return sendRequest(url, ccOptions).then(result => {

			if(result.status === 'success') {

				Linking.openURL(result.url);

				dispatch({ type: HANDLING_CC_SUCCESS });

			} else {
				dispatch({
					type: SHOW_TOAST,
					messageToast: {
						text: result.message,
						placeToShow: 'meetingCalendar'
					}
				});
			}	
		});
	});
	
};

export const getMeetings = () => dispatch => {
	
	dispatch({type: GET_MEETINGS });

	let currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
	let currentTimeToIOS = moment(currentTime).toISOString();

	return getAuthParams().then(({ token, userName, version }) => {
		
		const urlMeeting = HOST + 'api/v2/mobile/telehealth/meeting';
		const urlMeetingQuota = HOST + 'api/v2/mobile/telehealth/meeting/quota';

		const bodyMeeting = {
			token,
			userName,
			v: version
		};

		const bodyMeetingQuota = {
			token,
			userName,
			startDateTimeUTC: currentTimeToIOS,
			v: version
		};

		const meetingOprions = createJson('POST', bodyMeeting);
		const meetingQuotaOprions = createJson('POST', bodyMeetingQuota);

		const arrRequest = [
			sendRequest(urlMeeting, meetingOprions),
			sendRequest(urlMeetingQuota, meetingQuotaOprions)
		];

		return Promise.all(arrRequest).then(result => {

			let success = true;

			for (let i = 0; i < result.length; i++) {
				if (result[i].status !== 'success') {
					success = false;
				}
			}

			if(success) {

				dispatch({
					type: GET_MEETINGS_SUCCESS,
					meetings: {
						meetings: result[0].meetings,
						upcomingAppointment: getUpcomingAppointment(result[0].meetings),
						remainingAppointments: getRemainingAppointments(result[1].quota)
					}, 
					meetingsQuota: result[1].quota
				});

			} else {

				dispatch({
					type: SHOW_TOAST,
					messageToast: {
						text: result.message,
						placeToShow: 'meetingCalendar'
					}
				});

			}

		});

	});

};

export const getMeetingsCalendar = (duration, startDateTimeUTC, endDateTimeUTC) => dispatch => {
	
	dispatch({type: GET_MEETINGS_CALENDAR});

	return getAuthParams().then(({ token, userName, version }) => {

		const url = HOST + 'api/v2/mobile/telehealth/meeting/calendar';
		
		const body = {
			token,
			userName,
			startDateTimeUTC,
			endDateTimeUTC,
			v: version
		};

		const meetingOprions = createJson('POST', body);

		return sendRequest(url, meetingOprions).then(result => {

			if(result.status === 'success') {

				timeList(dispatch, result.busy, duration);

			} else {

				dispatch({type: GET_MEETINGS_CALENDAR_FAIL});

			}
			

		});

	});

};

export const createMeetings = (time, duration, startDateTimeUTC, endDateTimeUTC) => dispatch => {
	
	dispatch({type: CREATE_MEETING});
	
	return getAuthParams().then(({ token, userName, version }) => {

		const url = HOST + 'api/v2/mobile/telehealth/meeting';
		
		const body = {
			token,
			userName,
			startDateTimeUTC: time,
			durationMinutes: Number(duration),
			v: version
		};

		const meetingOprions = createJson('PUT', body);

		return sendRequest(url, meetingOprions).then(result => {

			if(result.status === 'success') {
				
				// dispatch(getMeetingsCalendar(startDateTimeUTC, endDateTimeUTC));
				dispatch({type: CREATE_MEETING_SUCCESS});
				Actions.meetingInfo({type: 'replace'});
				dispatch({
					type: SHOW_TOAST,
					messageToast: {
						type: 'success',
						text: result.message,
						placeToShow: 'meetingDay'
					}
				});
				

			} else {
				
				dispatch({type: CREATE_MEETING_FAIL}); 
				dispatch({
					type: SHOW_TOAST,
					messageToast: {
						type: 'error',
						text: result.message,
						placeToShow: 'meetingDay'
					}
				});

			}

		});

	});

};


const getUpcomingAppointment = ( meetings ) => {
	if(meetings.length === 0) 
		return 'No upcoming appointment';

	let nextAppointmentsArr = [];
	let currentDate = moment().format();

	for(let i = 0; i < meetings.length; i++) {
		let nextAppointment = moment(meetings[i].start_date_time_utc).format();
		if(moment(nextAppointment).isAfter(currentDate)) {

			nextAppointmentsArr.push({
				date: moment(meetings[i].start_date_time_utc).format('llll'),
				zoomUrl: JSON.parse(meetings[i].payload).conference.payload.start_url
			});
		}
	}
	
	if(nextAppointmentsArr.length === 0)
		return 'No upcoming appointment';

	nextAppointmentsArr.sort(((a, b) => {
		let aDate = new Date(a).getTime();
		let bDate = new Date(b).getTime();
		return aDate - bDate;
	}));
	
	return nextAppointmentsArr[0];

};

const getRemainingAppointments = (quota) => {

	let remainingAppointments = 0;
	Object.keys(quota).map((item) => {
		if(!quota[item].isDepleted) {
			remainingAppointments++;
		}
	});

	return remainingAppointments;
};

const timeList = (dispatch, time, duration) => {

	let durationMinutes = Number(duration);
	let dayS = moment('06:00', 'hh:mm');
	let dayE = moment('20:00', 'hh:mm');
	let periodsInADay = dayE.diff(dayS, 'minute');
	let dayTime = [];
	for(let i = 0; i <= periodsInADay; i += durationMinutes) {
		dayS.add(i === 0 ? 0 : durationMinutes, 'm');
		dayTime.push(dayS.format('hh:mm a'));
	}

	const busyTime = [];
	for(let i = 0; i < time.length; i++) {
		let originStartTime = moment(time[i].start).format('HH:mm');
		let originEndTime = moment(time[i].end).format('HH:mm');
		let a = moment(originStartTime, 'hh:mm');
		let b = moment(originEndTime, 'hh:mm');
		let periodsInADayCalendar = b.diff(a, 'minute');

		for(let j = 0; j <= periodsInADayCalendar; j += durationMinutes) {
			a.add(j === 0 ? 0 : durationMinutes, 'm');
			busyTime.push(a.format('hh:mm a'));
		}
	}
	
	for(let i = 0; i < dayTime.length; i++) {
		for(let j = 0; j < busyTime.length; j++) {
			if(dayTime[i] === busyTime[j]) {
				let index = dayTime.indexOf(busyTime[j]);
				dayTime.splice(index, 1);
			}
		}
	}

	let completeList = [];
	const spc = item => item.charAt(6);

	for(let i = 0; i < dayTime.length; i++) {
		let split = spc(dayTime[i]);
		if(i != 0) {
			if(spc(dayTime[i - 1]) != split ) {
				completeList.push('split');
			} 
		}
		completeList.push(dayTime[i]);
	}

	dispatch({type: GET_MEETINGS_CALENDAR_SUCCESS, busyTime: completeList});

};