/**
 * Created by mponomarets on 7/23/17.
 */
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Animated
} from 'react-native';
import {connect} from 'react-redux';
import {changeGroupBy} from '../../actions';
import FilterButton from './FilterButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, showAnimation} from '../../actions/const';

class FilterContainer extends Component {
	constructor (props) {
		super(props);
		this.state = {
			isFilterOpen: false
		};
		this.animatedValue = new Animated.Value(0);
	}

	renderFilters () {
		if (this.state.isFilterOpen) {
			return (
				<View style={{paddingBottom: 10}}>
					<View style={styles.filterContainer}>
						{this.props.children}
					</View>
				</View>
			);
		}
		else {
			return null;
		}
	}

	onPress () {
		
		if (this.state.isFilterOpen) {
			showAnimation(this.animatedValue, 0);
		} else {
			showAnimation(this.animatedValue, 1);
		}
		this.setNewState();
	}

	setNewState () {
		this.setState({
			isFilterOpen: !this.state.isFilterOpen
		});
	}

	render () {
		const {buttonContainer, textContainer, textStyle} = styles;
		const spin = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '180deg']
		});

		const title = this.props.title;

		let buttonContainerConditional = this.state.isFilterOpen ? {
			...buttonContainer,
			borderBottomColor: '#FFF'
		} : {...buttonContainer};

		return (
			<View style={{
				borderBottomWidth: 1,
				borderBottomColor: colors.lightGrey
			}}>
				<TouchableOpacity style={buttonContainerConditional} onPress={() => this.onPress()}>
					<View style={textContainer}>
						<Text style={textStyle}>{title}</Text>
						<Animated.View style={{transform: [{rotate: spin}]}}>
							<Icon name={'angle-up'} size={22} color={colors.primaryOrange}/>
						</Animated.View>
					</View>
				</TouchableOpacity>
				{this.renderFilters()}
			</View>
		);
	}
}

const styles = {
	buttonContainer: {
		minHeight: 60,
		flexDirection: 'column'
	},
	textContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	textStyle: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 14,
		marginRight: 10,
		flex: 0.8
	},
	filterContainer: {
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	filterButton: {
		padding: 10,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
		height: 50,
		minWidth: 70,
		borderRadius: 25,
		backgroundColor: '#FFF',
		borderColor: colors.lightGrey,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	filterText: {
		color: '#000',
		fontSize: 12,
		alignSelf: 'center',
		justifyContent: 'center'
	}
};

const mapStateToProps = ({search}) => {
	const {newFilters} = search;
	return {newFilters};
};

export default connect(mapStateToProps, {changeGroupBy})(FilterContainer);