// Redux-getGender-(8): tạo xong file thì sang rootReducer import nó vào

// Redux-getGender-(12): viết code
import actionTypes from "../actions/actionTypes";

const initialState = {
    // Redux-getGender-(13): thì ra không chỉ lưu mỗi gender:))
    isLoadingGenderValue: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    eliteDoctors: [],
    allDoctorsForDoctorArticlePage: [],
    detailsOfADoctor: {},
    examHoursData: [],
    specialties: [],
    remoteSpecialties: [],
    medicalFacility: [],

    allRequiredDoctorData: [],
    currentSystemUser: {},
    allRequiredDataForExamPackageManage: {},
    allPackagesData: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_VALUE_START:
            state.isLoadingGenderValue = true;
            // console.log('fire start: ', action)
            return {
                ...state,
            };
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
            };
        case actionTypes.FETCH_GENDER_VALUE_FAILED:
            // console.log('fire failed: ', action)
            state.genders = [];
            state.isLoadingGenderValue = false;
            return {
                ...state,
            };
        //position
        case actionTypes.FETCH_POSITION_VALUE_SUCCESSFULLY:
            state.positions = action.data;
            return {
                ...state,
            };
        case actionTypes.FETCH_POSITION_VALUE_FAILED:
            state.positions = [];
            return {
                ...state,
            };
        //role
        case actionTypes.FETCH_ROLE_VALUE_SUCCESSFULLY:
            state.roles = action.data;
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_VALUE_FAILED:
            state.roles = [];
            return {
                ...state,
            };
        //fetch allusers's data
        case actionTypes.FETCH_ALL_USERS_VALUE_SUCCESSFULLY:
            state.users = action.users;
            return {
                ...state,
            };
        case actionTypes.FETCH_ALL_USERS_VALUE_FAILED:
            state.users = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_ELITE_DOCTORS_VALUE_SUCCESSFULLY:
            state.eliteDoctors = action.eliteDoctorsData;
            return {
                ...state,
            };
        case actionTypes.FETCH_ELITE_DOCTORS_VALUE_FAILED:
            state.eliteDoctors = [];
            return {
                ...state,
            };
        case actionTypes.GET_All_DOCTORS_FOR_DOCTOR_ARTICLE_PAGE_SUCCESSFULLY:
            state.allDoctorsForDoctorArticlePage = action.allDoctorsData;
            return {
                ...state,
            };
        case actionTypes.GET_All_DOCTORS_FOR_DOCTOR_ARTICLE_PAGE_FAILED:
            state.allDoctorsForDoctorArticlePage = [];
            return {
                ...state,
            };

        case actionTypes.SAVE_INFOR_AND_ARTICLE_FOR_A_DOCTOR_SUCCESSFULLY:
            return {
                ...state,
            };
        case actionTypes.SAVE_INFOR_AND_ARTICLE_FOR_A_DOCTOR_FAILED:
            return {
                ...state,
            };
        case actionTypes.FETCH_DOCTOR_DETAILS_FOR_DOCTOR_MANAGE_PAGE_SUCCESSFULLY:
            state.detailsOfADoctor = action.detailsOfADoctor;
            return {
                ...state,
            };
        case actionTypes.FETCH_DOCTOR_DETAILS_FOR_DOCTOR_MANAGE_PAGE_FAILED:
            state.detailsOfADoctor = {};
            return {
                ...state,
            };
        //lấy khung giờ cho trang schedule manage
        case actionTypes.FETCH_HOURS_IN_ALLCODES_FOR_SCHEDULE_MANAGE_PAGE_SUCCESSFULLY:
            state.examHoursData = action.examHoursData;
            return {
                ...state,
            };
        case actionTypes.FETCH_HOURS_IN_ALLCODES_FOR_SCHEDULE_MANAGE_PAGE_FAILED:
            state.examHoursData = [];
            return {
                ...state,
            };
        //tạo khung giờ cho lịch biểu của bác sĩ
        case actionTypes.CREATE_TIMEFRAMES_FOR_DOCTOR_SCHEDULE_SUCCESSFULLY:
            return {
                ...state,
            };
        case actionTypes.CREATE_TIMEFRAMES_FOR_DOCTOR_SCHEDULE_FAILED:
            return {
                ...state,
            };
        //lấy dữ liệu price, paymentMethod, province,.. từ Doctor_infor table cho trang doctormanage
        case actionTypes.GET_REQUIRED_DATA_FOR_DOCTOR_MANAGE_PAGE_SUCCESSFULLY:
            state.allRequiredDoctorData = action.data;
            return {
                ...state,
            };
        case actionTypes.GET_REQUIRED_DATA_FOR_DOCTOR_MANAGE_PAGE_FAILED:
            state.allRequiredDoctorData = [];
            return {
                ...state,
            };
        //lấy dữ liệu specialties cho trang home
        case actionTypes.FETCH_SPECIALTIES_VALUE_SUCCESSFULLY:
            state.specialties = action.specialtiesData;
            return {
                ...state,
            };
        case actionTypes.FETCH_SPECIALTIES_VALUE_FAILED:
            state.specialties = [];
            return {
                ...state,
            };
        //lấy dữ liệu remote specialties cho trang home
        case actionTypes.FETCH_REMOTE_SPECIALTIES_VALUE_SUCCESSFULLY:
            console.log("check in reducer: ", action.remoteSpecialtiesData);
            state.remoteSpecialties = action.remoteSpecialtiesData;
            return {
                ...state,
            };
        case actionTypes.FETCH_REMOTE_SPECIALTIES_VALUE_FAILED:
            state.remoteSpecialties = [];
            return {
                ...state,
            };
        //lấy dữ liệu của người dùng hiện tại của hệ thống
        case actionTypes.GET_ALL_RELATIVE_INFOR_OF_CURRENT_SYSTEM_USER_SUCCESSFULLY:
            state.currentSystemUser = action.currentSystemUser;
            return {
                ...state,
            };
        case actionTypes.GET_ALL_RELATIVE_INFOR_OF_CURRENT_SYSTEM_USER_FAILED:
            state.currentSystemUser = {};
            return {
                ...state,
            };
        //lấy dữ liệu ngắn gọn về cơ sở y tế
        case actionTypes.GET_BRIEF_INFO_OF_MEDICAL_FACILITY_SUCCESSFULLY:
            state.medicalFacility = action.medicalFacilityInfo;
            return {
                ...state,
            };
        case actionTypes.GET_BRIEF_INFO_OF_MEDICAL_FACILITY_FAILED:
            state.medicalFacility = [];
            return {
                ...state,
            };
        //lấy dữ liệu liên quan tới một gói khám cho trang quản lý gói khám
        case actionTypes.GET_ALL_RELATIVE_INFOR_FOR_A_EXAM_PACKAGE_SUCCESSFULLY:
            state.allRequiredDataForExamPackageManage = action.data;
            return {
                ...state,
            };
        case actionTypes.GET_ALL_RELATIVE_INFOR_FOR_A_EXAM_PACKAGE_FAIL:
            state.medicalFacility = {};
            return {
                ...state,
            };

        //lấy thông tin các Gói khám
        case actionTypes.GET_ALL_EXAM_PACKAGE_SUCCESFULLY:
            state.allPackagesData = action.data;
            return {
                ...state,
            };
        case actionTypes.GET_ALL_EXAM_PACKAGE_FAIL:
            state.allPackagesData = [];
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default adminReducer;
// Redux-getGender-(14): quay lại UserManageByRedux.js
