import React, {Component} from 'react';
import moment from 'moment/moment';
import {PushNotificationIOS, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

export const manageNotification = (data) => {
	if(Platform.OS == 'ios') {
		PushNotificationIOS.cancelAllLocalNotifications();
	}else{
		PushNotification.cancelAllLocalNotifications();
	}
	let key = Object.keys(data);
	for(let k = 0; k < key.length; k++) {
		if (data[key[k]].item.is_remind) {
			let title = 'Reminder';
			let body = data[key[k]].item.title;
			if (JSON.parse(data[key[k]].item.frequency).daily) {
				//Set Reminder For Daily
				let d = JSON.parse(data[key[k]].item.frequency);
				if (Platform.OS === 'ios') {
					if ((new Date().getHours() === (Number((d.daily[0].timestamp.split(':')[0])) - 1) && new Date().getMinutes() >= 45 && new Date().getSeconds() > 0) ||
                        (new Date().getHours() > (Number((d.daily[0].timestamp.split(':')[0])) - 1))) {
						notifictionForIOS(Number((d.daily[0].timestamp.split(':')[0])) - 1, title, body, true);
					} else {
						notifictionForIOS(Number((d.daily[0].timestamp.split(':')[0])) - 1, title, body, false);
					}
				} else if (Platform.OS === 'android') {
					let date = new Date();
					if (new Date().getHours() >= (Number((d.daily[0].timestamp.split(':')[0])) - 1) && new Date().getMinutes() >= 45 && new Date().getSeconds() > 0) {
						date = moment().add(1, 'days').toDate();
					}
					date.setHours(Number((d.daily[0].timestamp.split(':')[0])) - 1);
					date.setMinutes(45);
					date.setSeconds(0);

					PushNotification.localNotificationSchedule({
						date: date,
						foreground: true,
						title: title,
						message: body,
						repeatType: 'day'
					});
				}
			} else {
				//Set Reminder For Intradaily
				let d = JSON.parse(data[key[k]].item.frequency);
				if (Platform.OS === 'ios') {
					for (let i = 0; i < Object.keys(d.intradaily).length; i++) {
						if ((new Date().getHours() === (Number((d.intradaily[i].timestamp.split(':')[0])) - 1) && new Date().getMinutes() >= 45 && new Date().getSeconds() > 0) ||
                            (new Date().getHours() > (Number((d.intradaily[i].timestamp.split(':')[0])) - 1))) {

							notifictionForIOS(Number((d.intradaily[i].timestamp.split(':')[0])) - 1, title, body, true);

						} else {
							notifictionForIOS(Number((d.intradaily[i].timestamp.split(':')[0])) - 1, title, body, false);
						}
					}
				} else if (Platform.OS === 'android') {
					for (let i = 0; i < Object.keys(d.intradaily).length; i++) {
						let date = new Date();
						if ((new Date().getHours() >= (Number((d.intradaily[i].timestamp.split(':')[0])) - 1) && new Date().getMinutes() >= 45 && new Date().getSeconds() > 0) ||
                            (new Date().getHours() > (Number((d.intradaily[i].timestamp.split(':')[0])) - 1))) {
							//if time passed
							date = moment().add(1, 'days').toDate();
						}
						date.setHours(Number((d.intradaily[i].timestamp.split(':')[0])) - 1);
						date.setMinutes(45);
						date.setSeconds(0);
						notifictionForAndroid(date, title, body);
					}
				}
			}
		}
	}
};


export const notifictionForIOS = (hours, title, body, set) => {

	if (set) {
		let date = moment().toDate();
		for (let i = 1; i < 8; i++) {
			date = moment().add(i, 'days').toDate();
			date.setHours(hours);
			date.setMinutes(45);
			date.setSeconds(0);
			PushNotificationIOS.scheduleLocalNotification({
				fireDate: date,
				alertBody: body,
				alertTitle: title
			});
		}

	} else {
		let date1 = moment().toDate();
		for (let i = 1; i < 8; i++) {
			date1.setHours(hours);
			date1.setMinutes(45);
			date1.setSeconds(0);
			PushNotificationIOS.scheduleLocalNotification({
				fireDate: date1,
				alertBody: body,
				alertTitle: title
			});
			date1 = moment().add(i, 'days').toDate();
		}
	}
};

export const notifictionForAndroid = (date, title, body) => {
	PushNotification.localNotificationSchedule({
		date: date,
		foreground: true,
		title: title,
		message: body,
		repeatType: 'day'
	});
};
