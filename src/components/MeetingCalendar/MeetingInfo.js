import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { colors, textStyles } from '../../actions/const';
import { getMeetings, connectCC } from '../../actions';
import { CalendarHeader }from './CalendarHeader';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';


const Button = ({ value, onPress }) => (
	<TouchableOpacity style={styles.button} onPress={onPress}>
		<Text style={styles.buttonText}>{`Schedule ${value} min appointment`}</Text>
	</TouchableOpacity>
);

class MeetingInfo extends Component {
    
	constructor() {
		super();
		
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.messageToast !== this.props.messageToast && nextProps.messageToast && nextProps.messageToast.placeToShow === 'meetingCalendar') {
			this.refs.toast.show(nextProps.messageToast.text, 3000);
		}
	}

	componentDidMount() {
		console.log(this.props);
		if(this.props.hasTelehealth) {
			this.props.getMeetings();
		}
		
	}

	handlePurchaseRequest(price) {
		console.log(price);
	}

	scheduleAppointment(item, itemObj) {
		if(!itemObj.isDepleted) {

			Actions.meetingCalendar({ duration: item });

		} else {
			
			let price = typeof itemObj.priceUSD === 'object' ? itemObj.priceUSD.price : itemObj.priceUSD;

			Alert.alert('Some text', `${item} min for ${price} USD`, [
				{text: 'Cancel'},
				{text: 'Buy', onPress: () => this.handlePurchaseRequest(price)}
			]);

		}
	}

	renderAvailableScheduleButtons() {
		
		const { meetingsQuota } = this.props; 
		
		return(
			<View>
				{
					Object.keys(meetingsQuota).map((item, index) => {
						if(!meetingsQuota[item].isDepleted) {
							return <Button key={index} value={item} onPress={() => this.scheduleAppointment(item, meetingsQuota[item])}/>;
						}
					})
				}				
			</View>
		);

	}

	renderAbbitionalScheduleButtons() {

		const { meetingsQuota } = this.props; 

		return(
			<View>
				{
					Object.keys(meetingsQuota).map((item, index) => {
						if(meetingsQuota[item].isDepleted) {
							return <Button key={index} value={item} onPress={() => this.scheduleAppointment(item, meetingsQuota[item])}/>;
						}
					})
				}				
			</View>
		);
	}

	renderAppointmentInfo() {
		
		const { packageInfoContainer, spinnerContainer, upcomingAppointmentsContainer, upcomingAppointmentsValue, innerUpcoming } = styles;
		const { loading, doctorName, meetings } = this.props;
		// console.log(this.props.meetings);
		if(loading)
			return(
				<View style={spinnerContainer}>
					<ActivityIndicator color={colors.primaryGrey} size={'large'} />
				</View>
			);

		return(
			<View>

				<View style={packageInfoContainer}>
					<Text style={textStyles.description14Regular}>{`Your package includes 2 meetings per month with ${doctorName}`}</Text>
				</View>

				<View style={upcomingAppointmentsContainer}>
					<Text style={textStyles.l3Text}>Upcoming Appointment</Text>
					<View style={innerUpcoming}>
						<Text style={[textStyles.description16, upcomingAppointmentsValue]}>{meetings.upcomingAppointment.date}</Text>
						<TouchableOpacity onPress={() => Linking.openURL(meetings.upcomingAppointment.zoomUrl)}>
							<Text style={[textStyles.description16, upcomingAppointmentsValue]}>Link</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={upcomingAppointmentsContainer}>
					<Text style={textStyles.l3Text}>Remaining Appointments</Text>
					<Text style={[textStyles.description16, upcomingAppointmentsValue]}>{meetings.remainingAppointments}</Text>
				</View>

				{this.renderAvailableScheduleButtons()}
				
				<View style={upcomingAppointmentsContainer}>
					<Text style={textStyles.l3Text}>Buy Appointments</Text>
				</View>

				{this.renderAbbitionalScheduleButtons()}

			</View>
		);

	}

	addCreditCard() {
		this.props.connectCC();
	}

	renderNoTelehealthCase() {

		if(this.props.loadingCC)
			return(
				<View style={styles.spinnerContainer}>
					<ActivityIndicator color={colors.primaryGrey} size={'large'} />
				</View>
			);

		return(
			<View>
				<View style={styles.packageInfoContainer}>
					<Text style={textStyles.description14}>The Appointments is required your credit card information</Text>
				</View>
				<TouchableOpacity style={[styles.button, { backgroundColor: colors.primaryGreen, borderColor: colors.primaryGreen}]} onPress={() => this.addCreditCard()}>
					<Text style={styles.buttonText}>+ Add Card</Text>
				</TouchableOpacity>
			</View>
		);

	}

	renderContent() {
		
		if(this.props.hasTelehealth) {
			return this.renderAppointmentInfo();
		} else {
			return this.renderNoTelehealthCase();
		}

	}

	render() {

		const { MainContainer } = styles;

		return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: '#fff'}}>
				<CalendarHeader title={'Appointments'} leftButtonPress={() => Actions.pop()}/>
				<ScrollView style={MainContainer}>
					{this.renderContent()}
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
	packageInfoContainer: {
		paddingVertical: 10,
		paddingHorizontal: 10
	},
	upcomingAppointmentsContainer: {
		paddingVertical: 10,
		paddingHorizontal: 10
	},
	innerUpcoming: {
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	upcomingAppointmentsValue: {
		marginTop: 10,
		marginLeft: 10	
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
	},
	// button: {
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// 	flexDirection: 'row',
	// 	marginHorizontal: 10,
	// 	marginVertical: 5,
	// 	height: 40,
	// 	borderColor: colors.primaryBlue,
	// 	borderWidth: 1,
	// 	borderRadius: 5
	// },
	// buttonText: {
	// 	color: colors.primaryBlue
	// },
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginHorizontal: 10,
		marginVertical: 5,
		height: 40,
		backgroundColor: colors.primaryBlue,
		borderColor: colors.primaryBlue,
		borderWidth: 1,
		borderRadius: 5
	},
	buttonText: {
		color: '#fff'
	} 
};

const mapStateToProps = (state) => {
	
	const {
		main: { messageToast },
		auth: { doctorName },
		clientPermissions: { hasTelehealth },
		meetingCalendar: {error, meetings, meetingsQuota, loading, loadingCC}
	} = state;

	return { 
		loading,
		doctorName, 
		meetings,
		meetingsQuota,
		messageToast,
		hasTelehealth,
		loadingCC
	};
};

export default connect(mapStateToProps, {getMeetings, connectCC})(MeetingInfo);