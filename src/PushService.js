import NotificationsIOS, {NotificationsAndroid, PendingNotifications} from 'react-native-notifications';
import {AsyncStorage, Platform} from 'react-native';
import moment from 'moment';
import BackgroundJob from 'react-native-background-job';

export default class PushService {
	static init() {
		PushService.token = null;
		PushService.userOnNotificationOpened = null;
		if(Platform.OS === 'android') {
			NotificationsAndroid.setRegistrationTokenUpdateListener(PushService.onPushRegistered);
			NotificationsAndroid.setNotificationOpenedListener(PushService.onNotificationOpened);

			// Cancel previous job ('15mJob' - was here before 'localNotification'). krn633
			BackgroundJob.cancel({jobKey: '15mJob'});

			// BackgroundJob schedules reminder push notifications
			BackgroundJob.register({ jobKey: 'localNotification', job: runEvery15m	});
			BackgroundJob.schedule({ jobKey: 'localNotification', period: 15 * 60 * 1000 });
		}
	}

	static setOnNotificationOpenedCallback(onNotificationOpened) {
		PushService.userOnNotificationOpened = onNotificationOpened;
	}

	static configure() {
		if(Platform.OS === 'ios') {
			NotificationsIOS.addEventListener('remoteNotificationsRegistered', PushService.onPushRegistered);
			NotificationsIOS.addEventListener('notificationReceivedForeground', PushService.onNotificationOpened);
			NotificationsIOS.addEventListener('notificationOpened', PushService.onNotificationOpened);
			NotificationsIOS.requestPermissions();
		}
	}

	static unconfigure() {
		if(Platform.OS === 'ios') {
			NotificationsIOS.removeEventListener('remoteNotificationsRegistered', PushService.onPushRegistered);
			NotificationsIOS.removeEventListener('notificationReceivedForeground', PushService.onNotificationOpened);
			NotificationsIOS.removeEventListener('notificationOpened', PushService.onNotificationOpened);
		}
	}

	// Use this to read the notification when the app was freshly launched (from killed state)
	static readQueue() {
		if(Platform.OS === 'android') {
			PendingNotifications.getInitialNotification()
				.then(notification => {
					if(notification && PushService.userOnNotificationOpened) {
						PushService.userOnNotificationOpened(notification.getData());
					}
				})
				.catch(); // don't care if the app was not opened from a notification
		} else {
			NotificationsIOS.consumeBackgroundQueue();
		}
	}

	static onPushRegistered(token) {
		PushService.token = token;
	}

	static onNotificationOpened(notification) {
		if(PushService.userOnNotificationOpened) {
			if(Platform.OS === 'ios')
				// (data payload in remote notifications is extra-nested)
				PushService.userOnNotificationOpened(notification.getData().data || notification.getData());
			else
				PushService.userOnNotificationOpened(notification.getData());
		}
	}

	static enqueueReviewReminder() {
		if(Platform.OS === 'android') {
			AsyncStorage.setItem('reviewMeals', 'true');
		} else {
			NotificationsIOS.cancelAllLocalNotifications();
			NotificationsIOS.localNotification({
				// fireDate: moment().seconds(moment().seconds() + 15).toISOString(),			// set to 15s from now
				fireDate: moment().hours(21).minutes(0).seconds(0).toISOString(), 	// set to 9pm
				alertBody: 'Review your meals for the day',
				alertTitle: 'Reminder',
				alertAction: 'Click here to open',
				userInfo: { category: 'feedback' }
			});
		}

	}

	static dequeueReviewReminer() {
		if(Platform.OS == 'android') {
			AsyncStorage.setItem('reviewMeals', '');
		}
	}
}

const runEvery15m = () => {
	const now = moment();
	const inside_the_window = now.hours() == 21 && now.minutes() < 15;
	AsyncStorage.getItem('reviewMeals')
		.then(reviewMeals => {
			// const should_notify = true;
			// const should_notify = (reviewMeals.length > 0); // notify every time the background job runs (set by interval_s above) and at least one meal is ready for review
			const meals_to_review = reviewMeals && reviewMeals.length > 0;
			if(meals_to_review && inside_the_window) {
				NotificationsAndroid.localNotification({
					title: 'Reminder',
					body: 'Review your meals for the day',
					category: 'feedback'
				});
			}
		})
		.catch(); // don't check time to schedule notification
		// .catch(()=> console.warn('failed to get mealplanLength, not going to check time to see if should notify user to review'));
};
