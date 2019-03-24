/**
 * Created by viktoria on 12.04.17.
 */
import React from 'react';
import { View, TextInput } from 'react-native';
import { textStyles } from '../../actions/const';

export const Input = ({
	changeText,
	error,
	rel,
	style,
	maxLength = 5000,
	...textInputProps
}) => {
	const { textInput, errorStyle } = styles;
	return (
		<View>
			<TextInput
				ref={rel}
				autoCorrect={false}
				onChangeText={changeText}
				underlineColorAndroid={'transparent'}
				blurOnSubmit={true}
				autoCapitalize={'none'}
				maxLength={maxLength}
				style={error ? errorStyle : style ? style : textInput}
				{...textInputProps}
			/>
		</View>
	);
};

const styles = {
	textInput: {
		height: 50,
		borderRadius: 15,
		paddingHorizontal: 8,
		backgroundColor: 'transparent',
		color: 'grey',
		paddingTop: 6
	},
	errorStyle: {
		height: 50,
		borderRadius: 15,
		paddingHorizontal: 8,
		borderColor: 'red',
		color: '#000',
		borderWidth: 1
	}
};
