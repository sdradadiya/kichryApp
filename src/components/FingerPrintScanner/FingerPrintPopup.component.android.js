import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {checkAuth, loginUser} from '../../actions';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from 'react-native';

class FingerprintPopup extends Component {

	constructor(props) {
		super(props);
        this.state = {
            loadingLogin: false,
        };
	}
	componentDidMount() {
		FingerprintScanner
			.authenticate({ onAttempt: this.handleAuthenticationAttempted })
			.then(() => {
				this.props.handlePopupDismissed();
				AsyncStorage.multiGet(['userKitchry', 'password']).then((res, err)=>{
					let email = res[0][1];
					let password = res[1][1];
					this.props.loginUser({email, password} ).then(()=>{
						this.props.onSuccess();
					}).catch(()=>{
                        this.props.handleError(this.props.error);
					});
				});
			})
			.catch((error) => {
				this.props.handlePopupDismissed();
				Alert.alert('Kitchry',error.message);
			});
	}

	handleAuthenticationAttempted = (error) => {
        this.props.handleError("Fingerprint Not Match");
	};

	render() {
		const { errorMessage } = this.state;
	    const { style, handlePopupDismissed } = this.props;
	 
	    return (
	      <View style={styles.container}>
	        <View style={[styles.contentContainer, style]}>
	 
	          <Image
	            style={styles.logo}
				source={require('../../../resources/img/finger_print.png')}

	          />
	 	  		
			<View>
	          <Text style={styles.heading}>
	            Fingerprint{'\n'}Authentication
	          </Text>
	          <Text style={styles.description(!!errorMessage)}>
	            {errorMessage || 'Scan your fingerprint on the\ndevice scanner to continue'}
	          </Text>
			 </View>
	 
	          <TouchableOpacity
	            style={styles.buttonContainer}
	            onPress={handlePopupDismissed}
	          >
	            <Text style={styles.buttonText}>
	              BACK TO MAIN
	            </Text>
	          </TouchableOpacity>
	 
	        </View>
	      </View>
	    );
	}
}

const styles = {
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 164, 222, 0.9)',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
	logo: {
		marginVertical: 45,
	},
	heading: {
		textAlign: 'center',
		color: '#00a4de',
		fontSize: 21,
	},
	description: (error) => ({
		textAlign: 'center',
		color: error ? '#ea3d13' : '#a5a5a5',
		height: 65,
		fontSize: 18,
		marginVertical: 10,
		marginHorizontal: 20,
	}),
	buttonContainer: {
		padding: 20,
	},
	buttonText: {
		color: '#8fbc5a',
		fontSize: 15,
		fontWeight: 'bold',
	},
};

FingerprintPopup.propTypes = {
	style: ViewPropTypes.style,
	handlePopupDismissed: PropTypes.func.isRequired
};

const mapStateToProps = ({ auth }) => {
    const { error, loading } = auth;
    return { error, loading };
};

export default connect(mapStateToProps, {
	loginUser,
    checkAuth
})(FingerprintPopup);
