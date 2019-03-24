import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Platform, Keyboard, ActivityIndicator, KeyboardAvoidingView, Image, Dimensions, FlatList, processColor } from 'react-native';
import { colors, parseRecordDate, parseRecordTime, textStyles, marginStyles } from '../../actions/const';
import BoolThumbs from './BoolThumbs';
import TrackFloatInput from './TrackFloatInput';
import SafeAreaView from 'react-native-safe-area-view';
import TrackComment from './TrackComment';
import TrendChart from './TrendChart';
import TrendList from './TrendList';
import { validateItem } from './TrackItemValidation';
import { Header } from '../common';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { trackDailyChecklist, clearError } from '../../actions';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import { dateFormating, getLastTrack, getLastComment, getFrequency } from './TrackItemHelper';
import Tabs from 'react-native-tabs';
import { Button } from '../common';

const Row = ({ time, value, unit }) => (
	<View style={styles.rowContainer}>
		<View style={styles.innerRowContainerLeft}>
			<Text style={styles.rowText}>{`${time}`}</Text>
		</View>
		<View style={styles.innerRowContainerRight}>
			<Text style={styles.rowText}>{`${value} ${unit}`}</Text>
		</View>
	</View>
)

class TrackItem extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedTab: 'TRACK',
			sub_topic: this.props.item.item.sub_topic,
			title: this.props.item.item.title,
			value: '',
			unit: this.props.item.item.unit,
			error: this.props.error,
			validationError: '',
			loading: true,
			previousDayCompare: '',
			boolDecision: null,
			data_type: this.props.item.item.data_type,
			isCompleted: this.props.item.isCompleted,
			comment: '',
			frequency: ''
		};

	}

	componentWillMount() {

		const { item, todayDate } = this.props;

		if(item.isCompleted) {
			return this.setState({
				value: getLastTrack(item, todayDate),
				comment: getLastComment(item, todayDate),
				frequency: getFrequency(item)
			});
		} else {
			this.setState({
				value: '',
				comment: '',
				frequency: getFrequency(item)
			});
		}
		
	}

	// componentDidMount() {

	// 	const { item } = this.props;
	// 	// getItemHistory(item, weeklyChecklist);

	// }
	
	componentWillUnmount () {
		this.props.clearError();
		this.setState({
			value: '',
			comment: '',
			frequency: ''
		});
	}

	renderTabs() {
		const { selectedTab } = this.state;
		const {tabsContainer, tabStyle, ativeTabStyle} = styles;

		return(
			<View style={styles.tabsContainer}>
       <Tabs selected={this.state.selectedTab} style={{backgroundColor:colors.primaryBlue}}
             selectedStyle={textStyles.l1Text} onSelect={(e)=>this.setState({ selectedTab: e.props.name })}>
           <Text name="TRACK" style={textStyles.description16White}>Track</Text>
           <Text name="TREND" style={textStyles.description16White}>Trend</Text>
       </Tabs>
     </View>
		);	
	}

	likedIt = () => {
		if(!this.state.isCompleted){
			this.setState({ 
				value: 'true',
				boolDecision: 'true',
				validationError: ''
			});
		}
	}

	didntLikeIt = () => {
		if(!this.state.isCompleted){
			this.setState({ 
				value: 'false',
				boolDecision: 'false',
				validationError: ''
			});
		}
	}

	handleChangeText = (text) => {

		const { previousDayCompare } = this.state;

		this.setState({
			value: text,
			validationError: ''
		});

	};

	handlePressSaveButton = () => {
		Keyboard.dismiss();

		const { todayDate, trackDailyChecklist, item} = this.props;
		const { title, value, unit, boolDecision, isCompleted, comment, data_type, frequency } = this.state;

		let validation = validateItem(item, isCompleted, data_type, value, todayDate);

		if( validation ) {
			this.setState({ validationError: validation })
		}

		let val = unit === 'bool' ? boolDecision : value;

		let data = {
			checkListItemId: item.item.id,
			value: val,
			comment: comment
		};

		let toastHelper = {
			frequency,
			eligibleRecords: item.eligibleRecords
		};

		trackDailyChecklist(data, toastHelper);

	};

	onStarRatingPress(rating) {
		this.setState({
		  value: rating.toString(),
		  validationError: ''
		});
	}

	handlesRequiredField = (text) => {
		this.setState({
			value: text,
			validationError: ''
		});
	};

	handleOptionalField = (text) => {
		this.setState({
			comment: text,
			validationError: ''
		});
	};

	renderOptionalField() {

		const { comment, height, heightIOS, isCompleted } = this.state;

		return(
			<TrackComment
				comment={comment}
				onChangeText={this.handleOptionalField}
				height={height}
				heightIOS={heightIOS}
				isCompleted={isCompleted}
			/>
		);

	}

	handlesRequiredField = (text) => {
		this.setState({
			value: text,
			validationError: ''
		});
	};

    renderFeedbackContainer = () =>{

		const { separator, feedbackContainer, scaleLegend, legendLeft, legendRight, legendText } = styles;
		const { value, unit, isCompleted, data_type, height, heightIOS } = this.state;

		if(data_type === 'float') {

			if(unit === 'scale') {
				return(
					<View>
						<View style={feedbackContainer}>
							<View style={{flex: 1, width: '100%'}}>
								<StarRating
									disabled={isCompleted ? true : false}
									maxStars={5}
									rating={+value}
									selectedStar={(rating) => this.onStarRatingPress(rating)}
									emptyStarColor={colors.primaryGrey}
									fullStarColor={colors.primaryGreen}
								/>
								<View style={scaleLegend}>
									<View style={legendLeft}>
										<Text style={legendText}>worse</Text>
									</View>
									<View style={legendRight}>
										<Text style={legendText}>better</Text>
									</View>
								</View>
							</View>
							<View style={separator}></View>
						</View>
						{this.renderOptionalField()}
					</View>
				);
			}

			return(
				<View>
					<TrackFloatInput
						value={value}
						onChangeText={this.handleChangeText}
						isCompleted={isCompleted}
						unit={unit}
					/>
					{this.renderOptionalField()}
				</View>
			);
		}

		if(data_type === 'bool') {
			return(
				<View>
					<View style={feedbackContainer}>
						<View style={{flex: 1, width: '100%'}}>
							<BoolThumbs
								value={value}
								onPressLike={this.likedIt}
								onPressDislike={this.didntLikeIt}
							/>
						</View>
						<View style={separator}></View>
					</View>
					{this.renderOptionalField()}
				</View>
			);
		}

		if(data_type === 'str') {
			return(
				<View style={[feedbackContainer, {paddingHorizontal: 0}]}>
					<View style={{flex: 1, width: '100%'}}>
						<TrackComment
							comment={value}
							onChangeText={this.handlesRequiredField}
							height={height}
							heightIOS={heightIOS}
							isCompleted={isCompleted}
							isRequired={true}
						/>
					</View>
					<View style={separator}></View>
				</View>
			);
		}

	};

	renderIntradailyHistoryList() {

		const { unit, data_type } = this.state;
		const { item: { eligibleRecords } } = this.props;

		return eligibleRecords.map((item, index) => {

			return(
				<Row
					key={index}
					time={moment(item.created_date_time_utc).format('LT')}
					value={JSON.parse(item.record).value}
					unit={data_type === 'float' && unit !== 'scale' ? unit : ''}
				/>
			)
		});
	}

	renderIntradailyHistory() {

		const { frequency } = this.state;
		const { item: { eligibleRecords } } = this.props;

		if(frequency === 'intradaily') {
			if(eligibleRecords.length > 0) {
				return(
					<View style={{flex: 1,paddingHorizontal: 20}}>
						<Text>TRACKED TODAY</Text>
						{this.renderIntradailyHistoryList()}
					</View>
				)
			}
		}
	}

	renderContent() {

		const { dataContainer, dataText, compareDataText, errorStyle, trendContainer, imgStyle } = styles;
		const { title, validationError, selectedTab, data_type, frequency } = this.state;
		const { todayDate, error, item, weeklyChecklist} = this.props;

		if(selectedTab === 'TRACK') {
			return(
				<View style={marginStyles.titleMargin}>
					{this.renderFeedbackContainer()}

					<Text style={errorStyle}>{error}</Text>
					<Text style={errorStyle}>{validationError}</Text>

					{this.renderIntradailyHistory()}

				</View>
			)
		} else {

			if(data_type === 'str' || data_type === 'bool') {
				return <TrendList itemId={item.item.id} />
			} else {
				return(
					<TrendChart
						itemId={item.item.id}
						frequency={item.item.frequency}
					/>
				)
			}
		}

	}
	
	renderSubmitButton = () => (
		<Button style={{width:'100%', backgroundColor:colors.primaryGreen, color:'white'}} title="DONE" onPress={this.handlePressSaveButton} />
	);

	render() {
		
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const { sub_topic, title } = this.state;
		const { loading } = this.props;
		const { dataContainer, dataText, tellMeWhyContainer, tellMeWhy, loadingContainer, titleColor } = styles;
		return(
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlue}}>
				<Header
					title='Wellness'
					leftIcon={icon}
					leftButtonPress={() => Actions.pop()}
				/>
				<View style={[dataContainer, {marginTop: 50, marginBottom: 5, paddingHorizontal: 15 }]}>
					<Text style={[textStyles.l1Text, titleColor]}>{title}</Text>
				</View>
				{this.renderTabs()}
				<KeyboardAvoidingView
					style={{ flex: 1, backgroundColor: '#fff' }}
					behavior={Platform.OS == 'ios' ? 'padding' : undefined}
				>

					<ScrollView>
						{this.renderContent()}
					</ScrollView>
				</KeyboardAvoidingView>
				{this.renderSubmitButton()}
			</SafeAreaView>
		);

	}

}

