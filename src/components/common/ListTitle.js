import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePeriod } from '../../actions';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const DATE_FORMAT = 'MM/DD/YYYY';

const TouchableIcon = ({ name, onPress }) => {
	const { iconStyle, center, arrowStyle } = styles;
	const { primaryOrange } = colors;
	if(Platform.OS == 'ios'){
		return (
			<TouchableOpacity style={[center, iconStyle]} onPress={onPress}>
				<Icon name={name} size={25} style={arrowStyle} color={colors.primaryBlack} />
			</TouchableOpacity>
		);
	} else {
		return(
			<Text style={[center, iconStyle]} onPress={onPress}>
				<Icon name={name} size={25} style={arrowStyle} color={colors.primaryBlack} />
			</Text>
		)
	}
	
};

class ListTitle extends Component {
	loadDay = inc => {
		const nextDay = moment(this.props.date, DATE_FORMAT)
			.add(inc, 'day')
			.format('l');
		this.props.changeDate(nextDay);
		this.props.getList(nextDay);
		this.props.getCheckList(nextDay);
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

	render() {
		const { dateContainer, center } = styles;
		const { mealplan, period, date } = this.props;

		const week = period === 'week' && !mealplan ? 'Week of ' : '';
		// const title = week + moment(date, DATE_FORMAT).format('ddd, MMM DD YYYY');
		const title = week + moment(date, DATE_FORMAT).calendar(null, {
			sameDay: '[Today]',
			nextDay: '[Tomorrow]',
			lastDay: '[Yesterday]',
			nextWeek: 'ddd, MMM DD YYYY',
			lastWeek: 'ddd, MMM DD YYYY',
			sameElse: 'ddd, MMM DD YYYY'
		})

		return (
			<Text style={dateContainer}>
				{this.renderArrowLeft()}
				<Text style={[styles.date, center]}>{` ${title} `}</Text>
				{this.renderArrowRight()}
			</Text>
		);
	}
}

const styles = {
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	date: {
		fontSize: 20,
		flex: 0.7,
		textAlign: 'center'
	},
	iconStyle: {
		flex: 0.15,
		width: 25,
		height: 20,
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 8,
	},
	arrowStyle: {
		justifyContent: 'center',
		alignItems: 'center'
	}
};

const mapStateToProps = ({ grocery: { period } }) => ({ period });

export default connect(mapStateToProps, { changePeriod })(ListTitle);
