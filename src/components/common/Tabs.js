/**
 * Created by mponomarets on 6/25/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import { tracker, colors } from '../../actions/const';

class Tabs extends Component {
	constructor (props) {
		super(props);
		this.state = {
			activeTab: this.props.id,
			tabsData: [
				{tabIcon: 'home', tabIconActive: 'home', tabName: 'Home', tabID: 0},
				{tabIcon: 'line-chart', tabIconActive: 'line-chart', tabName: 'Progress', tabID: 1},
				{tabIcon: 'book', tabIconActive: 'book', tabName: 'Recipe Book', tabID: 2},
				//{tabIcon: 'shopping-cart', tabIconActive: 'shopping-cart', tabName: 'Grocery', tabID: 3},
				{tabIcon: 'comments-o', tabIconActive: 'comments', tabName: 'Chat', tabID: 3}
			]
		};
	}

	changeActiveTab (id, title) {
		switch (id) {
			case 0:
				tracker.trackEvent('Click On', `${title}`);
				return this.setState({
					activeTab: id
				}, () => {

					this.props.onChangeTab(id, title);
				});
			case 1:
				tracker.trackEvent('Click On', `${title}`);
				return this.setState({
					activeTab: id
				}, () => {

					this.props.onChangeTab(id, title);
				});
			case 2:
				tracker.trackEvent('Click On', `${title}`);
				return this.setState({
					activeTab: id
				}, () => {
					this.props.onChangeTab(id, title);
				});
			/*case 3:
				tracker.trackEvent('Click On', `${title}`);
				return this.setState({
					activeTab: id
				}, () => {
					this.props.onChangeTab(id, title);
				});*/
			case 3: {
				tracker.trackEvent('Click On', `${title}`);
				this.props.onPressChat();
				return Actions.chat();
			}
			default:
				return this.setState({
					activeTab: id
				}, () => {

					this.props.onChangeTab(id, title);
				});

		}

	}

	renderTabButtons (name, icon, id, activeIcon) {
		return (
			<TouchableOpacity
				style={styles.touchableContainer}
				key={id}
				onPress={() => this.changeActiveTab(id, name)}
				activeOpacity={0.8}>
				<Icon
					name={this.state.activeTab === id ? activeIcon : icon}
					style={this.state.activeTab === id ? styles.activeIconStyle : styles.iconStyle} size={15}/>
				<Text style={this.state.activeTab === id ? styles.activeIconName : styles.iconName}>{name}</Text>
			</TouchableOpacity>
		);
	}

	generateTabsElements () {
		let data = this.state.tabsData;
		let tabsElements = [];
		data.forEach((item, i, data) => {
			tabsElements.push(
				this.renderTabButtons(data[i].tabName, data[i].tabIcon, data[i].tabID, data[i].tabIconActive)
			);
		});
		return tabsElements;
	}

	render () {
		return (
			<View style={styles.tabsContainer}>
				{this.generateTabsElements()}
			</View>
		);
	}
}

const styles = {
	tabsContainer: {
		height: ((Platform.OS === 'ios' && Dimensions.get('window').height === 812) ? 70 : 60),
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderTopColor: '#fff',
		borderTopWidth: 1,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingBottom: ((Platform.OS === 'ios' && Dimensions.get('window').height === 812) ? 10 : 0),
		backgroundColor: '#fff'
	},
	touchableContainer: {
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	iconStyle: {
		alignSelf: 'center',
		marginBottom: 5,
		color: 'rgba(0, 0, 0, 0.3)'
	},
	iconName: {
		alignSelf: 'center',
		fontSize: 12,
		color: 'rgba(0, 0, 0, 0.3)'
	},
	activeIconStyle: {
		alignSelf: 'center',
		marginBottom: 5,
		color: colors.primaryBlack
	},
	activeIconName: {
		alignSelf: 'center',
		fontSize: 12,
		color: colors.primaryBlack
	}
};
export {Tabs};
