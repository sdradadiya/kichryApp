import React, {Component} from 'react';
import {View, ScrollView, Image, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {BackHeader, Input}from './common';
import {colors,tracker} from '../actions/const';

class TasteProfile extends Component {
	constructor (props) {
		super(props);
		this.state = {
			cuisineList: [
				{
					name: 'American',
					cuisineImage: require('../../resources/img/american.png')
				},
				{
					name: 'Chinese',
					cuisineImage: require('../../resources/img/china_food_icon.png')
				},
				{
					name: 'French',
					cuisineImage: require('../../resources/img/french_food_icon.png')
				},
				{
					name: 'Greek',
					cuisineImage: require('../../resources/img/greek_food_icon.png')
				},
				{
					name: 'Indian',
					cuisineImage: require('../../resources/img/indian_food_icon.png')
				},
				{
					name: 'Italian',
					cuisineImage: require('../../resources/img/italian_food_icon.png')
				},
				{
					name: 'Mexican',
					cuisineImage: require('../../resources/img/mexican_food_icon.png')
				},
				{
					name: 'Thai',
					cuisineImage: require('../../resources/img/thai_food_icon.png')
				},
				{
					name: 'Mediterranean',
					cuisineImage: require('../../resources/img/medit_food_icon.png')
				},
				{
					name: 'Spanish',
					cuisineImage: require('../../resources/img/spanish_food_icon.png')
				},
				{
					name: 'Any',
					cuisineImage: require('../../resources/img/any_food_icon.png')
				}
			]
		};
	}

	componentDidMount()
	{
        tracker.trackScreenView("TasteProfile");
	}

	render () {
		const {horizontalScroll, img, elementContainer, elementTitle, borderColor} = styles;
		const products = ['Milk', 'Eggs'];
		return (
			<View>
				<BackHeader title={'Taste Profile'} leftButtonPress={() => Actions.pop()}/>
				<ScrollView>
					<View style={{height: 60, paddingLeft: 10}}>
						<Input placeholder='Search by ingredient or cuisine'/>
					</View>
					<View style={elementContainer}>
						<Text style={elementTitle}>Cuisines</Text>
					</View>
					<View>
						<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
							{this.state.cuisineList.map((item, index) => {
								return (
									<View style={horizontalScroll} key={index}>
										<Image style={img} source={item.cuisineImage}/>
										<Text style={{paddingTop: 10}}>{item.name}</Text>
									</View>
								);
							})}
						</ScrollView>
					</View>
					<View style={elementContainer}>
						<Text style={elementTitle}>Popular
							Ingredients</Text>
					</View>
					{products.map((item, index) => {
						return (
							<View style={borderColor} key={index}>
								<View style={elementContainer}>
									<Text>{item}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>

			</View>
		);
	}
}


const styles = {
	elementContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 50,
		paddingHorizontal: 15
	},
	elementTitle: {
		color: colors.primaryOrange,
		fontSize: 18,
		fontWeight: 'bold'
	},
	borderColor: {
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1
	},
	horizontalScroll: {
		alignItems: 'center',
		paddingLeft: 20,
		paddingTop: 10
	},
	img: {
		width: 80,
		height: 80
	}
};

export default TasteProfile;
