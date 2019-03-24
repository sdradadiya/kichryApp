import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../../actions/const';
import { selectMealPlanNutritionSummary } from '../../selectors/MealPlan.js';

const DataCell = ({ value, label, style }) => (
	<View style={styles.dataCellContainer}>
		<Text style={[styles.dataCellValueText, style]}>{value}</Text>
		<Text style={[styles.dataCellLabelText, style]}>{label}</Text>
	</View>
);

const Tab = ({ name, onPress, label, active }) => (
	<TouchableOpacity style={styles.tabContainer} onPress={onPress}>
		<View style={active ? styles.tabSubContainerActive : undefined}>
			<Text style={active ? styles.tabTextActive : styles.tabText}>
				{label}
			</Text>
		</View>
	</TouchableOpacity>
);

class NutritionSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_tab: {
				name: 'calories',
				precision: 0,
				unit: ''
			}
		};
	}

	renderData() {
		const { selected_tab: { name, unit, precision } } = this.state;
		const { cap, floor, consumed } = this.props.nutrition_summary[name];
		const average = (a, b) => (a == 0 ? b : (a + b) / 2);
		const str = val => Number(val.toFixed(precision)).toString() + unit;
		let dailytarget = average(cap, floor);

		let remaining = {};
		if (floor > 0) {
			// going for a target band
			if (consumed < floor) {
				remaining.value = str(dailytarget - consumed);
				remaining.label = 'to go';
				remaining.style = { color: 'black' };
			} else if (consumed < cap) {
				remaining.value = str(dailytarget - consumed);
				remaining.label = 'to go';
				remaining.style = { color: 'green' };
			} else {
				remaining.value = str(consumed - dailytarget);
				remaining.label = 'over';
				remaining.style = { color: 'red' };
			}
			// console.warn(
			// 	{ cap, floor, consumed },
			// 	remaining.value + ' ' + remaining.label
			// );
			return (
				<View style={styles.tabsContainer}>
					<DataCell value={str(average(cap, floor))} label="daily target" />
					<DataCell value={str(consumed)} label="consumed" />
					<DataCell {...remaining} />
				</View>
			);
		} else {
			// floor is 0, so always hitting the "min"
			if (consumed < cap) {
				remaining.value = str(dailytarget - consumed);
				remaining.label = 'to go';
				remaining.style = { color: 'black' };
			} else {
				remaining.value = str(consumed - dailytarget);
				remaining.label = 'over';
				remaining.style = { color: 'red' };
			}
			return (
				<View style={styles.tabsContainer}>
					<DataCell value={str(cap)} label="daily" />
					<DataCell value={str(consumed)} label="consumed" />
					<DataCell {...remaining} />
				</View>
			);
		}
	}

	selectTab = (name, unit, precision) =>
		this.setState({ selected_tab: { name, unit, precision } });

	renderTab = ({ item }) => {
		const { name, label = '', unit = 'g', precision = 0 } = item;
		return (
			<Tab
				name={name}
				onPress={() => this.selectTab(name, unit, precision)}
				label={label.toUpperCase()}
				active={this.state.selected_tab.name == name}
			/>
		);
	};

	renderTabs() {
		const data = [
			{ name: 'calories', label: 'Calories', unit: '' },
			{ name: 'carbs', label: 'Carbs', precision: 1 },
			{ name: 'protein', label: 'Protein', precision: 1 },
			{ name: 'fat', label: 'Fat', precision: 1 },
			{ name: 'fiber', label: 'Fiber', precision: 1 },
			{ name: 'sugar', label: 'Sugar', precision: 1 },
			{ name: 'sodium', label: 'Sodium', unit: 'mg' },
			{ name: 'potassium', label: 'Potassium', unit: 'mg' },
			{ name: 'phosphorus', label: 'Phosphorus', unit: 'mg' }
		];
		return (
			<View style={styles.tabsContainer}>
				<FlatList
					data={data}
					renderItem={this.renderTab}
					horizontal={true}
					keyExtractor={(item, idx) => idx}
					showsHorizontalScrollIndicator={false}
					style={{ flex: 1 }}
				/>
			</View>
		);
	}

	render() {
		if (!this.props.visible) return <View />;
		return (
			<View style={styles.container}>
				{this.renderData()}
				{this.renderTabs()}
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	nutrition_summary: selectMealPlanNutritionSummary(state),
	visible: state.clientPermissions.showNutrients && ownProps.visible
});

export default connect(mapStateToProps)(NutritionSummary);

const styles = {
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 15
	},
	tabsContainer: {
		flexDirection: 'row'
	},
	dataCellContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 40
	},
	dataCellValueText: {
		paddingBottom: 5,
		fontSize: 18
	},
	dataCellLabelText: {
		color: colors.darkGrey,
		fontSize: 14
	},
	tabContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		padding: 10
	},
	tabSubContainerActive: {
		borderBottomWidth: 0,
		paddingVertical: 8
	},
	tabText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: colors.darkGrey
	},
	tabTextActive: {
		fontSize: 12,
		fontWeight: 'bold',
		color: 'black'
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center'
	}
};
