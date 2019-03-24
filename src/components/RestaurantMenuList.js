import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {
	View,
	Platform,
	TouchableOpacity,
	Text,
	SectionList,
  ActivityIndicator,
	Alert,
  Image,
  Dimensions
} from 'react-native';
import {colors, sumNutritionToStringGlobalRecipe, showImagePicker} from '../actions/const';
import SafeAreaView from 'react-native-safe-area-view';
import {
	Header
} from './common';
import {connect} from 'react-redux';
import {
    addMealNewRecipe,
	createCustomRecipe,
	getRestaurantMenu,
	pinRecipeFromGlobal,
	recipeDelete,
	replaceMealNewRecipe,
    scaledIngredientsServingSizeForGlobal,
} from '../actions';
import Toast from 'react-native-another-toast';
import Emojicon from 'react-native-emojicon';
let toastMessage,toastSubMessage,toastImage;

class RestaurantMenuList extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			restaurantMenuListResult: [],
			imgData:'',
      title:'',
			error:'',
      renderToast:false,
      loading: false,
		};
	}

    componentWillReceiveProps (newProps) {
        if (newProps.error !== this.props.error) {
            this.setState({ error: newProps.error });
        }
    }

	componentWillMount()
	{
		this.setMenu();
	}

	setMenu()
	{
		this.props.restaurantMenuResult.map((data)=>{
			if(data.menuId === this.props.menuId) {
				this.setState({
					restaurantMenuListResult: data
				});
			}
			return true;
		});
	}

	renderLoading(){
	  if(this.state.loading){
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={colors.primaryGrey} size={'large'} />
        </View>
      );
    }
  }


	renderSectionHeader(section) {
		return(
			<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, backgroundColor: colors.lightGrey}}>
				<Text style={{fontSize: 22, marginHorizontal: 10, fontWeight:'600'}} numberOfLines={1}>{section.title}</Text>
			</View>
		);
	}

	onClickFood(item)
	{
		this.setState({title:item});
		if(this.props.activeTabId === 1)
		{
            toastMessage = " No Preview Available ";
            toastImage = "clipboard";
		    this.setState({renderToast:true},()=>{
                this.toast.showToast();
                setTimeout(() => {
                    this.setState({
                        renderToast: false,
                    });
                },3000);
            });
		}else{
            Alert.alert(
                '',
                'Would you like to take a picture of the meal?',
                [
                    {
                        text: 'Not now',
                        onPress: ()=>{
                            this.onPressSave();
                        },
                        style: 'cancel'
                    },
                    {
                        text: 'Yes', onPress: () => {
                            this.onShowImagePicker();
                        }
                    }
                ]
            );
		}
	}

    renderError () {
        const {error} = this.state;
        if (error) {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <Text style={{
                        color: 'red',
                        textAlign: 'center',
                        paddingVertical: 5,
                        paddingHorizontal: 20
                    }}>{error}</Text>
                </View>
            );
        } else {
            return null;
        }
    }

	onShowImagePicker = () =>
        showImagePicker(({ base64, uri }) =>{
                this.setState({ imgUri: uri, imgData: base64 });
                this.onPressSave();
        });



    onPressSave = () => {
        const {
            replaceMealNewRecipe,
            addMealNewRecipe,
            createCustomRecipe,
            recipeDelete,
        } = this.props;
        const {
            planId,
            planMealType,
            date,
            add,
            replace,
            createRecipeForBook,
            editRecipe,
            loading
        } = this.props;
        const {
            title,
			imgData
        } = this.state;

        if (loading) return;
        const recipe = {
            date,
            planMealType,
            title,
			      base64:imgData,
            hasIngredients:0
        };
        toastMessage = "";
        toastImage = "thumbsup";
      	if (add) {
            this.setState({loading:true});
            toastSubMessage = "Meal Added Successfully";
            addMealNewRecipe(recipe).then(()=> {
              this.setState({
                renderToast: true,
                loading:false
              }, () => {
                this.toast.showToast();
                setTimeout(() => {
                    this.setState({
                        renderToast: false,
                    });
                    Actions.main({type: 'replace'});
                },3000)
              });
            });
        } else if (replace) {
            toastSubMessage = "Meal Replaced Successfully";
            replaceMealNewRecipe({ ...recipe, planId }).then(()=>{
              this.setState({
                renderToast:true
              },()=>{
                this.toast.showToast();
                  setTimeout(() => {
                      this.setState({
                          renderToast: false,
                      });
                      Actions.main({type: 'replace'});
                  },3000)
              });
            });
        }

    };


    renderSection(item) {
		return(
			<TouchableOpacity onPress={()=>{this.onClickFood(item);}}>
				<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgb(57, 192, 111)', marginHorizontal: 5, height: 50, backgroundColor: '#fff', marginTop: 10}}>
					<View style={{flexDirection: 'column', justifyContent: 'center', height: 50, width: '100%'}}>
						<Text style={{fontSize: 20, marginHorizontal: 5}} numberOfLines={1}>
							{item}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	renderRestaurantMenu() {
		const {restaurantMenuListResult} = this.state;
		if(restaurantMenuListResult.length === 0) {
			return null;
		}

		let menuList_arr = [];
		restaurantMenuListResult.entries.items.map((data)=>{
			let menuList_obj = {};
			if(data.entries.items.length!==0){
                menuList_obj.title = data.name;

                let menuList = [];
                data.entries.items.map((d)=>{
                    menuList.push(d.name);
                });

                menuList_obj.data = menuList;
                menuList_arr.push(menuList_obj);
            }
		});

		return(
			<SectionList
				sections={menuList_arr}
				renderItem={({item}) => this.renderSection(item)}
				renderSectionHeader={({section}) => this.renderSectionHeader(section)}
			/>
		);
	}

  renderToast()
  {
    let Height=(Dimensions.get('window').height/2) - 60;
    const { toastStyle, toastTitle } = styles;
    if(this.state.renderToast){
      return(<Toast
        content={
          <View style={{alignItems: 'center',justifyContent:'center',flex:1,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:10, padding:5}}>
            <Emojicon name={toastImage} size={60} />
            <Text style={toastTitle}>{toastMessage}</Text>
          </View>
        }
        animationType={'fade'}
        animationDuration={200}
        topBottomDistance={Height}
        toastStyle={toastStyle}
        autoCloseTimeout={3000}
        ref={(c) => { this.toast = c }}
      />);
    }
  }

  renderContent()
  {
    if(this.state.loading){
      return this.renderLoading()
    }else{
      return(<View style={{backgroundColor: '#fff', flex: 1}}>
        {this.renderRestaurantMenu()}
        {this.renderError()}
        {this.renderToast()}
      </View>)
    }
  }

	render() {
        let Height=Dimensions.get('window').height/2;
		return(
			<SafeAreaView style={{flex: 1, backgroundColor: colors.primaryBlack}}>
				<Header
					title={this.props.name}
					leftIcon={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'}
					leftButtonPress={() => Actions.pop()}
				/>
        {this.renderContent()}
			</SafeAreaView>
		);
	}
}


const styles = {
	menuTitle: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 5
	},
	menuTitleText: {
		fontSize: 20,
		textAlign: 'center'
	},
	menuTypeText: {
		fontSize: 25,
		color: '#000'
	},
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  toastStyle: {
      borderRadius:10,
      height:170,
      width:170
  },
  toastTitle: {
      color: '#fff',
      fontSize:18,
      textAlign: 'center',
      justifyContent:'center'
  },
  toastSubTitle: {
      color: '#fff',
      fontSize:15,
      textAlign: 'center',
      justifyContent:'center'
  }
};


const mapStateToProps = (state) => {
    const {
        restaurant: { restaurantMenuResult, loading, error },

        mealPlan: {
            error: serverError,
            verifyingUnits,
            unitSuggestions = [],
            grams,
            editIngredient,
            nutrition_targets,
            preferredServingSize,
            currentDate

        },
        recipeBook:{
            searchResult
        },
        main : {
            activeMeal,
            activeTabId
        },
        clientPermissions: { showNutrients }
    }= state;
    return {
        restaurantMenuResult,
        loading,
        error,
        activeTabId,
        currentDate,
        serverError,
        verifyingUnits,
        unitSuggestions,
        grams,
        editIngredient,
        searchResult,
        activeMeal,
        nutrition_targets,
        preferredServingSize,
        showNutrients
    };
};

export default connect(mapStateToProps, {
    addMealNewRecipe,
    replaceMealNewRecipe,
    createCustomRecipe,
    recipeDelete,
    pinRecipeFromGlobal,
    scaledIngredientsServingSizeForGlobal,
    getRestaurantMenu
})(RestaurantMenuList);
