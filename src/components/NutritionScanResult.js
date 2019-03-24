import React, { Component } from 'react';
import { View, Platform, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Header } from './common';
import { replaceMealUPC, addMealUPC, addMealToBookUPC, addIngredientToEditRecipe } from '../actions';
import { connect } from 'react-redux';
import { colors, tracker } from '../actions/const';

class NutritionScanResult extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loading: false,
			error: '',
			shouldShow: {
				header: {
					'208': 'Calories',
					'205': 'Carbs(g)',
					'203': 'Protein(g)',
					'204': 'Fat(g)'
				},
				body: {
					'291': 'Fiber(g)',
					'269': 'Sugar(g)',
					'307': 'Sodium(mg)',
					'306': 'Potassium(mg)',
					'305': 'Phosphorus(mg)',
					'601': 'Cholesterol(mg)'
				}
			},
			barcodeResult: {},
			scannedItem: {}
		};
	}

	componentWillMount () {
		this.createbarcodeObject()
		this.setState({
			barcodeResult: this.props.barcodeResult
		});
	}

	componentDidMount()
	{
		tracker.trackScreenView("NutritionScanResult");
		
	}

	componentWillReceiveProps (newProps) {
		if (newProps.loading !== this.state.loading) {
			this.setState({
				error: newProps.error,
				loading: newProps.loading
			});
		}
	}

	createbarcodeObject() {
		
		const { nutrients, description, name, ndb } = this.props.barcodeResult;

		let	qty = Number(description.split(' ')[0]);
		let qty_g = Number(description.split(' ')[2].slice(1, -2));
		let unit = description.split(' ')[1];
		
		let scannedItem = {
			base: name,
			description: null,
			name: name,
			ndb: ndb,
			qty: qty,
			qty_g: qty_g,
			servings: 1,
			subs: null,
			tags: null,
			unit: unit,
			usda: {
				Energ_Kcal: nutrients[208] ? nutrients[208] : 0,
				Calcium: nutrients[301] ? nutrients[301] : 0,
				Carbohydrt: nutrients[205] ? nutrients[205] : 0,
				Cholestrl: nutrients[601] ? nutrients[601] : 0,
				Lipid_Tot: nutrients[204] ? nutrients[204] : 0,
				FA_Sat: nutrients[606] ? nutrients[606] : 0,
				Fiber_TD: nutrients[291] ? nutrients[291] : 0,
				Iron: nutrients[303] ? nutrients[303] : 0,
				Phosphorus: nutrients[305] ? nutrients[305] : 0,
				Potassium: nutrients[306] ? nutrients[306] : 0,
				Protein: nutrients[203] ? nutrients[203] : 0,
				Sodium: nutrients[307] ? nutrients[307] : 0,
				Sugar_Tot: nutrients[269] ? nutrients[269] : 0,
			}
		}

		this.setState({
			scannedItem
		});

	}

	handleSaveMeal = () => {

		const { upc, add, replace, activeTabId, planMealType, scannedRecipeForBook } = this.props;
		const { scannedItem } = this.state;

		// if (replace) {
			this.props.replaceMealUPC(upc)
		// }		
	};

	renderSelectButton () {
		
		if(this.state.loading){
			return(
				<ActivityIndicator style={{ marginBottom: 10 }} size={'large'} color={colors.primaryGrey}/>
			);
		}

		return(
			<TouchableOpacity style={styles.button} onPress={this.handleSaveMeal}>
				<Text style={styles.buttonTitle}>SELECT</Text>
			</TouchableOpacity>
		);

	}

	render () {
		const {
			container,
			header,
			itemContainerColumn,
			itemsRow,
			titleColumn,
			bigTitleColumn,
			smallTitleColumn,
			itemContainerRow,
			title,
			errorStyle,
			removeBorder
		} = styles;
		const { shouldShow } = this.state;
		const { description, name, nutrients } = this.state.barcodeResult;

		return (
			<View style={{ flex: 1 }}>
				<Header
					title={'Nutritional Information'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
				/>
				<ScrollView style={container}>
					<Text style={title}>Meal Information</Text>
					<View style={[itemContainerRow, removeBorder]}>
						<Text style={[titleColumn, smallTitleColumn]}>{name}</Text>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{description}</Text>
					</View>
					<Text style={title}>Nutrition</Text>
					<View style={header}>
						<View style={itemContainerColumn}>
							<Text
								style={[titleColumn, bigTitleColumn]}>{nutrients['208'] || 'N/A'}</Text>
							<Text style={bigTitleColumn}>{shouldShow.header['208']}
							</Text>
						</View>
						<View style={itemsRow}>
							<View style={itemContainerColumn}>
								<Text
									style={[titleColumn, smallTitleColumn]}>{nutrients['205'] || 'N/A'}</Text>
								<Text style={smallTitleColumn}>{shouldShow.header['205']}
								</Text>
							</View>
							<View style={itemContainerColumn}>
								<Text
									style={[titleColumn, smallTitleColumn]}>{nutrients['203'] || 'N/A'}</Text>
								<Text style={smallTitleColumn}>{shouldShow.header['203']}
								</Text>
							</View>
							<View style={itemContainerColumn}>
								<Text
									style={[titleColumn, smallTitleColumn]}>{nutrients['204'] || 'N/A'}</Text>
								<Text style={smallTitleColumn}>{shouldShow.header['204']}
								</Text>
							</View>
						</View>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{shouldShow.body['291']}</Text>
						<Text
							style={[titleColumn, smallTitleColumn]}>{nutrients['291'] || 'N/A'}</Text>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{shouldShow.body['269']}</Text>
						<Text
							style={[titleColumn, smallTitleColumn]}>{nutrients['269'] || 'N/A'}</Text>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{shouldShow.body['307']}</Text>
						<Text
							style={[titleColumn, smallTitleColumn]}>{nutrients['307'] || 'N/A'}</Text>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{shouldShow.body['306']}</Text>
						<Text
							style={[titleColumn, smallTitleColumn]}>{nutrients['306'] || 'N/A'}</Text>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{shouldShow.body['305']}</Text>
						<Text
							style={[titleColumn, smallTitleColumn]}>{nutrients['305'] || 'N/A'}</Text>
					</View>
					<View style={itemContainerRow}>
						<Text style={smallTitleColumn}>{shouldShow.body['601']}</Text>
						<Text
							style={[titleColumn, smallTitleColumn]}>{nutrients['601'] || 'N/A'}</Text>
					</View>
					<Text style={errorStyle}>{this.state.error}</Text>
				</ScrollView>
				
				{ this.renderSelectButton() }

			</View>
		);
	}
}
NutritionScanResult.defaultProps = {
	barcodeResult: {
		nutrients: {
			map: {
				'203': 'protein_g',
				'204': 'fat_g',
				'205': 'carb_g',
				'208': 'kcal',
				'291': 'fiber_g',
				'269': 'sugar_g',
				'307': 'sodium_mg',
				'306': 'potass_mg',
				'305': 'phosph_mg',
				'601': 'cholest_g'
			},
			nutrients: {
				'203': 'N/A',
				'204': 'N/A',
				'205': 'N/A',
				'208': 'N/A',
				'291': 'N/A',
				'269': 'N/A',
				'307': 'N/A',
				'306': 'N/A',
				'305': 'N/A',
				'601': 'N/A'
			}
		}
	}
};

