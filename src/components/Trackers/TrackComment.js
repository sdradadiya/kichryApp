import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { colors } from '../../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';

const TrackComment = ({ comment, onChangeText, height, heightIOS, isCompleted, isRequired }) => {
	
	const { inputWrap, iconStyle, wrapper, textInputStyleIOS, textInputStyleAD } = styles;

	if (Platform.OS === 'ios') {
		return (
			<View style={inputWrap}>
				<View style={wrapper}>
					<TextInput
						style={[textInputStyleIOS, { marginVertical: 10 }]}
						autoCorrect={false}
						underlineColorAndroid={'transparent'}
						value={comment}
						returnKeyType='default'
						placeholder={isRequired ? 'Your answer (required)' : 'Share any noteworthy observations here.(optional)'}
						multiline={true}
						editable={isCompleted ? false : true}
						onChangeText={onChangeText}
						maxLength={5000}
					/>
				</View>
			</View>
		);
	} else {
		return (
			<View style={[inputWrap, { height: height }]}>
				<View style={wrapper}>
					<TextInput
						style={textInputStyleAD}
						autoCorrect={false}
						value={comment}
						underlineColorAndroid={'transparent'}
						returnKeyLabel='go'
						placeholder={isRequired ? 'Anything noteworthy? (required)' : 'Anything noteworthy? (optional)'}
						multiline={true}
						onChangeText={onChangeText}
						editable={isCompleted ? false : true}
						// onSubmitEditing={() => this.sendConfirmDecision()}
						// onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
						// onChange={(e) => {
						// 	this.updateSize(e.nativeEvent.contentSize.height);
						// }}
						maxLength={5000}
					/>
				</View>
			</View>
		);
	}

};

const styles = {

	inputWrap: {
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 1,
		paddingHorizontal: 5,
		marginVertical: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 10,
		marginTop: 20
	},
	wrapper: {
		flex: 1
	},
	iconStyle: {
		flex: 0.15,
		marginHorizontal: 5,
		paddingLeft: 10
	},
	textInputStyleIOS: {
		flex: 0.8,
		alignItems: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 5,
		paddingBottom: 8,
		fontSize: 14,
		paddingTop: 5
	},
	textInputStyleAD: {
		flex: 0.8,
		alignItems: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 5,
		fontSize: 14,
		paddingBottom: 10,
		paddingTop: 10,
		paddingVertical: 0
	}
};

export default TrackComment;
