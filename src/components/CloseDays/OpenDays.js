import React, { Component } from 'react';
import { View, Text, Platform, FlatList, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Header } from '../common';
import { months, colors, tracker }from '../../actions/const';
import { setSelectedDay, getMeasurementsHistory, getDataForHomePage } from '../../actions';

class OpenDays extends Component {
	constructor (props) {
		super(props);

	}

	componentDidMount () {
		this.props.getDataForHomePage();
		this.props.getMeasurementsHistory();
	}

	renderListItem = ({ item }) => {
		const { buttonContainer, buttonTitle } = styles;

		return <TouchableOpacity style={buttonContainer} activeOpacity={0.8} onPress={() => {
			this.props.setSelectedDay({ day: item, meals: this.props.closeDaysList[item] });
            tracker.trackEvent("Click On", `${item}`);
		}}>
			<Text style={buttonTitle}>{`${item}`}</Text>
			<IonIcon name={'ios-arrow-forward'} size={30} color={colors.darkGrey}/>
		</TouchableOpacity>;
	};

	handleBackButtonPress = () => {
		Actions.main({type: 'replace'});
	};

	renderEmptyList = () => {
		return (
			<Text>no days found</Text>
		);
	}

	render () {
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const { closeDaysList } = this.props;
		const { container, listContainer } = styles;
		return (<View style={container}>
			<Header
				title={'Open Days'}
				leftIcon={icon}
				leftButtonPress={this.handleBackButtonPress}
			/>
			<View style={container}>
				<FlatList
					contentContainerStyle={listContainer}
					data={Object.keys(closeDaysList).reverse()}
					initialNumToRender={50}
					maxToRenderPerBatch={50}
					windowSize={100}
					shouldItemUpdate
					removeClippedSubviews={true}
					keyExtractor={(item, index) => index}
					renderItem={this.renderListItem}
					ListEmptyComponent={this.renderEmptyList}
				/>
			</View>
		</View>);
	}
}
const styles = {
	container: {
		flex: 1
	},
	listContainer: {
		flexGrow: 1,
		paddingHorizontal: 20
	},
	buttonContainer: {
		height: 60,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: colors.lightGrey
	},
	buttonTitle: {
		fontSize: 16,
		color: '#000'
	}
};
const mapStateToProps = ({ home }) => {
	const { closeDaysList } = home;
	return {
		closeDaysList
	};
};

export default connect(mapStateToProps, { setSelectedDay, getMeasurementsHistory, getDataForHomePage })(OpenDays);
