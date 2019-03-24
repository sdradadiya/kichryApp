import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonic from 'react-native-vector-icons/Ionicons';
import {
	View,
	TouchableOpacity,
	Image,
	Platform,
	Text,
	ScrollView,
	Picker,
	Modal,
	AsyncStorage,
	Linking
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Actions } from 'react-native-router-flux';
import { colors, textStyles } from '../actions/const';
import {
	getProfileImage,
	uploadProfileImage,
	getUserLocation,
	logOutUser,
	changeServing
} from '../actions';
import { showImagePicker, tracker } from '../actions/const';
import { Header } from './common';
import { connect } from 'react-redux';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

class Profile extends Component {
	constructor (props) {
		super(props);
		this.state = {
			numServings: this.props.numServings,
			location: this.props.location,
			avatarSource: this.props.photo,
			loading: this.props.loading,
			error: this.props.error,
			isPickerShow: false,
			name: '',
			loadingServing: this.props.loadingServing
		};
	}

	componentDidMount () {
		const { getProfileImage, getUserLocation, changeServing } = this.props;
		getUserLocation();
		getProfileImage();
		changeServing();
		AsyncStorage.getItem('name', (err, res) => {
			if (res) {
				this.setState({ name: res });
			}
		});
        tracker.trackScreenView("Profile");
	}

	componentWillReceiveProps (newProps) {
		if (newProps.photo && newProps.photo.length > 0 && !this.props.photo) {
			this.setState({
				avatarSource: newProps.photo,
				loading: newProps.loading,
				error: ''
			});
		}

		if (newProps.numServings !== this.props.numServings) {
			this.setState({
				numServings: newProps.numServings
			});
		}
		if (newProps.loadingServing !== this.props.loadingServing) {
			this.setState({
				loadingServing: newProps.loadingServing
			});
		}

		if (newProps.location && newProps.location.length > 0) {
			this.setState({
				location: newProps.location
			});
		}

		if (newProps.loading !== this.props.loading) {
			this.setState({
				loading: newProps.loading,
				error: ''
			});
		}

		if (newProps.error !== this.props.error && newProps.error) {
			this.setState({
				error: newProps.error,
				avatarSource: this.props.photo,
				loading: newProps.loading
			});
		}
	}

	logOutUser () {

		//!!!!!!!!!!!!!!!!!!!!!!!
		// GoogleSignin.signOut();

		this.props.logOutUser();

	}

	showPicker = () =>
		showImagePicker(({ base64, uri }) => {
			this.setState({ avatarSource: uri });
			this.props.uploadProfileImage({ base64 });
		});

	renderLocation () {
		const { location } = this.state;
		if (location) {
			return (<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
				<Icon name='map-marker' color='white' size={16}/>
				<Text style={textStyles.l4TextWhite}>{location}</Text>
			</View>);
		} else {
			return null;
		}
	}

	showLoading () {
		if (this.state.loading) {
			return (<View
				style={styles.loadingCoverImage}/>);
		} else {
			return <View/>;
		}
	}

	renderError () {
		const { error } = this.state;
		if (error) {
			return (<Text style={styles.error}>{error}</Text>);
		} else {
			return null;
		}
	}

	renderPicker () {
		let arr = [];
		for (let i = 1; i <= 20; i++) {
			arr.push(<Picker.Item label={i.toString()} value={i} key={1}/>);
		}
		return <Picker
			style={{ width: '100%' }}
			mode={'dialog'}
			ref={e => this.picker = e}
			selectedValue={this.state.numServings}
			onValueChange={(itemValue) => {
				this.setState({ numServings: itemValue });
				if (Platform.OS === 'android') {
					this.props.changeServing(itemValue);
					this.setState({ isPickerShow: false });
				}
			}}>
			{arr}
		</Picker>;
	}

	renderPickerIOS () {
		return (
			<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
				<View style={{
					flex: 1, backgroundColor: '#fff',
					marginTop: 60
				}}>
					<Header
						title={'Select number'}
						leftIcon={Platform.select({
							ios: 'ios-arrow-back',
							android: 'arrow-left'
						})}
						leftButtonPress={() => this.setState({
							isPickerShow: false,
							numServings: this.props.numServings
						})}
						rightIcon={'check'}
						rightButtonPress={() => this.setState({ isPickerShow: false }, () => this.props.changeServing(this.state.numServings))}
					/>
					{this.renderPicker()}
				</View>
			</View>);
	}

	renderPickerAndroid () {
		if (this.state.isPickerShow) {
			return this.renderPicker();
		} else null;
	}

	renderName () {
		if (this.state.name) {
			return (
				<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
					<Text style={textStyles.l4TextWhite}>{this.state.name}</Text>
				</View>
			);
		} else null;
	}

	renderTelehealth() {
		// Actions.meetingCalendar()
		// if(this.props.hasTelehealth) {
		return(
			<View>
				<View style={styles.borderColor}/>
				<TouchableOpacity style={styles.listView1} onPress={() => Actions.meetingInfo()}>
					<Text style={textStyles.l4Text}>My Appointments</Text>
					<Icon name='angle-right' color={colors.lightGrey} size={25}/>
				</TouchableOpacity>
			</View>
		)
		// }

	}

