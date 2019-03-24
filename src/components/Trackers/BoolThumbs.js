import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../actions/const';

const BoolThumbs = ({ value, onPressLike, onPressDislike }) => {

	const { iconsRow, buttonStyle } = styles;
	const defaultColor = 'rgba(0,0,0,0.2)';

	return(
		<View style={iconsRow}>
			<TouchableOpacity onPress={onPressLike}>
				<View style={buttonStyle}>
					<Icon
						size={40}
						name='thumbs-o-up'
						color={value === 'true' ? colors.primaryGreen : defaultColor}
					/>
					<Text style={{ marginLeft: 5 }}>Yes i did</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity onPress={onPressDislike}>
				<View style={buttonStyle}>
					<Icon
						size={40}
						name='thumbs-o-down'
						color={value === 'false' ? colors.primaryOrange : defaultColor}
					/>
					<Text style={{ marginLeft: 5 }}>No i did not</Text>
				</View>
			</TouchableOpacity>
		</View>
	);

};

const styles = {
	buttonStyle: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconsRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginTop: 10
	}
};

export default BoolThumbs;
