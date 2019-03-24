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
    Image,
    SectionList
} from 'react-native';
import {colors} from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';
import {
    Header,
    InfoBox
} from './common';
import {connect} from 'react-redux';
import { getRestaurantMenu } from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome';


class RestaurantMenu extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            restaurantMenuResult: [],
            loading: true,
            error: false
        };
    }
    componentWillMount()
    {
        this.props.getRestaurantMenu(this.props.id);
    }
    componentWillReceiveProps(nextProps)
    {
        if(this.props.restaurantMenuResult !== nextProps.restaurantMenuResult) {
            this.setState({
                restaurantMenuResult: nextProps.restaurantMenuResult,
                loading: false,
                error:false
            });
        }

        if(nextProps.error === "No Menu Found"){
            this.setState({error:true})
        }
    }

    hendleEmptyList = () => {
        const {error} = this.state;
        if (error) {
          return (<View style={{height:100}}>
              <InfoBox message={'No Menu available.'}/>
          </View>)
        } else {
          return null
        }
    }


  renderFooter = () => {
        if (this.state.loading) {
            return <ActivityIndicator style={{margin: 20}} color={colors.primaryOrange} size={'large'}/>;
        }
    };

    renderRestaurantMenu() {
        const {restaurantMenuResult} = this.state;
        const {date,planId,add,replace,mealType}=this.props;
        if(restaurantMenuResult.length === 0){
            return null;
        }
        const isIOS = Platform.OS === 'ios';
        return(
            <FlatList
                data={restaurantMenuResult}
                renderItem={({item}) => {
                    const { name, menuId } = item;
                    return (
                        <TouchableOpacity onPress={()=>{
                            Actions.restaurantMenuList({ menuId,date,planId,add,replace,planMealType:mealType,name})
                        }}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, borderBottomWidth: 1, borderBottomColor: 'rgb(57, 192, 111)', height: 50}}>
                                <Text style={{fontSize: 20}} numberOfLines={1}>
                                    {name}
                                </Text>
                                <Icon name={'angle-right'} size={22} color={colors.primaryOrange}/>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                disableVirtualization={false}
                removeClippedSubviews={true}
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
                    title={this.props.title}
                    leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
                    leftButtonPress={() => Actions.pop()}
                />
                <View style={{backgroundColor:'#fff',flex:1}}>
                    {this.renderFooter()}
                    {this.renderRestaurantMenu()}
                    {this.hendleEmptyList()}
                </View>
            </SafeAreaView>
        );
    }
}


const styles={
    menuTitle:{
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:5
    },
    menuTitleText:{
        fontSize:20,
        textAlign:'center'
    },
    menuTypeText:{
        fontSize:25,
        color:'#000'
    }
}

const mapStateToProps = (state) => {
    const {
        restaurant: { restaurantMenuResult, loading, error }
    } = state;

    return {
        restaurantMenuResult,
        loading,
        error
    };
};

export default connect(mapStateToProps, { getRestaurantMenu })(RestaurantMenu);