import React, { Component } from 'react';
import {Text, View, Platform, ScrollView, ActivityIndicator, FlatList, Dimensions, Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Header, InfoBox } from '../common';
import { months, colors, sortChecklist }from '../../actions/const';
import TrackItemButton from './TrackItemButton';
import { getDailyChecklist, clearError} from '../../actions';
import Toast from 'react-native-another-toast';
let toastMessage;

// TRACKDAY
class TrackDay extends Component {

	constructor(props) {
		super(props);

		this.state = {
			renderToast:false
		}

	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.messageToast !== this.props.messageToast && nextProps.messageToast && nextProps.messageToast.placeToShow === 'trackDay') {
      		toastMessage = nextProps.messageToast.text;
			this.setState({renderToast:true},()=>{
        		this.toast.showToast();
        		setTimeout(()=>{
                    this.setState({
                        renderToast: false,
                    });
				},5000)
			});
		}
	}

	componentDidMount() {
		
		const { date, getDailyChecklist } = this.props;

		getDailyChecklist(date);

	}

	componentWillUnmount() {
		this.props.clearError();
	}

	handlePressChecklist = (item, todayDate) => {

		Actions.trackItem({ item, todayDate })

	};

	renderEmptyList = () => {
		return(
			<InfoBox message={'We could not locate any trackers for this day.'}/>
		);
	};

	renderChecklistItem = ({item}) => {

		const { date } = this.props;

		return(
			<TrackItemButton
				key={item.item.id}
				title={item.item.sub_topic}
				question={item.item.title}
				icon={'ios-arrow-forward'}
				onPress={() => this.handlePressChecklist(item, date)}
			/>
		)
	};

	renderChecklistItems() {
		
		const { date, dailyChecklist } = this.props;

        sortChecklist(dailyChecklist);

		return(
			<FlatList
				data={sortChecklist(dailyChecklist)}
				renderItem={this.renderChecklistItem}
				ListEmptyComponent={this.renderEmptyList}
				extraData={this.state}
				keyExtractor={(item, index) => index}
			/>
		)

	}

    renderToast()
    {
        let Height=(Dimensions.get('window').height/2) - 60;
        const { toastStyle, toastTitle, toastSubTitle } = styles;
        if(this.state.renderToast){
            return(<Toast
                content={
                    <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
                        <Image
                            style={{ width: 60, height: 60 }}
                            source={require('../../../resources/img/WellDone2.gif')}
                        />
												<Text style={toastTitle}>{"Way to go!"}</Text>
												<Text style={toastSubTitle}>{toastMessage}</Text>
                    </View>
                }
                animationType={'fade'}
                animationDuration={200}
                topBottomDistance={Height}
                toastStyle={toastStyle}
                autoCloseTimeout={5000}
                ref={(c) => { this.toast = c }}
            />);
        }
    }

	render() {

		const { loadingContainer, errorStyle, toastStyle, toastTitle } = styles;
		const { measurementsData, date, loading, error, dailyChecklist } = this.props;
        let Height=Dimensions.get('window').height/2;

		return (
			<View style={{flex: 1}}>
				<ScrollView style={{flex: 1, marginBottom: 60}}>
					{this.renderChecklistItems()}
				</ScrollView>

				{loading && <View style={loadingContainer}>
						<ActivityIndicator size={'large'} color={colors.primaryGrey}/>
					</View>}
				
				{error.length > 1 &&
					<Text style={errorStyle}>{error}</Text>
				}

				{this.renderToast()}
			</View>
		);

	}

}

const styles = {
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(255,255,255,1)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	errorStyle: {
		textAlign: 'center',
		fontSize: 16,
		color: 'red',
		marginBottom: 60
	},
    toastStyle: {
        borderRadius:10,
        height:170,
        width:170
    },
    toastTitle: {
        color: '#fff',
        fontSize:18,
        textAlign: 'center',
        justifyContent:'center'
    },
    toastSubTitle: {
        color: '#fff',
        fontSize:12,
        textAlign: 'center',
        justifyContent:'center'
    }
};

const mapStateToProps = ({ main, trackers }) => {
	const { messageToast } = main;
	const { dailyChecklist, loading, error } = trackers;
	return {
		loading,
		error,
		dailyChecklist,
		messageToast
	};
};

export default connect(mapStateToProps, {getDailyChecklist, clearError})(TrackDay);
