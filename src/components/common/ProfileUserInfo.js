/**
 * Created by mponomarets on 8/16/17.
 */
import React, {Component} from 'react';
import {
	Text,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class ProfileUserInfo extends Component {
	constructor (props) {
		super(props);
		this.state = {
			country: '',
			city: '',
			name: 'Djon Dou'
		};
	}

	componentDidMount () {
		let url = 'https://freegeoip.net/json/';
		fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {

				this.setState({
					country: responseJson.country_name,
					city: responseJson.city
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	render () {
		const {container, nameStyle, iconContainer, location, splitter} = styles;
		const {name, city, country} = this.state;

		if (city === '' && country === '') {

			const userLocation = 'Acquiring location..';
		}

		else{

			if(city !== '') {

				const userLocation = country;

			}

			else if(country !== '') {

				const userLocation = city;

			}
			
			else{

				const userLocation = city + ', ' + country;

			}
		}

		return (
			<View style={container}>
				<Icon name={'user-circle'} color={'#fff'} size={150}/>
				<Text style={nameStyle}>{name}</Text>
				<View style={iconContainer}>
					<Icon name={'map-marker'} color={'#fff'} size={30}/>
					<Text style={location}>{userLocation}</Text>
				</View>
				<View style={splitter}/>
			</View>
		);
	}
}
const styles = {
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 20
	},
	nameStyle: {
		color: '#fff',
		paddingTop: 10,
		fontSize: 18
	},
	iconContainer: {
		flexDirection: 'row',
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	location: {
		color: '#fff',
		paddingHorizontal: 5,
		fontSize: 18
	},
	splitter: {
		borderBottomWidth: 1,
		borderBottomColor: '#fff',
		width: '70%',
		marginTop: 10
	}
};

export {ProfileUserInfo};