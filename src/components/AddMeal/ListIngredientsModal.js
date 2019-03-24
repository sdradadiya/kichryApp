import React, { Component } from 'react';
import {
	View,
	Platform,
	ScrollView,
	Text,
	Modal,
	TextInput,
	FlatList,
	TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Header } from '../common';
import { editIngredient } from '../../actions';
import { colors } from '../../actions/const';
import EditIngredientModal from './EditIngredientModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafeAreaView from 'react-native-safe-area-view';

const IngredientRow = ({
	name = '',
	unit = '',
	quantity = '',
	onPress,
	onPressDelete
}) => (
	<TouchableOpacity onPress={onPress} style={styles.ingredientRowContainer}>
		<Text numberOfLines={4} style={styles.ingredientNameText}>
			{name}
		</Text>
		<View style={styles.quantityContainer}>
			<Text>{quantity.toString()}</Text>
		</View>
		<Text numberOfLines={5} style={styles.unitText}>
			{unit}
		</Text>
		<TouchableOpacity onPress={onPressDelete}>
			<Icon name="trash" color={'red'} size={20} />
		</TouchableOpacity>
	</TouchableOpacity>
);

class ListIngredientsModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredients: this.props.data || [],
        	editing_ingredient:false,
		};
	}

	componentDidMount() {
		if (this.state.ingredients.length == 0) this.newIngredient();
	}

	saveIngredient = ingredient => {
		let { ingredients = [], selected_ingredient_index: index } = this.state;
		if (ingredients[index]) ingredients[index] = ingredient;
		else ingredients.push(ingredient);
		this.setState({ ingredients }, () => this.closeIngredient());
	};

	editIngredient = index => {
		const { ingredients } = this.state;
		this.props.editIngredient(ingredients && ingredients[index]);
		this.setState({
			selected_ingredient_index: index,
			editing_ingredient: true
		});
	};

	removeIngredient = index =>
		this.setState(({ ingredients }) => ({
			ingredients: [
				...ingredients.slice(0, index),
				...ingredients.slice(index + 1)
			]
		}));

	newIngredient = () => {
		const { ingredients } = this.state;
		this.editIngredient(ingredients ? ingredients.length : 0);
	};

	closeIngredient = () =>
		this.setState({
			selected_ingredient_index: undefined,
			editing_ingredient: false
		});

	renderIngredientRow = ({ item, index }) => (
		<IngredientRow
			onPress={() => this.editIngredient(index)}
			onPressDelete={() => this.removeIngredient(index)}
			{...item}
		/>
	);

	renderNoIngredients = () => (
		<View style={styles.noIngredientsContainer}>
			<Text style={styles.noIngredientsText}>
				Press the + above to add the first ingredient
			</Text>
		</View>
	);

	render() {
		const { visible, onSave, onClose } = this.props;
		const {
			ingredients,
			editing_ingredient,
			selected_ingredient_index
		} = this.state;

		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Modal
					animationType="slide"
					transparent={true}
					supportedOrientations={['portrait', 'landscape']}
					visible={visible}
					onRequestClose={onClose}
				>
					<View style={styles.modalContainer}>
						<View style={styles.container}>
							<Header
								title={'Modify Ingredients'}
								leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
								leftButtonPress={() => onSave(ingredients)}
								rightIcon={'plus'}
								rightButtonPress={this.newIngredient}
							/>
							<FlatList
								data={ingredients}
								renderItem={this.renderIngredientRow}
								ListEmptyComponent={this.renderNoIngredients}
								extraData={this.state}
								keyExtractor={(item, index) => index}
							/>
							{editing_ingredient && (
								<EditIngredientModal
									title="Enter Ingredient Details"
									onSave={ingredient => this.saveIngredient(ingredient)}
									onClose={this.closeIngredient}
								/>
							)}
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		);
	}
}

export default connect(() => ({}), { editIngredient })(ListIngredientsModal);

const styles = {
	ingredientRowContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1
	},
	ingredientNameText: {
		flex: 1,
		fontSize: 18
	},
	quantityContainer: {
		marginLeft: 10
	},
	unitText: {
		maxWidth: 80,
		marginLeft: 5,
		marginRight: 10,
		textAlign: 'left',
		color: colors.primaryBlack
	},
	modalContainer: {
		flex: 1,	
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		marginTop: 40,
		backgroundColor: '#fff',
		width: '100%'
	},
	noIngredientsContainer: {
		flex: 1,
		margin: 20,
	},
	noIngredientsText: {
		textAlign: 'center',
		color: colors.darkGrey,
		fontSize: 18
	}
};
