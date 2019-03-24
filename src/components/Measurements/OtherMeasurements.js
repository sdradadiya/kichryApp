import React, { PureComponent } from 'react';
import { View, Platform, Text, TouchableOpacity, ActivityIndicator, Image }from 'react-native';
import { Header }from '../common';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { colors } from '../../actions/const';
import { saveNewMeasurements } from '../../actions';
import moment from 'moment';

class OtherMeasurements extends PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			questions: this.props.params['Questions']
		};
	}

	handlePressAnswer (index, question, answer, amount) {
		question['selectedAnswer'] = answer;
		question['amount'] = amount;
		let newAnswer = this.state.questions;
		newAnswer[index] = question;
		this.setState({
			questions: [...newAnswer]
		})
	}

	handlePressSaveButton = () => {
		const unit = this.props.params['Category'];
		const date = moment(new Date(this.props.selectedDay.day)).format('L')

		let data = {
			title: 'Other Measurements',
			amount: this.state.questions,
			unit,
			date,
		};

		this.props.saveNewMeasurements(data);
	};


	renderEmoji (name) {
		const { emojiStyle } = styles;
		switch (name) {
			case('disturbed'):
				return (<Image
					source={require('../../../resources/img/disturbed.gif')} resizeMode={'contain'}
					style={emojiStyle}
				/>);
			case('limited'):
				return (<Image
                    source={require('../../../resources/img/sound.gif')} resizeMode={'contain'}
                    style={emojiStyle}
				/>);
			case('sound'):
				return (<Image
					source={require('../../../resources/img/snoring.gif')} resizeMode={'contain'}
					style={emojiStyle}
				/>);
			default:
				return null;
		}
	}

	render () {
		const icon = Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back';
		const { params, error, loading } = this.props;
		const { questions } = this.state;
		const { container, errorStyle, loadingContainer, questionStyle, buttonsContainer, activeButton, buttonStyle, buttonTitle, activeTitle } = styles;
		return (
			<View style={{ flex: 1 }}>
				<Header
					title={params['Category']}
					leftIcon={icon}
					leftButtonPress={() => Actions.pop()}
					rightButtonPress={this.handlePressSaveButton}
					rightIcon={'check'}
				/>
				<View style={container}>
					{questions.map((question, index) => {
						const variants = question.Answer.split(', ');
						return (
							<View key={question.Question}>
								<Text style={questionStyle}>{question.Question}</Text>
								<View style={buttonsContainer}>
									{variants.map((button, buttonId) => {
										let buttonsStyle = buttonStyle;
										let buttonsTitle = buttonTitle;
										if (question.hasOwnProperty('selectedAnswer') && question.selectedAnswer === button) {
											buttonsStyle = [buttonsStyle, activeButton];
											buttonsTitle = [activeTitle];
										}
										return <TouchableOpacity
											activeOpacity={1}
											onPress={() => this.handlePressAnswer(index, question, button, buttonId)}
											key={button}>
											<View>
												{this.renderEmoji(button)}
												<View style={buttonsStyle}>
													<Text style={buttonsTitle}>{button}</Text>
												</View>
											</View>
										</TouchableOpacity>
									})}
								</View>
							</View>
						);
					})}
				</View>
				{error && <Text style={errorStyle}>{error}</Text>}
				{loading && <View style={loadingContainer}>
					<ActivityIndicator size={'large'} color={'#fff'}/>
				</View>}
			</View>
		);
	}
}

const
	styles = {
		container: {
			padding: 20
		},
		questionStyle: {
			fontSize: 18,
			lineHeight: 20,
			marginBottom: 20
		},
		buttonsContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 20
		},
		activeButton: {
			backgroundColor: colors.primaryBlue,
		},
		activeTitle: {
			color: '#fff'
		},
		buttonStyle: {
			paddingVertical: 10,
			paddingHorizontal: 10,
			borderColor: colors.primaryBlue,
			borderWidth: 1,
			borderRadius: 20,
			alignItems: 'center',
			justifyContent: 'center'
		},
		buttonTitle: {
			color: colors.primaryBlue
		},
		emojiStyle: {
			width: 80,
			height: 80,
			paddingBottom: 5
		},
		errorStyle: {
			textAlign: 'center',
			fontSize: 16,
			color: 'red',
			paddingHorizontal: 20,
			paddingVertical: 20
		},
		loadingContainer: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,.3)',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center'
		}
	};

const
	mapStateToProps = ({ measurements, home }) => {
		const { selectedDay } = home;
		const {
			error,
			loading
		} = measurements;
		return {
			error,
			loading,
			selectedDay
		};
	};
export
default

connect(mapStateToProps, { saveNewMeasurements })

(
	OtherMeasurements
)
;



