// Redux-getGender-(8): tạo xong file thì sang rootReducer import nó vào

// Redux-getGender-(12): viết code
import actionTypes from '../actions/actionTypes';

const initialState = {
    // Redux-getGender-(13): thì ra không chỉ lưu mỗi gender:))
    isLoadingGenderValue: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_VALUE_START:
            state.isLoadingGenderValue = true;
            // console.log('fire start: ', action)
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_VALUE_SUCCESSFULLY:
            // Redux-getGender-(25): 
            state.genders = action.data;
            //có phần loading vì đó là chuẩn của một redux, nếu không có thì code này sẽ bỏ qua
            //phần start
            state.isLoadingGenderValue = false;
            // console.log('fire successfully: ', state)
            // Redux-getGender-(25): khi đó biến copyState/state trả ra 3 thuộc tính gender, position và role, nhưng chỉ có gender là có giá trị
            // Redux-getGender-(26): khi lấy được state rồi thì phải map nó vào hàm mapStateToProps để sử dụng trong file UserManageByRedux.js
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_VALUE_FAILED:
            // console.log('fire failed: ', action)
            state.genders = [];
            state.isLoadingGenderValue = false;
            return {
                ...state,
            }
        //position
        case actionTypes.FETCH_POSITION_VALUE_SUCCESSFULLY:
            state.positions = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_VALUE_FAILED:
            state.positions = [];
            return {
                ...state,
            }
        //role
        case actionTypes.FETCH_ROLE_VALUE_SUCCESSFULLY:
            state.roles = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_VALUE_FAILED:
            state.roles = [];
            return {
                ...state,
            }
        //fetch allusers's data
        case actionTypes.FETCH_ALL_USERS_VALUE_SUCCESSFULLY:
            state.users = action.users;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_VALUE_FAILED:
            state.users = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;
// Redux-getGender-(14): quay lại UserManageByRedux.js