import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, showImagePicker } from '../../actions/const';

class MealRow extends PureComponent {
	constructor (props) {
		super(props);
		this.state = { uri: this.props.meal && this.props.meal.photo }
	}

	onImageAdd = ({ base64, uri, type }) => {
		this.setState({ uri });
		this.props.addImage({base64, uri, type})
	};

	onPressImage = () => showImagePicker(this.onImageAdd);

	render () {
		const { meal: { type, title } } = this.props;
		const { container, headerContainer, buttonContainer } = styles;
		const { uri } = this.state;
		const img = uri ? { uri } : null;
		return (
			<View
				style={container}>
				<View style={headerContainer}>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={this.onPressImage}
						style={buttonContainer}>
						<Image
							style={{ flex: 1 }}
							borderRadius={30}
							source={img}>
						</Image>
						<Ionicons
							name={'ios-camera'} size={50} color={'rgba(255,255,255,0.9)'}
							style={{ position: 'absolute', backgroundColor: 'transparent', left: 12, top: 3 }}/>
					</TouchableOpacity>
					<View style={{ flex: 1, paddingVertical: 5, justifyContent: 'space-between' }}>
						<Text style={{
							fontSize: 18,
							textAlign: 'left',
							fontWeight: 'bold',
							paddingBottom: 7
						}}>{type}</Text>
						<Text style={{ fontSize: 16, textAlign: 'left' }}>{title}</Text>
					</View>
				</View>
				{this.props.children}
			</View>
		);
	}
}
const styles = {
	container: {
		minHeight: 40,
		marginBottom: 20,
		paddingBottom: 20,
		borderBottomColor: 'rgba(0,0,0,.2)',
		borderBottomWidth: 1
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	buttonContainer: {
		width: 60,
		minHeight: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(0,0,0,.2)',
		marginRight: 10
	}
};

export default MealRow;
