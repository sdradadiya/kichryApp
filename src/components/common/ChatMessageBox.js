/**
 * Created by mponomarets on 7/22/17.
 */
import React, {Component} from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, textStyles } from '../../actions/const';

class ChatMessageBox extends Component {
	constructor (props) {
		super(props);
		this.state = {
			text: '',
			textLength: '200',
			sendBtnColor: colors.primaryGreen,
			height: 60,
			heightIOS: 60
		};
	}

	onTextChange (text) {

		const trimText = text.replace(/\s/g, '');
		const textLength = text.length;
		const sub = 200 - textLength;
		this.setState({
			text: text,
			textLength: sub,
			sendBtnColor: textLength > 0 && trimText.length > 0 ? 'rgba(44, 194, 107, 1)' : '#cfd0d2'
		});
	}

	renderAttachButton () {
		return (
			<Icon name='paperclip' size={30} color={'#cfd0d2'}/>
		);
	}

	onAttachButtonPress () {

	}

	renderButtonSend () {
		if (Platform.OS === 'ios') {
			return <Icon name="paper-plane" size={25} color={this.state.sendBtnColor}/>;
		} else {
			return <Icon name="paper-plane" size={25} color={this.state.sendBtnColor}/>;
		}
	}

	onButtonPress (text) {
		
		const trimText = text.replace(/\s/g, '');

		if (text && trimText.length > 0) {
			this.props.sendMessage(text);
			this.setState({
				text: '',
				textLength: '200',
				sendBtnColor: colors.primaryGreen,
				height: 60,
				heightIOS: 60
			});
		}
	}

	updateSize (height) {
		this.setState({
			height: height
		});
	}

	renderTextInput () {
		const {height} = this.state;
		const {inputContainer, textInputStyleIOS, textInputStyleAD, inputLengthCount} = styles;
		if (Platform.OS === 'ios') {
			return (
				<View style={inputContainer}>
					<TextInput
						style={[textStyles.l4text, textInputStyleIOS, {marginVertical: 10}]}
						autoCorrect={false}
						underlineColorAndroid={'transparent'}
						value={this.state.text}
						returnKeyType='default'
						placeholder={'Type a message...'}
						multiline={true}
						editable={true}
						onChangeText={(text) => this.onTextChange(text)}
						onSubmitEditing={event => this.onButtonPress(event.nativeEvent.text)}
						onChange={(e) => {
							let h = e.nativeEvent.contentSize.height;
							let newHeight = h > 30 ? h + 30 : 60;
							this.setState({
								heightIOS: newHeight
							});
						}}
						maxLength={200}
					/>
					<Text style={[inputLengthCount, {bottom: 10}]}>
						{this.state.textLength}
					</Text>
				</View>
			);
		}
		else {
			return (
				<View style={[inputContainer, {height: height}]}>
					<TextInput
						style={[textStyles.l4text, textInputStyleAD]}
						autoCorrect={false}
						value={this.state.text}
						underlineColorAndroid={'transparent'}
						returnKeyLabel='go'
						placeholder={'Type a message...'}
						multiline={true}
						onChangeText={(text) => this.onTextChange(text)}
						onSubmitEditing={event => this.onButtonPress(event.nativeEvent.text)}
						onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
						onChange={(e) => {
							this.updateSize(e.nativeEvent.contentSize.height);
						}}
						maxLength={200}
					/>
					<Text style={inputLengthCount}>
						{this.state.textLength}
					</Text>
				</View>
			);
		}
	}

	render () {
		const {container, buttonContainer, borderColor} = styles;
		const {heightIOS} = this.state;
		return (
			<View style={Platform.OS === 'ios' ? [container, {height: heightIOS}] : container}>

				<View style={borderColor}/>

				{this.renderTextInput()}
				<TouchableOpacity
					style={buttonContainer}
					onPress={() => this.onButtonPress(this.state.text)}
				>
					{this.renderButtonSend()}
				</TouchableOpacity>

			</View>
		);
	}
}

const styles = {
	container: {
		borderTopWidth: 1,
		borderColor: '#f2f2f2',
		flexDirection: 'row',
		bottom: 0
	},
	buttonContainer: {
		marginVertical: 10,
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	inputContainer: {
		flex: 0.6,
		marginLeft:10
	},
	textInputStyleIOS: {
		flex: 0.8,
		alignItems: 'stretch',
		borderRadius: 5,
		paddingBottom: 8,
		paddingTop: 5
	},
	textInputStyleAD: {
		flex: 0.8,
		alignItems: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 5,
		fontSize: 14,
		paddingBottom: 10,
		paddingTop: 10,
		paddingVertical: 0
	},
	inputLengthCount: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: 12,
		color: colors.primaryGrey,
		backgroundColor: 'rgba(0, 0, 0, 0)'
	},
	borderColor: {
		backgroundColor: '#000000',
		height: 1,
		marginTop: 10,
		marginBottom: 10,
	},
};

export {ChatMessageBox};
