import actionTypes from "../actions/actionTypes";

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    temporaryEmail: "",
    temporaryPassword: "",
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
            };
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            };
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
            };
        case actionTypes.SAVE_USER_EMAIL_AND_PASSWORD_TEMPORARILY_SUCCESSFULLY:
            state.temporaryEmail = action.email;
            state.temporaryPassword = action.password;
            return {
                ...state,
            };
        case actionTypes.SAVE_USER_EMAIL_AND_PASSWORD_TEMPORARILY_FAIL:
            state.temporaryEmail = "";
            state.temporaryPassword = "";
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default appReducer;
