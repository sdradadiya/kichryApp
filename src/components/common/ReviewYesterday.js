/**
 * Created by mponomarets on 6/25/17.
 */
import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	Dimensions,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import {Spinner} from './Spinner';
const {width} = Dimensions.get('window');
import {formatServerDate, colors} from '../../actions/const';


class ReviewYesterday extends Component {
	constructor (props) {
		super(props);
		this.state = {
			isDetailOpen: false,
			loadingImage: true,
			list: this.props.list,
			position: 0,
			width: width,
			height: 120
		};
		this.loadingStart = this.loadingStart.bind(this);
		this.loadingEnd = this.loadingEnd.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.list !== this.props.list) {
			this.setState({
				list: nextProps.list
			});
		}
	}

	loadingImage () {
		if (this.state.loadingImage) {
			return (
				<Spinner/>
			);
		}
		else {
			return null;
		}
	}

	loadingStart () {
		this.setState({loadingImage: true});
	}

	loadingEnd () {
		this.setState({loadingImage: false});
	}

	onMealPress (meal, img) {
		let recipe = {
			recipe: meal
		};
		this.props.onPressItem(recipe, img);
	}

	renderItem (meal, index) {
		const {height} = this.state;
		const {container, descriptionContainer, sectionContainer, imgStyle, titleStyle, dateStyle, subTitleStyle} = styles;
		return (
			<TouchableOpacity
				style={[sectionContainer, {width: this.state.width}]}
				key={index}
				onPress={() => this.onMealPress(meal, meal.image)}
				activeOpacity={0.9}
			>
				<View style={[container, {minHeight: height}]}>
					<Image
						source={{uri: meal.image}}
						style={[imgStyle]}
					/>
					<View style={descriptionContainer}>
						<Text style={titleStyle}>{meal.title}</Text>
						<View>
							<Text style={subTitleStyle}>{meal.type}</Text>
							<Text style={dateStyle}>{formatServerDate(meal.date)}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
		/**/
	}

	renderId () {
		const {width, position} = this.state;
		return Math.round(position / width) + 1;
	}

	render () {
		const {title, componentContainer, containerEmpty, textEmpty} = styles;
		const {list} = this.state;
		if(list != 'default') {
			const listItems = list.length > 0 ? list.map((item, index) => {
				return this.renderItem(item, index);
			}) : null;
			return (
				<View style={componentContainer}>
					<Text style={title}>Review Your Meals ({list.length})</Text>
					<ScrollView
						horizontal={ true }
						pagingEnabled={ true }
						scrollEventThrottle={100}
						showsHorizontalScrollIndicator={ false }
						style={{flex: 1}}
						onScroll={(e) => {
							this.setState({
								position: e.nativeEvent.contentOffset.x
							});
						}}
						onLayout={(e) => {
							this.setState({
								width: e.nativeEvent.layout.width
							});
						}}
						directionalLockEnabled={true}
					>
						{listItems}
					</ScrollView>
				</View>
			);
		} else {
			if(list === 'default') {
				return (
					<View style={containerEmpty}>
						<Text style={textEmpty}>No meals for review</Text>
					</View>
				);
			} else {
				return null;
			}
		}

	}
}

const color = {
	imgBg: '#847e7e',
	borderColor: '#847e5e'
};

const styles = {
	componentContainer: {
		flex: 1,
		marginTop: 10
	},
	sectionContainer: {
		paddingHorizontal: 10
	},
	containerForEmptyList: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 100,
		margin: 10,
		borderBottomColor: color.borderColor,
		borderBottomWidth: 1
	},
	text: {
		color: '#676767',
		fontSize: 16,
		fontWeight: 'bold'
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		borderBottomColor: color.borderColor,
		borderBottomWidth: 1,
		paddingBottom: 10
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		paddingBottom: 10,
		paddingLeft: 10
	},
	descriptionContainer: {
		flex: 2,
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		borderColor: color.descriptionBg
	},
	imgStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginRight: 10
	},
	titleStyle: {
		color: color.descriptionTitleColor,
		fontSize: 16,
		fontWeight: 'bold',
		paddingBottom: 10
	},
	subTitleStyle: {
		color: colors.primaryOrange,
		fontSize: 16,
		lineHeight: 18,
		fontWeight: 'bold'
	},
	dateStyle: {
		fontSize: 14,
		lineHeight: 18,
		color: '#000',
		paddingVertical: 5
	},
	containerEmpty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 100,
		margin: 10,
		borderBottomColor: color.borderColor,
		borderBottomWidth: 1
	},

	textEmpty: {
		color: '#676767',
		fontSize: 16,
		fontWeight: 'bold'
	}
};

export {ReviewYesterday};
