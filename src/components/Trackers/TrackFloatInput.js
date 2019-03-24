import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { colors, textStyles } from '../../actions/const';

const TrackFloatInput = ({ value, onChangeText, isCompleted, unit }) => {

	const { inputContainer, innerInputContainer, inputStyle, previousData, separator} = styles;

	return(
		<View style={inputContainer}>
			<View style={innerInputContainer}>
				<TextInput
					style={inputStyle}
					value={value}
					underlineColorAndroid={'transparent'}
					keyboardType={'numeric'}
					placeholder={'.....'}
					autoCorrect={false}
					autoCapitalize="none"
					onChangeText={onChangeText}
					maxLength={5}
					editable={isCompleted ? false : true}
				/>
				<Text style={[textStyles.description14, previousData]}>{unit === 'minutes' ? 'minutes' : unit}</Text>
			</View>
		</View>
	);

};

const styles = {
	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop:50,
	},
	innerInputContainer: {
		flex: 1,
		height: 120,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	inputStyle: {
		flex: .6,
		height: 100,
		fontSize: 60,
		textAlign: 'right',
		alignItems: 'center',
		justifyContent: 'center'
	},
	previousData: {
		flex: .4,
		paddingLeft: 20,
		paddingBottom: 50,
		color: colors.primaryGrey
	},
	separator: {
		position: 'absolute',
		width: 70,
		borderBottomWidth: 1,
		borderColor: colors.primaryGrey
	}
};

export default TrackFloatInput;
