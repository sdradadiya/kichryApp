import React, { PureComponent } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../actions/const';

const Row = ({ title, onPress }) => (
	<View style={styles.rowContainer}>
		<TouchableOpacity style={styles.rowInnerContainer} onPress={onPress}>
			<View style={styles.rowLabel}>
				<Text style={styles.labelText}>{title}</Text>
			</View>
		</TouchableOpacity>
	</View>
);

class SelectMealModal extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			selectMealOption: 'Add'
		};

	}

	selectMeal(title, planId) {
		const { selectMealOption } = this.state;
		let add = selectMealOption === 'Add' ? true : undefined;
		let replace = selectMealOption === 'Replace' ? true : undefined;
		
		this.props.onClose('close');
		this.props.selectMeal({title, add, replace, planId});
	}

	renderHeader() {
		const { header, leftButton, rigthButton, headerTitel } = styles;
		return(
			<View style={header}>
				<TouchableOpacity onPress={() => this.props.onClose('close')}>
					<View style={leftButton}>
						<Icon name="md-close" size={25} color={'#FFFFFF'}/>
					</View>
				</TouchableOpacity>
				<View>
					<Text style={headerTitel}>Select Meal</Text>
				</View>
				<TouchableOpacity>
					<View style={rigthButton}>

					</View>
				</TouchableOpacity>
			</View>
		);

	}

	onTabPress(value) {
		this.setState({ selectMealOption: value });
	}

	renderTabs() {
		const { selectMealOption } = this.state;
		const { selectedOption } = this.props;
		const {tabsContainer, tabStyle, ativeTabStyle} = styles;
		
		const tabs = (selectedOption === 'addmeal' || selectedOption === 'nearby') ?
			[{name: 'Add to Meal', selectMealOption: 'Add'}, {name: 'Replace Meal', selectMealOption: 'Replace'}] 
			: 
			[{name: 'Add to Meal', selectMealOption: 'Add'}];

		const displayTabs = tabs.map((item, index) => {
			return(
				<TouchableOpacity
					key={index}
					onPress={() => this.onTabPress(item.selectMealOption)}
					style={selectMealOption == item.selectMealOption ? ativeTabStyle : tabStyle}
				>
					<Text style={selectMealOption == item.selectMealOption ? {color: '#fff'} : {color: '#000'}}>{item.name}</Text>
				</TouchableOpacity>
			);
		});
		
		return (
			<View style={{height: 40}}>
				<View style={tabsContainer}>
					{displayTabs}
				</View>
			</View>
		);

	}

	renderMealTypes() {
		const { mealTypeToDisplay } = this.props;

		let displayMealType = [];

		for( let key in mealTypeToDisplay.mealplan ) {
			if(mealTypeToDisplay.mealplan[key].isAssigned === true) {
				displayMealType.push(mealTypeToDisplay.mealplan[key]);
			}
		}
		
		const renderTypes = displayMealType.map((item, index) => {
			return(
				<Row key={index} title={item.type} onPress={() => this.selectMeal(item.type, item.plan_id)}/>
			);
		});

		return(
			<View style={styles.innerContainer}>
				{this.renderHeader()}
				{this.renderTabs()}
				{ renderTypes.length > 0 ? 
					renderTypes 
					: 
					<View style={styles.warningMessageConativer}>
						<Text style={styles.warningMessage}>You don't have meal plan</Text>
					</View>	
					
				}
			</View>
		);

	}

	render() {

		return(
			<Modal
				visible={this.props.isVisible}
				transparent={true}
				animationType={'slide'}
				onRequestClose={this.props.onClose}
			>
				<View style={styles.container}>
					{this.renderMealTypes()}
				</View>
			</Modal>
		);

	}

}

const styles = {

	container: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.8)'
	},
	innerContainer: {
		// marginTop: Dimensions.get('window').height - 340,
		height: 'auto',
		backgroundColor: '#fff'
	},
	header: {
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		width: '100%',
		height: 50,
		backgroundColor: colors.primaryGreen
	},
	leftButton: {
		width: 25,
		height: 25,
		marginLeft: 20
	},
	rigthButton: {
		width: 25,
		height: 25,
		marginRight: 20
	},
	headerTitel: {
		color: '#fff',
		fontSize: 20
	},
	rowContainer: {
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1,
		paddingVertical: 15
	},
	rowInnerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	rowLabel: {
		marginRight: 10
	},
	labelText: {
		fontSize: 16
	},
	tabsContainer: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: 0,
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 1,
		shadowOpacity: 0.5
	},
	tabStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: 'rgba(0,0,0,0.3)',
		borderBottomWidth: 1
	},
	ativeTabStyle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#279af0'
	},
	warningMessageConativer: {
		// flex: 1,
		height: 150,
		alignItems: 'center',
		justifyContent: 'center'
	},
	warningMessage: {
		fontSize: 16
	}
};

export { SelectMealModal };