	render () {
		const { avatarSource, loadingServing, numServings } = this.state;
		const { myMargin10, userIcon, scrollContainer, topView, photoView, userImageIOS, addphotoView, listView1, borderColor, logoutBtn, addButtonStyle } = styles;
		const avatar = avatarSource ?
			<Image
				style={userImageIOS}
				source={{ uri: avatarSource }}
				borderRadius={60}>
				{this.showLoading()}
			</Image> :
			<IconIonic name="ios-contact" size={85} color={'#fff'} style={userIcon}/>;
		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: '#333742'}}>
				<Header
					title='Profile'
					leftIcon={Platform.select({
						ios: 'ios-arrow-back',
						android: 'md-arrow-back'
					})}
					leftButtonPress={() => Actions.pop()}
					/>
				<View style={flex = 1, flexDirection = 'row', topView}>
					<TouchableOpacity style={photoView} onPress={this.showPicker}>
						{avatar}
						<View style={addphotoView}>
							<Text style={addButtonStyle}>+</Text>
						</View>
					</TouchableOpacity>
					{this.renderName()}
					{this.renderLocation()}
				</View>
				<ScrollView style={scrollContainer}>
				<View style={{height:responsiveHeight(12), flex:1, backgroundColor:colors.mainBackground, flexDirection: 'row'}}>				
				</View>
				{this.renderTelehealth()}
				<View style={borderColor}/>

					<TouchableOpacity style={listView1} onPress={() => {
						this.setState({ isPickerShow: true });
					}}>
						<View>
							<Text style={[textStyles.l4Text, myMargin10]}>Total Servings</Text>
							<Text style={[textStyles.description10]}>I usually cook for <Text
								style={{
									fontWeight: 'bold',
									color: loadingServing ? 'rgba(0,0,0,0.3)' : 'black'
								}}> {numServings} </Text> person(s)
							</Text>
						</View>
						<Icon name='angle-right' color={colors.lightGrey} size={25}/>
					</TouchableOpacity>
					<View style={borderColor}/>
					{Platform.select({
						ios: <Modal
							animationType="slide"
							transparent={true}
							supportedOrientations={['portrait', 'landscape']}
							visible={this.state.isPickerShow}
							onRequestClose={() => console.log('close')}
						>
							{this.renderPickerIOS()}
						</Modal>,
						android: this.renderPickerAndroid()
					})}

                    <TouchableOpacity style={listView1} onPress={() => Actions.groceryList({openDate:this.props.selectDate})}>
                        <Text style={[textStyles.l4Text]}>Grocery Lists</Text>
                        <Icon name='angle-right' color={colors.lightGrey} size={25}/>
                    </TouchableOpacity>

                    <View style={borderColor}/>

					<TouchableOpacity style={listView1} onPress={() => Actions.referForm()}>
						<Text style={[textStyles.l4Text]}>Refer Friends</Text>
						<Icon name='angle-right' color={colors.lightGrey} size={25}/>
					</TouchableOpacity>

					<View style={borderColor}/>

					<TouchableOpacity style={listView1} onPress={() => Actions.changePassword()}>
						<Text style={[textStyles.l4Text]}>Change Password</Text>
						<Icon name='angle-right' color={colors.lightGrey} size={25}/>
					</TouchableOpacity>
					
					<View style={borderColor}/>

					<TouchableOpacity style={listView1} onPress={() => Linking.openURL('https://intercom.help/kitchry/kitchry-mobile-app/the-latest-and-greatest')}>
						<Text style={[textStyles.l4Text]}>Kitchry Help Center</Text>
						<Icon name='angle-right' color={colors.lightGrey} size={25}/>
					</TouchableOpacity>

					<View style={borderColor}/>

					<TouchableOpacity style={logoutBtn} onPress={() => this.logOutUser()}>
						<Text style={textStyles.description14White}>LOGOUT</Text>
					</TouchableOpacity>
					{this.renderError()}
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = {
	scrollContainer: {
		height: '100%',
		paddingBottom: 60,
		backgroundColor: colors.mainBackground,
	},
	topView: {
		backgroundColor: '#333742',
		minHeight: 130,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom:10,
	},
	photoView: {
		marginTop:10,
		borderRadius: 50,
		width: 120,
		height: 120,
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	listView1: {
		height: 40,
		paddingLeft: 15,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	borderColor: {
		backgroundColor: colors.lightGrey,
		height: 0.5,
		marginTop: 5,
		marginBottom: 5,
	},
	addphotoView: {
		width: 26,
		height: 26,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: colors.primaryBlue,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 0,
		right: 0
	},
	logoutBtn: {
		flex: 1,
		flexDirection: 'row',
		height: 50,
		backgroundColor: colors.primaryGreen,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 20
	},
	userImageIOS: {
		width: 120,
		height: 120
	},
	error: {
		color: 'red',
		textAlign: 'center',
		paddingVertical: 10
	},
	addButtonStyle: {
		color: '#2bc26a',
		fontWeight: 'bold',
		fontSize: 16,
		bottom: 1
	},
	userIcon: {
		backgroundColor: 'transparent',
		flex: 1
	},
	loadingCoverImage: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.4)',
		borderRadius: 50
	},
	servingsPicker: {
		width: '110%',
		height: '100%',
		//backgroundColor: 'red',
		position: 'absolute',
		top: 0,
		left: 0,
		opacity: 0 //set opacity to 1 and uncomment backgroundColor if you want to see picker,
	},
	myMargin10: {
		marginTop: 10
	},
	myMargin20: {
		marginTop: 20,
	},
};


const mapStateToProps = (state) => {
	const { 
		profile: { error, loading, loadingServing, photo, location, numServings },
		clientPermissions: { hasTelehealth }
	} = state;

	return { error, loading, loadingServing, photo, location, numServings, hasTelehealth };
};

export default connect(mapStateToProps, {
	getProfileImage,
	uploadProfileImage,
	logOutUser,
	getUserLocation,
	changeServing
})(Profile);
