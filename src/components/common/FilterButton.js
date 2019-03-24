/**
 * Created by mponomarets on 10/20/17.
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import {colors} from '../../actions/const';

class FilterButton extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			isValueCheck: this.props.isChek
		};
		this.onPressButton = this.onPressButton.bind(this);
	}

	componentWillMount () {

		if (this.props.filtersList.isMultiChoice === false) {
			this.checkIsChose(this.props);
		}

	}

	checkIsChose (props) {
		if (props.selectedFilters[props.filtersList.title][0] !== props.filter) {
			this.setState({isValueCheck: false});
		} else {
			this.setState({isValueCheck: true});
		}
	}

	componentWillReceiveProps (newProps) {
		if (newProps.filtersList.isMultiChoice === false) {
			this.checkIsChose(newProps);
		}
	}

	onPressButton () {
		const {isValueCheck} = this.state;
		const {filtersList, clearAllFilters} = this.props;

		for(let i = 0; i < this.props.restrictions.length; i++) {
			if(this.props.filter === this.props.restrictions[i]) {
				return; 
			}
		}

		if (isValueCheck) {
			this.props.removeFilter();
			this.setState({isValueCheck: false});

		} else {
			if (filtersList.isMultiChoice === false) {
				clearAllFilters(this.props.addFilter);
			} else {
				this.props.addFilter();
				this.setState({isValueCheck: true});
			}
		}
	}

	render () {
		const {isValueCheck} = this.state;
		const {filterButton, filterText} = styles;

		let buttonStatus = isValueCheck ? [filterButton, {backgroundColor: 'rgba(0,0,0,0.05)'}] : filterButton;

		let buttonStyle = this.props.filter === this.props.restrictions[0] ? [filterButton, {backgroundColor: 'rgba(255,0,0,.5)'}] : buttonStatus;

		for(let i = 0; i < this.props.restrictions.length; i++) {
	
			if(this.props.filter === this.props.restrictions[i]) {
				return (
					<TouchableOpacity
						onPress={this.onPressButton}
						style={[filterButton, {backgroundColor: 'rgba(255,0,0,.5)'}]}>
						<Text style={filterText}>{this.props.filter}</Text>
					</TouchableOpacity>
				);
			}
		}

		return (
			<TouchableOpacity
				onPress={this.onPressButton}
				style={buttonStyle}>
				<Text style={filterText}>{this.props.filter}</Text>
			</TouchableOpacity>
		);
	}

}

const styles = {
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
	const { restrictions } = search;
	return { restrictions }; 
};

export default connect(mapStateToProps, {})(FilterButton);