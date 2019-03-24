/**
 * Created by mponomarets on 8/16/17.
 */
import React, {Component} from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import ProfileScreen from '../ProfileScreen';

class ProfileMenu extends Component {
	constructor (props) {
		super(props);
		this.logOutUser = this.logOutUser.bind(this);
		this.changePassword = this.changePassword.bind(this);
	}

	changePassword () {
		Actions.changePassword();
	}

	logOutUser () {
		this.props.logOut();
	}

	menuButton (icon, title, onPress) {
		const {buttonContainer, buttonContent, buttonTitle} = styles;
		return (
			<TouchableOpacity style={buttonContainer} onPress={onPress}>
				<View style={buttonContent}>
					<Icon name={icon} color={'#fff'} size={22}/>
					<Text style={buttonTitle}>{title}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render () {
		const {container} = styles;
		return (
			<ScrollView style={{flex: 1}}>
				<View style={container}>
					{this.menuButton('cog', 'Profile setting', () => ProfileScreen.onButtonPress())}
					{this.menuButton('camera', 'Take new profile photo', () => ProfileScreen.onButtonPress())}
					{this.menuButton('picture-o', 'Select profile photo', () => ProfileScreen.onButtonPress())}
					{this.menuButton('pencil-square-o', 'Change password', this.changePassword)}
					{this.menuButton('sign-out', 'Logout', this.logOutUser)}
				</View>
			</ScrollView>
		);
	}
}
const styles = {
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingVertical: 10,
		marginLeft: 40
	},
	buttonContainer: {
		width: '100%'
	},
	buttonContent: {
		flexDirection: 'row',
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: 60
	},
	buttonTitle: {
		color: '#fff',
		paddingHorizontal: 5,
		fontSize: 18
	}
};

export {ProfileMenu};