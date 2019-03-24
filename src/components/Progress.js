import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    Image,
    SectionList,
    Dimensions,
    FlatList,
    ScrollView,
    Platform
} from 'react-native';
import {changeDate, getMealPlan} from '../actions';
import {prettyDate, textStyles, colors, marginStyles} from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';
import _ from 'lodash';
import {Spinner} from './Home/common';
import Tabs from 'react-native-tabs';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

let userImage = [];
let nutrition = {
    calories:0,
    carbs:0,
    protein:0,
    fat:0
};
let totalMeals = 0;
let totalReportedMeals = 0;
let totalReportedDays = 0;
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

class Progress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadMore:false,
            loadNutrition:false,
            duration:0,
            selectedTab: '1',
        }
    }

    componentWillReceiveProps(nextProps) {

        const {mealPlans,date,changeDate, getMealPlan} = nextProps;

        if (nextProps.mealPlans !== this.props.mealPlans) {
            if (mealPlans) {
                let plans = mealPlans.mealplan;
                if (plans.length > 0) {
                  totalMeals = totalMeals + plans.length;
                }                

                let temp = plans.filter((plan) => plan.photo != null);
                let images = _.map(temp, 'photo');

                let temp_obj = {
                    title: date,
                    data: [{images: images}]
                };
                let trackedCount = 0;

                userImage.push(temp_obj);

                if (userImage.length < 7) {
                    let temp_nutrition = plans.filter((plan) => plan.isConfirmed != null);
                    let avg_fat = _.sumBy(temp_nutrition, (o)=> {
                      trackedCount = trackedCount + 1;
                      return o.fat;
                    });
                    totalReportedMeals = totalReportedMeals + trackedCount;

                    let avg_protein = _.sumBy(temp_nutrition, (o)=> { return o.protein; });
                    let avg_carb = _.sumBy(temp_nutrition, (o)=> { return o.carb; });
                    let avg_kcal = _.sumBy(temp_nutrition, (o)=> { return o.kcal; });

                    if (avg_kcal > 0) {

                        nutrition.calories = nutrition.calories + avg_kcal;
                        nutrition.carbs = nutrition.carbs + avg_carb;
                        nutrition.protein = nutrition.protein + avg_protein;
                        nutrition.fat = nutrition.fat + avg_fat;
                        totalReportedDays = totalReportedDays + 1;
                        this.createNutritionStats();
                      }

                      let mydate = new Date(date);
                      mydate.setDate(mydate.getDate() - 1);
                      changeDate(prettyDate(mydate));
                      getMealPlan();

                }else{
                    this.setState({
                        loadMore:false,
                        loadNutrition:true
                    })
                }
            }
        }

    }

    componentDidMount() {
        const {changeDate, getMealPlan} = this.props;
        let date = new Date();
        date.setDate(date.getDate() - 1);
        changeDate(prettyDate(date));
        getMealPlan();
    }

    componentWillUnmount(){
        userImage = [];
        nutrition = {
            calories:0,
            carbs:0,
            protein:0,
            fat:0
        };
        totalMeals = 0;
        totalReportedMeals = 0;
        totalReportedDays = 0;
    }

  /*  handleLoadMore = () => {

        const { date ,changeDate, getMealPlan } = this.props;
        if(!this.state.loadMore){
            if(date){
                let mydate = new Date(date);
                mydate.setDate(mydate.getDate() - 1);
                this.setState({
                    loadMore:true
                },()=>{
                    changeDate(prettyDate(mydate));
                    getMealPlan();
                });
            }
        }
    };*/

    renderTabs() {
  		const { selectedTab } = this.state;
  		const { tabsContainer, inActiveTabStyle } = styles;

  		return(
  			<View style={styles.tabsContainer}>
         <Tabs selected={this.state.selectedTab} style={{backgroundColor:'#fff', height:40}}
               selectedStyle={textStyles.l4Text} onSelect={()=>this.setState({ selectedTab: this.props.name })}>
             <Text name="1" style={textStyles.description14Regular}>7 Days</Text>
             <Text name="2" style={textStyles.description14Regular}>14 Days</Text>
             <Text name="3" style={textStyles.description14Regular}>30 Days</Text>
         </Tabs>
       </View>
  		);	
  	}

    renderNutrition = () => {
        const { titleView } = styles;
        return(
            <View style={[marginStyles.sectionTitle, titleView]}>
                <Text style={textStyles.l2Text}>Nutrition</Text>
            </View>
        );
    };


    renderMeal = () => {
        const { titleView } = styles;
        return (
            <View style={[titleView,marginStyles.sectionTitle]}>
                <Text style={textStyles.l2Text}>Meals</Text>
            </View>
        );
    };

    renderWellNess = () => {
        const { titleView } = styles;
        return (
            <View style={[titleView,{marginTop:20}]}>
                <Text style={textStyles.l2Text}>Wellness</Text>
            </View>
        );
    };

    itemSeparatorComponent = () => {
        return(
            <View  style={{height: 1}}/>
        );
    };

    renderDate = (title) => {
        let monthName = months[new Date(title).getMonth()];
        let day = new Date(title).getDate();
        return(
            <View style={{alignItems:'center',margin:10,flex:1}}>
                <Text style={{fontSize : 16, color:colors.primaryGrey}}>{monthName}</Text>
                <Text style={{fontSize : 16, color:colors.primaryGrey}}>{day}</Text>
            </View>
        );

    };

    renderItem = ({ item, index }) => {
        return (
            <View
                style={{flexWrap:'wrap', flexDirection:'row', maxWidth: 280}}>
				{
					item.images &&
						item.images.map((image) => {
							return (
                                <View  key={image} style={{height:80,width:80,margin:2}}>
                                    <Image source={{uri:image}} style={{height:null,width:null, flex: 1, margin: 2}} />
                                </View>
                            )
						})
				}
            </View>
        );
    };

    renderMealPhotoSectionTitle() {
      return (
      <View>
        <View style={[marginStyles.sectionMargin, {justifyContent: 'space-between', flexDirection: 'row'}]}>
            <Text style={textStyles.l3Text}>Photo Journal</Text>
        </View>
      </View>
      );
    }

    renderMealRatioSection() {

      return (
        <View>
          <View style={[marginStyles.sectionMargin, {justifyContent: 'space-between', flexDirection: 'row'}]}>
              <Text style={textStyles.l3Text}>Tracking Ratio</Text>
          </View>
          <View style={[marginStyles.descriptionMargin, {justifyContent: 'space-between', flexDirection: 'row'}]}>
              <Text style={textStyles.description12}>Ratio of meals tracked vs. untracked. For improved diagnosis, keep this number > 80%.</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
              <View style={{flexDirection:'row', justifyContent: 'center', marginVertical:10, marginLeft:5}}>
                <Text style={[textStyles.l1Text, {color:'orange'}]}>{parseInt((totalReportedMeals/totalMeals)*100)} %</Text>
              </View>
          </View>
        </View>
      );
    }

    renderMealSection() {

        const isIOS = Platform.OS === 'ios';
        if (userImage.length > 0) {
            return(
                <View style={{justifyContent:'center',margin:5}}>
                    <SectionList
                        renderItem={this.renderItem}
                        renderSectionHeader={({section: {title}}) => this.renderDate(title)}
                        sections={userImage}
                        horizontal={true}
                        keyExtractor={(item, index) => item + index}
                        ItemSeparatorComponent={this.itemSeparatorComponent}
                        showsHorizontalScrollIndicator={false}

                    />
                </View>
            );
        }
        else return <Spinner/>;
    }

    renderNutritionSection() {

      const displaySection =  this.state.nutritionStats && this.state.nutritionStats.length > 0 &&
                          this.state.nutritionStats.map((item, index) => {
                            return(
                              <View key={index} >
                                <View style={{height: responsiveHeight(10), width: responsiveWidth(25), borderWidth:1, borderTopWidth:0, borderBottomWidth:0, borderColor:colors.lightGrey, backgroundColor:'#fff', flexDirection:'column', justifyContent: 'center'}}>
                                    <View style={{flexDirection:'row', justifyContent: 'center', marginBottom:10}}>
                                      <Text style={textStyles.l3Text}>{item.average}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent: 'center'}}>
                                      <Text style={textStyles.description14}>{item.target}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent: 'center'}}>
                                      <Text style={textStyles.description10}>target</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row', justifyContent: 'center', marginTop:5}}>
                                  <Text style={textStyles.description12}>{item.title}</Text>
                                </View>
                              </View>
                          )
                        });


      if(this.state.loadNutrition) {

          return (
              <View>
                  <View style={[marginStyles.sectionMargin, {justifyContent: 'space-between', flexDirection: 'row'}]}>
                      <Text style={textStyles.l3Text}>Macronutrients</Text>
                  </View>
                  <View style={[marginStyles.descriptionMargin, {justifyContent: 'space-between', flexDirection: 'row'}]}>
                      <Text style={textStyles.description12}>The averages below are based on the number of tracked meals</Text>
                  </View>
                  <View style={{marginLeft:5, flexDirection:'row', justifyContent: 'center'}}>
                    {displaySection}
                  </View>
              </View>
            );
          }
    }

    createNutritionStats() {

      const { nutrition_targets } = this.props;

      const average = (a, b) => (a === 0 ? b : (a + b) / 2);

      let myArray = []

      let calories_avg = parseInt(nutrition.calories/totalReportedDays);
      let calories_target = average(nutrition_targets.day_calorie_cap, nutrition_targets.day_calorie_floor);
      let temp_obj = {
          title: 'calories',
          average: calories_avg,
          target: calories_target
      };
      myArray.push(temp_obj);

      let carbs_avg = parseInt(nutrition.carbs/totalReportedDays);
      let carbs_target = average(nutrition_targets.day_carbohydrate_cap, nutrition_targets.day_carbohydrate_floor);
      temp_obj = {
          title: 'carbs(g)',
          average: carbs_avg,
          target: carbs_target
      };
      myArray.push(temp_obj);

      let protein_avg = parseInt(nutrition.protein/totalReportedDays);
      let protein_target = average(nutrition_targets.day_protein_cap, nutrition_targets.day_protein_floor);
      temp_obj = {
          title: 'protein(g)',
          average: protein_avg,
          target: protein_target
      };
      myArray.push(temp_obj);

      let fat_avg = parseInt(nutrition.fat/totalReportedDays);
      let fat_target = average(nutrition_targets.day_fat_cap, nutrition_targets.day_fat_floor);
      temp_obj = {
          title: 'fat(g)',
          average: fat_avg,
          target: fat_target
      };
      myArray.push(temp_obj);

      this.setState({nutritionStats: myArray});
    }

    render() {
        const { loadNutrition } = this.state;
        return (
          <SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.mainBackground}}>
              {this.renderTabs()}
              <View style={{flex: 1, marginBottom:100}}>
                  {
                      (loadNutrition) &&
                      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent: 'space-between'}}>
                          {this.renderNutrition()}
                          {this.renderNutritionSection()}
                          {this.renderMeal()}
                          {this.renderMealRatioSection()}
                          {this.renderMealPhotoSectionTitle()}
                          {this.renderMealSection()}
                      </ScrollView>
                      || <Spinner/>
                  }

              </View>

          </SafeAreaView>
        );
    }
}

const styles = {
    titleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:30,
        marginLeft:5
    },
    tabsContainer: {
      flex: 0.08,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:10,
    },
    inActiveTabStyle: {
      backgroundColor:'#fff',
    }
};

const mapStateToProps = ({mealPlan}) => {
    const {mealPlans,currentDateMealPlan,nutrition_targets} = mealPlan;
    return {
        mealPlans,
        date: currentDateMealPlan,
        nutrition_targets
    };
};

export default connect(mapStateToProps, {
    getMealPlan,
    changeDate
})(Progress);
