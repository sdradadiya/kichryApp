/**
 * Created by mponomarets on 7/16/17.
 */
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {tracker} from '../actions/const';

class VerticalMenu extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount()
	{
        tracker.trackScreenView("VerticalMenu");
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: 'transparent'}}>
				<Text>menu</Text>
			</View>
		);
	}
}
export default VerticalMenu;