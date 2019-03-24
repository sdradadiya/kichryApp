import React, {Component} from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';
import {Header, DropDownList, InfoBox} from './common';
import {Actions} from 'react-native-router-flux';
import ListTitleGrocery from './common/ListTitleGrocery';
import {formatNotesDate, tracker} from '../actions/const';
import { colors } from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';

class RDNotes extends Component {

	constructor(props) {
		super(props);

		this.state = {

			currentMealNoteDate: '',
			currentMealNote: '',
			allNotes: []

		};

	}

	componentWillMount () {
		if(this.props.currentNote) {
			return this.setState({
				currentMealNoteDate: this.props.mealNotes.date,
				currentMealNote: this.props.mealNotes.note
			});
		}
		
		this.setState({
			allNotes: this.props.allMealNotes
		});

	}

	componentDidMount() {
		tracker.trackScreenView('RDNotes');
	}

	renderHeader() {

		const backIcon = Platform.select({ ios: 'ios-arrow-back', android: 'md-arrow-back' });

		return(
			<Header
				title={'Notes'}
				leftIcon={backIcon}
				leftButtonPress={() => Actions.pop()}
			/>
		);

	}

	renderNotesList() {
		
		const {allNotes} = this.state;

		if(allNotes && allNotes.length > 0) {

			let allNotesToArr = [];

			for (let index in allNotes) {
				
				allNotesToArr.push(allNotes[index]);
			}
			
			allNotesToArr.sort((a, b) => {
				
				let aDate = new Date(a.date).getTime();
				let bDate = new Date(b.date).getTime();

				return aDate - bDate;

			});
			
			let reverseAllNotes = allNotesToArr.reverse();

			return reverseAllNotes.map((mealNotes, index) => {
				
				let date = formatNotesDate(mealNotes.date);
				
				return(
					<DropDownList 
						key={index}
						title={date}
						content={mealNotes.note}
					/>
				);
	
			});
		}
		
		return(
			<InfoBox message={'You don\'t have any notes yet.'}/>
		); 

	}


	render () {

		const {noteContainet, noteText} = styles;

		const {currentMealNoteDate} = this.state;

		let date = formatNotesDate(currentMealNoteDate);

		if(this.props.currentNote) {

			return(

				<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
					
					{this.renderHeader()}

					<View style={{flex: 1, backgroundColor: '#fff'}}>
						<ListTitleGrocery date={date} note={true} />
						<View style={noteContainet}>
							<Text style={noteText}>{this.state.currentMealNote}</Text>
						</View>
					</View>
	
				</SafeAreaView>
				
			);

		} 

		return(
			
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				
				{this.renderHeader()}

				<ScrollView style={{backgroundColor: '#fff'}}>
					{this.renderNotesList()}
				</ScrollView>
				
			</SafeAreaView>
			
		);	

	}

}

const styles = {

	noteContainet: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 10,
		backgroundColor: '#fff'
	},

	noteText: {
		fontSize: 16,
		color: '#000'
	}

};

export default RDNotes;