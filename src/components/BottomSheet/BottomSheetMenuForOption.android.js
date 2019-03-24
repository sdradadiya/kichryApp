import React, { PureComponent } from 'react';
import {
	Text,
	Dimensions,
	Animated,
	TouchableWithoutFeedback,
	TouchableOpacity,
	View
} from 'react-native';
import { connect } from 'react-redux';
import { toggleBottomSheetMenuForOption, toggleBottomSheetMenuForGroceryOption, toggleBottomSheetMenuForSwapOption, toggleBottomSheetMenuForTrackOption } from '../../actions/index';
import { colors } from '../../actions/const';
const { height } = Dimensions.get('window');

class BottomSheetMenuForOption extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			backgroundColor: new Animated.Value(0),
			backgroundPosition: 0,
			buttons: this.props.buttons

		};
		this.menuAnimatedValue = new Animated.Value(height);
	}

	componentWillMount () {
		this.showDecisionMenu();
	}

	showDecisionMenu () {
		this.changeBackgroundPosition(0);
		this.state.backgroundColor.setValue(0);
		Animated.parallel([
			Animated.timing(this.menuAnimatedValue, {
				duration: 300,
				toValue: 0
			}),
			Animated.timing(this.state.backgroundColor, {
				duration: 300,
				toValue: 300
			})
		]).start(() => {
		});
	}

	changeBackgroundPosition (position) {
		this.setState({
			backgroundPosition: position
		});
	}

	hideDecisionMenu = () => {
		this.state.backgroundColor.setValue(300);
		Animated.parallel([
			Animated.timing(this.menuAnimatedValue, {
				duration: 300,
				toValue: height
			}),
			Animated.timing(this.state.backgroundColor, {
				duration: 300,
				toValue: 0
			})
		]).start(() => {
			this.changeBackgroundPosition(height);
			if(this.props.onCancel) {
				this.props.onCancel();
			} else {
				this.props.toggleBottomSheetMenuForOption(false);
				this.props.toggleBottomSheetMenuForGroceryOption(false);
                this.props.toggleBottomSheetMenuForSwapOption(false);
                this.props.toggleBottomSheetMenuForTrackOption(false);
			}
		});
	};

	renderCancelButton() {

		const { buttonContainer, buttonTitle, buttonCancelTitle, cancelButton } = styles;
		
		if(!this.props.doNotRenderCancelButton){
			return(
				<TouchableOpacity
					activeOpacity={0.9}
					style={[buttonContainer, cancelButton]}
					onPress={this.hideDecisionMenu}>
					<Text style={[buttonTitle, buttonCancelTitle]}>Cancel</Text>
				</TouchableOpacity>
			);
		} else {
			return(
				<View style={{ width: '100%', height: 75 }}></View>
			);
		}
		
	}

	render () {
		let opacityBgColor = this.state.backgroundColor.interpolate({
			inputRange: [0, 300],
			outputRange: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)']
		});
		const { opacityAnimContainer, buttonContainer, buttonTitle, firstButton, lastButton, moveAnimContainer, contentContainer } = styles;
		const opacityContainer = [opacityAnimContainer, { backgroundColor: opacityBgColor }];
		const moveContainer = [moveAnimContainer, {
			transform: [{ translateY: this.menuAnimatedValue }]
		}];
		return (
			<Animated.View style={opacityContainer}>
				<TouchableWithoutFeedback onPress={this.hideDecisionMenu}>
					<Animated.View style={moveContainer}>
						<View style={contentContainer}>

                            {
                                (this.state.buttons && this.state.buttons[0].icon && this.state.buttons.length === 6) && this.state.buttons.map((button, index) => {
                                    let buttonStyle = buttonContainer;
                                    if (index === 0) {
                                        buttonStyle = [buttonContainer, firstButton];
                                    }
                                    if (index === (this.state.buttons.length - 1)) {
                                        buttonStyle = [buttonContainer, lastButton];
                                    }
                                    return (

                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            key={button.title}
                                            style={buttonStyle}
                                            onPress={button.onPress}>
                                            <View style={{flexDirection:'row',justifyContent:'center',alignItems: 'center'}}>
                                                <View style={{width:70,justifyContent:'center',alignItems: 'center'}}>
                                                    <Icon name={button.icon} size={30} color={colors.primaryBlack} />
                                                </View>
                                                <View style={{flex:1,justifyContent:'center'}}>
                                                    <Text style={buttonTitle}>{button.title}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    );
                                })||
                                this.state.buttons && this.state.buttons.map((button, index) => {
                                        let buttonStyle = buttonContainer;
                                        if (index === 0) {
                                            buttonStyle = [buttonContainer, firstButton];
                                        }
                                        if (index === (this.state.buttons.length - 1)) {
                                            buttonStyle = [buttonContainer, lastButton];
                                        }
                                        return <TouchableOpacity
                                            activeOpacity={0.9}
                                            key={button.title}
                                            style={buttonStyle}
                                            onPress={button.onPress}>
                                            <Text style={buttonTitle}>{button.title}</Text>
                                        </TouchableOpacity>
                                    }
                                )

                            }{
                            /*{this.state.buttons && this.state.buttons.map((button) => {
                                    return <TouchableOpacity
                                        activeOpacity={0.9}
                                        key={button.title}
                                        style={buttonContainer}
                                        onPress={button.onPress}>
                                        <Text style={buttonTitle}>{button.title}</Text>
                                    </TouchableOpacity>
                                }
                            )}*/
                        }
							{this.renderCancelButton()}
						</View>
					</Animated.View>
				</TouchableWithoutFeedback>
			</Animated.View >
		);
	}
}

const styles = {
	opacityAnimContainer: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		bottom: 0
	},
	moveAnimContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		height: '100%'
	},
	contentContainer: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	buttonContainer: {
		width: '100%',
		height: 55,
		alignItems: 'flex-start',
		backgroundColor: '#fff',
		justifyContent: 'center',
		paddingLeft: 20
	},
	buttonTitle: {
		color: '#457afc',
		fontSize: 20,
		fontWeight: '400',
		textAlign: 'left',
	},
	separator: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.1)'
	},
    firstButton: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
};

const mapStateToProps = ({ main }) => {
	const { activeMeal } = main;
	return { activeMeal };
};

export default connect(mapStateToProps, {
	toggleBottomSheetMenuForOption,
	toggleBottomSheetMenuForGroceryOption,
    toggleBottomSheetMenuForSwapOption,
    toggleBottomSheetMenuForTrackOption
})(BottomSheetMenuForOption);
