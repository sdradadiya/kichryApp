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
	ScrollView,
	TouchableOpacity
} from 'react-native';
import {colors} from '../../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';

class OnboardingScreen extends Component {
	constructor (props) {
		super(props);
		this.state = {
			welcomes: [
				{
					image: require('./img/onboarding-icons-1.png'),
					title: 'Welcome to Kitchry!',
					subtitle: 'Take a look around at all of Kitchry\'s features.'
				},
				{
					image: require('./img/onboarding-icons-2.png'),
					title: 'Home',
					subtitle: 'Here are your upcoming meals. Don\'t forget to give a review of each meal!'
				},
				{
					image: require('./img/onboarding-icons-3.png'),
					title: 'Grocery List',
					subtitle: 'Use our grocery list feature to search through your daily or weekly grocery list.'
				},
				{
					image: require('./img/onboarding-icons-4.png'),
					title: 'Meal Plan',
					subtitle: 'View your daily meal plan here or swipe through each day to see your meal plan for the week!'
				},
				{
					image: require('./img/onboarding-icons-5.png'),
					title: 'Chat',
					subtitle: 'Utilize our chat feature to communicate with your dietitian.'
				}
			],
			width: this.props.width,
			height: this.props.height,
			position: 0,
			activeId: 0
		};
	}

	componentWillReceiveProps (newProps) {
		if (newProps !== this.props) {
			this.setState({
				width: newProps.width,
				height: newProps.height
			}, () => this._scrollView.scrollTo({x: this.state.activeId * newProps.width, y: 0, animated: true}));
		}
	}

	onPressButton () {
		const {activeId, width, welcomes} = this.state;
		if (activeId < welcomes.length - 1) {
			this._scrollView.scrollTo({x: (activeId + 1) * width, y: 0, animated: true});
		} else {
			this.props.onClose();
		}
	}

	render () {
		const {container, elementContainer, wrapper, img, textContainer, title, subtitle, buttonContainer, buttonTitle, indicatorContainer} = styles;
		const {width, activeId, height, welcomes} = this.state;
		const list = welcomes.map((item, index) => {
			return (
				<View style={[elementContainer, {width: width}]} key={index}>
					<View style={wrapper}>
						<View style={{height: height / 2.5}}>
							<Image
								style={img}
								source={item.image}/>
						</View>
						<View style={[textContainer, {width: width}]}>
							<Text style={title}>{item.title}</Text>
							<Text style={subtitle}>{item.subtitle}</Text>
						</View>
					</View>
				</View>
			);
		});
		return (
			<View style={[container, {
				width: '100%',
				height: '100%'
			}]}>
				<ScrollView
					ref={scroll => this._scrollView = scroll}
					horizontal={ true }
					pagingEnabled={ true }
					scrollEventThrottle={100}
					showsHorizontalScrollIndicator={ false }
					onScroll={(e) => {
						if (e.nativeEvent.contentOffset.x % width === 0) {
							this.setState({
								position: e.nativeEvent.contentOffset.x,
								activeId: e.nativeEvent.contentOffset.x / width
							});
						}

					}}
					directionalLockEnabled={true}>
					{list}
				</ScrollView>
				<View
					style={indicatorContainer}>
					{welcomes.map((elem, index) => {
						const isActive = activeId === index ? colors.primaryGreen : '#ebecee';
						return (
							<Icon name={'circle'} size={16} color={isActive} style={{paddingLeft: 5}} key={index}/>
						);
					})}
				</View>
				<TouchableOpacity style={buttonContainer} onPress={this.onPressButton.bind(this)}>
					<Text
						style={buttonTitle}>{activeId === welcomes.length - 1 ? 'DONE' : 'NEXT'}</Text></TouchableOpacity>
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
	elementContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	wrapper: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	img: {
		flex: 1,
		height: 10,
		resizeMode: Image.resizeMode.contain
	},
	textContainer: {
		marginTop: 10
	},
	title: {
		fontWeight: 'bold',
		fontSize: 22,
		color: '#000',
		textAlign: 'center',
		marginHorizontal: 30
	},
	subtitle: {
		fontSize: 18,
		textAlign: 'center',
		marginHorizontal: 30
	},
	buttonContainer: {
		backgroundColor: colors.primaryGreen,
		justifyContent: 'center',
		alignItems: 'center',
		height: 60
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 20
	},
	indicatorContainer: {
		bottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	}
};
export {OnboardingScreen};