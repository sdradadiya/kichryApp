import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, prettyDate, textStyles, marginStyles} from '../../actions/const';
import _ from 'lodash';
import moment from 'moment';
import {Actions} from "react-native-router-flux/index";
let passed = false;


export default class TrackWellNess extends Component {

    constructor(props) {
        super(props);
    }


    getDayName = (day) => {
        switch (day) {
            case 0:
                return 'sunday';
            case 1:
                return 'monday';
            case 2:
                return 'tuesday';
            case 3:
                return 'wednesday';
            case 4:
                return 'thursday';
            case 5:
                return 'friday';
            case 6:
                return 'saturday';
            default:
                return '';
        }
    };

    setRemainingTime = (time) => {

        let tempArray = JSON.parse(time);

        if (tempArray.hasOwnProperty('daily')) {

            let data = _.find(tempArray.daily, function (item) {
                return item.dayOfWeek === 'wednesday';
            });

            let d1 = moment(data.timestamp, 'HH:mm:ss');
            let newTime = moment();
            let duration = moment.duration(d1.diff(newTime));
            let hours = duration.asHours();
            passed = false;

            if (hours >= 0 && hours <= 1) {
                hours = parseInt(moment.duration(d1.diff(newTime)).asMinutes()) + ' m';
            } else if (hours < 0) {
                hours = 'DUE';
                passed = true;
            }else{
                hours = parseInt(duration.asHours()) + ' h';
            }

            return hours

        }else {
            let hours = null;
            for(i = 0; i < tempArray.intradaily.length; i++){

                let d1 = moment(tempArray.intradaily[i].timestamp, 'HH:mm:ss');
                let newTime = moment();
                let duration = moment.duration(d1.diff(newTime));
                hours = duration.asHours();
                passed = false;

                if(hours >= 0 && hours <= 1){
                    return hours = parseInt(moment.duration(d1.diff(newTime)).asMinutes()) + ' m';
                } else if(hours > 0) {
                    return parseInt(duration.asHours()) + ' h';
                }else{
                    hours = 'DUE';
                    passed = true;
                }
            }
            return  hours

        }

    };

    handlePressChecklist = (item, todayDate) => {
        Actions.trackItem({ item, todayDate })
    };

    render() {

        const {title, description, icon, time, tracked, item} = this.props;
        let remain_time = this.setRemainingTime(time);

        return (
            <View style={styles.listItem}>
                <TouchableOpacity onPress={() => this.handlePressChecklist(item, prettyDate())}>
                <View style={{flex: 1, backgroundColor: '#fff', height: 100, flexDirection: 'row'}}>
                    <View style={{flex: 0.2}}>
                        {(remain_time === '15 m') && <Text style={styles.warning}> Coming Up </Text>}
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <MaterialCommunityIcons size={50} name={icon.name} color={icon.color}/>
                        </View>
                    </View>
                    <View style={{flex: 0.6, marginVertical: 15}}>
                        <Text style={[textStyles.description12, styles.trackerTitle]}>{title}</Text>
                        <Text style={[textStyles.l4Text, styles.trackerDesc]}>{description}</Text>
                    </View>
                    <View style={{flex: 0.2, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <View style={{paddingRight: 10}}>
                            <MaterialCommunityIcons size={40} name='alarm-check' color={(tracked) ? colors.primaryGreen : ((passed) ? 'red' : colors.lightGrey)}/>
                        </View>
                        <Text style={ styles.time }>{(tracked || passed) ? '' : 'In ' + remain_time} </Text>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    warning: {
        fontSize: 15,
        color: 'red'
    },
    trackerTitle: {
        padding: 5, 
    },
    trackerDesc: {
        padding: 5,
    },
    time: {
        fontSize: 15,
        paddingBottom: 10,
        paddingRight: 10,
        color: colors.darkGrey
    },
    passedtime: {
        fontSize: 15,
        paddingBottom: 10,
        paddingRight: 10
    },
    listItem: {
        flex: 1,
        backgroundColor: colors.mainBackground,
        marginHorizontal:5,
        marginVertical: 5,
        borderRadius: 2,

    }
});
