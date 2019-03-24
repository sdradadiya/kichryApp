/**
 * Created by mponomarets on 7/30/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import {changePeriod, getGroceryList} from '../../actions';
import {colors, textStyles, tabStyles} from '../../actions/const';

class GroceryTabs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			period: this.props.period
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps !== this.props) {
			this.setState({
				period: newProps.period
			});
		}
	}

	onTabPress(name) {
		this.props.changePeriod(name);
		this.props.getGroceryList();
	}

	render() {
		const {period} = this.state;
		const {container, tabStyle, rightTab, tabTitle} = styles;
		const dayStyle = period === 'day' ? tabStyles.activeTabTitle : tabStyles.inactiveTabTitle;
		const rightStyle = period === 'week' ? tabStyles.activeTabTitle : tabStyles.inactiveTabTitle;
		return (
			<View style={{height: 40}}>
				<View style={[container, tabStyles.container]}>
					<TouchableOpacity
						onPress={() => this.onTabPress('day')}
						style={tabStyle}>
						<Text style={[dayStyle, tabTitle]}>Daily</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.onTabPress('week')}
						style={tabStyle}>
						<Text style={[rightStyle, tabTitle]}>Weekly</Text>
					</TouchableOpacity>
				</View>
			</View>);
	}
}
const styles = {
	container: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: 0,
	},
	tabStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	tabTitle: {
		fontSize:16,
		fontWeight: 'bold'
	}
};

const mapStateToProps = ({grocery}) => {
	const {period} = grocery;
	return {period};
};

export default connect(mapStateToProps, {changePeriod, getGroceryList})(GroceryTabs);
