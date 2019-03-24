/**
 * Created by mponomarets on 7/10/17.
 */
/**
 * Created by mponomarets on 6/25/17.
 */
import React, {Component} from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Platform,
	StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { colors, textStyles } from '../../actions/const';

class BackHeader extends Component {
	constructor (props) {
		super(props);
	}

	renderStatusBar () {
		if (Platform.OS === 'android') {
			return (<StatusBar
				translucent={true}
				backgroundColor={'transparent'}
			/>);
		} else {
			return (<StatusBar
				barStyle="light-content"
			/>);
		}
	}

	renderLeftIcon () {
		const {buttonContainer} = styles;
		if (Platform.OS === 'android') {
			return (
				<TouchableOpacity
					onPress={this.props.leftButtonPress}
					style={buttonContainer}>
					<Icon name="arrow-left" size={22} color={colors.primaryBlack}/>
				</TouchableOpacity>
			);
		}
		else {
			return (
				<TouchableOpacity
					onPress={this.props.leftButtonPress}
					style={buttonContainer}>
					<IonIcon name={'ios-arrow-back'} size={26} color={colors.primaryBlack}/>
 				</TouchableOpacity>
			);
		}
	}

	render () {
		const {headerContainer, header, titleStyle, titleContainer, iosBarHeight, buttonContainer} = styles;
		return (
			<View style={Platform.OS === 'android' ? headerContainer : [headerContainer, iosBarHeight]}>
				{this.renderStatusBar()}
				<View style={header}>
					{this.renderLeftIcon()}
					<View style={titleContainer}>
						<Text style={[textStyles.l2Text, titleStyle]}>{this.props.title}</Text>
					</View>
					<View style={buttonContainer}>
						<Text/>
					</View>
				</View>
			</View>
		);
	}
}
const styles = {
	headerContainer: {
		height: 60,
		backgroundColor: '#fff'
	},
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingRight: 15,
		paddingTop: 10
	},
	titleContainer: {
		flex: 0.6,
		alignItems: 'center',
		justifyContent: 'center'
	},
	titleStyle: {
		textAlign: 'center'
	},
	buttonContainer: {
		flex: 0.2,
		justifyContent: 'center',
		height: 40,
		paddingLeft: 15
	},
	leftButton: {},
	rightButton: {
		alignItems: 'flex-end'
	},
	iosBarHeight: {
		height: 40,
		paddingBottom: 10
	}
};

export {BackHeader};
