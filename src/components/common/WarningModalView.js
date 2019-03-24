/**
 * Created by mponomarets on 11/4/17.
 */
import React from 'react';
import {View, Modal, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {colors} from '../../actions/const';
import Icon from 'react-native-vector-icons/Ionicons';


export const WarningModalView = ({modalVisible, onClose, sendConfirm, children, showWarning, closeModal, buttonRender}) => {
	const {container, contentContainer, button, modalTitle, closeButtonContainer, buttonTitle, closeButton} = modalStyles;

	return (
		<Modal
			animationType="slide"
			transparent={true}
			supportedOrientations={['portrait', 'landscape']}
			visible={modalVisible}
			onRequestClose={() => console.log('close')}
			onShow={() => console.log('open')}
		>
			<View style={container}>
				<View style={contentContainer}>
					<View style={{flex: 1}}>
						<View style={closeButtonContainer}>
							<TouchableOpacity
								onPress={closeModal}
								style={closeButton}>
								<Icon size={25} name={'md-close'} color={'grey'}/>
							</TouchableOpacity>
						</View>
						<ScrollView>
							<View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
								<Image
									source={require('./img/n-w.png')}
									resizeMode={'contain'}
									style={{height: 150, paddingBottom: 20}}/>
								<Text style={{fontSize: 22, color: '#000', fontWeight: 'bold'}}>Warning</Text>
							</View>
							<View style={{flexWrap: 'wrap'}}>
								{children}
								<View>
									<TouchableOpacity
										onPress={onClose}
										style={[button, {backgroundColor: colors.primaryGreen}]}>
										<Text style={buttonTitle}>Find something else</Text>
									</TouchableOpacity>
									{ buttonRender === true ?
										<TouchableOpacity
											onPress={sendConfirm}
											style={[button, {backgroundColor: colors.primaryOrange}]}>
											<Text style={buttonTitle}>Select Anyway</Text>
										</TouchableOpacity>
										:
										<ActivityIndicator color={colors.primaryGrey} size={'large'}/>
									}
								</View>
							</View>
						</ScrollView>
					</View>
				</View>
			</View>
		</Modal>
	);
};


const modalStyles = {
	container: {
		backgroundColor: 'rgba(0,0,0,0.4)',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'

	},
	contentContainer: {
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingHorizontal: 20,
		marginHorizontal: 10,
		marginVertical: 40,
		paddingTop: 20,
		backgroundColor: '#fff',
		borderRadius: 5,
		paddingBottom: 40
	},
	modalTitle: {
		color: '#b2b2b2',
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 16,
		paddingVertical: 15
	},
	button: {
		height: 60,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
		borderRadius: 5
	},
	warningContainer: {
		justifyContent: 'space-around',
		paddingTop: 10
	},
	closeButtonContainer: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	closeButton: {
		width: 40,
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold'		 
	}
};
