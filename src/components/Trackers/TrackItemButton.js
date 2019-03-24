import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../actions/const';


const TrackItemButton = ({ title, question, icon, onPress }) => {
	const { container, buttonTitle, buttonQuestion } = styles;
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={container}>
				<View>
					<Text style={buttonTitle}>{title.toUpperCase()}</Text>
					<Text style={buttonQuestion} numberOfLines={1}>{question}</Text>
				</View>
				<Icon name={icon} size={25} color={'rgba(0,0,0,0.3)'}/>
			</View>
		</TouchableOpacity>
	);
};

const styles = {
	container: {
		height: 60,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: 'rgba(0,0,0,0.1)',
		borderBottomWidth: 1
	},
	buttonTitle: {
		fontSize: 16,
		// textTransform: 'uppercase',
		color: colors.darkGrey
	},
	buttonQuestion: {
		fontSize: 20
	}
};

TrackItemButton.defaultProps = {
	title: 'Title',
	onPress: () => {
	}
};

export default TrackItemButton;