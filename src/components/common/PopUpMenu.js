/**
 * Created by mponomarets on 9/27/17.
 */
import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, PanResponder} from 'react-native';

class PopUpMenu extends PureComponent {
	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => true,
			onPanResponderRelease: () => {
				this.props.hideMenu();
			},
			onPanResponderTerminate: () => {
				if (this.state.isShowOption) {
					this.setState({
						isShowOption: false
					});
				}
			},
			onShouldBlockNativeResponder: () => false
		});
	}

	render () {
		const {
			list = [{
				title: 'Dublicate'
			}], left = false
		} = this.props;
		const {container, menuStyle, button, buttonTitle} = styles;
		const buttons = list.map((item, index) => {
			return (
				<TouchableOpacity onPress={item.onPress} key={index} style={button}>
					<Text style={buttonTitle}>{item.title}</Text>
				</TouchableOpacity>
			);
		});
		let position = left ? {left: 15} : {right: 15};
		return (
			<View
				style={container}
				{...this._panResponder.panHandlers}
			>
				<View
					style={[
						menuStyle,
						{height: 40 * list.lengths},
						position
					]}>
					{buttons}
				</View>
			</View>
		);
	}
}
const styles = {
	container: {
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0,0)',
		width: '100%',
		height: '100%',
		top: 0,
		left: 0
	},
	menuStyle: {
		position: 'absolute',
		top: 50,
		backgroundColor: '#fff',
		width: 150,
		borderColor: 'lightgray',
		borderWidth: 1
	},
	button: {
		height: 40,
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 30
	},
	buttonTitle: {
		fontWeight: '600',
		fontSize: 16
	}
};
export {PopUpMenu};