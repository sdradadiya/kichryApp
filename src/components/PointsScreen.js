import React, { PureComponent } from 'react';
import { View, Platform, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Header } from './common';
import { connect } from 'react-redux';
import { colors, tracker } from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';

class PointsScreen extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			points: null,
			exchang: null,
			loading: true
		};
	}

	componentWillReceiveProps (newProps) {
	
		this.setState({
			points: newProps.myPoints,
			exchang: newProps.exchang,
			loading: newProps.loadingPoints
		});
	}

	capitalizeFirstLetter (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	renderPointsRedeemed() {

		const { pointsTitle, pointContainer, pointsDescription} = styles;

		if(!this.state.loading) {
			return(
				<View style={pointContainer}>
					<View>
						<Text style={pointsTitle}>Points Redeemed</Text>
						<Text style={pointsDescription}>Points redeemed for rewards</Text>
					</View>
					<Text style={pointsTitle}> - { this.state.exchang || 0}</Text>
				</View>
			);
		}
		
	}

	componentDidMount () {
		tracker.trackScreenView('PointsScreen');
	}

	render () {
		const {
			container,
			pointsTitle,
			title,
			pointsDescription,
			pointContainer,
			activityIndicatorStyle,
			generalPointsDescription
		} = styles;
		const { points } = this.state;

		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={'Kitchry Award Points'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
				/>
				<ScrollView style={container}>
					<Text style={generalPointsDescription}>These points can be exchanged for gifts or rewards. Ask your provider for more details.</Text>
					<Text style={title}>Points Summary</Text>
					{points ? points.map((item) => {
						let pointsLocaleString = item.points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						let myPointstoLocaleString = item.myPoints.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						return (
							<View style={pointContainer} key={item.title}>
								<View>
									<Text style={pointsTitle}>{this.capitalizeFirstLetter(item.title)}</Text>
									<Text style={pointsDescription}>Earns you {pointsLocaleString || 'X'} points</Text>
								</View>
								<Text style={pointsTitle}>{myPointstoLocaleString || 0}</Text>
							</View>
						);
					}) : <ActivityIndicator
						size={'large'} color={colors.primaryOrange}
						style={activityIndicatorStyle}/>}
					
					{this.renderPointsRedeemed()}

				</ScrollView>
			</SafeAreaView>
		);
	}
}
PointsScreen.defaultProps = {
	myPoints: null,
	exchang: null
};

const styles = {
	container: {
		// paddingVertical: 20,
		paddingBottom: 60,
		flex: 1,
		backgroundColor: '#fff'
	},
	activityIndicatorStyle: {
		paddingVertical: 20, alignSelf: 'center'
	},
	removeBorder: {
		borderTopWidth: 0
	},
	title: {
		fontSize: 18,
		paddingLeft: 20,
		color: colors.primaryOrange,
		paddingBottom: 10
	},
	pointContainer: {
		borderTopColor: colors.lightGrey,
		borderTopWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		minHeight: 60
	},
	pointsTitle: {
		fontSize: 16,
		lineHeight: 20,
		color: '#000',
		fontWeight: '500'
	},
	pointsDescription: {
		fontSize: 16,
		lineHeight: 20,
		color: 'rgba(0,0,0,0.5)'
	},
	generalPointsDescription: {
		fontSize: 14,
		lineHeight: 18,
		color: 'rgba(0,0,0,0.5)',
		marginLeft: 10,
		marginRight: 10,
		marginVertical: 10
	}
};
const mapStateToProps = ({ pointsAwards }) => {
	const { loading, error, myPoints, exchang } = pointsAwards;
	return { loading, error, myPoints, exchang };
};

export default connect(mapStateToProps, {})(PointsScreen);
