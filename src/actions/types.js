/**
 * Created by mponomarets on 6/25/17.
 */

/*types for auth actions */
export const EMAIL_CHANGED = 'email_changed';
export const PASSWORD_CHANGED = 'password_changed';
export const LOGIN_USER_SUCCESS = 'login_user_success';
export const LOGIN_USER_FAIL = 'login_user_fail';
export const LOGIN_USER = 'login_user';
export const IS_FIRST_LOGIN = 'is_first_login';

/*reset password*/
export const SEND_RESET_REQUEST = 'end_reset_request';
export const SEND_RESET_SUCCESS = 'end_reset_success';
export const SEND_RESET_FAIL = 'end_reset_fail';

/*general types */
export const CHANGE_ACTIVE_TAB = 'change_active_tab';
export const CHANGE_ACTIVE_SLIDE = 'change_active_slide';
export const RESET_STATE = 'reset_state';
export const OPEN_CLOSE_ONBOARDING = 'open_close_ondoarding';
export const OPEN_CLOSE_WELCOME = 'open_close_welcome';
export const GET_WELCOME_SUCCESS = 'get_welcome_success';
export const GET_WELCOME_FAIL = 'get_welcome_fail';

/*Meal Plan*/
export const MEAL_PLAN_GET_SUCCESS = 'meal_plan_get_success';
export const MEAL_PLAN_GET_FAIL = 'meal_plan_get_fail';
export const MEAL_PLAN_START_LOAD = 'meal_plan_start_load';
export const MEAL_PLAN_GET_BY_DATE_SUCCESS = 'meal_plan_get_by_date_success';
export const CHANGE_CURRENT_DATE_IN_MEAL_PLAN = 'change_current_date_in_meal_plan';
export const MEAL_PLAN_START_UPDATING = 'meal_plan_start_updating';
export const MEAL_PLAN_START_ADD_NEW = 'meal_plan_start_add_new';
export const MEAL_SAVE_SUCCESS = 'meal_save_success';
export const MEAL_SAVE_FAIL = 'meal_save_fail';
export const SEND_UPC = 'send_upc';
export const SEND_UPC_SUCCESS = 'send_upc_success';
export const SEND_UPC_FAIL = 'send_upc_fail';
export const SET_NUTRITION_TARGETS = 'set_nutrition_targets';
export const SET_NUTRITION_REMAIN = 'set_nutrition_remain';
export const SET_DIET_RESTRICTION = 'set_diet_restriction';
export const REMOVE_DIET_RESTRICTION = 'remove_diet_restriction';
export const GET_MEAL_PLAN_NOTES_SUCCESS = 'get_meal_plan_notes_success';
export const DELETE_MEAL = 'delete_meal';
export const DELETE_MEAL_SUCCESS = 'delete_meal_success';
export const DELETE_MEAL_FAIL = 'delete_meal_fail';
export const EDIT_INGREDIENT = 'edit_ingredient';
export const LOAD_INGREDIENT_SUGGESTIONS = 'load_ingredient_suggestions';
export const LOAD_INGREDIENT_SUGGESTIONS_SUCCESS = 'load_ingredient_suggestions_success';
export const LOAD_INGREDIENT_SUGGESTIONS_FAIL = 'load_ingredient_suggestions_fail';
export const VERIFY_UNITS = 'verify_units';
export const VERIFY_UNITS_SUCCESS = 'verify_units_success';
export const VERIFY_UNITS_SUGGESTIONS = 'verify_units_suggestions';
export const VERIFY_UNITS_FAIL = 'verify_units_fail';
export const SET_TAB_FOR_MEALPlANSCREEN = 'set_tab_for_mealplanscreen';

/* Grocery list */
export const GROCERY_LIST_GET_SUCCESS = 'grocery_list_get_success';
export const GROCERY_LIST_GET_FAIL = 'grocery_list_get_fail';
export const GROCERY_LIST_START_LOAD = 'grocery_list_start_load';
export const CHANGE_CURRENT_DATE_IN_GROCERY_LIST = 'change_current_date_in_grocery_list';
export const ACTIVE_PERIOD = 'active_period';
export const CHANGE_GROUP_BY = 'change_group_by';
export const GROCERY_LIST_GROUP_BY_RECIPE = 'grocery_list_group_by_recipe';
export const GROCERY_LIST_GROUP_BY_CATEGORY = 'grocery_list_group_by_category';


/* Chat page*/
export const START_LOAD_CHAT_MESSAGE = 'start_load_chat_message';
export const LOAD_CHAT_MESSAGE_SUCCESS = 'load_chat_message_success';
export const LOAD_CHAT_MESSAGE_FAIL = 'load_chat_message_fail';
export const CHANGE_MESSAGE_LIST = 'change_message_list';

