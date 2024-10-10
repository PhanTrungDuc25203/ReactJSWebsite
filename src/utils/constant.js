export const path = {
    HOME: '/',
    HOMEPAGE: '/home', //dự án booking care: chưa cần đăng nhập nhưng vẫn có thể vào Homepage
    LOGIN: '/login',
    REGISTER: '/register',
    REGISTER_PERSONAL_INFO: '/register/personal-info',
    LOG_OUT: '/logout',
    SYSTEM: '/system',
    DETAIL_DOCTOR_ARTICLE: '/detail-doctor-article/doctor/:id',
    MAKE_APPOINTMENT_WITH_DOCTOR: '/make-appointment/:id/:date/:timeframe',
    CONFIRM_BOOKING_APPOINTMENT: '/confirm-booking',
    SPECIALTY_ARTICLE: '/detail-specialty-article/:id',
    ALL_SPECIALTIES: '/all-specialties/',
    MEDICAL_FACILITY_ARTICLE: '/detail-medical-facility/:id',
    USER_PROFILE: '/user-profile/:email',
};

export const LANGUAGES = {
    VI: 'vi',
    EN: 'en'
};

export const CRUD_ACTIONS = {
    CREATE: "CREATE",
    EDIT: "EDIT",
    DELETE: "DELETE",
    READ: "READ",
};

export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'
};

export const YesNoObj = {
    YES: 'Y',
    NO: 'N'
}

export const REGISTERED_ROLE = {
    ADMIN: 'R1',
    DOCTOR: 'R2',
    PATIENT: 'R3',
}