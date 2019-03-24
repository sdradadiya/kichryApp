import React, {Component} from 'react';
import {View, Alert, ActivityIndicator, TouchableOpacity, Text, Platform} from 'react-native';
import {connect} from 'react-redux';
import {Header} from './common';
import Camera from 'react-native-camera';
import {Actions} from 'react-native-router-flux';
import {loadNutritionForUPC} from '../actions';
import { tracker } from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';
import {colors} from '../actions/const';

class BarCodeScreen extends Component {
	constructor (props) {
		super(props);
		this.state = {
			showSpinner: false,
			showCamera: true
		};
	}

	componentDidMount()
	{
        tracker.trackScreenView("BarCodeScreen");
	}

	componentWillReceiveProps (newProps) {
		if ((newProps.loading !== this.props.loading) && (!newProps.loading)) {
			this.setState({showSpinner: false}); // always clear the spinner when result of UPC lookup received
			if(newProps.error) {								 // if error received, alert user (once)
				Alert.alert(newProps.error, null, [{ text: 'OK', onPress: () => this.setState({showCamera: true}) }]);
			}
		}
	}

	_onBarCodeRead = ({ data, type }) => {
		this.setState({ showCamera: false, showSpinner: true });
		const isSupportedBarcode = type.toLowerCase().search('ean_13') > -1 || type === 'org.gs1.EAN-13';
		const { add, replace, planMealType, scannedRecipeForBook } = this.props;
		if (isSupportedBarcode) {
			const upc = data.slice(1);
			this.props.loadNutritionForUPC({upc, add, replace, planMealType, scannedRecipeForBook});
		} else {
			this.setState({showSpinner: false});
			Alert.alert('Barcode not supported', null, [{ text: 'OK', onPress: () => this.setState({showCamera: true}) }]);
		}
	};

	renderCamera() {
		if(this.state.showCamera) {
			return(
				<Camera
					ref='cam'
					defaultOnFocusComponent={true}
					style={styles.camera}
					onBarCodeRead={this._onBarCodeRead}
					type={Camera.constants.Type.back}
					barcodeFinderVisible={true}
					barcodeFinderWidth={280}
					barcodeFinderHeight={200}
				/>
			);
		} else {
			return (this.state.showSpinner ? (
				<View style={styles.codeReaderContainer}>
					<ActivityIndicator color={'#fff'} size={'large'} />
				</View>
			) : (
				<TouchableOpacity
					style={styles.codeReaderContainer}
					onPress={() => this.setState({ showCamera: true })}>
					<Text style={styles.continueScan}>Press to scan</Text>
				</TouchableOpacity>
			))
		}
	}

	render () {
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={'Barcode Scanner'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
				/>
				<View style={styles.container}>
					{this.renderCamera()}
				</View>
			</SafeAreaView>
		);
	}
}

const styles = {
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: '#000'
	},
	camera: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	continueScan: {
		color: '#fff',
		fontSize: 16,
		backgroundColor: 'transparent'
	},
	codeReaderContainer: {
		alignSelf: 'center',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	}
};

const mapStateToProps = ({mealPlan}) => {
	const {loading, error} = mealPlan;
	return {loading, error};
};

export default connect(mapStateToProps, {loadNutritionForUPC})(BarCodeScreen);
