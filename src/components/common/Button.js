/**
 * Created by viktoria on 12.04.17.
 */

import React from 'react';
import {
	Text,
	TouchableOpacity
} from 'react-native';
import {colors} from '../../actions/const';

const Button = ({title, onPress, stylesContainer, styleText}) => {
	const {touchableElement, textButton} = buttonStyles;
	return (
		<TouchableOpacity style={stylesContainer ? stylesContainer : touchableElement} onPress={onPress}>
			<Text style={styleText ? styleText : textButton}>{title}</Text>
		</TouchableOpacity>
	);
};
const buttonStyles = {
	touchableElement: {
		backgroundColor: colors.primaryGreen,
		alignItems: 'center',
		marginHorizontal: 0,
		borderRadius: 0
	},
	textButton: {
		color: 'white',
		paddingVertical: 15,
		fontWeight: 'bold'
	}
};


export {Button};
