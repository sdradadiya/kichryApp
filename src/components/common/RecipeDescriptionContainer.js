/**
 * Created by mponomarets on 7/23/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, showAnimation, textStyles} from '../../actions/const';

class RecipeDescriptionContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDescriptionOpen: true
		};
		this.animatedValue = new Animated.Value(0);
	}

	renderDescription() {
		const body = this.props.isContent ? this.props.directions : this.props.description;

		const {descriptionContainer, descriptionStyle} = styles;
		
		if (this.state.isDescriptionOpen) {
			if(body.includes('http')) {
				return (
					<View style={descriptionContainer}>
						<Text style={descriptionStyle}>For cooking directions, please click on the link below.</Text>
						<Text style={[descriptionStyle, {color: 'rgb(6,69,173)'}]} onPress={() => Linking.openURL(body)}>{body}</Text>
					</View>
				);
			}else{
				return (
					<View style={descriptionContainer}>
						<Text style={textStyles.description14}>{body}</Text>
					</View>
				);
			}

		}
		else {
			return null;
		}
	}

	onPress() {
		if (this.state.isDescriptionOpen) {
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

		const title = this.props.isContent ? 
			'Directions' : 
			'Description';

		return (
			<View style={{flex: 1}}>
				<TouchableOpacity style={buttonContainer} onPress={() => this.onPress()}>
					<View style={textContainer}>
						<Text style={[textStyles.l3Text, textStyle]}>{title}</Text>
						<Animated.View style={{transform: [{rotate: spin}]}}>
							<Icon name={'angle-up'} size={22} color={colors.primaryBlue}/>
						</Animated.View>
					</View>
				</TouchableOpacity>
				{this.renderDescription()}
			</View>
		);
	}
}

const styles = {
	buttonContainer: {
		height: 60,
		flexDirection: 'column',
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: colors.primaryGrey
	},
	textContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	textStyle: {
		marginRight: 10,
		flex: 0.8
	},
	descriptionContainer: {
		paddingHorizontal: 10
	}
};
export {RecipeDescriptionContainer};
