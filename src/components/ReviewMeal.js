import React, { PureComponent } from 'react';
import {
	View,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	Dimensions,
    ActivityIndicator
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Header, IconRowsForRecipeDetail } from './common';
import { omitBy, isNull } from 'lodash';
import DecisionComponentSingleRecipe from './common/DecisionComponentSingleRecipe';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendReview } from '../actions';
import { formatServerDate, colors, showImagePicker, tracker } from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';
import {Crashlytics} from "react-native-fabric";

class ReviewMeal extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			recipeImg: this.props.activeMeal.image,
			base64: '',
            liked: null,
            disliked: null,
            didntTry: true,
            activeButton: false,
            loading: false,
            comment: '',
			leftButton: this.props.leftButton,
		};
	}

	componentDidMount()
	{	
        tracker.trackScreenView("ReviewMeal");
	}

	componentWillUnmount() {
		Keyboard.dismiss();
	}

	onImageAdd = ({ base64, uri }) => {
		this.setState({
			recipeImg: uri,
			base64: base64
		});
	};

	onImageRemove = () => {
		this.setState({
			recipeImg: '',
			base64: ''
		});
	};

    getInitialState (callback) {
        this.setState({
            liked: false,
            disliked: false,
            didntTry: true,
            activeButton: true,
            loading: false
        }, callback);
    }

    makeLike = () => {
        this.getInitialState(() => this.setState({ liked: true, error: '',disliked: false }));
    };

    makeDisLike = () =>{
        this.getInitialState(() => this.setState({ disliked: true, error: '', liked: false }));
    };

    onCommentChange = (text) => {
    	this.setState({
			comment:text
		})
	};


    sendConfirmDecision = () =>{

        this.setState({ loading: true });
        const { liked, didntTry, comment, base64 } = this.state;
        const { plan_id , id, fromMealPlan, isAssigned } = this.props.activeMeal;
        let isLiked = liked === null ? null : (liked ? 1 : 0);
        let isConfirm = 1;
        this.onImageRemove();

        if (fromMealPlan) {
            this.props.sendReview(plan_id, isLiked, isConfirm, isAssigned, comment, id, base64);
        }
        return Promise.resolve(this.props.sendReview(plan_id, isLiked, isConfirm, isAssigned, comment, id, base64))
            .then(() => {
                this.setState({
                    height: 60,
                    heightIOS: 60,
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

	renderImage() {
		const {
			imgContainer,
			imgStyle,
			imageButtonContainer,
			addButtonStyle,
			addButton,
			addButtonTitle
		} = styles;
		const uri = this.state.recipeImg;
		return (
			<View style={imgContainer}>
				{!!uri && <Image source={{ uri }} style={imgStyle} />}
				<View style={imageButtonContainer}>
					<TouchableOpacity
						style={addButtonStyle}
						onPress={() => showImagePicker(this.onImageAdd)}
					>
						<View style={addButton}>
							<Icon name={'add-a-photo'} size={70} color={colors.lightGrey} />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderDecisionRow() {
		const { plan_id, id, isAssigned } = this.props.activeMeal;
		return (
			<DecisionComponentSingleRecipe
				sendConfirm={this.props.sendReview}
				planId={plan_id}
				recipeId={id}
				isAssigned={isAssigned}
				base64={this.state.base64}
				onImageRemove={this.onImageRemove}
                onLike={this.makeLike}
                onDislike={this.makeDisLike}
				onComment={this.onCommentChange}
				fromMealPlan
			/>
		);
	}

	goHome(){
		
		Actions.main({type: ActionConst.RESET});
	}
	
    renderSkipButton () {
		const { buttonContainer, submitButton, submitButtonTitle, buttonReady, skipButtonTitle } = styles;
		const { loading, activeButton, leftButton } = this.state;

		const buttonStyle = activeButton ? [submitButton, buttonReady] : submitButton;

		if (leftButton) {
			return (<View/>);
		}

		return (
				<View style={buttonContainer}>
						<TouchableOpacity
						  	style={[buttonStyle, {backgroundColor:'#fff'}]}
								onPress={this.sendConfirmDecision}
						>
							<Text style={skipButtonTitle}>Skip</Text>
						</TouchableOpacity>
				</View>
		);
	}
		
    renderButton () {
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
            return <ActivityIndicator style={{ margin: 20 }} color={colors.primaryGrey} size={'large'}/>;
        }

    }

	renderDate() {
		const { type, date } = this.props.activeMeal;
		const { dateContainer, recipeType, recipeDate } = styles;
		return (
			<View style={dateContainer}>
				<Text style={recipeType}>{type}</Text>
				<Text style={recipeDate}>{formatServerDate(date)}</Text>
			</View>
		);
	}

	renderHeader() {
		const {leftButton} = this.state;
		if (leftButton === true) {
			return (
				<Header
					title={'How was this meal?'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'arrow-left'}
					leftButtonPress={Actions.pop}
				/>
			);
		} else {
			return (
				<Header
					title={'How was this meal?'}
				/>
			);
		}
	}

	render() {
		const { header, headerStyle } = styles;
		const { showTab, activeMeal, leftButton } = this.props;
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				{this.renderHeader()}
				<KeyboardAvoidingView
					behavior={Platform.OS == 'ios' ? 'position' : undefined}
					style={{ flex: 1, backgroundColor: '#fff' }}
				>
					<ScrollView
						style={{ backgroundColor: '#fff' }}
						onContentSizeChange={() => {
							if (showTab) this.scrollView.scrollToEnd({ animated: false });
						}}
						ref={scrollView => (this.scrollView = scrollView)}
						onScroll={e => {
							if (e.nativeEvent.contentOffset.y < 0)
								this.scrollView.scrollTo({ x: 0, y: 0, animated: false });
						}}
						scrollEventThrottle={0}
						showsVerticalScrollIndicator={false}
					>
            		{this.renderDecisionRow()}
            		{<View style={{ width: '100%', paddingBottom: 10 }}>
                		{this.renderButton()}
            		</View>}
                	{this.renderSkipButton()}

					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = {
	headerStyle: {
		width: '100%',
		height: 60,
		borderRadius: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 15,
		color: '#000'
	},
	imgContainer: {
		height: 250,
		alignItems: 'stretch',
		borderBottomWidth: 0,
		borderBottomColor: 'rgba(0,0,0,0.2)'
	},
	imgStyle: {
		flex: 1,
		borderRadius: 5,
		opacity: 0.4
	},
	header: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.2)',
		paddingBottom: 20
	},
	descriptionContainer: {
		flex: 1,
		marginHorizontal: 10,
		paddingBottom: 10,
		paddingTop: 10
	},
	dateContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.2)'
	},
	recipeType: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	recipeDate: {
		fontSize: 18
	},
	buttonSwap: {
		backgroundColor: colors.primaryGreen,
		height: 50,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonTitle: {
		fontSize: 16,
		color: '#fff'
	},
	cookingTimeContainer: {
		paddingHorizontal: 5,
		fontSize: 10,
		justifyContent: 'space-between'
	},
	warningContainer: {
		justifyContent: 'space-around',
		paddingBottom: 20,
		minHeight: 10
	},
	imageButtonContainer: {
		position: 'absolute',
		backgroundColor: 'transparent',
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	addButtonStyle: {
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	addButton: {
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		width: 100,
		height: 100,
		borderRadius: 0
	},
	addButtonTitle: {
		paddingVertical: 10,
		color: 'rgba(0,0,0,0.2)',
		fontSize: 18,
		flexWrap: 'wrap',
		textAlign: 'center'
	},
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 10
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
    submitButtonTitle: {
        color: '#fff',
        fontSize: 16
    },
		skipButtonTitle: {
				color: colors.primaryBlue,
				fontSize: 18
		},
    buttonReady: {
        backgroundColor: colors.primaryGreen
    },
};

const mapStateToProps = ({ main }) => {
	const { messageToast } = main;
	return {
		messageToast
	};
};

export default connect(mapStateToProps, {
	sendReview
})(ReviewMeal);
