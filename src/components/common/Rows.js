import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, textStyles } from '../../actions/const';

export const SwitchRow = ({ title, description, ...switchProps }) => (
	<Row title={title} description={description}>
		<Switch {...switchProps} />
	</Row>
);

export const PhotoRow = ({ onPress, uri }) => (
	<Row title={'Photo'} description={'Take a picture of the meal'}>
		<TouchableOpacity style={styles.imageContainer} onPress={onPress}>
			<Image source={{ uri }} style={styles.image} resizeMode={'cover'}>
				<Icon name={'camera'} size={30} color={'#fff'} />
			</Image>
		</TouchableOpacity>
	</Row>
);

export const ArrowRow = rowProps => (
	<Row {...rowProps}>
		<Icon name="angle-right" size={22} />
	</Row>
);

export const InputRow = ({
	title,
	description,
	indentLabel,
	maxLength,
	editable = true,
	placeholder,
	onChangeText,
	multiline,
	value,
	...textInputProps
}) => (
	<Row title={title} description={description} indentLabel={indentLabel}>
		<TextInput
			editable={editable}
			style={multiline ? [textStyles.l4Text, styles.multilineInputText] : 
				[textStyles.l4Text, styles.inputText]}
			placeholder={editable ? placeholder : undefined}
			onChangeText={onChangeText}
			multiline={multiline}
			value={value}
			underlineColorAndroid={'transparent'}
			keyboardType={'numeric'}
			{...textInputProps}
		/>
		{maxLength && (
			<Text style={styles.charactersRemainingText}>
				{value && maxLength - value.length}
			</Text>
		)}
	</Row>
);

export const Row = ({ title, description, onPress, children, indentLabel }) => {
	const ContainingComponent = onPress ? TouchableOpacity : View;
	return (
		<View style={styles.rowOuterContainer}>
			<ContainingComponent
				style={[
					styles.rowInnerContainer,
					{ paddingLeft: indentLabel ? 35 : 20 }
				]}
				onPress={onPress}
			>
				<View style={styles.rowLabelContainer}>
					<Text style={textStyles.description12}>{title}</Text>
					{!!description && (
						<Text style={[textStyles.description12Regular, styles.rowDescriptionText]}>{description}</Text>
					)}
				</View>
				<View style={styles.rowChildrenContainer}>{children}</View>
			</ContainingComponent>
		</View>
	);
};

const styles = {
	imageContainer: {
		width: 50,
		height: 50,
		backgroundColor: colors.lightGrey
	},
	image: {
		width: 50,
		height: 50,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center'
	},
	multilineInputText: {
		width: '100%',
		flex: 0.7,
		textAlign: 'right',
		paddingTop: -2,
		paddingBottom: 2
	},
	inputText: {
		width: '100%',
		flex: 0.7,
		textAlign: 'right',
	},
	charactersRemainingText: {
		textAlign: 'right',
		color: '#c9cacc',
		marginLeft: 10
	},
	rowOuterContainer: {
		borderBottomColor: colors.lightGrey,
		borderBottomWidth: 1,
		paddingVertical: 10
	},
	rowInnerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	rowLabelContainer: {
		marginRight: 10
	},
	rowChildrenContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	rowDescriptionText: {
		color: '#c9cacc',
		marginTop: 5
	}
};
