// Redux-getGender-(2): khai báo action cho admin
//để sử dụng được file này thì bào index để export
import actionTypes from './actionTypes';
// Redux-getGender-(21): import để gọi api
import { getAllCodesService, createNewUserService } from "../../services/userService";


//Redux-getGender-(4): tạo action
//code chuẩn redux thì gồm 3 hành động start doing và end

// Redux-getGender-(22): khi đó thay vì return một action như dưới đây thì ta return một fucntion
// export const fetchGenderValueStart = () => ({
//     type: actionTypes.FETCH_GENDER_VALUE_START,
// })
// Redux-getGender-(23): return một function
export const fetchGenderValueStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_VALUE_START });
            let res = await getAllCodesService('gender');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderValueSuccessfully(res.data));
            } else {
                dispatch(fetchGenderValueFailed());
            }
        } catch (e) {
            dispatch(fetchGenderValueFailed());
            console.log('fetchGenderValueStart function error: ', e);
        }
    }
    // Redux-getGender-(24): lấy được biến data rồi thì ra sẽ lưu nó vào redux, về file adminReducer
}

export const fetchGenderValueSuccessfully = (genderData) => ({
    type: actionTypes.FETCH_GENDER_VALUE_SUCCESSFULLY,
    data: genderData,
})
export const fetchGenderValueFailed = () => ({
    type: actionTypes.FETCH_GENDER_VALUE_FAILED,
})

//Redux-getGender-(5): qua actionTypes khai báo type

//position
export const fetchPositionValueStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_VALUE_START });
            let res = await getAllCodesService('position');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionValueSuccessfully(res.data));
            } else {
                dispatch(fetchPositionValueFailed());
            }
        } catch (e) {
            dispatch(fetchPositionValueFailed());
            console.log('fetchPositionValueStart function error: ', e);
        }
    }
}

export const fetchPositionValueSuccessfully = (positionData) => ({
    type: actionTypes.FETCH_POSITION_VALUE_SUCCESSFULLY,
    data: positionData,
})
export const fetchPositionValueFailed = () => ({
    type: actionTypes.FETCH_POSITION_VALUE_FAILED,
})
//role
export const fetchRoleValueStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_VALUE_START });
            let res = await getAllCodesService('role');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleValueSuccessfully(res.data));
            } else {
                dispatch(fetchRoleValueFailed());
            }
        } catch (e) {
            dispatch(fetchRoleValueFailed());
            console.log('fetchRoleValueStart function error: ', e);
        }
    }
}

export const fetchRoleValueSuccessfully = (roleData) => ({
    type: actionTypes.FETCH_ROLE_VALUE_SUCCESSFULLY,
    data: roleData,
})
export const fetchRoleValueFailed = () => ({
    type: actionTypes.FETCH_ROLE_VALUE_FAILED,
})

export const addNewUserByRedux = (data) => {
    return async (dispatch, getState) => {
        try {

            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                dispatch(addNewUserSuccessfully());
            } else {
                dispatch(addNewUserFailed());
            }
        } catch (e) {
            dispatch(addNewUserFailed());
        }
    }
}

export const addNewUserSuccessfully = () => ({
    type: 'ADD_NEW_USER_SUCCESSFULLY',
})

export const addNewUserFailed = () => ({
    type: 'ADD_NEW_USER_FAILED',
})