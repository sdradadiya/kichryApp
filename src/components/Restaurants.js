import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {
	Alert,
	View,
	Keyboard,
	Platform,
	TouchableOpacity,
	Text,
	FlatList,
	ActivityIndicator,
	ScrollView,
	Dimensions,
	AsyncStorage,
	Image
} from 'react-native';
import {colors} from '../actions/const';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafeAreaView from 'react-native-safe-area-view';
import {
	Header,
	InfoBox,
	Input
} from './common';
import {connect} from 'react-redux';
import { getRestaurant } from '../actions';


class Restaurants extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			restaurantResult: [],
			loading: true,
			error: '',
			search:''
		};
	}
	componentWillMount()
	{
		const {latitude,longitude}= this.props;
		if(latitude && longitude){
            this.props.getRestaurant(latitude, longitude);
		}
	}
	componentWillReceiveProps(nextProps)
	{
		if(this.props.restaurantResult !== nextProps.restaurantResult) {
			this.setState({
				restaurantResult: nextProps.restaurantResult,
				loading: false
			});
		}
        if(nextProps.error === "serverError" || nextProps.error === "No Result Fond"){
            this.setState({error:nextProps.error,loading: false})
        }
	}

    onTextChange = (search)=> {
        this.setState({
			search
		})
    }

    onSearchButtonPress = () => {
        const {search} = this.state;
        const {latitude,longitude}= this.props;
        Keyboard.dismiss();
        this.props.getRestaurant(latitude,longitude,search);
    }

    hendleEmptyList = () => {
        const {error} = this.state;
        if (error === "serverError") {
        	return <InfoBox message={'Sorry, your request could not be processed'}/>
        } else if(error === "No Result Fond"){
            return <InfoBox message={'No Restaurant found near your location'}/>
        } else{
            return null
        }
    }

    renderFooter = () => {
        if (this.state.loading) {
            return <ActivityIndicator style={{margin: 20}} color={colors.primaryOrange} size={'large'}/>;
        } else {
            return <View style={{flex: 1, marginBottom: 60}}></View>;
        }
    };

	renderRestaurant() {
		const {restaurantResult} = this.state;
        const {date,planId,add,replace,mealType}=this.props;
		const isIOS = Platform.OS === 'ios';
		return(
			<FlatList
				data={restaurantResult}
				renderItem={({item}) => {
					const { name, id, categories, location } = item;
                    let image = categories[0].icon.prefix + 'bg_64' + categories[0].icon.suffix;
					return (
						<View style={{marginVertical:2}}>
							<TouchableOpacity onPress={()=>{
								Actions.restaurantMenu({id: id,title:name,date,planId,add,replace,mealType})
							}}>
								<View style={{flexDirection: 'row', marginHorizontal: 3, justifyContent:'center',borderBottomWidth: 1,borderColor:colors.lightGrey, height: 100}}>
									<View style={{width:90,margin:5}}>
										<Image source={{uri:image}} style={{width:90,height:90,borderRadius:5}}/>
									</View>
									<View style={{flex:1,flexDirection:'row'}}>
											<View style={{flex:1,marginTop:5}}>
												<Text style={{fontSize: 20,marginHorizontal:3}} numberOfLines={2}>
													{name}
												</Text>
												<Text style={{fontSize: 17,marginHorizontal:3,color:colors.darkGrey}} numberOfLines={1}>
													{categories[0].name}
												</Text>
											</View>
										<View style={{marginTop:5,alignItems:'flex-end'}}>
                                            <Text style={{fontSize: 20,marginHorizontal:3,color:colors.darkGrey}} numberOfLines={1}>
                                                {location.distance + ' m'}
                                            </Text>
										</View>
									</View>
									</View>
							</TouchableOpacity>
						</View>
					);
				}}
				disableVirtualization={false}
				removeClippedSubviews={true}
				ListEmptyComponent={this.hendleEmptyList}
				keyExtractor={(item, index) => index}
				ListFooterComponent={this.renderFooter()}
				keyboardShouldPersistTaps={'always'}
				onEndReachedThreshold={isIOS ? 0 : 0.5}
				onMomentumScrollBegin={() => {
					this.onEndReachedCalledDuringMomentum = false;
				}}
				style={{backgroundColor: '#fff'}}
			/>
		);
	}
	render() {
		return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={'Restaurants Near You'}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => {Actions.pop()}}
				/>
				<View style={{backgroundColor:'#fff',borderBottomWidth:1,borderColor:colors.darkGrey}}>
					<Input
						autoFocus={false}
						placeholder='Search...'
						returnKeyType='search'
						keyboardType='default'
						onSubmitEditing={this.onSearchButtonPress}
						changeText={this.onTextChange}
					/>
				</View>
				{this.renderRestaurant()}
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		restaurant: { restaurantResult, restaurantMenuResult, loading, error }
	} = state;

	return {
		restaurantResult,
		restaurantMenuResult,
		loading,
		error
	};
};

export default connect(mapStateToProps, { getRestaurant })(Restaurants);
