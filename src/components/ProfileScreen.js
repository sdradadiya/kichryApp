/**
 * Created by mponomarets on 8/16/17.
 */
import React, {Component} from 'react';
import {
	View
} from 'react-native';
import {BackHeader, ProfileUserInfo, ProfileMenu} from './common';
import {connect} from 'react-redux';
import {colors, tracker} from '../actions/const';

class ProfileScreen extends Component {
	constructor (props) {
		super(props);
		this.onPressLogOut = this.onPressLogOut.bind(this);
	}

	onPressLogOut () {
		this.props.logOutUser();
	}

	componentDidMount()
	{
        tracker.trackScreenView("ProfileScreen");
	}

	render () {
		return (
			<View style={{flex: 1, backgroundColor: colors.primaryGreen}}>
				<BackHeader title={'Profile'}/>
				<ProfileUserInfo/>
				<ProfileMenu logOut={this.onPressLogOut}/>
			</View>
		);
	}
}
const mapStateToProps = ({measurements}) => {
	const {
		error,
		loading,
		measurementsData
	} = measurements;
	return {
		error,
		loading,
		measurementsData
	};
};

export default connect(mapStateToProps, {})(ProfileScreen);
