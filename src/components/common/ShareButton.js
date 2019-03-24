import React, { Component } from 'react';

import { Text, View, Share, TouchableHighlight } from 'react-native';

import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/Ionicons';

class ShareButton extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.onShareClick = this.onShareClick.bind(this);
	}

	onShareClick() {
		if(this.props.recipe) {
			let id = this.props.recipe.recipe_id;
			let title = this.props.recipe.title;
			Share.share(
				{
					message: `Hi, check out this recipe of ${title} from Kitchry at https://app.kitchry.com/public/recipe/${id}. Thought you would like it!`,
					url: undefined,
					title: `${title}`
				},
				{
					// Android only:
					dialogTitle: 'Share recipe with your friends!'
					// iOS only:
					// exclude certain social media
					// excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"]
				}
			);
		}

	}

	render() {
		return (
			<TouchableHighlight style={styles.shareTouchable} onPress={this.onShareClick}>
				<View style={styles.shareButton} >
					{<Icon name="md-share" size={25} color={'#FFFFFF'}/>}
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = {
	shareTouchable: {
		borderRadius: 25
	},
	shareButton: {
		width: 50,
		height: 50,
		marginLeft: 5,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)'

	}
};

export { ShareButton };
