import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../actions/const';

const CloseDayButton = ({ numDaysOpen, onPress }) => {
	const { container, circleView, circleTitle, buttonTitle, textContainer } = styles;
	return (<TouchableOpacity
		activeOpacity={0.8}
		onPress={onPress}
		style={container}>
		<View style={circleView}>
			<Text style={circleTitle}>{numDaysOpen}</Text>
		</View>
		<View style={textContainer}>
			<Text style={buttonTitle}>My Daily Checklist</Text>
		</View>
	</TouchableOpacity>);
};

const styles = {
	container: {
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 20
	},
	circleView: {
		marginRight: 15,
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.lightGrey,
		alignItems: 'center',
		justifyContent: 'center'
	},
	circleTitle: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	textContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginRight: 10
	},
	buttonTitle: {
		fontSize: 16,
		flexWrap: 'wrap'
	}
};
export { CloseDayButton };