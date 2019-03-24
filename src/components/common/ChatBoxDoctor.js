/**
 * Created by mponomarets on 7/22/17.
 */
import React, {PureComponent} from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Linking
} from 'react-native';
import ProfileOutline from '../../../resources/img/person.png';
import { HOST, colors, textStyles } from '../../actions/const';

const parseURL = (messageBody) => {

	let matchHostUrl = HOST.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
	let hostUrl = matchHostUrl && { href: HOST, protocol: matchHostUrl[1], host: matchHostUrl[2], hostname: matchHostUrl[3], port: matchHostUrl[4], pathname: matchHostUrl[5], search: matchHostUrl[6], hash: matchHostUrl[7] };

	let matchMessageBody = messageBody.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
	let receivedUrl = matchMessageBody && { href: messageBody, protocol: matchMessageBody[1], host: matchMessageBody[2], hostname: matchMessageBody[3], port: matchMessageBody[4], pathname: matchMessageBody[5], search: matchMessageBody[6], hash: matchMessageBody[7] };

	if(hostUrl.host === receivedUrl.host) {
		let urlSplit = receivedUrl.hash.split('/');
		let recipeId = urlSplit[urlSplit.length - 1];
		return recipeId;
	} else {
		return messageBody;
	}

};

class ChatBoxDoctor extends PureComponent {

	openRecipe(recipeId) {
		this.props.onPress(+recipeId);
	}

	renderMessageBody() {

		const { messageBody, messageSenderName } = this.props;
		
		const isURL = new RegExp('^(?:[a-z]+:)?//', 'i');

		if(isURL.test(messageBody)) {

			const definedURL = parseURL(messageBody);

			if(isURL.test(definedURL)) {
				return (
					<TouchableOpacity onPress={() => Linking.openURL(definedURL)}>
						<Text style={textStyles.l5Text}>{definedURL}</Text>
					</TouchableOpacity>
				);
			} else {
				return (
					<TouchableOpacity onPress={() => this.openRecipe(definedURL)}>
						<Text style={textStyles.l5Text}>
							<Text>Hi. I picked this </Text>
							<Text style={{color: 'blue'}}>recipe </Text>
							<Text>for you. Let me know how it turns out.</Text>
						</Text>
					</TouchableOpacity>
				);
			}
		} else {
			return(
				<Text style={textStyles.l4Text}>{messageBody}</Text>
			);
		}

	}


	render() {
		const { messageSenderPhoto, messageLocalTimestamp } = this.props;
		const {
			doctorMessageContainer,
			messagesContainer,
			messageTime,
			messagePhoto
		} = styles;

		return (
			<View style={messagesContainer}>
				<Image source={messageSenderPhoto ? {uri: messageSenderPhoto} : ProfileOutline} style={messagePhoto} />
				<View style={doctorMessageContainer}>
					{this.renderMessageBody()}
					<Text style={[textStyles.description12, messageTime]}>{messageLocalTimestamp}</Text>
				</View>
			</View>
		);
	}
}

const styles = {
	messagesContainer: {
		flexDirection: 'row',
		margin: 10,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	doctorMessageContainer: {
		borderWidth: 1,
		marginLeft: 10,
		paddingVertical: 5,
		minWidth: 100,
		maxWidth: 230,
		borderColor: 'rgba(242, 242, 242, 1)',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingHorizontal: 10,
		flexDirection: 'column',
		borderRadius: 15,
		borderBottomLeftRadius: 0,
		backgroundColor: '#fff'
	},
	messageTime: {
		paddingTop: 5,
	},
	messageText: {
		color: '#000'
	},
	messagePhoto: {
		width: 60,
		height: 60,
		borderRadius: 30
	}

};

export {ChatBoxDoctor};
