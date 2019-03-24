/**
 * Created by mponomarets on 6/25/17.
 */
import React, { PureComponent } from 'react';
import {
	Text,
	View,
	Image
} from 'react-native';
import {Spinner} from './Spinner';

class UpcomingMeals extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { loadingImage: true };
	}

	loadingImage() {
		if (this.state.loadingImage) {
			return <Spinner color={colors.primaryOrange} />;
		}
	}

	renderDescription () {
		const { description } = this.props.meal;

		if (description) {
			return <Text style={styles.mealDetailStyle}>{description}</Text>;
		}
	}

	render() {
		const {
			container,
			descriptionContainer,
			imgStyle,
			imgTitle,
			titleStyle,
			subTitleStyle
		} = styles;
		const { meal: { title, image, type } } = this.props;

		if (title) {
			return (
				<View style={container}>
					<View style={{ height: 250 }}>
						<Image
							source={{ uri: image }}
							style={imgStyle}
							onLoad={() => this.setState({ loadingImage: false })}
						>
							<Text style={imgTitle}>Upcoming meal</Text>
						</Image>
					</View>
					<View style={descriptionContainer}>
						<Text style={titleStyle}>{title}</Text>
						<Text style={subTitleStyle}>{type}</Text>
						{this.renderDescription()}
					</View>
				</View>
			);
		} else {
			return (
				<View style={container}>
					<View style={{height: 250, borderBottomWidth: 1, borderBottomColor: colors.borderColor}}>
						<Image
							source={require('./img/default-recipe.jpg')}
							style={imgStyle}
							resizeMode={'cover'}
						/>
					</View>
				</View>
			);
		}
	}

}
const colors = {
	imgBg: 'rgba(0,0,0,0.1)',
	titleImageColor: '#fff',
	titleImageShodowColor: '#847e7e',
	descriptionBg: '#f6f6f8',
	descriptionTitleColor: '#000',
	descriptionSubTitleColor: '#272525',
	descriptionTextColor: '#584f4f',
	borderColor: 'rgba(0,0,0,0.3)'
};

const styles = {
	container: {
		flex: 1
	},
	buttonStyle: {
		borderColor: colors.borderColor,
		borderBottomWidth: 1,
		marginBottom: 20
	},
	descriptionContainer: {
		padding: 10,
		backgroundColor: colors.descriptionBg,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: colors.borderColor,
		borderBottomWidth: 1,
		borderTopWidth: 0,
		borderTopColor: colors.borderColor
	},
	imgStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: colors.imgBg,
		width: undefined,
		height: undefined
	},
	imgTitle: {
		backgroundColor: 'transparent',
		color: colors.titleImageColor,
		fontSize: 25,
		fontWeight: '600',
		top: 15,
		left: 15,
		textShadowColor: colors.titleImageShodowColor,
		textShadowOffset: {width: 2, height: 2}
	},
	titleStyle: {
		color: colors.descriptionTitleColor,
		fontSize: 18,
		fontWeight: 'bold',
		lineHeight: 30,
		textAlign: 'center'
	},
	subTitleStyle: {
		color: colors.descriptionSubTitleColor,
		fontSize: 16,
		lineHeight: 30
	},
	mealDetailStyle: {
		color: colors.descriptionTextColor,
		fontSize: 14,
		lineHeight: 20,
		paddingHorizontal: 10,
		paddingTop: 5
	}
};

export {UpcomingMeals};
