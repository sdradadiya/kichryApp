import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setFiltersList} from '../../actions';

import {Modal, View, ScrollView, Platform} from 'react-native';
import {Header} from './Header';
import FilterContainer from './FilterContainer';
import FilterButton from './FilterButton';
import { colors } from '../../actions/const';

const dietTypes =

	['Paleo', 'Vegan', 'Vegetarian'];

const mealTypes =

	['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner'];

const dietaryRestrictions =

	['Beef', 'Egg', 'Milk', 'Peanuts', 'Fish', 'Pork', 'Poultry', 'Shellfish', 'Soy', 'Tree Nuts', 'Wheat'];

const recipeTags =

	['10 or Less Ingredients', 'Drink/Smoothie', 'Grab-N-Go', 'Low-Sodium', 'Pasta/Grain', 'Salad', 'Sides', 'Slow Cooker', 'Soup/Chili'];

const cookingTimes = ['<15min', '15min-30min', '30min-1h', '1h-2h', '>2h'];

const preparationTimes = ['<15min', '15min-30min', '30min-1h', '1h-2h', '>2h'];

/*const servingSizes = ['1', '2', '3', '4', '4+'];

 const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Iron Chef'];

 const cuisines = ['American', 'Chinese', 'French', 'Greek', 'Indian', 'Italian', 'Mediterranean', 'Mexican', 'Spanish', 'Thai', 'Other'];
 */

const filterslist = [
	{name: 'Cooking Time', filters: cookingTimes, title: 'cookingTime', isMultiChoice: false},
	{name: 'Diet Types', filters: dietTypes, title: 'dietTypes', isMultiChoice: false},
	{name: 'Dietary Restrictions', filters: dietaryRestrictions, title: 'restrictions', isMultiChoice: true},
	{name: 'Meal Types', filters: mealTypes, title: 'mealTypes', isMultiChoice: true},
	{name: 'Preparation Time', filters: preparationTimes, title: 'preparationTime', isMultiChoice: false},
	{name: 'Recipe Tags', filters: recipeTags, title: 'tags', isMultiChoice: true}

	/* {name: 'Skill Level', filters: skillLevels, title: ''},
	 {name: 'Cuisine', filters: cuisines, title: ''}*/
];

class FilterPopUp extends Component {
	constructor (props) {
		super(props);
		this.state = {
			selectedFilters: this.props.filters
		};
	}

	

	applyFilters () {

		this.props.setFiltersList(this.state.selectedFilters);
		this.props.toggleSearchFilters();

	}

	addFilter (filterTitle, filterValue) {
		let tmp = this.state.selectedFilters;
		tmp[filterTitle].push(filterValue);
		this.setState({
			selectedFilters: {...tmp}
		});
	}

	removeFilter (filterTitle, filterValue) {
		let tmp = this.state.selectedFilters;
		for (let i = 0; i < tmp[filterTitle].length; i++) {
			if (tmp[filterTitle][i] === filterValue) {
				tmp[filterTitle].splice(i, 1);
			}
		}
		this.setState({
			selectedFilters: {...tmp}
		});
	}

	processRequestClose () {

		return;

	}

	clearAllFilters (filterTitle, callback) {
		let tmp = this.state.selectedFilters;
		tmp[filterTitle] = [];
		this.setState({
			selectedFilters: {...tmp}
		}, () => callback());
	}

	render () {

		const filters = filterslist.map((item, index) =>
			<FilterContainer key={index} title={item.name} filterTypes={item.filters}>
				{item.filters.map((elem, i) => {
					const {filters} = this.props;
					let isSelectedFilter = false;
					if (filters[item.title].length > 0) {
						isSelectedFilter = filters[item.title].find(title => title === elem);
					}
					return <FilterButton
						key={i}
						isChek={isSelectedFilter}
						filtersList={item}
						filter={elem}
						clearAllFilters={this.clearAllFilters.bind(this, item.title)}
						selectedFilters={this.state.selectedFilters}
						addFilter={this.addFilter.bind(this, item.title, elem)}
						removeFilter={this.removeFilter.bind(this, item.title, elem)}
					/>;
				})}
			</FilterContainer>
		);

		return (
			<View>
				<Modal
					animationType='slide'
					transparent={false}
					supportedOrientations={['portrait', 'landscape']}
					visible={this.props.showSearchFilters}
					onRequestClose={() => this.processRequestClose()}
				>
						<View style={styles.container}>
							<Header
								title={'Search Filters'}
								leftIcon={Platform.select({
									ios: 'ios-arrow-back',
									android: 'md-arrow-back'
								})}
								leftButtonPress={() => this.props.toggleSearchFilters()}
								rightIcon={'check'}
								rightButtonPress={() => this.applyFilters()}
							/>
							<ScrollView>
								{filters}
							</ScrollView>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = {
	modalContainer: {
		flex: 1,	
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		marginTop: 40,
		backgroundColor: '#fff',
		width: '100%'
	}
};

const mapStateToProps = ({search}) => {
	const {filters} = search;
	return {filters};
};

export default connect(mapStateToProps, {setFiltersList})(FilterPopUp);
