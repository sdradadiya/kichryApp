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

class SelectMealModalRecipeBook extends PureComponent {

	constructor(props) {
		super(props);

	}

	selectMeal(title) {
		this.props.onClose('close');
		this.props.selectMeal(title);
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
					<Text style={headerTitel}>Recipe Meal Tag</Text>
				</View>
				<TouchableOpacity>
					<View style={rigthButton}>

					</View>
				</TouchableOpacity>
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
					<View style={styles.innerContainer}>
						{this.renderHeader()}

						<Row title='Breakfast' onPress={() => this.selectMeal('Breakfast')}/>
						<Row title='Morning Snack' onPress={() => this.selectMeal('Morning Snack')}/>
						<Row title='Lunch' onPress={() => this.selectMeal('Lunch')}/>
						<Row title='Evening Snack' onPress={() => this.selectMeal('Evening Snack')}/>
						<Row title='Dinner' onPress={() => this.selectMeal('Dinner')}/>

					</View>
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
	}
};

export { SelectMealModalRecipeBook };
