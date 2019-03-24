import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {colors, tracker} from '../actions/const';
import {Actions} from 'react-native-router-flux';
import {BackHeader}from './common';

class DietAlergies extends Component {

	static renderSectionTitle (title) {
		const {elementContainer, elementTitle} = styles;
		return (
			<View style={elementContainer}>
				<Text style={elementTitle}>{title}</Text>
			</View>
		);
	}

	componentDidMount(){
        tracker.trackScreenView("DietAlegies");
	}

	render () {
		const {container, elementContainer, disText, borderColor, elementTitle, addButton, buttonTitle} = styles;
		const products = ['Gluten', 'Soy', 'Eggs'];

		return (
			<View style={container}>
				<BackHeader title={'Diet & Alergies'} leftButtonPress={() => Actions.pop()}/>
				<ScrollView>
					{DietAlergies.renderSectionTitle('Diet')}
					<View style={elementContainer}>
						<Text>Your preference</Text>
						<Text style={disText}>Vegan</Text>
					</View>
					{DietAlergies.renderSectionTitle('Allergies & Restrictions')}
					{products.map((item, index) => {
						return (
							<View style={borderColor} key={index}>
								<View style={elementContainer}>
									<Text>{item}</Text>
									<Text style={elementTitle}>Never</Text>
								</View>
							</View>
						);
					})}
					<TouchableOpacity style={addButton}>
						<Text style={buttonTitle}>Add New</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1
	},
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
	disText: {
		color: colors.primaryOrange,
		fontSize: 16
	},
	borderColor: {
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1
	},
	addButton: {
		flex: 1,
		height: 50,
		marginTop: 30,
		borderRadius: 25,
		backgroundColor: colors.primaryGreen,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 30
	},
	buttonTitle: {
		color: 'white',
		fontSize: 16
	}
};

export default DietAlergies;
