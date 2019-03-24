import React, { Component } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import {colors} from '../../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel, { Pagination } from 'react-native-snap-carousel';

class ReleaseNotes extends Component {

	constructor (props) {
		super(props);
		this.state = {
			notes: [
				{
					image: require('./img/releaseNotes/img1.png')
					// title: 'Trends for Tracked Items',
					// subtitle: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
				},
				{
					image: require('./img/releaseNotes/img2.png')
					// title: '',
					// subtitle: ''
				},
				{
					image: require('./img/releaseNotes/img3.png')
				// 	title: '',
				// 	subtitle: ''
				}
			],
			itemWidth: Dimensions.get('window').width - 80,
			itemHeight: Dimensions.get('window').height - 100,
			activeSlide: 0
		};
	}

	componentWillReceiveProps (newProps) {
		// if (newProps !== this.props) {
		// 	this.setState({
		// 		width: newProps.width,
		// 		height: newProps.height
		// 	}, () => this._scrollView.scrollTo({x: this.state.activeId * newProps.width, y: 0, animated: true}));
		// }
	}

	onPressButton () {
		this.props.onClose();
	}

	renderItem ({item}) {
		return (
			<View style={[styles.imgContainer, { width: this.state.itemWidth, height: this.state.itemHeight}]}>
				<Image
					style={styles.img}
					source={item.image}
				/>	
			</View>
		);
	} 

	render() {
		const {container, elementContainer, buttonContainer, buttonTitle} = styles;

		return(
			<View style={container}>
				<View style={elementContainer}>
					<Carousel
						layout={'default'}
						data={this.state.notes}
						renderItem={this.renderItem.bind(this)}
						onSnapToItem={(index) => this.setState({ activeSlide: index })}
						sliderWidth={Dimensions.get('window').width}
						itemWidth={this.state.itemWidth}
					/>
					<Pagination
						dotsLength={this.state.notes.length}
						activeDotIndex={this.state.activeSlide}
						containerStyle={{ width: 100, height: 10 }}
						dotStyle={{
							width: 10,
							height: 10,
							borderRadius: 5,
							marginHorizontal: 8,
							backgroundColor: 'rgba(255, 255, 255, 0.92)',
							...Platform.select({
								android: {
									marginTop: 10
								}
							})
						}}
						inactiveDotStyle={{
							// Define styles for inactive dots here
						}}
						inactiveDotOpacity={0.4}
						inactiveDotScale={0.6}
					/>
					<TouchableOpacity style={buttonContainer} onPress={this.onPressButton.bind(this)}>
						<Text style={buttonTitle}>CLOSE</Text>
					</TouchableOpacity>
				</View>
			</View>
		);

	}

}

const styles = {
	container: {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		position: 'absolute',
		alignItems: 'stretch',
		backgroundColor: colors.primaryGreen
	},
	elementContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		...Platform.select({
			android: {
				marginTop: 30
			}
		})
	},
	imgContainer: {
		backgroundColor: colors.primaryGreen
	},
	img: {
		flex: 1,
		width: '100%',
		height: '100%',
		resizeMode: Image.resizeMode.contain,
		shadowColor: 'rgba(0,0,0, .8)',
		shadowOffset: { height: 0, width: 0 },
		shadowOpacity: 1,
		shadowRadius: 5
		// ...Platform.select({
		// 	ios: {
		// 		shadowColor: 'rgba(0,0,0, .8)',
		// 		shadowOffset: { height: 0, width: 0 },
		// 		shadowOpacity: 1,
		// 		shadowRadius: 5
		// 	},
		// 	android: {
		// 		elevation: 5
		// 	}
		// })
	},
	buttonContainer: {
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 16
	}
};

export { ReleaseNotes };