import React, { PureComponent } from 'react';
import {View, Text, Modal, TouchableHighlight, Animated, Dimensions, Platform, PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { colors, tracker } from '../../actions/const';
import { AddButton } from './AddButton';

const Nearby = ({ bottom, onPress }) => (
	<Animated.View style={[styles.nearbyContainer, {transform: [{translateY: bottom }]}]}>
		<TouchableHighlight onPress={onPress}>
			<View style={styles.Button} >
				<Icon name="md-pin" size={25} color={'#FFFFFF'}/>
			</View>
		</TouchableHighlight>
		<Text style={styles.textStyle}>Nearby</Text>
	</Animated.View>
);

const BarCode = ({ bottom, right, onPress }) => (
	<Animated.View style={[styles.barcodeContainer, {transform: [{translateY: bottom }, {translateX: right }]}]}>
		<TouchableHighlight onPress={onPress}>
			<View style={styles.Button} >
				<Icon name="md-barcode" size={25} color={'#FFFFFF'}/>
			</View>
		</TouchableHighlight>
		<Text style={styles.textStyle}>Scan</Text>
	</Animated.View>
);

const EnterMeal = ({ bottom, right, onPress }) => (
	<Animated.View style={[styles.entermealContainer, {transform: [{translateY: bottom }, {translateX: right }]}]}>
		<TouchableHighlight onPress={onPress}>
			<View style={styles.Button} >
				<Icon2 name="cutlery" size={25} color={'#FFFFFF'}/>
				{tracker.trackEvent('Click On', 'Track Meal')}
			</View>
		</TouchableHighlight>
		<Text style={styles.textStyle}>Track Meal</Text>
	</Animated.View>
);


class AdditionalMenu extends PureComponent {

	constructor (props) {
		super(props);

		this.state = {
			screenHeight: '',
			screenWidth: ''
		};

		this.closeMenu = this.closeMenu.bind(this);

	}

	componentWillMount() {
		var {height, width} = Dimensions.get('window');

		this.setState({
			screenHeight: height,
			screenWidth: width
		});

		this.bottomNearbyAnim = new Animated.Value(height - 130);
		this.bottomBarcodeAnim = new Animated.Value(height - (Platform.OS === 'ios' ? 130 : 130));
		this.rightBarcodeAnim = new Animated.Value(width - (Platform.OS === 'ios' ? 65 : 65));
		this.bottomMealAnim = new Animated.Value(height - (Platform.OS === 'ios' ? 130 : 130 ));
		this.rightMealAnim = new Animated.Value(width - (Platform.OS === 'ios' ? 75 : 75));
	}

	componentWillReceiveProps(newProps) {

		if(newProps.isVisible === true) {
			Animated.parallel([
				Animated.timing(this.bottomNearbyAnim, {
					toValue: this.state.screenHeight - (Platform.OS === 'ios' ? 370 : 390),
					duration: 200
				}).start(),
				Animated.timing(this.bottomBarcodeAnim, {
					toValue: this.state.screenHeight - (Platform.OS === 'ios' ? 290 : 230),
					duration: 200
				}).start(),
				/*Animated.timing(this.rightBarcodeAnim, {
					toValue: this.state.screenWidth - (Platform.OS === 'ios' ? 170 : 170),
					duration: 200
				}).start(),*/
				Animated.timing(this.bottomMealAnim, {
					toValue: this.state.screenHeight - (Platform.OS === 'ios' ? 210 : 310),
					duration: 200
				}).start()
				/*Animated.timing(this.rightMealAnim, {
					toValue: this.state.screenWidth - (Platform.OS === 'ios' ? 190 : 190),
					duration: 200
				}).start()*/
			]);

		}
	}

	closeMenu() {
		const { screenWidth, screenHeight } = this.state;

		Animated.parallel([
			Animated.timing(this.bottomNearbyAnim, {
				toValue: screenHeight - 130,
				duration: 200
			}),
			Animated.timing(this.bottomBarcodeAnim, {
				toValue: screenHeight - (Platform.OS === 'ios' ? 130 : 150),
				duration: 200
			}),
			Animated.timing(this.rightBarcodeAnim, {
				toValue: screenWidth - (Platform.OS === 'ios' ? 65 : 65),
				duration: 200
			}),
			Animated.timing(this.bottomMealAnim, {
				toValue: screenHeight - (Platform.OS === 'ios' ? 130 : 170),
				duration: 200
			}),
			Animated.timing(this.rightMealAnim, {
				toValue: screenWidth - (Platform.OS === 'ios' ? 75 : 75),
				duration: 200
			})
		]).start(() => {
			this.props.toggleMenu('close');
		});

	}

	onPressButton(button) {
		this.props.toggleMenu(button);
	}

	renderButtons() {

		return(
			<View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.8)'}}>

				<Nearby
					bottom={this.bottomNearbyAnim}
					onPress={() => this.onPressButton('nearby')}
				/>
				<BarCode
					bottom={this.bottomBarcodeAnim}
					right={this.rightBarcodeAnim}
					onPress={() => this.onPressButton('barcode')}
				/>
				<EnterMeal
					bottom={this.bottomMealAnim}
					right={this.rightMealAnim}
					onPress={() => this.onPressButton('addmeal')}
				/>

				<AddButton
					onPress={this.closeMenu}
					inModal={true}
				/>
			</View>
		);

	}

	render() {

		return(
			<Modal
				visible={this.props.isVisible}
				transparent={true}
				animationType={'fade'}
				onRequestClose={() => {return;}}
			>
				{this.renderButtons()}
			</Modal>
		);

	}

}

const styles = {

	Button: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.primaryGreen

	},
	textStyle: {
		color: '#fff',
		fontSize: 15,
		marginTop: 2
	},
	nearbyContainer: {
		flex: 1,
		alignItems: 'center',
		position: 'absolute',
		right: 15
		// bottom: 180
	},
	barcodeContainer: {
		flex: 1,
		alignItems: 'center',
		position: 'absolute'
		// right: 100,
		// bottom: 140
	},
	entermealContainer: {
		flex: 1,
		alignItems: 'center',
		position: 'absolute'
		//right: 15,
		// bottom: 50
	}
};

export { AdditionalMenu };
