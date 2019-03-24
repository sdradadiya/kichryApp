import {HOST, getAuthParams} from './const';
import { 
	SEND_REFER_FORM,
	SEND_REFER_FORM_SUCCESS,
	SEND_REFER_FORM_FAIL
} from './types';
import {Actions} from 'react-native-router-flux';
import { sendRequest, createJson } from './http';

export const sendReferForm = (name, referEmail) => {

	return (dispatch) => {

		getAuthParams().then(({token, userName, version}) => {

			dispatch({type: SEND_REFER_FORM, name, referEmail});

			let url = HOST + 'api/v2/mobile/refer';

			let body = {
				token,
				userName,
				version,
				name,
				email: referEmail
			};
			const referOptions = createJson('POST', body);

			sendRequest(url, referOptions).then(result => {
				
				if(result.status === 'success') {

					dispatch({type: SEND_REFER_FORM_SUCCESS});

					Actions.pop();

				} else {

					if(result.status === 'serverError') {
						dispatch({type: SEND_REFER_FORM_FAIL, error: 'Sorry, your request could not be processed'});
					} else {
						dispatch({type: SEND_REFER_FORM_FAIL, name, referEmail, error: result.message});
					}	

				}

			});

		});

	};


};
