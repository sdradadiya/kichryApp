import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { connectCC } from '../../actions';
import { colors } from '../../actions/const';
import { CalendarHeader }from './CalendarHeader';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { InfoBox } from '../common';
import moment from 'moment';
import Toast from 'react-native-easy-toast';

const DaySection = ({ title, subTitle, onPress }) => (
	<TouchableOpacity style={styles.dayContainer} onPress={onPress}> 
		<View style={styles.textContainer}>
			<Text style={styles.dayTitle}>{title}</Text>
			<Text style={styles.daySubtitle}>{subTitle}</Text>
		</View>
		<View style={styles.iconContainer}>
			<Icon name="ios-arrow-dropright-outline" size={30} color={'#1ca4fc'}/>
		</View>
	</TouchableOpacity>
);


const weekCalendarList = () => {
	
	var startOfWeek = moment();
	var endOfWeek = moment().add(6, 'days');

	let day = [];
	let arrDays = [];
	let todayDay = startOfWeek;

	while (todayDay <= endOfWeek) {
		arrDays.push(todayDay.toDate());
		todayDay = todayDay.clone().add(1, 'd');
	}

	for(let i = 0; i < arrDays.length; i++) {
		day.push({ 
			weekDay: moment(arrDays[i]).format('dddd'),
			data: moment(arrDays[i]).format('MMMM Do YYYY')
		});
	}
	return day;

};

class MeetingCalendar extends Component {

	constructor () {
		super();

		
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.messageToast !== this.props.messageToast && nextProps.messageToast && nextProps.messageToast.placeToShow === 'meetingCalendar') {
			this.refs.toast.show(nextProps.messageToast.text, 3000);
		}
	}

	componentDidMount() {

		// tpm solution. for users that already installed the app but don't provide credit card info.
		// if(this.props.needsPaymentSource) {
		// 	return this.props.connectCC();
		// }
		console.log(this.props);

	}

	selectDay(dayInfo) {

		const { duration } = this.props;

		Actions.meetingDay({dayInfo, duration});
	}

	renderDayList () {
		
		// const { loadingMeetings, meetings } = this.props;

		let day = weekCalendarList();

		// if(loadingMeetings) {
		// 	return(
		// 		<View style={styles.spinnerContainer}>
		// 			<ActivityIndicator color={colors.primaryGrey} size={'large'} />
		// 		</View>
		// 	);
		// }

		return (
			<View>
				{day.map((item, index) => {
					return (
						<DaySection
							key={index} 
							title={item.weekDay} 
							subTitle={item.data} 
							onPress={() => this.selectDay(item)} 
						/>
					);
				})}
			</View>
		);

	}

	render() {

		const { MainContainer, titleContainer, titleText } = styles;

		return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: '#fff'}}>
				<CalendarHeader title={'Meetings'} leftButtonPress={() => Actions.pop()}/>
				<ScrollView style={MainContainer}>
					<View style={titleContainer}>
						<Text style={titleText}>Select a day</Text>
					</View>
					{this.renderDayList()}
				</ScrollView>

				<Toast
					ref="toast"
					style={[styles.toastStyle]}
					position='top'
					positionValue={60}
					fadeInDuration={900}
					fadeOutDuration={900}
					opacity={.9}
					textStyle={styles.toastTitle}
				/>

			</SafeAreaView>
		);

	}

}

const styles = {
	MainContainer: {
		flex: 1,
		backgroundColor: '#fff'		
	},
	titleContainer: {
		width: '100%',
		height: 80,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderBottomColor: 'rgba(102,106,114, .5)',
		borderBottomWidth: 1 
	},
	titleText: {
		fontSize: 18,
		color: '#666a72'
	},
	dayContainer: {
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: 'rgba(102,106,114, .5)',
		borderBottomWidth: 1 
	},
	textContainer: {
		// flex: 0.9,
		paddingLeft: 10
	},
	dayTitle: {
		fontSize: 18,
		color: '#666a72'
	},
	daySubtitle: {
		fontSize: 16,
		color: '#a8a8a8'	
	},
	iconContainer: {
		// flex: 0.1,
		paddingRight: 10
	},
	spinnerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		margin: 20
	},
	toastStyle: {
		backgroundColor: 'red',
		width: '100%',
		borderRadius: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
};

const mapStateToProps = (state) => {

	const { 
		main: { messageToast },
		meetingCalendar: {error, loadingMeetings, meetings, cc},
		clientPermissions: { needsPaymentSource }
	} = state;

	return { error, loadingMeetings, meetings, messageToast, cc, needsPaymentSource};
};

export default connect(mapStateToProps, { connectCC })(MeetingCalendar);