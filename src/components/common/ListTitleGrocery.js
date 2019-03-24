import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePeriod } from '../../actions';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, textStyles } from '../../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const DATE_FORMAT = 'MM/DD/YYYY';

const TouchableIcon = ({ name, onPress }) => {
	const { iconStyle, center } = styles;
	const { primaryOrange } = colors;
	return (
		<TouchableOpacity style={[center, iconStyle]} onPress={onPress}>
			<Icon name={name} style={iconStyle} size={22} color={colors.primaryBlack} />
		</TouchableOpacity>
	);
};

class ListTitleGrocery extends Component {
	loadDay = inc => {
		const nextDay = moment(this.props.date, DATE_FORMAT)
			.add(inc, 'day')
			.format(DATE_FORMAT);
		this.props.changeDate(nextDay);
		this.props.getList(nextDay);
	};

	loadNextDay = () => this.loadDay(1);
	loadPrevDay = () => this.loadDay(-1);

	renderArrowLeft() {
		if (this.props.needArrow)
			return <TouchableIcon name="angle-left" onPress={this.loadPrevDay} />;
	}

	renderArrowRight() {
		if (this.props.needArrow)
			return <TouchableIcon name="angle-right" onPress={this.loadNextDay} />;
	}

	renderDate() {
		const { center } = styles;
		const { mealplan, period, date, note } = this.props;
		const week = period === 'week' && !mealplan ? 'Week of ' : '';
		const title = week + moment(date, DATE_FORMAT).format('ddd, MMM DD YYYY');
		if(note) {
			return(
				<Text style={[styles.date, center]}>{date}</Text>
			);
		}
		return(
			<Text style={[textStyles.l2Text, center]}>{title}</Text>
		);

	}

	render() {
		const { dateContainer, center } = styles;
		
		return (
			<View style={dateContainer}>
				{this.renderArrowLeft()}
				{this.renderDate()}
				{this.renderArrowRight()}
			</View>
		);
	}
}

const styles = {
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		marginTop:20
	},
	date: {
		fontSize: 20,
		flex: 0.7,
		textAlign: 'center'
	},
	iconStyle: {
		flex: 0.15
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center'
	}
};

const mapStateToProps = ({ grocery: { period } }) => ({ period });

export default connect(mapStateToProps, { changePeriod })(ListTitleGrocery);
