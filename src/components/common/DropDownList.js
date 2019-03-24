import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableWithoutFeedback,
	Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, showAnimation} from '../../actions/const';



class DropDownList extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			isDescriptionOpen: false
		};

		this.animatedValue = new Animated.Value(0);
	}

	renderContent() {

		const {contentContainer, contentStyle} = styles;

		const content = this.props.content;

		if(this.state.isDescriptionOpen) {
			
			return(
				<View style={contentContainer}>
					<Text style={contentStyle}>{content}</Text>
				</View>
			);

		}

		return null;

	}

	onPress() {
		if (!this.state.isDescriptionOpen) {
			showAnimation(this.animatedValue, 1);
		} else {
			showAnimation(this.animatedValue, 0);
		}
		this.setNewState();
	}

	setNewState() {
		this.setState({
			isDescriptionOpen: !this.state.isDescriptionOpen
		});
	}

	render() {
		
		const {buttonContainer, textContainer, textStyle} = styles;
		const spin = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '180deg']
		});

		const title = this.props.title;
		const borderBottom = this.state.isDescriptionOpen;

		return(
			<View>
				<TouchableWithoutFeedback style={buttonContainer} onPress={() => this.onPress()}>
					<View style={[textContainer, {borderBottomWidth: borderBottom ? 0 : 1}]}>
						<Text style={textStyle}>{title}</Text>
						<Animated.View style={{transform: [{rotate: spin}]}}>
							<Icon name={'angle-up'} size={22} color={colors.primaryOrange}/>
						</Animated.View>
					</View>
				</TouchableWithoutFeedback>
				{this.renderContent()}
			</View>
		);

	}

}

const styles = {
	buttonContainer: {
		// height: 60,
		// flexDirection: 'column',
		// marginBottom: 10,
		// borderTopWidth: 1,
		// borderBottomWidth: 1,
		// borderColor: colors.primaryGreen
	},
	textContainer: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 60,
		marginBottom: 0,
		borderColor: colors.primaryGreen
	},
	textStyle: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 18,
		marginRight: 10,
		flex: 0.8
	},
	contentContainer: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 5,
		marginRight: 5,
		marginTop: 5,
		marginBottom: 5
	},
	contentStyle: {
		fontSize: 16,
		color: '#000'
	}
};

export {DropDownList};