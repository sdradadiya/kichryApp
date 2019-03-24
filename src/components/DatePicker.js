/**
 * Created by mponomarets on 7/10/17.
 */
/**
 * Created by mponomarets on 7/5/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text,
	DatePickerIOS,
	TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {prettyDate, colors, tracker} from '../actions/const';
import {BackHeader} from './common';
import SafeAreaView from 'react-native-safe-area-view';

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(this.props.date),
			formatDate: ''
		};
		this.onCancelButtonPress = this.onCancelButtonPress.bind(this);
		this.onApproveButtonPress = this.onApproveButtonPress.bind(this);
	}

	componentDidMount() {
		this.setState({
			formatDate: prettyDate(this.state.date)
		});
		tracker.trackScreenView('DatePicker');
	}


	onDateChange(date) {
		this.setState({
			date: date,
			formatDate: prettyDate(date)
		});
	}

	onCancelButtonPress() {
		Actions.pop();
	}

	onApproveButtonPress() {
		const {formatDate} = this.state;
		const {setNewDate, getList} = this.props;
		setNewDate(formatDate);
		getList(formatDate);
		Actions.pop();
	}

	renderDatePicker() {
		return (
			<DatePickerIOS
				style={{paddingHorizontal: 10, backgroundColor: '#fff'}}
				date={this.state.date}
				mode="date"
				onDateChange={(date) => this.onDateChange(date)}/>
		);
	}

	render() {
		const {buttonContainer, title, buttonStyle, buttonApprove, buttonCancel, buttonTitle} = styles;
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<BackHeader leftButtonPress={() => Actions.pop()}/>
				<Text style={title}>Choose date</Text>
				{this.renderDatePicker()}
				<View style={buttonContainer}>
					<TouchableOpacity style={[buttonStyle, buttonCancel]} onPress={this.onCancelButtonPress}>
						<Text
							style={buttonTitle}>Cancel
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[buttonStyle, buttonApprove]} onPress={this.onApproveButtonPress}>
						<Text
							style={buttonTitle}>Ok
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = {
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingHorizontal: 10,
		backgroundColor: '#fff'
	},
	buttonStyle: {
		height: 40,
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50
	},
	buttonApprove: {
		backgroundColor: colors.primaryGreen,
		marginLeft: 5
	},
	buttonCancel: {
		backgroundColor: colors.primaryOrange
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 18
	},
	title: {
		textAlign: 'center',
		fontSize: 22,
		paddingVertical: 10,
		backgroundColor: '#fff'
	}
};

export default DatePicker;
