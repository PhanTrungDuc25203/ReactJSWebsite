import actionTypes from './actionTypes';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo,
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})

export const saveUserEmailAndPasswordTemporarily = (email, password) => {
    return async (dispatch, getState) => {
        try {
            if (email && password) {
                dispatch({
                    type: actionTypes.SAVE_USER_EMAIL_AND_PASSWORD_TEMPORARILY_SUCCESSFULLY,
                    email: email,
                    password: password,
                })
            } else {
                dispatch({
                    type: actionTypes.SAVE_USER_EMAIL_AND_PASSWORD_TEMPORARILY_FAIL,
                    email: '',
                    password: '',
                })
            }
        } catch (e) {
            console.log('Save user email and password temporarily fail: ', e);
            dispatch({
                type: actionTypes.SAVE_USER_EMAIL_AND_PASSWORD_TEMPORARILY_FAIL,
                email: '',
                password: '',
            })
        }
    }
}