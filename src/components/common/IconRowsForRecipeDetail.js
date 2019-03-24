/**
 * Created by mponomarets on 7/23/17.
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../actions/const';

const Icon = ({name}) => (
	<FAIcon
		style={styles.iconStyle}
		name={name}
		color={colors.primaryBlue}
		size={18}
	/>
)

const IconLabel = ({ name, value }) => (
	<View style={styles.itemsInner}>
		<Icon name={name} />
		<Text>{value}</Text>
	</View>
);

class IconRowsForRecipeDetail extends Component {
	constructor(props) {
		super(props);
	}

	renderNutrients() {
		const { kcal = 0, showNutrients } = this.props;
		if (showNutrients) {
			return (
				<View style={styles.itemsInner}>
					<Icon name="cutlery" />
					<Text>{kcal + ' cal'}</Text>
				</View>
			);
		}
	}

	renderCookingTimeItem() {
		const { cookingTime = '', showCookTimeDisclaimer = false } = this.props;
		const disclaimer = showCookTimeDisclaimer ? '*' : '';
		const value = cookingTime.replace(/min/g, 'm') + disclaimer;
		if(cookingTime)
			return (
				<IconLabel name="clock-o" value={value} />
			);
	}

	renderServingsSize () {
		const { totalServings, servings } = this.props;

		if (servings % 1 !== 0) {
			return (
				<IconLabel name="users" value={totalServings + ' serving(s)#'} />
			);
		} else {
			return (
				<IconLabel name="users" value={totalServings + ' serving(s)'} />
			);
		}	
	}

	render() {
		const { cuisine = 'Other', title } = this.props;
		return (
			<View>
				<Text style={styles.titleStyle}>{title}</Text>

				<View style={styles.container}>
					<IconLabel name="globe" value={cuisine} />
					{this.renderServingsSize()}
					{this.renderNutrients()}
					{this.renderCookingTimeItem()}
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 5,
		marginRight: 5,
		marginLeft: 5
	},
	itemsInner: {
		flexDirection: 'row',
		marginTop: 5,
		alignSelf: 'flex-start'
	},
	iconStyle: {
		marginRight: 5,
		marginLeft: 5
	},
	titleStyle: {
		color: '#000',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		paddingTop: 20
	}
};

export { IconRowsForRecipeDetail };
