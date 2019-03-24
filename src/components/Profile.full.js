import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonic from 'react-native-vector-icons/Ionicons';
import {
	View,
	TouchableOpacity,
	Image,
	Platform,
	Dimensions,
	Text,
	ScrollView,
	PanResponder
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {logOutUser, getUserLocation, getProfileImage, uploadProfileImage} from '../actions';
import { colors, showImagePicker, tracker } from '../actions/const';

const {width, height} = Dimensions.get('window');

class Profile extends Component {
	constructor (props) {
		super(props);

		this.state = {
			isCookingSkill: false,
			skill: 'Beginner',
			location: this.props.location,
			avatarSource: this.props.photo,
			loading: this.props.loading,
			error: this.props.error,
			screenWidth: width,
			screenHeight: height,
			showMenuY: 0,
			showMenuX: 10
		};
	}

	componentWillMount () {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => true,
			onPanResponderRelease: () => {
				if (this.state.isCookingSkill) {
					this.setState({
						isCookingSkill: false
					});
				}
			},
			onPanResponderTerminate: () => {
				if (this.state.isCookingSkill) {
					this.setState({
						isCookingSkill: false
					});
				}
			},
			onShouldBlockNativeResponder: () => false
		});
	}


	componentDidMount () {
		const {getProfileImage, getUserLocation} = this.props;
		getUserLocation();
		getProfileImage();
        tracker.trackScreenView("Profile.Full");
	}

	componentWillReceiveProps (newProps) {
		if (newProps.photo && newProps.photo.length > 0 && !this.props.photo) {
			this.setState({
				avatarSource: newProps.photo,
				loading: newProps.loading,
				error: ''
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

	changeSkill (skill) {
		this.setState({
			skill: skill,
			isCookingSkill: !this.state.isCookingSkill
		});
	}

	logOutUser () {
		this.props.logOutUser();
	}

	onShowSkill () {
		const {skillcategory} = styles;
		const {screenWidth, screenHeight, skill, showMenuY, showMenuX} = this.state;
		let skillList = ['Beginner', 'Intermediate', 'Advanced', 'Iron Chef'];
		if (this.state.isCookingSkill === true) {
			return (
				<View style={{
					top: 0,
					left: 0,
					position: 'absolute',
					backgroundColor: 'transparent',
					width: screenWidth,
					height: screenHeight
				}} {...this._panResponder.panHandlers} >
					<View style={{
						width: 200,
						height: 160,
						backgroundColor: 'white',
						borderColor: 'lightgray',
						borderWidth: 1,
						top: showMenuY,
						left: showMenuX
					}}>
						{skillList.map((item, index) => {
							let active = skill === item ? colors.primaryOrange : '#000';
							return (
								<TouchableOpacity
									style={skillcategory}
									onPress={() => this.changeSkill(item)}
									key={index}>
									<Text style={{color: active}}>{item}</Text>
								</TouchableOpacity>);
						})}
					</View>
				</View>
			);
		} else {
			return null;
		}
	}

	showPicker = () =>
		showImagePicker(({ base64, uri }) => {
			this.setState({ avatarSource: uri });
			this.props.uploadProfileImage({ base64 });
		});

	renderLocation () {
		const {location} = this.state;

		if (location) {
			return (<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
				<Icon name='map-marker' color='white' size={15}/>
				<Text style={{color: 'white', fontSize: 13, marginLeft: 10}}>{location}</Text>
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

	_onCookingSkill () {
		this.setState({isCookingSkill: !this.state.isCookingSkill});
	}

	renderError () {
		const {error} = this.state;
		if (error) {
			return (<Text style={styles.error}>{error}</Text>);
		} else {
			return null;
		}
	}

	onOrientalChange (y, x) {
		this.setState({
			showMenuY: y,
			showMenuX: x
		});
	}

	render () {
		const {avatarSource, skill} = this.state;
		const {container, userIcon, topView, photoView, userImageIOS, addphotoView, listView1, borderColor, logoutBtn, addButtonStyle, buttonLogoutTitle, subtitle} = styles;
		const avatar = avatarSource ?
			<Image
				style={userImageIOS}
				source={{uri: avatarSource}}
				borderRadius={40}>
				{this.showLoading()}
			</Image> :
			<IconIonic name='ios-contact' size={85} color={'#fff'} style={userIcon}/>;
		const buttonList = [
			{
				title: 'Taste Profile',
				subtitle: 'What & when you like to eat it?',
				onClick: () => Actions.tasteprofile()
			},
			{
				title: 'Diet & Allergies',
				subtitle: 'Vegan, Nuts',
				onClick: () => Actions.DietAllergies()
			},
			{
				title: 'Change Password',
				subtitle: '',
				onClick: () => Actions.changePassword()
			}];
		return (
			<ScrollView>
				<View>
					<View style={topView}>
						<View style={topView}>
							<TouchableOpacity style={photoView} onPress={this.showPicker}>
								{avatar}
								<View style={addphotoView}>
									<Text style={addButtonStyle}>+</Text>
								</View>
							</TouchableOpacity>
							{this.renderLocation()}
						</View>
					</View>
					<View
						style={container}
						onLayout={e => this.onOrientalChange(e.nativeEvent.layout.y + 60, e.nativeEvent.layout.width - 210)}>
						<View style={borderColor}>
							<View style={listView1}>
								<Text style={{color: 'black'}}>Cooking Skill</Text>
								<TouchableOpacity onPress={() => this._onCookingSkill()}>
									<Text style={{color: colors.primaryOrange}}>{skill}</Text>
								</TouchableOpacity>
							</View>
						</View>
						{buttonList.map((item, index) => {
							return (
								<View style={borderColor} key={index}>
									<TouchableOpacity
										style={listView1}
										onPress={item.onClick}>
										<View>
											<Text style={{color: 'black'}}>{item.title}</Text>
											{item.subtitle ?
												<Text style={subtitle}>{item.subtitle}</Text> : null}
										</View>
										<View >
											<Icon name='angle-right' color={colors.darkGrey} size={25}/>
										</View>
									</TouchableOpacity>
								</View>);
						})}
						<TouchableOpacity style={logoutBtn} onPress={() => this.logOutUser()}>
							<Text style={buttonLogoutTitle}>LOGOUT</Text>
						</TouchableOpacity>
						{this.renderError()}
					</View>
				</View>
				{this.onShowSkill()}
			</ScrollView>
		);
	}
}
const styles = {
	container: {
		flex: 1,
		paddingBottom: 60
	},
	scrollContainer: {
		height: '100%',
		paddingBottom: 60
	},
	topView: {
		backgroundColor: '#2bc26a',
		height: 130,
		alignItems: 'center',
		justifyContent: 'center'
	},
	photoView: {
		borderRadius: 40,
		width: 80,
		height: 80,
		alignItems: 'center',
		justifyContent: 'center'
	},
	listView1: {
		height: 70,
		paddingLeft: 15,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	borderColor: {
		borderColor: '#eaeaea',
		borderBottomWidth: 1
	},
	addphotoView: {
		width: 26,
		height: 26,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#2bc26a',
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 0,
		right: 0
	},
	logoutBtn: {
		flex: 1,
		height: 50,
		borderRadius: 25,
		backgroundColor: colors.primaryOrange,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 30,
		marginTop: 20
	},
	userImageIOS: {
		width: 80,
		height: 80
	},
	error: {
		color: 'red',
		textAlign: 'center',
		paddingVertical: 10
	},
	skillView: {},
	skillcategory: {
		height: 40,
		justifyContent: 'center',
		paddingLeft: 10
	},
	addButtonStyle: {
		color: '#2bc26a',
		fontWeight: 'bold',
		fontSize: 16,
		bottom: 1
	},
	buttonLogoutTitle: {
		color: 'white',
		fontSize: 16
	},
	userIcon: {
		backgroundColor: 'transparent',
		flex: 1
	},
	loadingCoverImage: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.4)',
		borderRadius: 40
	},
	subtitle: {
		color: '#999',
		textAlign: 'left'
	}
};


const mapStateToProps = ({profile}) => {
	const {error, loading, photo, location} = profile;

	return {error, loading, photo, location};
};

export default connect(mapStateToProps, {getProfileImage, uploadProfileImage, logOutUser, getUserLocation})(Profile);
