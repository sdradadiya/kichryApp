/**
 * Created by mponomarets on 7/5/17.
 */
import React, {Component} from 'react';
import {
	View,
	ScrollView,
	ActivityIndicator, Platform, Keyboard
} from 'react-native';
import {connect} from 'react-redux';
import {InfoBox, GroceryListButton, Header} from './common';
import ListTitleGrocery from './common/ListTitleGrocery';
import BottomSheetMenuForOption from './BottomSheet/BottomSheetMenuForOption';
import {
	getGroceryList,
	changeDateForGroceryList,
	changePeriod,
	changeGroupBy,
	toggleBottomSheetMenuForGroceryOption
} from '../actions';
import {prettyDate, colors, tracker} from '../actions/const';
import GroceryTabs from './common/GroceryTabs';
import {Actions} from 'react-native-router-flux/index';
// import GroupGroceryTabs from './common/GroupGroceryTabs';

class GroceryList extends Component {
	constructor (props) {
		super(props);
		this.state = {
			date: this.props.currentDayForGroceryList,
			period: this.props.period,
			groceryListGroupByCategory: this.props.groceryListGroupByCategory,
			groupBy: this.props.groupBy,
			groceryListGroupByRecipe: this.props.groceryListGroupByRecipe,
			error: this.props.error,
			bottomSheetButtonsForGrocery: [
				{
					title: 'View by Recipes',
					onPress: () => {
						this.onChangeOption('recipe');
						this.props.toggleBottomSheetMenuForGroceryOption(false);
					}
				},
				{
					title: 'View by categories',
					onPress: () => {
						this.onChangeOption('category');
						this.props.toggleBottomSheetMenuForGroceryOption(false);
					}
				},
				{
					title: 'Select Date',
					onPress: () => {
						this.props.openDate();
						this.props.toggleBottomSheetMenuForGroceryOption(false);
					}
				}
			]
		};

	}

	componentDidMount () {

		const {currentDayForGroceryList, changeDateForGroceryList, getGroceryList} = this.props;
		if (!currentDayForGroceryList) {
			changeDateForGroceryList(prettyDate());
			getGroceryList();
		}
		else {
			getGroceryList(currentDayForGroceryList);
		}
		tracker.trackScreenView('GroceryList');
	}

	componentWillReceiveProps (newProps) {
		if (newProps !== this.props) {
			this.setState({
				date: newProps.currentDayForGroceryList,
				groceryListGroupByCategory: newProps.groceryListGroupByCategory,
				period: newProps.period,
				error: newProps.error,
				groupBy: newProps.groupBy,
				groceryListGroupByRecipe: newProps.groceryListGroupByRecipe
			});
		}
	}

	findIcons (groupName, id) {
		let icon = 'restaurant-food';
		const {groceryGroupIcons} = this.props;
		for (let i = 0; i < groceryGroupIcons.length; i++) {
			if (groupName.toLowerCase() === groceryGroupIcons[i].group.toLowerCase() || id === groceryGroupIcons[i].id) {
				icon = groceryGroupIcons[i].iconName;
			}
		}
		return icon;
	}

	renderGroupList (groupBy) {

		const {loading} = this.props;
		const {groceryListGroupByRecipe, error, period, groceryListGroupByCategory} = this.state;
		if (loading) {
			return <ActivityIndicator style={{margin: 20}} color={colors.primaryGrey} size={'large'}/>;
		}
		else {
			let list = groupBy === 'recipe' ? groceryListGroupByRecipe : groceryListGroupByCategory;

			if (list && Object.keys(list).length > 0 && !error) {
				return Object.keys(list).map((key, index) => {
					let icon = groupBy === 'recipe' ? 'restaurant-food' : this.findIcons(key, list[key].groupId);
					return (
						<GroceryListButton
							key={index}
							title={key}
							list={list[key]}
							iconName={icon}
						/>);
				});
			} else {
				let message = period === 'day' ? 'No grocery list found for this day' : 'Grocery list could not be created as no meal plans exist for this period. Please request your provider to regenerate your meal plan.';
				return (
					<InfoBox message={message}/>
				);
			}
		}
	}

	renderList (groupBy) {
		const {padding} = styles;
		return (
			<ScrollView style={padding}>
				{this.renderGroupList(groupBy)}
			</ScrollView>
		);
	}

    onChangeOption = (groupBy) => {
        if (groupBy !== this.state.groupBy) {
            this.props.changeGroupBy();
            this.setState({ groupBy }, () => this.props.getGroceryList());
        }
    };

	goBack () {
		Keyboard.dismiss();
		Actions.pop();
	}

	render () {//categories
		const {container, padding} = styles;
		const {getGroceryList, changeDateForGroceryList, isBottomSheetForOptionGroceryOpen} = this.props;
		const {groupBy, bottomSheetButtonsForGrocery} = this.state;
		const leftIcon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		return (
			<View style={container}>
				<Header
					title={'Grocery'}
					leftIcon={leftIcon}
					leftButtonPress={this.goBack}
					rightIcon={'ellipsis-v'}
					rightButtonPress={() => this.props.toggleBottomSheetMenuForGroceryOption(true)}
				/>
				<GroceryTabs/>

				{/* <GroupGroceryTabs/> */}

				<ListTitleGrocery
					style={padding}
					needArrow date={this.state.date}
					changeDate={changeDateForGroceryList}
					getList={getGroceryList}/>
				{groupBy === 'recipe' ? this.renderList('recipe') : this.renderList('category')}
				{isBottomSheetForOptionGroceryOpen &&
                <BottomSheetMenuForOption buttons={bottomSheetButtonsForGrocery}/>}
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: colors.mainBackground
	},
	padding: {
		paddingHorizontal: 10
	}
};

const mapStateToProps = ({main, grocery}) => {
	const {
		isBottomSheetForOptionGroceryOpen
	} = main;
	const {
		groceryListGroupByRecipe,
		currentDayForGroceryList,
		groceryGroupIcons,
		loading,
		period,
		error,
		groupBy,
		groceryListGroupByCategory} = grocery;
	return {
		groceryListGroupByRecipe,
		currentDayForGroceryList,
		groceryGroupIcons,
		loading,
		period,
		error,
		groupBy,
		groceryListGroupByCategory,
		isBottomSheetForOptionGroceryOpen
	};
};

export default connect(mapStateToProps, {
	getGroceryList,
	changeDateForGroceryList,
	changePeriod,
	changeGroupBy,
	toggleBottomSheetMenuForGroceryOption
})(GroceryList);
