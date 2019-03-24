/**
 * Created by artem on 7/22/17.
 */
import React, {PureComponent} from 'react';

import {
	Text,
	View
} from 'react-native';

class ChatSplitDate extends PureComponent {
	render () {
		const {dateContainer, dateText} = styles;
		const {splitDate} = this.props;
		return (
			<View style={dateContainer}>
				<Text style={dateText}>{splitDate}</Text>
			</View>
		);
	}
}

const styles = {

	dateContainer: {
		flex: 1,
		alignItems: 'center'
	},

	dateText: {
		color: '#cfd0d2'
	}

};

export {ChatSplitDate};
