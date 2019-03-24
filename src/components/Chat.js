/**
 * Created by mponomarets on 7/5/17.
 */
import React, { Component } from 'react';
import moment from 'moment';
import {
	View,
	ActivityIndicator,
	Platform,
	KeyboardAvoidingView,
	Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { InvertibleFlatList } from 'react-native-invertible-flatlist';
import { getChatMessage, sendMessage, getRecipeById, openRecipeFromChat } from '../actions';
import { colors,tracker, textStyles } from '../actions/const';
import { Header, ChatMessageBox, ChatBoxUser, ChatBoxDoctor, ChatSplitDate } from './common';
import SafeAreaView from 'react-native-safe-area-view';

class Chat extends Component {
	constructor (props) {
		super(props);
		this.state = {
			isScrollActive: true,
		};
		this.openRecipe = this.openRecipe.bind(this);
	}

	sendMessage (text) {
		const { doctorId, userId } = this.props;
		const new_message = {
			body: text.trim(),
			receiver_user_id: doctorId,
			sender_user_id: userId,
			timestamp_utc: new Date().toUTCString(),
			type: 'text'
		};

		Keyboard.dismiss();
		this.props.sendMessage(
		  new_message.body,
		  this.props.chatMessages.concat([new_message])
		);
	}

	componentWillUnmount () {
		Keyboard.dismiss();
	}
	componentDidMount()
	{
		tracker.trackScreenView("Chat");
	}

	openRecipe(recipeId) {
		this.props.openRecipeFromChat(true);
		this.props.getRecipeById(recipeId, servings=1, {recipeImg: ''});
	}

	renderMessage = ({sender_user_id, body, sender_name, photo, timestamp_utc}, index) => {
		
		const { doctorId, doctorName } = this.props;

		if (sender_user_id === doctorId) {
			return (
				<ChatBoxDoctor
					key={index}
					messageBody={body}
					messageSender={sender_name}
					messageSenderName={doctorName}
					messageSenderPhoto={photo}
					onPress={this.openRecipe}
					messageLocalTimestamp={moment(new Date(timestamp_utc)).format(
						'hh:mm A'
					)}
				/>
			);
		} else {
			return (
				<ChatBoxUser
					key={index}
					messageBody={body}
					messageSender={sender_name}
					messageLocalTimestamp={moment(new Date(timestamp_utc)).format(
						'hh:mm A'
					)}
				/>
			);
		}
	}

	renderMessageOrSection = ({ item, index }) => {
		if(item.message) {
			return this.renderMessage(item.message, index)
		}
		else {
			return <ChatSplitDate key={item.section} splitDate={item.section} />
		}
	};

	_keyExtractor({message, section}) {
		if(message) {
			const {body, sender_name, timestamp_utc} = message;
			return body + sender_name + timestamp_utc;
		} else {
			return section;
		}
	}

	renderSectionList() {
		if (this.props.loading) {
			return <ActivityIndicator style={{ margin: 20, flex: 1 }} color={colors.primaryGrey} size={'large'}/>;
		} else {
			return (
				<InvertibleFlatList
					inverted
					keyExtractor={this._keyExtractor}
					renderItem={this.renderMessageOrSection}
					data={this.props.messages_and_sections}
				/>
			);
		}
	}

	renderChat () {
		if (Platform.OS === 'ios') {
			return (
				<KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: colors.mainBackground }}>
					{this.renderSectionList()}
					<ChatMessageBox sendMessage={(text) => this.sendMessage(text)}/>
				</KeyboardAvoidingView>
			);
		} else {
			return (
				<View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
					{this.renderSectionList()}
					<ChatMessageBox sendMessage={(text) => this.sendMessage(text)}/>
				</View>
			);
		}
	}

	render () {
		const backIcon = Platform.select({ ios: 'ios-arrow-back', android: 'md-arrow-back' })
		return (
			<View style={{flex: 1, backgroundColor: colors.mainBackground}}>
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={'Messages'}
					leftIcon={backIcon}
					leftButtonPress={() => {
						Keyboard.dismiss();
						Actions.pop();
					}}/>
				{this.renderChat()}
				
				

			</SafeAreaView>
			{this.props.loadRecipeFromChat && <View style={styles.loadingContainer}>
					<ActivityIndicator size={'large'} color={'#fff'}/>
				</View>}
			</View>
		);
	}
}

const styles = {
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,.3)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
}

const sectionTitle = timestamp_utc_string => moment(timestamp_utc_string).calendar(null, {
	sameDay: '[Today]',
	lastDay: '[Yesterday]',
	lastWeek: 'dddd',
	sameElse: 'dddd[,] LL'
});

const sectionChatMessages = messages => {
	let messages_and_sections = []
	messages.forEach((message, i) => {
		const section_title = sectionTitle(message.timestamp_utc);
		if(i==0 || (sectionTitle(messages[i-1].timestamp_utc) != section_title)) {
			messages_and_sections.push({section: section_title})
		}
		messages_and_sections.push({message});
	});
	return messages_and_sections;
};

const mapStateToProps = ({ chat, auth, recipeDetail }) => {
	const { loading, chatMessages = {}, error, userId, doctorId } = chat;
	const { doctorName } = auth;
	const { loadRecipeFromChat } = recipeDetail;
	return {
		loading,
		messages_and_sections: sectionChatMessages(chatMessages).reverse(),
		chatMessages,
		error,
		userId,
		doctorId,
		doctorName,
		loadRecipeFromChat
	};
};

export default connect(mapStateToProps, { getChatMessage, sendMessage, getRecipeById, openRecipeFromChat })(Chat);
