// Redux-getGender-(8): tạo xong file thì sang rootReducer import nó vào

// Redux-getGender-(12): viết code
import actionTypes from '../actions/actionTypes';

const initialState = {
    // Redux-getGender-(13): thì ra không chỉ lưu mỗi gender:))
    genders: [],
    roles: [],
    positions: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_VALUE_START:
            console.log('fire start: ', action)
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_VALUE_SUCCESSFULLY:
            // Redux-getGender-(25): 
            let copyState = { ...state };
            copyState.genders = action.data;
            console.log('fire successfully: ', copyState)
            // Redux-getGender-(25): khi đó biến copyState trả ra 3 thuộc tính gender, position và role, nhưng chỉ có gender là có giá trị
            // Redux-getGender-(26): khi lấy được state rồi thì phải map nó vào hàm mapStateToProps để sử dụng trong file UserManageByRedux.js
            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_VALUE_FAILED:
            console.log('fire failed: ', action)
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;
// Redux-getGender-(14): quay lại UserManageByRedux.js