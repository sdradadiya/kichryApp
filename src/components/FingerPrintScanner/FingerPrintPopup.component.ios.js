import React, { Component } from 'react';
import { AlertIOS, AsyncStorage } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {checkAuth, loginUser} from '../../actions';

class FingerprintPopup extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		FingerprintScanner
			.authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
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
				AlertIOS.alert(error.message);
			});
	}

	render() {
		return false;
	}
}

FingerprintPopup.propTypes = {
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
