/**
 * Created by mponomarets on 7/26/17.
 */
import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	Platform,
	TextInput,
	ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { changeMealList } from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, textStyles } from '../../actions/const';
import { Crashlytics } from 'react-native-fabric';
import { Actions } from 'react-native-router-flux';

class DecisionComponentSingleRecipe extends Component {
	constructor (props) {
		super(props);
		this.state = {
			defaultColor: 'rgba(0,0,0,0.2)',
			activeColor: colors.primaryOrange,
			liked: null,
			disliked: false,
			didntTry: true,
			activeButton: false,
			loading: this.props.confirm,
			error: this.props.error,
			comment: '',
			textLength: 5000,
			height: 60,
			heightIOS: 60,
			base64: ''
		};
		this.sendConfirmDecision = this.sendConfirmDecision.bind(this);
		this.writeComment = this.writeComment.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.error !== this.props.error) {
			this.setState({
				error: nextProps.error
			});
		}

	}

	/*getInitialState (callback) {
		this.setState({
			liked: false,
			disliked: false,
			didntTry: true,
			activeButton: true,
			loading: false
		}, callback);
	}*/

	onMakeLike = () => {
		this.setState({ liked: true, error: '',disliked: false });
		this.props.onLike();
	};

	onMakeDisLike = () => {
        this.setState({ disliked: true, error: '',liked: false });
        this.props.onDislike();
	};


	triedIt () {
	}

	writeComment (text) {
		this.setState({
			comment: text,
			error: ''
		});
        this.props.onComment(text);
	}

	sendConfirmDecision () {
		
		this.setState({ loading: true });
		const { liked, didntTry, comment, base64 } = this.state;
		const { sendConfirm, planId, recipeId, fromMealPlan, isAssigned } = this.props;
		let isLiked = didntTry === false ? null : (liked ? 1 : 0);
		let isConfirm = didntTry ? 1 : 0;
		this.props.onImageRemove();
		if (fromMealPlan) {
			sendConfirm(planId, isLiked, isConfirm, isAssigned, comment, recipeId, this.props.base64, true);
		}
		return Promise.resolve(sendConfirm(planId, isLiked, isConfirm, isAssigned, comment, recipeId, base64))
			.then(() => {
				this.setState({
					height: 100,
					heightIOS: 100,
					liked: false,
					disliked: false,
					didntTry: true,
					activeButton: false,
					loading: false,
					comment: '',
					error: ''
				});
				Platform.OS === 'ios' ? Crashlytics.recordError('Submit fail') : Crashlytics.logException('Submit fail');
			});
	}

	updateSize (height) {
		this.setState({
			height: height
		});
	}

	renderTextInput () {
		const { inputWrap, iconStyle, wrapper, textInputStyleIOS, textInputStyleAD } = styles;
		const { activeButton, height, comment } = this.state;
		//if (activeButton) {
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
								placeholder={'Anything noteworthy? (optional)'}
								multiline={true}
								editable={true}
								onChangeText={this.writeComment}
								onSubmitEditing={this.sendConfirmDecision}
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
						<View style={wrapper}>
							<TextInput
								style={textInputStyleAD}
								autoCorrect={false}
								value={comment}
								underlineColorAndroid={'transparent'}
								returnKeyLabel='go'
								placeholder={'Anything noteworthy? (optional)'}
								multiline={true}
								onChangeText={this.writeComment}
								onSubmitEditing={() => this.sendConfirmDecision}
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

		/*}
		else {
			return null;
		}*/

	}

	/*renderButton () {
		const { buttonContainer, submitButton, submitButtonTitle, buttonReady } = styles;
		const { loading, activeButton } = this.state;
		const buttonStyle = activeButton ? [submitButton, buttonReady] : submitButton;
		if (!loading) {
			return (
				<View style={buttonContainer}>
					<TouchableOpacity
						style={buttonStyle}
						disabled={!activeButton}
						onPress={this.sendConfirmDecision}
					>
						<Text style={submitButtonTitle}>SUBMIT</Text>
					</TouchableOpacity>
				</View>
			);
		} else {
			return <ActivityIndicator style={{ margin: 20 }} color={colors.primaryOrange} size={'large'}/>;
		}

	}*/

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
        const { defaultColor, activeColor, disliked, liked } = this.state;
        const { container, buttonsContainer, buttonsColumnContainer, columnTitle, buttonStyle } = styles;
        return (
            <View style={container}>
                <View style={buttonsContainer}>
                    <View style={buttonsColumnContainer}>
                        <Text style={columnTitle}>Your Review</Text>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 20,
                            paddingHorizontal: 10
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity onPress={this.onMakeLike}>
                                    <View style={[buttonStyle]}>
                                        <Icon
                                            size={70}
                                            name='thumbs-o-up'
                                            color={liked ? colors.primaryGreen : defaultColor}
                                        />
                                        <Text style={{ marginLeft: 5 }}>Felt Great</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onMakeDisLike}>
                                    <View style={buttonStyle}>
                                        <Icon
                                            size={70}
                                            name='thumbs-o-down'
                                            color={disliked ? colors.primaryOrange : defaultColor}
                                        />
                                        <Text style={{ marginLeft: 5 }}>Not so good</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {this.renderTextInput()}
                {this.renderCharacterCount()}
                {/*<View style={{ width: '100%', paddingBottom: 10 }}>
					{this.renderButton()}
				</View>*/}
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
		paddingTop: 10,
		marginTop: 100
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
		alignItems: 'center',
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
		backgroundColor: colors.primaryGreen
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
		flex: 1.5,
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

export default connect(mapStateToProps, { changeMealList })(DecisionComponentSingleRecipe);
