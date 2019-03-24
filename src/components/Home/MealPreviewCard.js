/**
 * Created by mponomarets on 10/30/17.
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ImageOrCamera = ({ uri }) =>
	uri && uri != 'add-a-photo' ? (
		<Image style={styles.imgStyle} source={{ uri }} />
	) : (
		<View style={styles.iconContainer}>
			<Icon style={styles.iconStyle} name='add-a-photo' />
		</View>
	);

export const MealPreviewCard = ({ uri, title, subtitle, onPress }) => (
	<TouchableOpacity
		style={styles.outerContainer}
		activeOpacity={0.9}
		onPress={onPress}
	>
		<View style={styles.container}>
			<ImageOrCamera uri={uri} />
			<View style={styles.textContainer}>
				<Text style={styles.titleText}>{title}</Text>
				<View>
					<Text style={styles.subTitleText}>{subtitle}</Text>
				</View>
			</View>
		</View>
	</TouchableOpacity>
);

const color = {
	imgBg: '#847e7e',
	borderColor: '#847e5e'
};

const styles = {
	outerContainer: {
		paddingHorizontal: 10,
		width: Dimensions.get('window').width
	},
	container: {
		flexDirection: 'row',
		borderBottomColor: color.borderColor,
		borderBottomWidth: 1,
		paddingBottom: 10,
		minHeight: 80
	},
	imgStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginRight: 10,
		resizeMode: 'cover'
	},
	iconContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconStyle: {
		fontSize: 80,
		color: colors.lightGrey
	},
	textContainer: {
		flex: 2,
		height: '100%',
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		borderColor: color.descriptionBg
	},
	titleText: {
		color: color.descriptionTitleColor,
		fontSize: 16,
		fontWeight: 'bold',
		paddingBottom: 10
	},
	subTitleText: {
		color: colors.primaryOrange,
		fontSize: 16,
		lineHeight: 18,
		fontWeight: 'bold'
	}
};
