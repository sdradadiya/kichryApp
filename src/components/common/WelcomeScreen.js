/**
 * Created by mponomarets on 9/11/17.
 */
/**
 * Created by mponomarets on 9/10/17.
 */
/**
 * Created by mponomarets on 9/7/17.
 */
import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	Platform,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import {colors, textStyles} from '../../actions/const';
import IconIonic from 'react-native-vector-icons/Ionicons';
import { responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';

class WelcomeScreen extends Component {
	constructor (props) {
		super(props);
		this.state = {
			greeting: this.props.greeting.greeting.text,
			description: this.props.greeting.moto.text,
			author: this.props.greeting.moto.author,
			doctorPhoto: this.props.greeting.greeting.photo,
			goals: this.props.greeting.goals
		};
	}

	componentWillReceiveProps (newProps) {
		if (newProps !== this.props) {
			this.setState({
				width: newProps.width,
				height: newProps.height
			});
		}

	}

	onPressButton () {
		this.props.onClose();
	}

	renderGreetingSection () {
		const {
			greetingTitle,
			greetingText,
			greetingContainer,
			doctorPhotoStyle,
			defaultPhotoStyle,
			greetingTextContainer
		} = styles;
		const {greeting, doctorPhoto} = this.state;

		const doctorAvatar = doctorPhoto ?
			<Image
				style={doctorPhotoStyle}
				source={{uri: doctorPhoto}}
				borderRadius={40}
			/> :
			<IconIonic name="ios-contact" size={80} color={'#fff'} style={defaultPhotoStyle}/>;

		return (
			<View style={greetingContainer}>
				<Text style={greetingTitle}>Welcome</Text>
				{doctorAvatar}
				<View style={greetingTextContainer}>
					<Text style={greetingText}>{greeting}</Text>
				</View>
			</View>
		);
	}

	renderDescriptionContainer () {
		const {
			descriptionContainer,
			textDescription,
			textAuthor
		} = styles;
		const {description, author} = this.state;
		return (
			<View style={descriptionContainer}>
				<Text style={textDescription}>{description}</Text>
				<Text style={textAuthor}> - {author.toUpperCase()}</Text>
			</View>
		);
	}

	renderMeasurements () {
		const {measurementsContainer, measurementsTitleContainer, measurementsTitle, measurements, goalsContainer, goalsItem} = styles;
		const {goals} = this.state;

		if(this.props.showGoals) {

			if (Object.keys(goals).length > 0) {
				return (
					<View style={measurementsContainer}>
						<View style={measurementsTitleContainer}>
							<Text style={measurementsTitle}>
								DIET GOALS
							</Text>
						</View>
						<View style={measurements}>
							{Object.keys(goals).map((item, key) => {
								return (
									<View style={goalsContainer} key={key}>
										<Text style={goalsItem}>{goals[item].from_amount.toString()}</Text>
										<Text style={{fontWeight: 'bold'}}>{item}</Text>
									</View>
								);
							})}
						</View>
					</View>
				);
			} else {
				return null;
			}

		}

		return null;

	}

	render () {
		const {
			container,
			titlePageContainer,
			pageTitle,
			buttonContainer,
			buttonTitle
		} = styles;
		return (
			<View style={[container, {
				width: '100%',
				height: '100%'
			}]}>
				<View style={titlePageContainer}><Text style={pageTitle}>Kitchry</Text></View>
				<ScrollView>
					{this.renderGreetingSection()}
					{this.renderMeasurements()}
					{this.renderDescriptionContainer()}
					<TouchableOpacity
						style={buttonContainer}
						onPress={this.onPressButton.bind(this)}>
						<Text style={textStyles.description16White}>Continue</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

const styles = {
	container: {
		top: 0,
		left: 0,
		position: 'absolute',
		backgroundColor: '#fff'
	},
	titlePageContainer: {
		backgroundColor: colors.primaryBlue,
		height: Platform.OS === 'ios' ? 70 : 90,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.4)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	pageTitle: {
		fontSize: 18,
		color: '#fff'
	},
	greetingTextContainer: {
		marginHorizontal: 20
	},
	greetingTitle: {
		fontSize: 22,
		color: '#fff',
		fontWeight: 'bold',
		paddingVertical: 20
	},
	greetingText: {
		fontSize: 16,
		color: '#fff',
		paddingHorizontal: 30,
		textAlign: 'center',
		paddingVertical: 20,
		lineHeight: 25
	},
	buttonContainer: {
		backgroundColor: colors.primaryGreen,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		borderRadius: 0,
		marginHorizontal: 0
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 20
	},
	greetingContainer: {
		backgroundColor: colors.primaryBlue,
		minHeight: responsiveHeight(43),
		alignItems: 'center',
		justifyContent: 'center'
	},
	descriptionContainer: {
		marginHorizontal: 30,
		borderLeftColor: colors.primaryGrey,
		borderLeftWidth: 1,
		marginVertical: 10
	},
	textDescription: {
		color: colors.primaryGrey,
		fontSize: 16,
		padding: 20
	},
	textAuthor: {
		color: colors.primaryGrey,
		fontSize: 16,
		paddingHorizontal: 20,
		paddingBottom: 10,
		fontWeight: 'bold'
	},
	doctorPhotoStyle: {
		width: 80,
		height: 80
	},
	defaultPhotoStyle: {
		backgroundColor: 'transparent',
		flex: 1
	},
	measurementsContainer: {
		paddingVertical: 20,
		borderBottomColor: 'rgba(0,0,0,0.1)',
		borderBottomWidth: 1
	},
	measurementsTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 30
	},
	measurementsTitle: {
		textAlign: 'left',
		color: colors.primaryOrange,
		fontWeight: 'bold'
	},
	measurements: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 10
	},
	goalsContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	goalsItem: {
		fontWeight: 'bold',
		color: colors.primaryOrange,
		paddingBottom: 5,
		fontSize: 20
	}
};
export {WelcomeScreen};
