/**
 * Created by mponomarets on 6/25/17.
 */
import React, {PureComponent} from 'react';
import {
	View,
	ActivityIndicator,
	Dimensions
} from 'react-native';
const {width} = Dimensions.get('window');
import {colors} from '../../actions/const';

class Spinner extends PureComponent {
	render () {
		const {container} = activityIndicatorStyle;
		return (
			<View style={container}>
				<ActivityIndicator color={colors.primaryGrey} size={'large'}/>
			</View>
		);
	}
}
// const colors = {
// 	idicatorColor: '#fff'
// };

const activityIndicatorStyle = {
	container: {
		flex: 1,
		width: width,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
};
export {Spinner};