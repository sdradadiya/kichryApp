/**
 * Created by mponomarets on 10/11/17.
 */
import React, {Component} from 'react';
import {
	TouchableOpacity,
	Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../actions/const';
import {connect} from 'react-redux';
import {changeMealOpenId, changeActiveScroll, closeAllMenu, getRecipeById} from '../../actions';
import {Actions} from 'react-native-router-flux';
import Swipeable from 'react-native-swipeable';

class SwipeableContainer extends Component {
	constructor (props) {
		super(props);
		this.state = {
			id: this.props.id,
			planId: this.props.planId,
			currentlyOpenSwipeable: null
		};
		this.onPressSearch = this.onPressSearch.bind(this);
		this.onPressCustom = this.onPressCustom.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.openMealId !== this.state.id && nextProps.openMealId !== this.props.openMealId && this.state.currentlyOpenSwipeable) {
			this.swipeable.recenter();
			this.setState({currentlyOpenSwipeable: null});
		}
		if (nextProps.closeAllShortMenu === true && this.state.currentlyOpenSwipeable !== null) {
			this.swipeable.recenter();
			this.setState({currentlyOpenSwipeable: null});
		}
		if (nextProps.widthDevice !== this.props.widthDevice) {
			this.swipeable.recenter();
			this.setState({currentlyOpenSwipeable: null});
		}
	}


	onPressSearch () {
		this.swipeable.recenter();
		Actions.recipeBook({mealType: this.props.mealType, planId: this.props.recipe.plan_id, showSelectButton: true});
	}

	onPressCustom () {
		this.swipeable.recenter();
		const { id, image: recipeImg, plan_id: planId } = this.props.recipe;
		this.props.getRecipeById(id, {
			recipeImg,
			isFromCustom: true,
			planId,
			planMealType: this.props.mealType
		});
	}

	onCloseNotification () {
		this.swipeable.recenter();
		this.props.closeNotification();
	}

	isSwipping (status) {
		this.props.disableScroll(status);
	}

	renderButtons() {

		const buttonWidth = this.props.widthDevice / 3;

		return([
			<TouchableOpacity
				style={[styles.rightSwipeItem, {width: buttonWidth}]}
				onPress={this.onPressCustom}>
				<Icon name="plus-circle" style={styles.iconStyle}/>
				<Text style={styles.buttonText}>New</Text>
			</TouchableOpacity>,
			<TouchableOpacity
				style={[styles.rightSwipeItem, {width: buttonWidth}]}
				onPress={this.onPressSearch}>
				<Icon name="pencil" style={styles.iconStyle}/>
				<Text style={styles.buttonText}>Change</Text>
			</TouchableOpacity>
		]);

	}

	render () {
		const {currentlyOpenSwipeable} = this.state;

		const itemProps = { onOpen: (event, gestureState, swipeable) => {
			if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
				currentlyOpenSwipeable.recenter();
			}
			this.setState({currentlyOpenSwipeable: swipeable});
		},
		onClose: () => this.setState({currentlyOpenSwipeable: null})
		};

		const buttonWidth = this.props.widthDevice / 3;

		return (
			<Swipeable
				onRef={ref => this.swipeable = ref}
				rightButtonWidth={buttonWidth}
				rightButtons={this.renderButtons()}
				onRightButtonsOpenRelease={itemProps.onOpen}
				onRightButtonsCloseRelease={itemProps.onClose}
				onSwipeStart={() => {
					this.isSwipping(true);
					this.props.changeMealOpenId(this.state.id);
					this.props.closeAllMenu(false);
				}}
				onSwipeRelease={() => {
					this.isSwipping(false);
				}}
			>
				{React.Children.map(this.props.children, (element) =>
					<TouchableOpacity
						onPress={() => {
							if (this.state.currentlyOpenSwipeable === null) {
								this.props.getRecipeById(this.props.recipe.id, {recipeImg: this.props.recipe.image});
								this.props.closeAllMenu(true);
							}
						}} activeOpacity={1}>
						{element}
					</TouchableOpacity>
				)}
			</Swipeable>
		);
	}
}

const styles = {
	buttonText: {
		color: colors.primaryOrange
	},
	iconStyle: {
		color: colors.primaryOrange,
		fontSize: 25,
		marginVertical: 10
	},
	rightSwipeItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(242,242,242,1)'
	},
	rightSwipeItemNotes: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(38, 152, 238, .8)'
	},
	listItem: {
		minHeight: 75,
		alignItems: 'center',
		justifyContent: 'center'
	}
};

const mapStateToProps = ({main}) => {
	const {openMealId, closeAllShortMenu} = main;
	return {openMealId, closeAllShortMenu};
};
export default connect(mapStateToProps, {
	changeMealOpenId,
	getRecipeById,
	changeActiveScroll,
	closeAllMenu
})(SwipeableContainer);
