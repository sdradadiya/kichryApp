import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text, Dimensions} from 'react-native';
import {colors} from '../../actions/const';
import {selectMealPlanNutritionSummary} from '../../selectors/MealPlan.js';
import {
	setNutritionRemain
} from '../../actions';
import _ from 'lodash';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

let nutritionArray = ['calories', 'carbs', 'protein', 'fat'];
let nutritionMealArray = ['kcal', 'carbohydrate', 'protein', 'fat'];
const circleRadius = ((Dimensions.get('window').width / 4) - 10);

class NutritionChart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_tab: {
				name: 'calories',
				precision: 0,
				unit: ''
			}
		};
	}


    renderDailyProgress = (more, consumedNutrition, consumed, total, index) => {

        const {titleContainer} = styles;
		let fillValue = ((more) ? 100 : consumedNutrition);
		let fillColor = ((more) ? '#ff1800' : '#61cd89');
		if (total < 1) // initial load
		{
			fillValue = 100;
			fillColor = colors.lightGrey;
		}
		return (
            <View style={{justifyContent: 'center', alignItems: 'center'}} key={index}>

                <AnimatedCircularProgress
                    size={circleRadius}
                    width={5}
                    fill={fillValue}
                    tintColor={fillColor}
                    rotation={0}
                    backgroundColor={colors.lightGrey} >
					{
						(fill) => (
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#282c36'
                                }}>{(consumed)}</Text>
                                <Text style={{fontSize: 15, color: '#999999'}}>{(total)}</Text>
                                </View>

                            )
					}
                </AnimatedCircularProgress>

                <Text style={titleContainer}>{nutritionArray[index]} </Text>
            </View>
        );
    };

    renderProgress() {

        const {container, titleContainer} = styles;
        const {activeMeal, dailyMeal, data, originalServing, prefereServing, preferredServingSize, servings} = this.props;

        let consumedNutrition = 0;
        let remaining = {};
        let more = false;
        let total = 0;
        let consumed = 0;

        return <View style={container}>
            {

                (!dailyMeal) &&

                nutritionMealArray.map((item, index) => {
                    if (activeMeal && (Object.keys(activeMeal).length !== 0) && data) {
                        more = false;
                        let tempActiveMeal = _.cloneDeep(activeMeal);
                        tempActiveMeal['carbohydrate'] = tempActiveMeal['carb'];
                        delete tempActiveMeal['carbs'];
                        total = parseInt(tempActiveMeal[item]);
                        consumed = parseInt((data[item]) ? data[item] / originalServing : 0);

                        remaining.value = total - consumed;

                        consumedNutrition = (100 * consumed) / total;
                        if (consumedNutrition > 95 && consumedNutrition < 105) {
                            // lets not fret over 5% deviations.
                            consumed = total;
                            consumedNutrition = 100;
                        }else if(consumedNutrition > 105){
                            more = true;
						}

                        if(isNaN(consumedNutrition)){
                            consumedNutrition = 0;
                        }
                    }

                    {return this.renderDailyProgress(more, consumedNutrition, consumed, total, index)}
                })

                ||

                nutritionArray.map((item, index) => {

                    more = false;
                    const {selected_tab: {unit, precision}} = this.state;
                    const {cap, floor, consumed} = this.props.nutrition_summary[item];
                    const average = (a, b) => (a === 0 ? b : (a + b) / 2);
                    const str = val => Number(val.toFixed(precision)).toString() + unit;
					let dailytarget = average(cap, floor);

					let consumedNutrition = 0;

					if (floor > 0) {
						// going for a target band
						remaining.value = str(consumed);
						remaining.label = str(dailytarget);
						if (consumed < floor) {
							remaining.style = {color: 'black'};
						} else if (consumed < cap) {
							remaining.style = {color: 'green'};
						} else {
							remaining.style = {color: 'red'};
						}
						
						let remain = {...remaining};
						let gain = dailytarget - parseInt(remain.value);
						consumedNutrition = (100 * consumed) / dailytarget;
						
                    	{return this.renderDailyProgress(more, consumedNutrition, Math.abs(remaining.value), total=remaining.label, index)}

                    } else {
						
						remaining.value = str(consumed);
						remaining.label = str(dailytarget);
						if (consumed < dailytarget) {
							remaining.style = {color: 'black'};
						} else {
							remaining.style = {color: 'red'};
							more = true
						}

						if (parseInt(remaining.value) && dailytarget !== 0) {
							let left = dailytarget - parseInt(remaining.value);
							consumedNutrition = (100 * consumed) / dailytarget;
						}

                        {return this.renderDailyProgress(more, consumedNutrition, Math.abs(remaining.value), total=remaining.label, index)}

                    }

                })
            }
        </View>;

    }


    render() {
        if (!this.props.visible) return <View/>;
        return (
            <View>
                {this.renderProgress()}
            </View>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    nutrition_summary: selectMealPlanNutritionSummary(state),
    visible: state.clientPermissions.showNutrients && ownProps.visible,
    activeMeal: state.main.activeMeal
});

export default connect(mapStateToProps, {
    setNutritionRemain
})(NutritionChart);

const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'space-between'
    },
    titleContainer: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#999999'
    }
};
