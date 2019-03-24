import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import UpcomingMealPreview from './UpcomingMealPreview';
import {isNull, omitBy} from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
    changeMealList,
    setActiveMeal,
    changeActiveSlide
} from '../../actions';
import {connect} from "react-redux";
import { Actions } from 'react-native-router-flux';
import {typeMeal,colors, textStyles, marginStyles} from "../../actions/const";

class DayMeals extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeSlide: (props.activeSlide !== -1)? (props.activeSlide) : 0
        }
    }

    componentDidMount(){
        const { meal } = this.props;
        this.props.setActiveMeal(meal[this.state.activeSlide]);
    }
    
    // else{
    //     return(
    //         <View style={marginStyles.descriptionMargin}>
    //         <Text style={textStyles.l3Text}>{`Track ${item.type}`}</Text>
    //         <View style={{height:240,justifyContent:'center'}}>
    //             <TouchableOpacity  style={{backgroundColor:'#fff',margin:3}} onPress={()=>Actions.mealDetail({recommended:true,tracked:true})}>
    //             <View style={{flexDirection:'row', width: '80%', height: 100, alignItems:'center'}}>
    //                 <View style={{height:70,width:70, flex:0.4}}>
    //                     <Image source={require('../../../resources/img/recommended.png')}
    //                            style={{margin:10,height:null,width:null, flex: 1,tintColor:'#00a9e8'}}
    //                            resizeMode={'contain'}/>
    //                 </View>
    //                 <View style={{flex:1}}>
    //                   <Text style={textStyles.l4Text}>Recommended Meal</Text>
    //                   <Text style={textStyles.description12}>Foods from the recommendation are already organized for one click tracking.</Text>
    //                 </View>
    //             </View>
    //             </TouchableOpacity>
    // 
    //             <TouchableOpacity style={{backgroundColor:'#fff',margin:3}} onPress={()=>Actions.mealDetail({recommended:false,tracked:true})}>
    //                 <View style={{flexDirection:'row', width: '80%', height: 110, alignItems:'center'}}>
    //                     <View style={{height:70,width:70, flex:0.4}}>
    //                         <Image source={require('../../../resources/img/study.png')}
    //                                style={{margin:10,height:null,width:null, flex: 1,tintColor:'#fd7037'}}
    //                                resizeMode={'contain'}/>
    //                     </View>
    //                     <View style={{flex:1}}>
    //                       <Text style={textStyles.l4Text}>Build your own meal</Text>
    //                       <Text style={textStyles.description12}>Choose this option if recommendation was not followed</Text>
    //                     </View>
    //                 </View>
    //             </TouchableOpacity>
    // 
    //         </View>
    //         </View>
    //     )
    //  }

    renderMeal = ({item}) => {
        const { onSwapMealClicked,onImageClicked,activeMeal,onSelectMeal,onTrackClicked } = this.props;
        const { preferredServingSize } = this.props.meal;

        if(item.id === -1) {
            return null;
        };
        
        const {loadingUpcoming, upcomingMeal} = this.props;
        let current = typeMeal.indexOf(item.type);
        let upcoming = typeMeal.indexOf(upcomingMeal.type);

        return(
          
          <View style={marginStyles.descriptionMargin}>
                <Text style={textStyles.l3Text}>{(item.isConfirmed) ? `Tracked ${item.type}` : `Your ${item.type}`}</Text>
            <TouchableOpacity
                onPress={onSelectMeal}
            >
                <UpcomingMealPreview
                    {...omitBy(item, isNull)}
                    description={`${parseInt(item.kcal)} Cal  .  ${parseInt(item.carb)}g Carbs  .  ${parseInt(item.protein)}g Protein  .  ${parseInt(item.fat)}g Fat`}
                    showNutrients={this.props.showNutrients}
                    preferredServingSize={preferredServingSize}
                    visible={!(item.isConfirmed)}
                    onImage={onImageClicked}
                    onSwap={onSwapMealClicked}
                    onTrack={onTrackClicked}
                />

            </TouchableOpacity>
            </View>

        )
    };

    updateActiveSlide = (index) =>{
        const { meal,activeSlide } = this.props;
        this.setState({ activeSlide: index });
        this.props.changeActiveSlide(index);
        this.props.setActiveMeal(meal[index]);
    };

    render(){
        const { meal,activeSlide } = this.props;
        return(
            (meal.length > 0) &&
            <View style={Styles.componentContainer}>
                <Carousel
                    layout={'default'}
                    data={meal}
                    firstItem={activeSlide}
                    renderItem={this.renderMeal}
                    onSnapToItem={(index) => this.updateActiveSlide(index)}
                    ListEmptyComponent={this.renderEmptyList}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.15}
                    keyExtractor={({plan_id}) => plan_id}
                    ListFooterComponent={this.renderFooter}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width - 50}
                />
            </View>
            ||
            <View style={Styles.noMealView}>
                <Image source={require('./img/default-recipe.jpg')} style={{flex:1}} resizeMode={'contain'}>
                    <Text style={{color:'#999999'}}>No meal found</Text>
                </Image>
            </View>

        );
    }

}

const Styles = {
    componentContainer: {
        flex:1,
        marginLeft: 5,
        marginTop: 20,
        height: 335,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 10
    },
    noMealView: {
        width:Dimensions.get('window').width,
        height:220,
        justifyContent:'center',
        alignItems:'center'
    },
    imgTitle: {
        flex: 1,
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
        fontSize: 15,
        fontWeight: '600',
        alignSelf:'center',
        textAlign:'center',
        color:'#999999'
    },
    viewShadow: {
        margin:7,
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        justifyContent:'center',
        backgroundColor:'#fff',
        overflow:'hidden'
    },
};

const mapStateToProps = (state) => {
    const {
        main: { activeMeal },
        home: {
            loadingUpcoming,
            upcomingMeal
        }
    } = state;
    return{
        activeMeal,
        loadingUpcoming,
        upcomingMeal
    }
};

export default connect(mapStateToProps, { setActiveMeal,changeActiveSlide })(DayMeals);
