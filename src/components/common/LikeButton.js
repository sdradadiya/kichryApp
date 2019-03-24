import React, { Component } from 'react';

import { View, TouchableHighlight, ActivityIndicator } from 'react-native';

import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import { pinRecipe } from '../../actions';

class LikeButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_pinned: (this.props.recipe) ? (this.props.recipe.is_pinned) : null,
			buttonProcessed: this.props.buttonProcessed
		};

		this.onLikeClick = this.onLikeClick.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if(newProps.buttonProcessed !== this.state.buttonProcessed) {
			this.setState({
				buttonProcessed: newProps.buttonProcessed,
				is_pinned: newProps.is_pinned
			});
		}
	}

	onLikeClick() {

		if(this.props.recipe) {

			const { recipe_id } = this.props.recipe;
			const { is_pinned } = this.state;

			this.props.pinRecipe(recipe_id, is_pinned);

		}
	}

	renderIcon() {

		const { buttonProcessed, is_pinned } = this.state;
		
		if(buttonProcessed) {
			return(
				<ActivityIndicator style={{margin: 20}} color={'#ffffff'} size={'small'}/>
			);
		} else {
			return (
				<Icon name={is_pinned ? 'ios-heart' : 'ios-heart-outline'} size={30} color={'#ffffff'}/>
			);
		}
		
	} 

	render() {
		return (
			<TouchableHighlight style={styles.likeTouchable} onPress={this.onLikeClick}>
				<View style={styles.likeButton} >
					{this.renderIcon()}
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = {
	likeTouchable: {
		borderRadius: 25
	},
	likeButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)'

	}
};

const mapStateToProps = ({recipeDetail}) => {

	const { buttonProcessed, is_pinned } = recipeDetail;

	return { buttonProcessed, is_pinned };

};

export default connect(mapStateToProps, {pinRecipe})(LikeButton);
