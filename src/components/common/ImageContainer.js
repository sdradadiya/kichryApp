/**
 * Created by mponomarets on 7/13/17.
 */
import React, { PureComponent } from 'react';
import { View, Image } from 'react-native';

// import DefaultRecipe from './img/default-recipe.jpg';

class ImageContainer extends PureComponent {
	render() {
		const { imgStyle, container } = styles;
		const { imgUrl } = this.props;

		const image = imgUrl ? { uri: imgUrl } : require('./img/default-recipe.jpg');

		return (
			<View style={container}>
				<Image
					source={image}
					style={imgStyle}
					resizeMode={'cover'}
				/>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 0.4,
		alignItems: 'stretch'
	},
	imgStyle: {
		flex: 1,
		borderRadius: 5,
		width: undefined,
		height: undefined
	}
};

export { ImageContainer };