/*Recipe detail*/
export const START_LOAD_RECIPE = 'start_load_recipe';
export const LOAD_RECIPE_SUCCESS = 'load_recipe_success';
export const LOAD_RECIPE_FAIL = 'load_recipe_fail';
export const SEND_CONFIRM = 'send_confirm';
export const SEND_CONFIRM_SUCCESS = 'send_confirm_success';
export const SEND_CONFIRM_FAIL = 'send_confirm_fail';
export const ADD_SUCCESS = 'add_success';
export const ADD_FAIL = 'add_fail';
export const SWAP_SUCCESS = 'swap_success';
export const SWAP_FAIL = 'swap_fail';
export const SET_WARNINGS = 'set_warnings';
export const PIN_BUTTON_PRESS = 'pin_button_press';
export const PINNED_SUCCESS = 'pinned_success';
export const PIN_FAIL = 'pin_fail';
export const LOAD_RECIPE_FROM_CHAT = 'load_recipe_from_chat';

/*Home page*/
export const START_LOAD_DATA = 'start_load_data';
export const LOAD_UPCOMING_MEAL_SUCCESS = 'load_upcoming_meal_success';
export const LOAD_UPCOMING_MEAL_FAIL = 'load_upcoming_meal_fail';
export const LOAD_REVIEW_MEAL_LIST_SUCCESS = 'load_review_meal_list_success';
export const LOAD_REVIEW_MEAL_LIST_FAIL = 'load_review_meal_list_fail';

export const LOAD_MEASUREMENT_SUCCESS = 'load_review_measurements_success';
export const LOAD_MEASUREMENT_FAIL = 'load_measurements_fail';
export const SET_CLOSE_DAYS_LIST = 'set_close_days_list';
export const SET_SELECTED_DAY = 'set_selected_day';

export const GET_MEAL_PLAN_FOR_HOMESCREEN_SUCCESS = 'get_meal_plan_for_homescreen_success';

/*measurements page*/
export const SEND_MEASUREMENTS = 'send_measurements';
export const SEND_MEASUREMENTS_SUCCESS = 'send_measurements_success';
export const SEND_MEASUREMENTS_FAIL = 'send_measurements_fail';
export const SET_MEASUREMENTS_HISTORY_SUCCESS = 'set_measurements_history_success';
export const SET_MEASUREMENTS_HISTORY_FAIL = 'set_measurements_history_fail';

/*Profile page*/
export const SET_PROFILE_IMAGE = 'upload_profile_image';
export const SET_PROFILE_IMAGE_FAIL = 'upload_profile_image_fail';
export const SET_PROFILE_IMAGE_SUCCESS = 'upload_profile_image_success';
export const USER_LOCATION = 'user_location';
export const SET_SERVINGS = 'SET_SERVINGS';
export const SET_SERVINGS_FAIL = 'SET_SERVINGS_FAIL';
export const SET_SERVINGS_SUCCESS = 'SET_SERVINGS_SUCCESS';

export const FETCH_SERVINGS = 'FETCH_SERVINGS';
export const FETCH_SERVINGS_FAIL = 'FETCH_SERVINGS_FAIL';
export const FETCH_SERVINGS_SUCCESS = 'FETCH_SERVINGS_SUCCESS';

export const UPDATE_SERVINGS_IN_STATE = 'UPDATE_SERVINGS_IN_STATE';

/*Change password page */
export const SEND_NEW_PASSWORD = 'send_new_password';
export const SEND_NEW_PASSWORD_SUCCESS = 'send_new_password_success';
export const SEND_NEW_PASSWORD_FAIL = 'send_new_password_fail';

/**/
export const CHANGE_ACTIVE_MEAL_ID = 'change_active_meal_id';
export const CHANGE_SCROLL_ACTIVE = 'change_scroll_active';
export const CLOSE_ALL_SHORT_MENU = 'close_all_short_menu';
export const IS_SHORT_MENU_OPEN = 'is_short_menu_open';

/*search types*/
export const START_SEARCH = 'start_search';
export const CONTINUE_SEARCH = 'continue_search';
export const SEARCH_SUCCESS = 'search_success';
export const SEARCH_FAIL = 'search_fail';

/*filters type*/
export const ADD_NEW_FILTER = 'ADD_NEW_FILTER';
export const REMOVE_NEW_FILTER = 'ADD_NEW_FILTER';
export const CLEAR_NEW_FILTERS = 'CLEAR_NEW_FILTERS';
export const SET_FILTERS = 'SET_FILTERS';

/* check nutrition*/
export const SET_UPC_DATA = 'set_upc_data';
export const NUTRITION_SUCCESS = 'nutrition_success';
export const LOAD_NUTRITION = 'load_nutrition';
export const NUTRITION_FAIL = 'nutrition_fail';

/* show new toast */
export const SHOW_TOAST = 'show_toast';

/*Points*/
export const LOAD_MY_POINTS = 'load_my_points';
export const LOAD_MY_POINTS_SUCCESS = 'load_my_points_success';
export const LOAD_MY_POINTS_FAIL = 'load_my_points_fail';

