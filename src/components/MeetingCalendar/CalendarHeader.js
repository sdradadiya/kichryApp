import React, {Component} from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Platform,
	StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const colors = {
	headerBg: '#fff',
	textColor: '#666a72',
	iconColor: '#666a72'
};

class CalendarHeader extends Component {
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
				barStyle="dark-content"
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
					<Icon name="arrow-left" size={22} color={colors.iconColor}/>
				</TouchableOpacity>
			);
		}
		else {
			return (
				<TouchableOpacity
					onPress={this.props.leftButtonPress}
					style={buttonContainer}>
					<Icon name="angle-left" size={22} color={colors.iconColor}/>
				</TouchableOpacity>
			);
		}
	}

	render () {

		const {headerContainer, headerContainerSub, header, titleStyle, subTitleStyle, titleContainer, iosBarHeight, iosBarHeightSub, buttonContainer} = styles;
		const { subTitle } = this.props;

		let container = subTitle ? headerContainerSub : headerContainer;
		let containerIOS = subTitle ? iosBarHeightSub : iosBarHeight;

		return (
			<View style={Platform.OS === 'android' ? container : [container, containerIOS]}>
				{this.renderStatusBar()}
				<View style={header}>
					{this.renderLeftIcon()}
					<View style={titleContainer}>
						<Text style={titleStyle}>{this.props.title}</Text>
						{subTitle ? <Text style={subTitleStyle}>{subTitle}</Text> : null}
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
		backgroundColor: colors.headerBg
	},
	headerContainerSub: {
		height: 80,
		backgroundColor: colors.headerBg
	},
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		// paddingRight: 10,
		// paddingTop: 10,
		borderBottomColor: 'rgba(102,106,114, .5)',
		borderBottomWidth: 1 
	},
	titleContainer: {
		flex: 0.6,
		alignItems: 'center',
		justifyContent: 'center'
	},
	titleStyle: {
		color: colors.textColor,
		fontSize: 22,
		textAlign: 'center'
	},
	subTitleStyle: {
		color: colors.textColor,
		fontSize: 16,
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
		height: 40
		// paddingBottom: 10
	},
	iosBarHeightSub: {
		height: 60
		// paddingBottom: 10
	}
};

export {CalendarHeader};