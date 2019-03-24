import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '../../actions/const';

export const Spinner = () => (
	<ActivityIndicator
		style={{ margin: 20 }}
		color={colors.primaryGrey}
		size={'large'}
	/>
);