/*awards*/
export const LOAD_ALL_AWARDS = 'load_all_awards';
export const LOAD_ALL_AWARDS_SUCCESS = 'load_all_awards_success';
export const LOAD_ALL_AWARDS_FAIL = 'load_all_awards_fail';

export const LOAD_MY_AWARDS = 'load_my_awards';
export const LOAD_MY_AWARDS_SUCCESS = 'load_my_awards_success';
export const LOAD_MY_AWARDS_FAIL = 'load_my_awards_fail';

/* Client permissions */
export const SET_CLIENT_PERMISSIONS = 'client_permissions';

/*show bottom sheet*/
export const IS_BOTTOM_SHEET_OPEN = 'is_bottom_sheet_open';
export const IS_BOTTOM_SHEET_FOR_OPTION_OPEN = 'is_bottom_sheet_for_option_open';
export const IS_BOTTOM_SHEET_FOR_OPTION_GROCERY_OPEN = 'is_bottom_sheet_for_option_grocery_open';
export const IS_BOTTOM_SHEET_FOR_OPTION_SWAP_OPEN = 'is_bottom_sheet_for_option_swap_open';
export const IS_BOTTOM_SHEET_FOR_OPTION_TRACK_OPEN = 'is_bottom_sheet_for_option_track_open';

/*set active meal*/
export const SET_ACTIVE_MEAL = 'set_active_meal';

/* Refer Form */
export const SEND_REFER_FORM = 'send_refer_form';
export const SEND_REFER_FORM_SUCCESS = 'send_refer_form_success';
export const SEND_REFER_FORM_FAIL = 'send_refer_form_fail';

/* Recipe Book */
export const START_LOAD_RECIPE_BOOK = 'start_load_recipe_book';
export const CONTINUE_LOAD_RECIPE_BOOK = 'continue_load_recipe_book';
export const DELETE_RECIPE = 'delete_recipe';
export const DELETE_RECIPE_SUCCESS = 'delete_recipe_success';
export const DELETE_RECIPE_FAIL = 'delete_recipe_fail';
export const LOAD_RECIPE_FOR_EDITING = 'load_recipe_for_editing';
export const LOAD_RECIPE_FOR_EDITING_SUCCESS = 'load_recipe_for_editing_success';
export const LOAD_RECIPE_FOR_EDITING_FAIL = 'load_recipe_for_editing_fail';
export const START_ADD_NEW_CASTOM_RECIPE = 'start_add_new_castom_recipe';
export const ADD_NEW_CASTOM_RECIPE_FAIL = 'add_new_castom_recipe_fail';
export const SET_LOCK_TAB = 'set_lock_tab';

/* Trackeers */
export const GET_DAILY_CHECKLIST = 'get_daily_checklist';
export const GET_CHECKLIST_RECORDS = 'get_checklist_records';
export const GET_DAILY_CHECKLIST_SUCCESS = 'get_daily_checklist_success';
export const GET_CHECKLIST_RECORDS_SUCCESS = 'get_checklist_records_success';
export const GET_CHECKLIST_RECORDS_FAIL = 'get_checklist_records_fail';
export const GET_DAILY_CHECKLIST_FAIL = 'get_daily_checlist_fail';
export const TRACK_CHECKLIST = 'track_checklist';
export const TRACK_CHECKLIST_SUCCESS = 'track_checklist_success';
export const TRACK_CHECKLIST_FAIL = 'track_checklist_fail';
export const TRACK_CHECLIST_ERROR_CLEAN = 'track_checklist_error_clean';
export const CLEAN_CHECKLIST_RECORDS = 'clean_checklist_records';

/* Restaurant */
export const GET_RESTAURANT = 'get_restaurant';
export const GET_RESTAURANT_SUCCESS = 'get_restaurant_success';
export const GET_RESTAURANT_FAIL = 'get_restaurant_fail';
export const GET_RESTAURANT_MENU = 'get_restaurant_menu';
export const GET_RESTAURANT_MENU_SUCCESS = 'get_restaurant_menu_success';
export const GET_RESTAURANT_MENU_FAIL = 'get_restaurant_menu_fail';

/* Release Notes */
export const SHOW_RELEASE_NOTES = 'show_release_notes';
export const CLOSE_RELEASE_NOTES = 'close_release_notes';

/* Meetings Calendar */
export const GET_MEETINGS = 'get_meetings';
export const GET_MEETINGS_SUCCESS = 'get_meetings_success';
export const CREATE_MEETING = 'create_meeting';
export const CREATE_MEETING_SUCCESS = 'create_meeting_success';
export const CREATE_MEETING_FAIL = 'create_meeting_fail';
export const GET_MEETINGS_CALENDAR = 'get_meeting_calendar';
export const GET_MEETINGS_CALENDAR_SUCCESS = 'get_meeting_calendar_success';
export const GET_MEETINGS_CALENDAR_FAIL = 'get_meeting_calendar_fail';
export const HANDLING_CC = 'handling_cc';
export const HANDLING_CC_SUCCESS = 'handling_cc_success';
export const CC_DISABEL = 'cc_disabel';