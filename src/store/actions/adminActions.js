// Redux-getGender-(2): khai báo action cho admin
//để sử dụng được file này thì bào index để export
import actionTypes from './actionTypes';
// Redux-getGender-(21): import để gọi api
import { getAllCodesService } from "../../services/userService";


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