const styles = {
	tabsContainer: {
		flex: 0.2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tabStyle: {
		width: 60,
		alignItems: 'center',
		justifyContent: 'center'
	},
	ativeTabStyle: {
		width: 60,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 2,
		borderColor: colors.primaryOrange
	},
	dataContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 60
	},
	compareDataText: {
		fontSize: 15
	},
	titleColor: {
		color: '#fff',
	},
	motivationContainer: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 20
	},
	motivationTextContainer: {
		flex: 0.7,
		paddingVertical: 5,
		paddingHorizontal: 20
	},
	motivationText: {
		fontSize: 20
	},
	motivationIconContainer: {
		flex: 0.3,
		paddingVertical: 5,
		paddingHorizontal: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	tellMeWhyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	tellMeWhy: {
		fontSize: 16,
		color: 'blue'
	},
	errorStyle: {
		textAlign: 'center',
		fontSize: 16,
		color: 'red'
	},
	loadingContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,.3)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	feedbackContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 30
	},
	separator: {
		marginTop: 20,
		width: 140,
		borderBottomWidth: 3,
		borderColor: '#000'
	},
	trendContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20
	},
	imgStyle: {
		flex: 1,
		width: 200,
		height: 200
	},
	scaleLegend: {
		flex: 1,
		marginTop: 5,
		flexDirection: 'row'
	},
	legendLeft: {
		flex: .5,
		alignItems: 'flex-start',
	},
	legendRight: {
		flex: .5,
		alignItems: 'flex-end',
	},
	legendText: {
		color: colors.darkGrey
	},
	rowContainer: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 5
	},
	innerRowContainerLeft: {
		flex: .5,
		paddingLeft: 10,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	innerRowContainerRight: {
		flex: .5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	rowText: {
		fontSize: 16,
		color: colors.darkGrey
	}

};

const mapStateToProps = ({ trackers }) => {
	const { loading, error } = trackers;
	return {
		loading,
		error
	}
};

export default connect(mapStateToProps, { trackDailyChecklist, clearError })(TrackItem);
