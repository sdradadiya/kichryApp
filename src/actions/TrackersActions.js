import {
	GET_DAILY_CHECKLIST,
	GET_CHECKLIST_RECORDS,
	GET_DAILY_CHECKLIST_SUCCESS,
	GET_CHECKLIST_RECORDS_SUCCESS,
	GET_CHECKLIST_RECORDS_FAIL,
	GET_DAILY_CHECKLIST_FAIL,
	TRACK_CHECKLIST,
	TRACK_CHECKLIST_SUCCESS,
	TRACK_CHECKLIST_FAIL,
	SHOW_TOAST,
	CLEAN_CHECKLIST_RECORDS
} from './types';
import { Actions } from 'react-native-router-flux';
import { HOST, getAuthParams } from './const';
import { sendRequest, createJson } from './http';
import { manageNotification } from '../components/TrackerNotification';
import moment from 'moment';

const getUtcOffset = () => {
	return -1 * new Date().getTimezoneOffset() / 60;
};

export const cleanHistory = () => {
	return dispatch => dispatch({ type: CLEAN_CHECKLIST_RECORDS });
};

// get daily checklist
export const getDailyChecklist = (checklistDate) => {
	
	return dispatch => {
		
		dispatch({ type: GET_DAILY_CHECKLIST });

		const date = moment(checklistDate, 'MMDDYYYY').format('YYYY-MM-DD');
		// const dateOfMonday = moment(date).startOf('isoweek').format('YYYY-MM-DD');

		getAuthParams().then(({ token, userName, version }) => {
			
			const url = HOST + 'api/v2/mobile/checklist/day';

			const body = {
				token,
				userName,
				v: version,
				date
			};

			return sendRequest(url, createJson('POST', body)).then(result => {
				if(result.status == 'success') {
					dispatch({ type: GET_DAILY_CHECKLIST_SUCCESS, dailyChecklist: result.checklist.items });
					// dispatch({ type: GET_WEEKLY_CHECKLIST_SUCCESS, weeklyChecklist: result[1].checklist });
					if(Object.keys(result.checklist.items).length > 0) {
						manageNotification(result.checklist.items);
					}

				} else {

					if(result.status === 'fail') {
						dispatch({ type: GET_DAILY_CHECKLIST_FAIL, error: 'Something went wrong, please try again later'});
					}

				}
			});

		});

	};

};

export const getChecklistRecords = (recordsFor) => {

	return dispatch => {

		dispatch({ type: CLEAN_CHECKLIST_RECORDS });
		dispatch({ type: GET_CHECKLIST_RECORDS });
		
		getAuthParams().then(({ token, userName, version }) => {

			const url = HOST + 'api/v2/mobile/checklist/records';

			const body = {
				token,
				userName,
				v: version
			};

			if(recordsFor.type === 'List') {
				body['checkListItemId'] = recordsFor.itemId;
			}

			if(recordsFor.type === 'Chart') {

				let startDate;
				switch (recordsFor.scale) {
					case '1week':
						startDate = moment().subtract(1, 'week').calendar(null, { sameElse: 'YYYY-MM-DD' });	
						break;
					case '2weeks':
						startDate = moment().subtract(2, 'week').calendar(null, { sameElse: 'YYYY-MM-DD' });
						break;
					case '1month':
						startDate = moment().subtract(1, 'month').calendar(null, { sameElse: 'YYYY-MM-DD' });
						break;
					case '3months':
						startDate = moment().subtract(3, 'month').calendar(null, { sameElse: 'YYYY-MM-DD' });
						break;
					case 'year':
						startDate = moment().subtract(1, 'year').calendar(null, { sameElse: 'YYYY-MM-DD' });
						break;
					case 'All':
						startDate = '';
						break;
					default:
						break;
				}
				
				if( startDate != '' ) {
					body['startDate'] = startDate;
				}

				body['checkListItemId'] = recordsFor.itemId;

			}
			
			return sendRequest(url, createJson('POST', body)).then(result => {

				if(result.status == 'success') {
					dispatch({ type: GET_CHECKLIST_RECORDS_SUCCESS, checklistRecords: result.records });
				} else {
					dispatch({ type: GET_CHECKLIST_RECORDS_FAIL, error: 'Something went wrong, please try again later' });
				}

			});

		});

	};

};

// track daily checklist
export const trackDailyChecklist = (data, toastHelper) => {

	return (dispatch, getState) => {

		
		let checklist = Object.values(getState().trackers.dailyChecklist);

		dispatch({ type: TRACK_CHECKLIST });

		getAuthParams().then(({ token, userName, version }) => {
			
			const url = HOST + 'api/v2/mobile/checklist/day';

			const body = {
				token,
				userName,
				v: version,
				checkListItemId: data.checkListItemId,
				value: data.value,
				utcOffsetHours: getUtcOffset()
			};

			if(data.comment.length > 0) {
				body.comment = data.comment;
			}
			
			const referOptions = createJson('PUT', body);

			sendRequest(url, referOptions).then(result => {

				if(result.status === 'success') {
					
					dispatch({ type: TRACK_CHECKLIST_SUCCESS });

					Actions.main({ type: 'replace' });
					
					// stuff for toast 
					let itemsLeft;
					let itemsDone = 0;
					for(let i = 0; i < checklist.length; i++) {
						if(checklist[i].eligibleRecords.length !== 0) {
							itemsDone++;
						}
					}
					
					if(toastHelper.frequency === 'intradaily' && toastHelper.eligibleRecords.length > 0) {
						itemsLeft = checklist.length - itemsDone;
					} else {
						itemsLeft = checklist.length - (itemsDone === 0 ? 1 : itemsDone + 1);
					}

					let toastText = itemsLeft !== 0
						? `You have ${itemsLeft} more item(s) left to track today.` 
						: 'You are a real go getter! You tracked all items for today.';

					dispatch({
						type: SHOW_TOAST,
						messageToast: {
							text: toastText,
							placeToShow: 'trackDay'
						}
					});
					
				} else {
				
					dispatch({ type: TRACK_CHECKLIST_FAIL, error: 'Sorry, your request could not be processed' });

				}
				
			});
			
		});

	};

};
