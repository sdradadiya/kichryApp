import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../actions/const';

export class PointsBanner extends PureComponent {

	render() {
		const { points = 0, onPress, userName } = this.props;
		const { buttonContainer, textContainer, textStyle, title } = styles;

		const pointsLocaleString = points.toLocaleString('us');

		return (
			<TouchableOpacity onPress={onPress} style={buttonContainer}>
				<View style={textContainer}>
					<View style={{ backgroundColor: 'transparent' }}>
						<Text style={[textStyle, title]}>Welcome Back, {userName}</Text>
						<Text style={textStyle}>
							Your Kitchry Award Points balance is {pointsLocaleString}
						</Text>
					</View>
					<View style={{ backgroundColor: 'transparent' }}>
						<Icon name={'ios-arrow-forward-outline'} size={30} color={'rgba(0,0,0,0.5)'}/>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
};

const styles = {
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: '#fbbe3b',
		borderBottomColor: 'rgba(0,0,0,0.3)',
		borderBottomWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.3)',
		borderTopWidth: 1
	},
	textContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	textStyle: {
		fontSize: 14,
		lineHeight: 20,
		color: '#000'
	},
	title: {
		fontWeight: 'bold',
		color: colors.white
	}
};
