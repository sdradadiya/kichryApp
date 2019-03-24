/**
 * Created by mponomarets on 7/2/17.
 */

import React, { Component } from 'react';
import {
	View,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Modal,
	Text,
	Alert,
	Platform,
	ActivityIndicator,
	StatusBar,
	AsyncStorage,
	TouchableOpacity,
	Dimensions,
	Image
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	emailChanged,
	checkAuth,
	passwordChanged,
	loginUser,
	GoogleOauth
} from '../actions';
import { Input, Button } from './common';
import {
	version,
	appVersion,
	appPlatform,
	getKeyFromStorage,
	iosClientId,
	webClientId,
	tracker
} from '../actions/const';
import { GoogleSignin } from 'react-native-google-signin';
import Toast from 'react-native-another-toast';
import FingerprintScanner from "react-native-fingerprint-scanner";

export class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showPassword: false,
			modalVisible:false,
			fingerprint:true,
			renderToast:false
		};
	}
	componentDidMount() {
        getKeyFromStorage().then(({email}) => {
            if (email) this.onEmailChange(email);
        }).catch(err => alert(err.toString()));
        GoogleSignin.hasPlayServices({autoResolve: true});
        GoogleSignin.configure({
            iosClientId: iosClientId,
            webClientId
        })
        tracker.trackScreenView("LoginScreen");
    }
    componentWillMount(){
        FingerprintScanner
            .isSensorAvailable()
            .catch((error) =>{
                this.setState({ fingerprint: false });
            });
		if(!this.props.loginWithEmail){
            AsyncStorage.getItem('fingerprint').then(res=>{
                if(res === 'Enable') {
                    Actions.scanner({type: 'replace'});
                }else{
                    Actions.auth({type: 'replace'});
                }
            });
		}
        this.props.checkAuth().then(res=>{
        	if(res){
        		Actions.main({type: 'replace'});
        	}
        }).catch(e=>{})
	 }

	focusPassword = () => {
		if (passwordRef) passwordRef.focus();
	};

	onEmailChange = text => this.props.emailChanged(text);

	onPasswordChange = text => this.props.passwordChanged(text);

	fingerPrintModal=()=>{
		return (
			<Modal
				animationType="slide"
				transparent={true}
				supportedOrientations={['portrait', 'landscape']}
				visible={this.state.modalVisible}
				onRequestClose={() => console.log('close')}
				onShow={() => console.log('open')}>
				<View style={styles.container}>
					<View style={styles.contentContainer}>
						<View style={{flex: 1}}>
							<View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
								<View style={styles.modalTitle}>
									<Text style={styles.modalTitleText}>Enable Fingerprint Authentication</Text>
								</View>
							</View>
							<View>
								<View style={styles.modalButtonView}>
									<TouchableOpacity onPress={() => {
                                        AsyncStorage.setItem('once', 'yes').then(()=>{
                                            Actions.main({type: 'replace'});
                                        });
									}} style={styles.button}><Text style={styles.buttonTitle}>No thanks</Text></TouchableOpacity>
									<TouchableOpacity onPress={() => {
                                        AsyncStorage.multiSet([['fingerprint', "Enable"], ['once', 'yes'], ["password", this.state.pass]]).then(() => {
												this.setState({modalVisible: false,renderToast:true},()=>{
                                                    this.toast.showToast();
                                                    setTimeout(()=>{
                                                        this.setState({
                                                            renderToast: false,
                                                        });
                                                        Actions.main({type:'replace'});
                                                    },3000)
                                                });
                                        	});
                                    	}
									} style={styles.button}><Text style={styles.buttonTitle}>Enable Fingerprint</Text></TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		)
	};

	onButtonPress = () => {
		const { email, password } = this.props;
		this.setState({
			pass:password
		});

		this.props.loginUser({email, password}).then((res) => {
			
			AsyncStorage.getItem('once').then(value => {
				if (value === null) {
                    if(this.state.fingerprint){
                        this.setState({modalVisible: true});
                    }else{
                        this.setState({renderToast: true},()=>{
                            this.toast.showToast();
                            setTimeout(()=>{
                                this.setState({
                                    renderToast: false,
                                });
                                Actions.main({type:'replace'});
                            },3000)
                        });
                    }
				} else if(value == "yes") {
                    this.setState({renderToast: true},()=>{
                        this.toast.showToast();
                        setTimeout(()=>{
                            this.setState({
                                renderToast: false,
                            });
                            Actions.main({type:'replace'});
                        },3000)
                    });
				}
			})
		}).catch(e=>{Alert.alert("error", str(e))});
		Keyboard.dismiss();
	};

	toggleShowPassword = () =>
		this.setState({ showPassword: !this.state.showPassword });

	renderStatusBar() {
		if (Platform.OS === 'android') {
			return <StatusBar translucent={true} backgroundColor={'transparent'} />;
		} else {
			return <StatusBar barStyle="light-content" />;
		}
	}

	renderError() {
		const { error } = this.props;
		if (error) return <Text style={styles.errorText}>{error}</Text>;
	}

	_GoogleOauth = () => {
		GoogleSignin.signIn()
			.then(user => {
				if (user) {
					this.props.GoogleOauth(
						user.email,
						user.idToken,
						appPlatform,
						appVersion
					);
				}
			})
	};

	renderEmailInput = () => (
		<View style={styles.inputWrap}>
			<Icon
				style={styles.iconStyle}
				name="ios-mail-outline"
				size={20}
				color="#fff"
			/>
			<View style={styles.wrapper}>
				<Input
					placeholder="E-mail"
					keyboardType="email-address"
					returnKeyType="next"
					changeText={this.onEmailChange}
					value={this.props.email}
					onSubmitEditing={this.focusPassword}
				/>
			</View>
		</View>
	);

	renderPasswordInput = () => {
		const { showPassword } = this.state;
		return (
			<View style={styles.inputWrap}>
				<Icon
					style={styles.iconStyle}
					name="ios-unlock"
					size={20}
					color="#fff"
				/>
				<View style={styles.wrapper}>
					<Input
						rel={ref => (passwordRef = ref)}
						secureTextEntry={!showPassword}
						placeholder="password"
						changeText={this.onPasswordChange}
						value={this.props.password}
						returnKeyType="go"
						onSubmitEditing={this.onButtonPress}
					/>
				</View>
				<TouchableWithoutFeedback onPress={this.toggleShowPassword}>
					<Icon
						style={styles.iconStyle}
						name="ios-eye"
						color={showPassword ? 'red' : '#fff'}
						size={25}
					/>
				</TouchableWithoutFeedback>
			</View>
		);
	};

	renderSubmitButton = () => (
		<Button title="Get Started" onPress={this.onButtonPress} />
	);

	renderForgotPasswordButton = () => (
		<TouchableOpacity onPress={() => Actions.forgotForm()}>
			<View style={{ paddingVertical: 5 }}>
				<Text style={styles.versionStyle}>Forgot password?</Text>
			</View>
		</TouchableOpacity>
	);

	renderGoogleSignInButton = () => (
		<TouchableOpacity onPress={this._GoogleOauth}>
			<View style={styles.googleSigninButton}>
				<Icon name="logo-google" size={25} color={'#fff'} />
				<Text style={styles.googleSigninText}>Sign in</Text>
			</View>
		</TouchableOpacity>
	);

	renderInputs() {
		if (this.props.loading) {
			return (
				<View style={{ flex: 1 }}>
					<ActivityIndicator color={'#fff'} size={'large'} />
				</View>
			);
		} else {
			return (
				<View style={styles.formContainer}>
					<View style={styles.inputsContainer}>
						{this.renderEmailInput()}
						{this.renderPasswordInput()}
					</View>
					{this.renderSubmitButton()}
					{this.renderError()}
					{this.renderForgotPasswordButton()}
					{this.renderGoogleSignInButton()}
				</View>
			);
		}
	}

	renderLogo = () => (
		<View style={styles.logoContainer}>
			<Text style={styles.titleApp}>KITCHRY</Text>
		</View>
	);

	renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        const { toastStyle, toastTitle } = styles;
        if(this.state.renderToast){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
                        <Image
                            style={{ width: 90, height: 90 }}
                            source={require('../../resources/img/loginSuccess.gif')}
                        />
                        <Text style={toastTitle}>Success!</Text>
                    </View>
                }
                animationType={'fade'}
                animationDuration={200}
                topBottomDistance={Height}
                toastStyle={toastStyle}
                autoCloseTimeout={2500}
                ref={(c) => { this.toast = c }}
            />);
        }
    }

	render() {
		return (
			<SafeAreaView style={styles.screenContainer}>
				{this.renderStatusBar()}
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}>
					{this.renderLogo()}
					{this.renderInputs()}
					{this.fingerPrintModal()}
					<Text style={styles.versionStyle}>{version}</Text>
                    {this.renderToast()}
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = {
	screenContainer: {
		flex: 1,
		backgroundColor: 'rgb(57, 192, 111)'
	},
	titleApp: {
		color: '#fff',
		fontSize: 30
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		marginTop: 50,
		justifyContent: 'center'
	},
	formContainer: {
		padding: 10,
		flexDirection: 'column',
		marginBottom: 50
	},
	inputsContainer: {
		marginHorizontal: 20,
		marginBottom: 5,
		borderRadius: 5,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	inputWrap: {
		borderColor: 'rgba(255,255,255,0.6)',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 3,
		marginVertical: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,0.2)'
	},
	wrapper: {
		flex: 1.5
	},
	iconStyle: {
		flex: 0.15,
		marginHorizontal: 5,
		paddingLeft: 10
	},
	checkboxWrapper: {
		marginTop: 15
	},
	versionStyle: {
		textAlign: 'center',
		color: 'grey'
	},
	googleSigninButton: {
		justifyContent: 'center',
		flexDirection: 'row',
		paddingVertical: 15,
		marginTop: 10
	},
	googleSigninText: {
		textAlign: 'center',
		paddingTop: 2,
		paddingLeft: 10,
		color: '#fff'
	},
	errorText: {
		paddingVertical: 7,
		textAlign: 'center',
		color: 'red'
	},
    container: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    contentContainer: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginHorizontal: 10,
        marginVertical: 40,
        paddingTop: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingBottom: 20
    },
    modalTitle: {
        paddingVertical: 15
    },
    button: {
        height: 40,
				margin:'2%',
        width: '46%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 5,
		backgroundColor:'rgb(57, 192, 111)'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 15
    },
    modalButtonView:{
		flexDirection:'row',
		alignItems:'center',
	},
    modalTitleText:{
		fontSize:20
	},
    toastStyle: {
        borderRadius:10,
        height:170,
        width:170,
		backgroundColor:'black'
    },
    toastTitle: {
        color: '#fff',
        fontSize:18,
        textAlign: 'center',
        justifyContent:'center'
    },
    toastSubTitle: {
        color: '#fff',
        fontSize:15,
        textAlign: 'center',
        justifyContent:'center'
    }
};

const mapStateToProps = ({ auth }) => {
	const { email, password, error, platform, loading } = auth;
	return { email, password, error, platform, loading };
};


export default connect(mapStateToProps, {
	emailChanged,
	passwordChanged,
	loginUser,
	checkAuth,
	GoogleOauth
})(LoginScreen);
