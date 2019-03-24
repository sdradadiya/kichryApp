import {
    START_ADD_NEW_CASTOM_RECIPE,
    ADD_NEW_CASTOM_RECIPE_FAIL
} from './types';
import { Alert, AsyncStorage } from 'react-native';
import {
    HOST,
    getAuthParams
} from './const';
import {
    pinRecipe
} from './RecipeBookActions';
import { sendRequest, createOptions, createJson } from './http';
import { isEmpty } from 'lodash';
import {fromJS} from "immutable";


export const pinRecipeFromGlobal = ({
                                       planMealType,
                                       title,
                                       ingredients,
                                       nutrition,
                                       description,
                                       brand,
                                       location,
                                       base64
                                   }) => dispatch => {
    dispatch({ type: START_ADD_NEW_CASTOM_RECIPE });
    const hasIngredients = isEmpty(ingredients) ? 0 : 1;
    return getAuthParams().then(({ token, userName, version }) => {
        const url = HOST + 'api/v2/mobile/recipe/new/custom';
        const body = {
            token,
            userName,
            version,
            mealType: planMealType ? planMealType.charAt(0).toLowerCase() : undefined,
            title,
            hasIngredients,
            ingredients: hasIngredients ? ingredients : undefined,
            ...nutrition,
            description,
            brand,
            location,
            image: base64,
            imageType: base64 ? 'image/jpeg' : undefined
        };

        const recipeOptions = createJson('PATCH', body);
        return sendRequest(url, recipeOptions).then(result => {


            if(result.status === 'success') {
                 dispatch(pinRecipe(result.recipeId, false));
               // Actions.main({ type: 'replace' });

            } else {
                Alert.alert('Failed to add meal', null);
                dispatch({ type: ADD_NEW_CASTOM_RECIPE_FAIL });

            }

        });
    });
};

export const scaledIngredientsServingSizeForGlobal = (ingredients, originalServing, prefereServing) => {
  
    let updateIngredients = fromJS(ingredients);

    let scaledIngredients = updateIngredients.map(item =>
        item.set('quantity',
            item.get('quantity') / originalServing * prefereServing
        )
    );
   
    return scaledIngredients.toJS();
};

