/**
 * Created by mponomarets on 6/25/17.
 */

import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { colors } from '../../actions/const';
import moment from 'moment';

class Goals extends PureComponent {

	render () {
		const { descriptionContainer, titleStyle, subTitleStyle } = styles;
		const {
			container,
			contentContainer,
			iconStyle,
			trackTitle,
			trackSubTitleContainer,
			activeTrackColor,
			trackText
		} = trackStyle;

		if (this.props.measurement) {
			const { recordDateUTC, amount, unit } = this.props.measurement;
			return (
				<View style={container}>
					<TouchableOpacity style={container} onPress={() => Actions.selectMeasurementsForm()}>
						<View style={contentContainer}>
							<View style={iconStyle}>
								<Text style={trackTitle}>{amount} {unit}</Text>
							</View>
							<View style={descriptionContainer}>
								<Text style={titleStyle}>Keep on track!</Text>
								<View style={trackSubTitleContainer}>
									<Text style={[subTitleStyle, trackText]}>{'Your ' + this.props.type}</Text>
									<Text style={[subTitleStyle, trackText]}>
										{moment(recordDateUTC)
											.local()
											.format('MMM Do, YYYY')}
									</Text>
									<Text style={activeTrackColor}>+Track</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			);
		} else {
			return (
				<View style={styles.container}>
					<TouchableOpacity
						style={container}
						onPress={() => Actions.measurements()}
					>
						<View style={contentContainer}>
							<View style={iconStyle}/>
						</View>
						<View style={descriptionContainer}>
							<Text style={titleStyle}>Keep on track!</Text>
							<View style={trackSubTitleContainer}>
								<Text style={[subTitleStyle, trackText]}>
									You have no measurements
								</Text>
								<Text style={[subTitleStyle, trackText]}/>
								<Text style={activeTrackColor}>+Track</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			);
		}
	}
}

const color = {
	imgBg: '#847e7e',
	activeColor: '#ffa227',
	textColorWhite: '#fff',
	subTitle: '#272525',
	borderColor: '#847e5e'
};

const styles = {
	container: {
		flex: 1,
		flexDirection: 'column',
		padding: 10,
		borderColor: color.borderColor,
		borderBottomWidth: 1,
		paddingBottom: 10,
		backgroundColor: 'red'
	},
	descriptionContainer: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: 10,
		borderColor: color.descriptionBg
	},
	subTitleStyle: {
		color: colors.primaryOrange,
		fontSize: 16,
		lineHeight: 18
	},
	titleStyle: {
		color: '#000',
		fontSize: 18,
		fontWeight: 'bold',
		paddingBottom: 5
	}
};

const trackStyle = {
	container: {
		flex: 1,
		flexDirection: 'row',
		padding: 5,
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'stretch',
		marginRight: 10
	},
	iconStyle: {
		flex: 1,
		minHeight: 80,
		backgroundColor: color.imgBg,
		justifyContent: 'center',
		alignItems: 'center'
	},
	trackTitle: {
		color: color.textColorWhite
	},
	trackSubTitleContainer: {
		flexDirection: 'column'
	},
	trackText: {
		color: color.subTitle,
		paddingBottom: 5
	},
	activeTrackColor: {
		color: colors.primaryOrange,
		fontWeight: 'bold'
	}
};

export { Goals };
