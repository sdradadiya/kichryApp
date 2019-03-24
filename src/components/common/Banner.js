import React, { Component } from 'react';
import {
	View,
	TouchableHighlight,
	Text,
	Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Banner extends Component {

	render() {
		const { header, description, onPress, icon, color} = this.props;

	    return(
			<TouchableHighlight onPress={ onPress } underlayColor='transparent'>
				<View style={[{backgroundColor: '#fff'}, styles.bannerView]}>

					<View style={{justifyContent: 'center', alignItems: 'center'}}>
						<Icon style={{margin:10, color: color, fontSize: 40}} name={icon} />
					</View>
					<View>
						<Text style={{margin:10, color: color, 
							width: (Dimensions.get('window').width - 115), fontFamily:'Montserrat-Regular', fontSize: 18}}>
							{header}
						</Text>
						<Text style={{margin:5, color: '#999999', fontSize: 12, fontFamily:'Montserrat-SemiBold', flexWrap: 'wrap',
							width: (Dimensions.get('window').width - 115) }}>
								{description}
						</Text>
					</View>

				</View>
			</TouchableHighlight>
		);
	}
}

const styles = {
	bannerView: {
        flex: 1,
		flexDirection: 'row',
		borderRadius: 5,
		margin: 5
	},
	descriptionStyle: {
        color: 'white',
		fontSize: 15,
		flexWrap: 'wrap',
		margin: 5,
		width: (Dimensions.get('window').width - 115)
	}
};
