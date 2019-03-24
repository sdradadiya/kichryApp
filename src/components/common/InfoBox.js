/**
 * Created by mponomarets on 7/16/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../actions/const';

class InfoBox extends Component {
	constructor(props) {
		super(props);		
		this.state = {
			iconName: 'angle-up' 
		};
	}

	render() {
		const {container, infoContainer, title, iconStyle} = styles;
		const iconName = this.state.iconName ? 'angle-up' : 'angle-down';
		return (
			<View style={container}>
				<Icon style={iconStyle} name={iconName} size={25} color={colors.primaryGrey}/>
				<View style={infoContainer}>
					<Text style={title}>{this.props.message}</Text>
				</View>
			</View>);
	}
}
const styles = {
	container: {
		marginVertical: 15,
		marginHorizontal: 10,
		borderRadius: 5,
		borderColor: 'transparent',
		borderWidth: 1,
		flex: 1
	},
	infoContainer: {
		flex: 1,
		margin: 5,
		borderRadius: 5,
		borderColor: colors.primaryGreen,
		borderWidth: 0,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		flex: 0.8,
		color: colors.primaryOrange,
		fontSize: 20,
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center'
	},
	iconStyle: {
		margin: 10,
		flex: 0.2,
		textAlign: 'center'
	}
};
export {InfoBox};
