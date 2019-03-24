import React, { Component } from 'react';
import { View, Platform, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Header, } from '../common';
import MealRow from './MealRow';
import DecisionComponent from '../common/DecisionComponent';

import { months, colors }from '../../actions/const';
import { setSelectedDay, getMeasurementsHistory, sendReviews } from '../../actions';

class ReviewMeals extends Component {
	constructor (props) {
		super(props);
		this.state = {
			selectedDay: this.props.selectedDay,
			reviewMealsList: {},
			loading: false,
			showSendButton: false
		};
	}

	componentDidMount () {
		this.props.getMeasurementsHistory();
	}

	addImage = ({base64, type, image, meal}) => {
		var reviewMealsList = Object.assign({}, this.state.reviewMealsList);
		reviewMealsList[meal.id] = { ...reviewMealsList[meal.id], base64, image, type, meal };
		this.setState({
			reviewMealsList
		});
	};

	addDecision = ({ meal, decision }) => {
		var reviewMealsList = Object.assign({}, this.state.reviewMealsList);
		reviewMealsList[meal.id] = { ...reviewMealsList[meal.id], decision, meal };
		this.setState({
			reviewMealsList,
			showSendButton: true
		});
	};

	renderListItem = ({ item: meal }) => {
		return (
			<MealRow meal={meal} addImage={props => {
				return this.addImage({...props, meal})
			}}>
				<DecisionComponent
					addDecision={decision => this.addDecision({ meal, decision })}
				/>
			</MealRow>
		);
	};

	handleBackButtonPress = () => {
		Actions.pop();
	};

	handlePressSave = () => {
		const { reviewMealsList } = this.state;
		if (Object.keys(reviewMealsList).length > 0) {
			this.props.sendReviews(reviewMealsList);
			this.setState({ loading: true });
		} else {
			Alert.alert('Provide feedback at least for one meal consumed')
		}
	};

	render () {
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const { selectedDay, loading, showSendButton, reviewMealsList } = this.state;
		const { container, listContainer, loadingContainer } = styles;
		const list = selectedDay.meals;
		const sendButton = showSendButton ? {
			rightIcon: 'check',
			rightButtonPress: this.handlePressSave
		} : null;
		const headerProps = {
			title: 'Meals',
			leftIcon: icon,
			leftButtonPress: this.handleBackButtonPress,
			...sendButton
		};
		return (<View style={container}>
			<Header
				{...headerProps}
			/>
			<View style={container}>
				<View style={{ flex: 1 }}>
					<FlatList
						data={list}
						renderItem={this.renderListItem}
						disableVirtualization={false}
						removeClippedSubviews={true}
						keyExtractor={(item, index) => index}
						contentContainerStyle={listContainer}
					/>
				</View>
			</View>
			{loading && <View style={loadingContainer}>
				<ActivityIndicator size={'large'} color={'#fff'}/>
			</View>}
		</View>);
	}
}
const styles = {
	container: {
		flex: 1
	},
	listContainer: {
		flexGrow: 1,
		padding: 20
	},
	buttonContainer: {
		height: 60,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: colors.lightGrey
	},
	buttonTitle: {
		fontSize: 16,
		color: '#000'
	},
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,.3)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
};
const mapStateToProps = ({ home }) => {
	const { selectedDay } = home;
	return {
		selectedDay
	};
};

export default connect(mapStateToProps, { setSelectedDay, getMeasurementsHistory, sendReviews })(ReviewMeals);
