import React, { Component } from 'react';
import { Text, View, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { MealPreviewCard } from './MealPreviewCard';
import { Spinner } from './common';
import { colors, showImagePicker } from '../../actions/const';
import { setImageForMeal, getReviewList } from '../../actions';
import { selectTodaysMealsForJournal } from '../../selectors/home';

const EmptyList = () => (
	<View style={styles.containerEmpty}>
		<Text style={styles.text}>No Open Meals</Text>
	</View>
);

class MealJournal extends Component {
	renderItem = ({
		item: { title, type, photo, plan_id: planId, isAssigned }
	}) => (
		<MealPreviewCard
			title={title}
			subtitle={type}
			uri={photo}
			onPress={() =>
				showImagePicker(({ base64, type: imageType }) =>
					this.props
						.setImageForMeal({ planId, base64, isAssigned, imageType })
						.then(() => this.props.getReviewList())
				)
			}
		/>
	);

	render() {
		return this.props.loading ? (
			<Spinner />
		) : (
			<View style={styles.componentContainer}>
				<Text style={styles.title}>Meal Journal Today</Text>
				<FlatList
					data={this.props.meals}
					renderItem={this.renderItem}
					horizontal={true}
					ListEmptyComponent={EmptyList}
					keyExtractor={({ plan_id }) => plan_id}
					showsHorizontalScrollIndicator={false}
					style={{ flex: 1 }}
					pagingEnabled={true}
				/>
			</View>
		);
	}
}

const mapStateToProps = state => {
	// console.log(state)
	return{
	loading: state.home.loadingReviewList,
	meals: selectTodaysMealsForJournal(state)
	}
};

export default connect(mapStateToProps, { setImageForMeal, getReviewList })(
	MealJournal
);

const styles = {
	componentContainer: {
		marginTop: 10
	},
	text: {
		color: '#676767',
		fontSize: 16,
		fontWeight: 'bold'
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		paddingBottom: 10,
		paddingLeft: 10,
		color: colors.primaryOrange
	},
	containerEmpty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Dimensions.get('window').width - 20,
		height: 100,
		marginLeft: 10,
		marginRight: 10,
		borderBottomColor: '#847e5e',
		borderBottomWidth: 1
	}
};
