import React, { Component } from 'react';
import { View, Platform, ScrollView, Text, Modal } from 'react-native';
import { colors } from '../../actions/const';
import { Header } from '../common';
import { SwitchRow, InputRow, ArrowRow, PhotoRow } from '../common/Rows';
import SafeAreaView from 'react-native-safe-area-view';

const ValidationError = ({ visible, message }) =>
	!!visible && <Text style={styles.errorStyle}>{message}</Text>;

export default class NutritionModal extends Component {
	constructor(props) {
		super(props);
		this.state = { ...this.props.data };
	}

	save = () => {
		if (!this.state.kcal)
			this.setState({ showError: true, errorMessage: 'Enter calories' });
		else this.props.onSave({ ...this.state });
	};

	renderRow = ({ field, ...inputRowProps }) => {
		const defaults = {
			kcal: { title: 'Calories (kcal)', required: true },
			calcium: { title: 'Calcium (mg)' },
			carbohydrate: { title: 'Total Carbohydrate (g)' },
			cholesterol: { title: 'Cholesterol (mg)' },
			fat: { title: 'Total Fat (g)' },
			fat_sat: { title: 'Saturated Fat (g)', indentLabel: true },
			fiber: { title: 'Dietary Fiber (g)', indentLabel: true },
			iron: { title: 'Iron (mg)' },
			phosphorus: { title: 'Phosphorus (mg)' },
			potassium: { title: 'Potassium (mg)' },
			protein: { title: 'Protein (g)' },
			sodium: { title: 'Sodium (mg)' },
			sugar: { title: 'Total Sugars (g)', indentLabel: true },
			vitamin_d: { title: 'Vitamin D (mcg)' }
		};
		const field_defaults = defaults[field] || {};

		return (
			<InputRow
				{...defaults[field]}
				value={this.state[field]}
				editable={this.props.editable}
				placeholder={field_defaults.required ? 'required' : 'optional'}
				indentLabel={field_defaults.indentLabel}
				onChangeText={text =>
					this.setState({ [field]: text, showError: false })}
				{...inputRowProps}
			/>
		);
	};
	
	renderHeader() {
		const { visible, onClose, editable } = this.props;
		const headerProps = editable
			? {
					rightIcon: 'check',
					rightButtonPress: this.save
				}
			: {};

		if (editable) {
			return (
			<Header
				title={'Nutrition'}
				leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
				leftButtonPress={onClose}
				{...headerProps}
			/>			
		);
		
		}
	}

	render() {
		const { visible, onClose, editable } = this.props;
		const { showError, errorMessage } = this.state;

		return (
			<SafeAreaView forceInset={{ bottom: 'never' }} style={{flex: 1, backgroundColor: colors.primaryBlack}}>
					<ScrollView
						scrollEnabled={true}
						contentContainerStyle={styles.modalContainer}
					>
							{this.renderheader}
							
						<View style={styles.container}>
							{this.renderRow({ field: 'kcal' })}
							{this.renderRow({ field: 'fat' })}
							{this.renderRow({ field: 'fat_sat' })}
							{this.renderRow({ field: 'cholesterol' })}
							{this.renderRow({ field: 'sodium' })}
							{this.renderRow({ field: 'carbohydrate' })}
							{this.renderRow({ field: 'fiber' })}
							{this.renderRow({ field: 'sugar' })}
							{this.renderRow({ field: 'protein' })}
							{this.renderRow({ field: 'vitamin_d' })}
							{this.renderRow({ field: 'calcium' })}
							{this.renderRow({ field: 'iron' })}
							{this.renderRow({ field: 'potassium' })}
							{this.renderRow({ field: 'phosphorus' })}
							<ValidationError visible={showError} message={errorMessage} />
						</View>
					</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = {
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgb(0,0,0)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginTop: 40,
		width: '100%'
	},
	errorStyle: {
		paddingVertical: 7,
		textAlign: 'center',
		color: 'red'
	}
};
