import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/Ionicons';

export const AddButton = ({ inModal, onPress }) => (
	<View
		style={[styles.buttonContainer, { bottom: inModal === true ? 80 : 20 }]}
	>
		<TouchableHighlight style={styles.shareTouchable} onPress={onPress}>
			<View style={[styles.shareButton, { transform: [{ rotate: '0deg' }] }]}>
				<Icon name="md-add" size={25} color={'#FFFFFF'} />
			</View>
		</TouchableHighlight>
	</View>
);

const styles = {
	buttonContainer: {
		flex: 1,
		position: 'absolute',
		right: 15
	},
	shareTouchable: {
		borderRadius: 25
	},
	shareButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.primaryGreen
	}
};
