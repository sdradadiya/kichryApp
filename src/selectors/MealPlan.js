const totalConsumed = nutrient => (acc, meal) => {
	const { servings, totalServings, isConfirmed, photo } = meal;
	const amount = meal[nutrient];
	const countable = isConfirmed;
	// const countable = isConfirmed || (photo && isConfirmed==null);
	return countable ? amount + acc : acc;
};

export const selectMealPlanNutritionSummary = state => {
	const {
		mealPlan: {
			mealPlans: { mealplan = [] },
			nutrition_targets: {
				day_calorie_cap = 0,
				day_calorie_floor = 0,
				day_carbohydrate_cap = 0,
				day_carbohydrate_floor = 0,
				day_fat_cap = 0,
				day_fat_floor = 0,
				day_fiber_cap = 0,
				day_fiber_floor = 0,
				day_potassium_cap = 0,
				day_potassium_floor = 0,
				day_phosphorus_cap = 0,
				day_phosphorus_floor = 0,
				day_protein_cap = 0,
				day_protein_floor = 0,
				day_sodium_cap = 0,
				day_sodium_floor = 0,
				day_sugar_cap = 0,
				day_sugar_floor = 0
			}
		}
	} = state;

	const nutrition_summary = {
		calories: {
			cap: day_calorie_cap,
			floor: day_calorie_floor,
			consumed: mealplan.reduce(totalConsumed('kcal'), 0)
		},
		carbs: {
			cap: day_carbohydrate_cap,
			floor: day_carbohydrate_floor,
			consumed: mealplan.reduce(totalConsumed('carb'), 0)
		},
		fat: {
			cap: day_fat_cap,
			floor: day_fat_floor,
			consumed: mealplan.reduce(totalConsumed('fat'), 0)
		},
		fiber: {
			cap: day_fiber_cap,
			floor: day_fiber_floor,
			consumed: mealplan.reduce(totalConsumed('fiber'), 0)
		},
		potassium: {
			cap: day_potassium_cap,
			floor: day_potassium_floor,
			consumed: mealplan.reduce(totalConsumed('potassium'), 0)
		},
		phosphorus: {
			cap: day_phosphorus_cap,
			floor: day_phosphorus_floor,
			consumed: mealplan.reduce(totalConsumed('phosphorus'), 0)
		},
		protein: {
			cap: day_protein_cap,
			floor: day_protein_floor,
			consumed: mealplan.reduce(totalConsumed('protein'), 0)
		},
		sodium: {
			cap: day_sodium_cap,
			floor: day_sodium_floor,
			consumed: mealplan.reduce(totalConsumed('sodium'), 0)
		},
		sugar: {
			cap: day_sugar_cap,
			floor: day_sugar_floor,
			consumed: mealplan.reduce(totalConsumed('sugar'), 0)
		}
	};

	return nutrition_summary;
};

