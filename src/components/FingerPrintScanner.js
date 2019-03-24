import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Modal,
    Dimensions,
    AsyncStorage,
    Alert,
    ActivityIndicator,
    Platform,
    StatusBar
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import {Actions} from 'react-native-router-flux';
import Toast from 'react-native-another-toast';
import FingerprintPopup from './FingerPrintScanner/FingerPrintPopup.component';
import {tracker} from '../actions/const';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {checkAuth, loginUser} from '../actions';
import {version} from "../actions/const";

const { width } = Dimensions.get('window');

class FingerPrintScanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: undefined,
            popupShowed: false,
            modalSuccess:false,
            loading:true,
            renderToast:false
        };
    }

    handleFingerprintShowed = () => {
        this.setState({ popupShowed: true });
    };

    handleFingerprintDismissed = () => {
        this.setState({ popupShowed: false });
    };

    handleError = (error) => {
        if (error) {
            Alert.alert("Kitchry",error);
        }
    }

    async componentWillMount()
    {
        await this.props.checkAuth().then(res=>{
            if(res){
                Actions.main({type:'replace'});
            }else{
                this.setState({'loading':false});
            }
        })
    }


    renderStatusBar() {
        if (Platform.OS === 'android') {
            return <StatusBar translucent={true} backgroundColor={'transparent'} />;
        } else {
            return <StatusBar barStyle="light-content" />;
        }
    }


    componentDidMount() {
        FingerprintScanner
            .isSensorAvailable()
            .catch((error) =>{
                this.setState({ errorMessage: error.message });
            });
        tracker.trackScreenView("FingerPrintScanner");
    }

    renderError() {
        const { error } = this.props;
        if (error) return <Text style={styles.errorText}>{error}</Text>;
    }

    renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        if(this.state.renderToast){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
                        <Image
                            style={{ width: 90, height: 90 }}
                            source={require('../../resources/img/loginSuccess.gif')}
                        />
                        <Text style={styles.toastTitle}>Success!</Text>
                    </View>
                }
                animationType={'fade'}
                animationDuration={200}
                topBottomDistance={Height}
                toastStyle={styles.toastStyle}
                autoCloseTimeout={3000}
                ref={(c) => { this.toast = c }}
            />);
        }
    }

    render() {
        const { errorMessage, popupShowed } = this.state;
        if (this.state.loading) {
            return (
                <View style={styles.screenContainer}>
                    {this.renderStatusBar()}
                    <View style={styles.logoContainer}>
                        <Text style={styles.titleApp}>KITCHRY</Text>
                    </View>
                    <View style={{flex:1}}>
                        <ActivityIndicator color={'#fff'} size={'large'} />
                    </View>
                </View>
            );
        }else{
            return (
                <View style={styles.container}>

                    <Text style={styles.heading}>
                        Fingerprint Scanner
                    </Text>

                    <TouchableOpacity
                        style={styles.fingerprint}
                        onPress={this.handleFingerprintShowed}
                        disabled={!!errorMessage}
                    >
                        <Image source={require('../../resources/img/finger_print.png')} />
                    </TouchableOpacity>



                    {errorMessage && (
                        <Text style={styles.errorMessage}>
                            {errorMessage}
                        </Text>
                    ) ||
                    ( <Text style={[styles.heading,{fontSize:15,alignSelf:'center',textAlign:'center'}]}>
                        Tap on the Fingerprint image above to start authentication
                    </Text>)}

                    <TouchableOpacity
                        style={styles.fingerprint}

                        onPress={()=>Actions.auth({loginWithEmail:true})}>
                        <Text style={styles.heading}>Log In with Email</Text>
                    </TouchableOpacity>

                    {popupShowed && (
                        <FingerprintPopup
                            style={styles.popup}
                            handlePopupDismissed={this.handleFingerprintDismissed}
                            handleError={this.handleError}
                            onSuccess={()=>{
                                this.setState({renderToast:true},()=>{
                                    this.toast.showToast();
                                    setTimeout(()=>{
                                        this.setState({
                                            renderToast: false,
                                        });
                                        Actions.main({type:'replace'});
                                    },1000)
                                });
                            }}
                        />
                    )}
                    {this.renderError()}
                    {this.renderToast()}
                </View>
            );
        }
    }
}


const styles =  {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(57, 192, 111)'
    },
    screenContainer: {
        flex: 1,
        backgroundColor: 'rgb(57, 192, 111)'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        marginTop: 50,
        justifyContent: 'center'
    },
    titleApp: {
        color: '#fff',
        fontSize: 30
    },
    errorText: {
        paddingVertical: 7,
        textAlign: 'center',
        color: 'red'
    },
    heading: {
        color: '#ffffff',
        fontSize: 22,
        marginTop: 30,
        marginBottom: 5,
    },
    subheading: {
        color: '#ffffff',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 30,
    },
    fingerprint: {
        padding: 20,
        marginVertical: 30,
    },
    errorMessage: {
        color: '#ea3d13',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 10,
        marginTop: 30,
    },
    popup: {
        width: width * 0.8,
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

const mapStateToProps = (()=>{
    return {};
});
export default connect(mapStateToProps, {checkAuth})(FingerPrintScanner);