const styles = {
	container: {
		paddingVertical: 20,
		paddingBottom: 60,
		flex: 1
	},
	removeBorder: {
		borderTopWidth: 0
	},
	title: {
		fontSize: 18,
		paddingLeft: 20,
		color: colors.primaryOrange
	},
	button: {
		height: 60,
		backgroundColor: colors.primaryGreen,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 18
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 15
	},
	itemsRow: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 15,
		paddingHorizontal: 20
	},
	itemContainerColumn: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemContainerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,
		borderTopColor: 'rgba(0,0,0,.1)',
		borderTopWidth: 1,
		paddingHorizontal: 20
	},
	titleColumn: {
		fontWeight: 'bold',
		textAlign: 'center'
	},
	bigTitleColumn: {
		fontSize: 19,
		lineHeight: 22
	},
	smallTitleColumn: {
		fontSize: 16,
		lineHeight: 20
	},
	errorStyle: {
		color: 'red',
		textAlign: 'center'
	}
};
const mapStateToProps = ({ main, mealPlan }) => {
	const { activeTabId } = main;
	const { loading, error, barcodeResult, currentDateMealPlan } = mealPlan;
	return { loading, error, barcodeResult, currentDateMealPlan, activeTabId };
};

const mapDispatchToProps = { replaceMealUPC, addMealUPC, addMealToBookUPC, addIngredientToEditRecipe };

export default connect(mapStateToProps, mapDispatchToProps)(NutritionScanResult);
