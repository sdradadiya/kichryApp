import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { colors }from '../../actions/const';

const Tab = ({ onPress, label, active }) => (
	<TouchableOpacity style={styles.tabContainer} onPress={onPress}>
		<View style={active ? styles.tabSubContainerActive : undefined}>
			<Text style={active ? styles.tabTextActive : styles.tabText}>
				{label}
			</Text>
		</View>
	</TouchableOpacity>
);

class TrendChartTabs extends Component {

	constructor() {
		super();

		this.state = {
			name: '1week',
		};

	}

	// componentDidMount(){
	// 	this.props.onDataSelect(this.state.name);
	// }

	selectTab (name) {
		this.setState({name});
		this.props.onDataSelect(name);
	}
	
	renderTab = ({ item }) => {
		const { name, label = ''} = item;
		return (
			<Tab
				onPress={() => this.selectTab(name)}
				label={label}
				active={this.state.name == name}
			/>
		);
	};

	renderTabs() {
		const data = [
			{ name: '1week', label: '1 week'},
			{ name: '2weeks', label: '2 weeks'},
			{ name: '1month', label: '1 month'},
			{ name: '3months', label: '3 months'},
			{ name: 'year', label: 'Year'},
			{ name: 'All', label: 'All'},
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

		return(
			<View style={styles.container}>
				{this.renderTabs()}
			</View>
		);

	}
    
}

const styles = {
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 15
	},
	tabsContainer: {
		flexDirection: 'row',
	},
	tabContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		padding: 10
	},
	tabSubContainerActive: {
		borderBottomWidth: 2,
		borderBottomColor: colors.primaryOrange,
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
		borderBottomColor: colors.primaryOrange,
		color: 'black'
	}
};

export default TrendChartTabs;