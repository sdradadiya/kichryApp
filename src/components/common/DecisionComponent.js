/**
 * Created by mponomarets on 7/26/17.
 */
import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	Platform,
	TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { changeMealList } from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../actions/const';
import { Crashlytics } from 'react-native-fabric';

class DecisionComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			defaultColor: 'rgba(0,0,0,0.2)',
			activeColor: colors.primaryOrange,
			liked: null,
			disliked: false,
			didntTry: false,
			showCommentBox: false,
			loading: this.props.confirm,
			error: this.props.error,
			comment: '',
			textLength: 5000,
			height: 60,
			heightIOS: 60,
			base64: ''
		};
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.error !== this.props.error) {
			this.setState({
				error: nextProps.error
			});
		}
		if (nextProps !== this.props) {
			this.setState({
				base64: nextProps.base64,
				ImageType: nextProps.ImageType
			});
		}

	}

	likedIt = () =>
		this.setState(
			{ liked: true, disliked: false, didntTry: false, showCommentBox: true },
			() => this.writeDecision()
		);

	didntLikeIt = () =>
		this.setState(
			{ liked: false, disliked: true, didntTry: false, showCommentBox: true },
			() => this.writeDecision()
		);

	didntTryIt = () =>
		this.setState(
			{ liked: false, disliked: false, didntTry: true, showCommentBox: true },
			() => this.writeDecision()
		);

	writeDecision = () => {
		const { liked, disliked, didntTry, comment } = this.state;
		this.props.addDecision({ liked, disliked, didntTry, comment });
	};

	onChangeText = comment =>
		this.setState({ comment, error: '' }, () => this.writeDecision());

	onBlurCommentField = () => {
		if (this.state.comment) this.writeDecision();
	};

	updateSize = (height) => this.setState({ height });

	renderTextInput () {
		const { inputWrap, iconStyle, wrapper, textInputStyleIOS, textInputStyleAD } = styles;
		const { showCommentBox, height, comment } = this.state;
		if (showCommentBox) {
			if (Platform.OS === 'ios') {
				return (
					<View style={inputWrap}>
						<Icon style={iconStyle} name="commenting" size={25} color={colors.primaryGreen}/>
						<View style={wrapper}>
							<TextInput
								style={[textInputStyleIOS, { marginVertical: 10 }]}
								autoCorrect={false}
								underlineColorAndroid={'transparent'}
								value={comment}
								returnKeyType='default'
								placeholder={'Anything noteworthy? (Optional)'}
								multiline={true}
								editable={true}
								onChangeText={this.onChangeText}
								onSubmitEditing={this.sendConfirmDecision}
								onBlur={this.onBlurCommentField}
								onChange={(e) => {
									let h = e.nativeEvent.contentSize.height;
									let newHeight = h > 30 ? h + 30 : 60;
									this.setState({
										heightIOS: newHeight
									});
								}}
								maxLength={5000}
							/>
						</View>
					</View>
				);
			}
			else {
				return (
					<View style={[inputWrap, { height: height }]}>
						<Icon style={iconStyle} name="commenting" size={25} color={colors.primaryGreen}/>
						<View style={wrapper}>
							<TextInput
								style={textInputStyleAD}
								autoCorrect={false}
								value={comment}
								onBlur={this.onBlurCommentField}
								underlineColorAndroid={'transparent'}
								returnKeyLabel='go'
								placeholder={'Anything noteworthy? (Optional)'}
								multiline={true}
								onChangeText={this.onChangeText}
								onSubmitEditing={() => this.sendConfirmDecision()}
								onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
								onChange={(e) => {
									this.updateSize(e.nativeEvent.contentSize.height);
								}}
								maxLength={5000}
							/>
						</View>
					</View>
				);
			}

		}
		else {
			return null;
		}

	}

	renderError () {
		if (this.state.error) {
			return (
				<Text style={{ paddingTop: 5, textAlign: 'center', color: 'red' }}>Try again later</Text>
			);
		} else {
			return null;
		}
	}

	renderCharacterCount () {
		const { inputLengthCount } = styles;
		const { comment } = this.state;
		if (comment.length > 0) {
			return (
				<Text style={inputLengthCount}>
					{5000 - comment.length}
				</Text>
			);
		} else {
			return null;
		}

	}

	render () {
		const { defaultColor, activeColor, disliked, liked, didntTry } = this.state;
		const { container, buttonsContainer, buttonsColumnContainer, iconsContainer, iconsRow, buttonStyle } = styles;
		return (
			<View style={container}>
				<View style={buttonsContainer}>
					<View style={buttonsColumnContainer}>
						<View style={iconsContainer}>
							<View style={iconsRow}>
								<TouchableOpacity onPress={this.likedIt}>
									<View style={[buttonStyle]}>
										<Icon
											size={30}
											name='thumbs-o-up'
											color={liked ? activeColor : defaultColor}
										/>
										<Text style={{ marginLeft: 5 }}>I liked it</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={this.didntLikeIt}>
									<View style={buttonStyle}>
										<Icon
											size={30}
											name='thumbs-o-down'
											color={disliked ? activeColor : defaultColor}
										/>
										<Text style={{ marginLeft: 5 }}>I didn't like it</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={this.didntTryIt}>
									<View style={buttonStyle}>
										<Icon
											size={30}
											name='times'
											color={didntTry ? activeColor : defaultColor}
											style={{ marginRight: 5 }}/>
										<Text>I didn't try it</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				{this.renderTextInput()}
				{this.renderCharacterCount()}

				{this.renderError()}
			</View>
		);
	}
}
const styles = {
	container: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10
	},
	iconsContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 10
	},
	iconsRow: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	buttonsContainer: {
		flex: 1,
		flexDirection: 'row',
		marginHorizontal: 10,
		justifyContent: 'space-between',
		alignItems: 'stretch'
	},
	buttonsColumnContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	columnTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000'
	},
	buttonStyle: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	submitButton: {
		flex: 1,
		height: 50,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0,.2)',
		marginTop: 20
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingHorizontal: 10
	},
	buttonReady: {
		backgroundColor: colors.primaryOrange
	},
	submitButtonTitle: {
		color: '#fff',
		fontSize: 16
	},
	inputsContainer: {
		marginHorizontal: 5,
		marginBottom: 5,
		borderRadius: 5,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	inputWrap: {
		borderColor: 'rgba(0,0,0,0.3)',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 3,
		marginVertical: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 10,
		marginTop: 20
	},
	wrapper: {
		flex: 1.5
	},
	iconStyle: {
		flex: 0.15,
		marginHorizontal: 5,
		paddingLeft: 10
	},
	textInputStyleIOS: {
		flex: 0.8,
		alignItems: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 5,
		paddingBottom: 8,
		fontSize: 14,
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
		width: '100%',
		textAlign: 'right',
		fontSize: 12,
		color: '#cfd0d2',
		paddingRight: 20,
		backgroundColor: 'rgba(0, 0, 0, 0)'
	}
};

const mapStateToProps = ({ main, home, recipeDetail }) => {
	const { activeMeal } = main;
	const { reviewMealList } = home;
	const { recipe, error } = recipeDetail;
	return { reviewMealList, recipe, error, activeMeal };
};

export default connect(mapStateToProps, { changeMealList })(DecisionComponent);
