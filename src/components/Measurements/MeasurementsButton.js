import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const MeasurementsButton = ({ title, icon, onPress }) => {
	const { container, buttonTitle } = styles;
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={container}>
				<Text style={buttonTitle}>{title}</Text>
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
		fontSize: 20
	}
};

MeasurementsButton.defaultProps = {
	title: 'Title',
	onPress: () => {
	}
};

export default MeasurementsButton;