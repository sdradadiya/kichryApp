import React, { Component } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

class ForegroundNotification extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			mealNotes: this.props.mealNotes
		};
		
		this.onNotificationPress = this.onNotificationPress.bind(this);
		this.onCloseNotification = this.onCloseNotification.bind(this);
	}

	componentWillReceiveProps (newProps) {
		
		if (newProps !== this.props) {
			this.setState({
				mealNotes: newProps.mealNotes
			});
		}

	}

	onNotificationPress () {
		
		const { mealNotes } = this.state;
		Actions.rdNotes({mealNotes, currentNote: true});

	}

	onCloseNotification () {

		this.props.closeNotification();

	}

	render () {

		const { container, textStyle, containerInner } = styles;
		
		const { mealNotes } = this.state;

		let note = mealNotes.note;

		return(

			<View style={container}>
				<TouchableOpacity style={containerInner} onPress={this.onNotificationPress}>
					<Icon name='exclamation-circle' color={colors.iconColor} size={22}/>
					<Text style={textStyle}>{`Don’t miss out! You have notes from ${this.props.doctorName} today!`}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.onCloseNotification}>
					<Icon name='times-circle-o' color={colors.closeIconColor} size={22}/>
				</TouchableOpacity>
			</View>

		);
	}

}

const colors = {
	iconColor: 'rgba(38, 152, 238, .8)',
	closeIconColor: 'rgba(38, 152, 238, .8)'
};

const styles = {

	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 60,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
		backgroundColor: 'rgba(38, 152, 238, .2)',
		paddingHorizontal: 10
	},

	containerInner: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	textStyle: {
		flex: 0.8,
		fontSize: 16,
		paddingLeft: 10
	}


};

export {ForegroundNotification};


