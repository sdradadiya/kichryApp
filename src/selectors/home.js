import moment from 'moment';

export const selectTodaysMealsForJournal = ({
	home: { reviewMealList = [] }
}) => {
	const reviewMealListToday = reviewMealList.filter(
		({ date, photo }) =>
			moment(date, 'MMM Do, YYYY').isSame(moment(), 'day') && !photo
	);
	return reviewMealListToday;
};
