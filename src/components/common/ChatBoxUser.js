/**
 * Created by mponomarets on 7/22/17.
 */
import React, {PureComponent} from 'react';
import {
	Text,
	View
} from 'react-native';
import { colors, textStyles } from '../../actions/const';

class ChatBoxUser extends PureComponent {

	render() {
		const { messageBody, messageLocalTimestamp } = this.props;
		const {
			userMessageContainer,
			messagesContainer,
			messageTime
		} = styles;
	
		return (
			<View style={messagesContainer}>
				<View style={userMessageContainer}>
					<Text style={textStyles.l5TextWhite}>{messageBody}</Text>
					<Text style={[textStyles.description12White, messageTime]}>{messageLocalTimestamp}</Text>
				</View>
			</View>
		);
	}
}

const styles = {

	messagesContainer: {
		flexDirection: 'row',
		margin: 10,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	userMessageContainer: {
		borderWidth: 1,
		paddingVertical: 5,
		maxWidth: 230,
		marginRight: 10,
		borderColor: colors.primaryBlue,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingHorizontal: 10,
		borderRadius: 20,
		borderBottomRightRadius: 0,
		backgroundColor: colors.primaryBlue

	},
	messageTime: {
		position: 'relative',
		paddingTop: 5
	},
};

export {ChatBoxUser};
