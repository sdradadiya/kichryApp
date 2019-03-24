const topicList = [
	{
		title: 'Sugar',
		description: 'Sugar destroys healthy bacteria in our gut causing poor absorption of nutrients, poor bowel movement and poor skin.'
	},
	{
		title: 'Omega-3',
		description: 'Being deficient in Omega-3 can cause depression, heart disease and increased body inflammation.'
	},
	{
		title: 'Vitamin D',
		description: 'Improved Vitamin D levels helps against diabetes, cancer and improve bone health.'
	},
	{
		title: 'High Blood Sugar',
		description: 'High blood sugar levels causes the body to store more fat.'
	},
	{
		title: 'Fat',
		description: 'Low-fat diets lead to increased body fat.'
	},
	{
		title: 'Beets',
		description: 'Historically, Beets have been used as food, medicine, and as a natural dye.'
	},
	{
		title: 'Cucumber',
		description: 'The inside of a cucumber is 20 degrees cooler than the outside.'
	},
	{

		title: 'Beta Carotene',
		description: 'Sweet potato, carrots, spinach & kale are the highest amount of beta carotene than any other veggie, great for eyesight and for fighting infections.'
	}
];

const randValue = topicList[Math.floor(Math.random() * topicList.length)];

export const BannerData = [
	{
        id: 1,
        title: randValue.title,
        description: randValue.description,
        icon: 'graduation-cap'
	},
	{
    	id: 2,
		title: 'Refer Your Friends',
		description: '',
		icon: 'slideshare'
	},
	{
    	id: 3,
		title: 'Your Kitchry Award Points total is',
		description: '',
		icon: 'shield'
	},
	{
    	id: 4,
		title: 'You need more num trackers to unveil your mystry image',
		description: '',
		icon: 'trophy'
	}
];



