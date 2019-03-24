import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import { colors, textStyles } from '../../actions/const';


export default class ProgressBar extends Component {

	constructor(props) {
		super(props);
	}


	render() {
		const { title, progress, value, baseValue } = this.props;

		return(
			<View style={{flex: 1, margin: 10, flexDirection: 'column', alignItems: 'center'}}>
        <Text style={textStyles.description12White}>{baseValue}</Text>
				<View style={{ width: '40%', height: 100, backgroundColor: colors.lightGrey, justifyContent: 'flex-end'}}>
                    {
                        !(value === '0 g' || value === '0 Cal' || value === 0 ) &&
                        <Text style={[textStyles.description12, {
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                        }]}
                              adjustsFontSizeToFit={true}
                              numberOfLines={1}
                        >{value}</Text>
                    }
					<View style={{ height: (progress > 100) ? '100%' : `${progress}%`,
						backgroundColor: (progress > 100) ? '#ff1800' : '#61cd89',
						alignItems: 'center',
						justifyContent: 'flex-start'}}>

					</View>
				</View>
				<Text style={textStyles.description12White}>{title}</Text>
			</View>
		);
	}
}
