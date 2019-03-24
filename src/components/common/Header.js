/**
 * Created by mponomarets on 6/25/17.
 */
import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Platform,
	StatusBar,
	AppState,
    PermissionsAndroid
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import KitchryIcon from '../../lib';
import { colors, textStyles } from '../../actions/const';
import {Actions} from "react-native-router-flux/index";

class Header extends Component {
	constructor (props) {
		super(props);
		this.state = {
			appState: AppState.currentState
		};
	}

	componentDidMount () {
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount () {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

    async requestLocationPermission() {
        try {
             const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'Aplication needs to access your location.'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return Promise.resolve();
            } else {
                return Promise.resolve();
            }
        } catch (err) {
        }
    }

	_handleAppStateChange = (nextAppState) => {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

			if (Platform.OS === 'android') {
				StatusBar.setTranslucent(true);
				StatusBar.setBackgroundColor('transparent')
			}
		}
		this.setState({ appState: nextAppState });
	};

	renderStatusBar () {
		return Platform.OS === 'android' ? (
			<StatusBar translucent={true} backgroundColor={'transparent'} />
		) : (
			<StatusBar barStyle="light-content" />
		);
	}

	renderLeft () {
		const { buttonContainer } = styles;
		const { leftIcon, leftButtonPress } = this.props;
		
		if (leftIcon) {
			return (
				<TouchableOpacity
					onPress={leftButtonPress}
					style={buttonContainer}>
					<IonIcon name={leftIcon} size={26} color={colors.primaryBlack}/>
				</TouchableOpacity>
			);
		} else {
			return (<View/>);
		}
	}

	renderInnerRight () {
		const { buttonContainer } = styles;
		const { innerRightIcon, innerRightButtonPress } = this.props;
		if (innerRightIcon) {
			return (
				<TouchableOpacity
					onPress={innerRightButtonPress}
					style={buttonContainer}>
					{
						innerRightIcon == 'md-barcode' ? (
							<IonIcon name={innerRightIcon} size={23} color={colors.primaryBlack} />
						) : (
							<FAIcon name={innerRightIcon} size={22} color={colors.primaryBlack} />
						)
					}
				</TouchableOpacity>
			);
		}
	}

	renderRight () {
		const { buttonContainer } = styles;
		const { rightIcon, rightButtonPress, rightButtonText } = this.props;
		
		if (rightButtonText) {
			return(
				<TouchableOpacity
					onPress={rightButtonPress}
					style={buttonContainer}
				>
					<Text style={{ color: colors.primaryBlack, fontSize: 18, marginRight:10 }}>{rightButtonText}</Text>
				</TouchableOpacity>
			)
		}
		
		if (rightIcon) {

			if(rightIcon === 'OK_text'){
				return(
					<TouchableOpacity
						onPress={rightButtonPress}
						style={buttonContainer}
					>
						<Text style={{ color: colors.primaryBlack, fontSize: 18 }}>OK</Text>
					</TouchableOpacity>
				)
			}

			return (
				<TouchableOpacity
					onPress={rightButtonPress}
					style={buttonContainer}>
					{
						rightIcon == 'md-add' ? (
							<IonIcon name={rightIcon} size={25} style={{ paddingRight: 4}} color={colors.primaryBlack} />
						) : (
							<FAIcon name={rightIcon} size={22} color={colors.primaryBlack} />
						)
					}
				</TouchableOpacity>
			);
		}
	}

    renderMapIcon() {
		const {date,planId,add,replace,mealType}=this.props;
        let currentPosition;
		if(this.props.mapIcon){
            return (
                (<TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center',marginRight:7}}
                    onPress={()=>{
                    this.requestLocationPermission().then(()=>{
                        navigator.geolocation.getCurrentPosition((position) => {
                                let latitude=position.coords.latitude;
                                let longitude=position.coords.longitude;
                                Actions.restaurant({date,planId,add,replace,mealType,latitude,longitude});
                            },
                            (error)=>alert(error.message)
                        );
                    })
                    }}
                >
                    <IonIcon name='md-pin' size={25} color={colors.primaryBlack}/>
                </TouchableOpacity>)
            );
		}
	}

	render () {
		const { headerContainer, header, titleStyle, titleContainer, rightButtonsContainer} = styles;
		return (
			<View style={headerContainer}>
				{this.renderStatusBar()}
				<View style={header}>
					<View style={titleContainer}>
						<Text style={[textStyles.l1Text, titleStyle]}>{this.props.title}</Text>
					</View>
					{this.renderLeft()}
					<View style={rightButtonsContainer}>
						{this.renderInnerRight()}
            {this.renderRight()}
					</View>
				</View>
			</View>
		);
	}
}

const styles = {
	headerContainer: {
		backgroundColor: '#fff',
		...Platform.select({
			ios: {
				minHeight: 40,
			},
			android: {
				minHeight: 60,
				paddingTop: 20,
			}
		})	
	},
	header: {
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingHorizontal: 4
	},
	titleContainer: {
		left: 0,
		right: 0,
		position: 'absolute'
	},
	titleStyle: {
		textAlign: 'center',
	},
	rightButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		minWidth: 40
	},
	leftButton: {
		paddingLeft: 15,
        color: '#676767',
	},
	rightButton: {
		alignItems: 'flex-end',
		paddingRight: 15,
        color: '#676767',
	}
};

export { Header };
