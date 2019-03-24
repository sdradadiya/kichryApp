import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { createMeetings, getMeetingsCalendar } from '../../actions';
import { colors } from '../../actions/const';
import { CalendarHeader }from './CalendarHeader';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-easy-toast';

const TimeButton = ({time, onPress}) => (
	<TouchableOpacity style={styles.button} onPress={onPress}>
		<Text style={styles.buttonText}>{time}</Text>
	</TouchableOpacity>
);

const Layout = () => (
	<View style={styles.layout}>
		<View style={styles.layoutLine}></View>
		<Text style={styles.layoutText}>NOON</Text>
		<View style={styles.layoutLine}></View>
	</View>
);

const currentDayRange = (dayInfo) => {
	
	let startDate = moment(dayInfo.data, 'MMMM Do YYYY').format('YYYY-MM-DDT09:00:00');
	let endDate = moment(dayInfo.data, 'MMMM Do YYYY').format('YYYY-MM-DDT21:00:00');

	let startDateTimeUTC = moment(startDate).toISOString();
	let endDateTimeUTC = moment(endDate).toISOString();

	return {
		start: startDateTimeUTC,
		end: endDateTimeUTC
	};

};

class MeetingDay extends Component {

	constructor () {
		super();

		this.state = {
			confirmSection: false,
			selectedTime: '',
			toastType: ''
		};

	}

	componentDidMount() {

		const { dayInfo, duration } = this.props;

		let dayRange = currentDayRange(dayInfo);

		this.props.getMeetingsCalendar(duration, dayRange.start, dayRange.end);

	}

	componentWillReceiveProps (nextProps) {

		if(nextProps.messageToast !== this.props.messageToast && nextProps.messageToast && nextProps.messageToast.placeToShow === 'meetingDay') {
			
			if(nextProps.messageToast.type === 'error') {
				this.setState({
					toastType: nextProps.messageToast.type,
					confirmSection: false,
					selectedTime: ''
				}, () => {
					this.refs.toast.show(nextProps.messageToast.text, 3000);
				});	
			}

			if(nextProps.messageToast.type === 'success') {
				this.refs.toast.show(nextProps.messageToast.text, 3000);
			}
			
		}
	}

	cancelSelectedTime() {
		this.setState({
			confirmSection: false
		});
	}

	confirmSelectedTime(time) {

		const { dayInfo, duration } = this.props;

		let trtime = moment(time, 'hh:mm A').format('HH:mm:ss');
		let dayRange = currentDayRange(dayInfo);
	
		let selectedTime = moment(dayInfo.data, 'MMMM Do YYYY').format('YYYY-MM-DDT' + trtime);
		let isoTime = moment(selectedTime).toISOString();

		//dayRange props is to call getMeetingsCalendar from createMeeting method in actions
		this.props.createMeetings(isoTime, duration, dayRange.start, dayRange.end);

		this.setState({
			confirmSection: false
		});
	}

	confirmButtonStatus() {
		if(this.props.confirmButtonStatus) {
			return(
				<ActivityIndicator color={'#fff'} size={'small'} />
			);
		}
		return(
			<Text style={[styles.buttonText, {color: '#fff'}]}>Confirm</Text>
		);
	}

	renderConfirmSection () {
		
		const { confirmConteiner, confirmButton, buttonText } = styles;
		const { confirmSection, selectedTime } = this.state;
		
		if(confirmSection) {
			return (
				<View style={confirmConteiner}>
					<TouchableOpacity
						onPress={() => this.cancelSelectedTime()}
						style={[confirmButton, {backgroundColor: '#666a72', borderColor: '#666a72'}]}
					>
						<Text style={[buttonText, {color: '#fff'}]}>{selectedTime}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.confirmSelectedTime(selectedTime)}
						style={[confirmButton, {backgroundColor: '#1ca4fc', borderColor: '#1ca4fc'}]}
					>
						{this.confirmButtonStatus()}
					</TouchableOpacity>
				</View>
			);
		}

	}

	selectTime(item) {
		this.setState({
			confirmSection: true,
			selectedTime: item
		});
	}
    
	renderTimeButtons () {

		const { loadingMeetingDay } = this.props;
		
		let time = this.props.busyTime;

		if(loadingMeetingDay) {
			return(
				<View style={styles.spinnerContainer}>
					<ActivityIndicator color={colors.primaryGrey} size={'large'} />
				</View>
			);
		}

		return(
			<View>
				{time.map((item, index) => {
					if(item === 'split') {
						return(
							<Layout key={index} />
						);
					} else {
						return(
							<TimeButton key={index} time={item} onPress={() => this.selectTime(item)}/>
						);
					}
					
				})}
			</View>
		);

	}

	render() {

		const { MainContainer, titleContainer, titleText } = styles;
		const { toastType } = this.state;

		let toastColor = toastType === 'error' ? {backgroundColor: 'red'} : {backgroundColor: 'green'};

		return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: '#fff'}}>
				<CalendarHeader title={this.props.dayInfo.weekDay} subTitle={this.props.dayInfo.data} leftButtonPress={() => Actions.pop()}/>
				<View style={titleContainer}>
					<Text style={titleText}>Select a Time</Text>
					{this.renderConfirmSection()}
				</View>
				<ScrollView style={MainContainer}>
					{this.renderTimeButtons()}
				</ScrollView>

				<Toast
					ref="toast"
					style={[styles.toastStyle, toastColor]}
					position='top'
					positionValue={80}
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
		flexDirection: 'column',
		borderBottomColor: 'rgba(102,106,114, .5)',
		borderBottomWidth: 1 
	},
	titleText: {
		fontSize: 18,
		color: '#666a72'
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginHorizontal: 10,
		marginVertical: 5,
		height: 40,
		borderColor: '#1ca4fc',
		borderWidth: 1,
		borderRadius: 5
	},
	buttonText: {
		color: '#1ca4fc'
	},
	layout: {
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginHorizontal: 10,
		marginVertical: 5,
		height: 40	
	},
	layoutLine: {
		borderColor: '#666a72',
		borderWidth: .5,
		width: '40%'
	},
	layoutText: {
		color: '#666a72'
	},
	confirmConteiner: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row'
	}, 
	confirmButton: {
		flex: .5,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginHorizontal: 10,
		marginVertical: 5,
		height: 40,
		borderWidth: 1,
		borderRadius: 5
	},
	toastStyle: {
		width: '100%',
		borderRadius: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	spinnerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		margin: 20
	}
};

const mapStateToProps = (state) => {
	const { 
		main: { messageToast }, 
		meetingCalendar: { loadingMeetingDay, error, confirmButtonStatus, busyTime }
	} = state;
	return { messageToast, loadingMeetingDay, error, confirmButtonStatus, busyTime };
};

export default connect(mapStateToProps, { createMeetings, getMeetingsCalendar })(MeetingDay);