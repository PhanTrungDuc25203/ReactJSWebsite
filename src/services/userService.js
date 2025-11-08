import axios from "../axios";

// có một điều cần chú ý ở đây là chỉ cần thêm số 1 vào tham số truyền vào như thế này:
// const handleLoginAPI = (email11, password) => {
//     return axios.post('/api/login', { email1, password1});
// }
// thì web sẽ không thể POST được, lí do là vì khi viết là {email, password}
// thì ide sẽ hiểu là:
// {
//     email: your email,
//     password: your password,
// }
// khi viết là {email1, password1}
// thì ide sẽ hiểu là:
// {
//     email1: your email,
//     password1: your password,
// }
// mà trong file controller/userController.js của NodeJS thì định nghĩa 2 biến là:
// let email = req.body.email;
// let password = req.body.password;
//nên phải đặt đúng 2 biến này
//vậy thì chúng ta có thể viết tắt như thế này:
// const handleLoginAPI = (email, password) => {
//     return axios.post('/api/login', { email, password });
// }

//hoặc chúng ta có thể viết đầy đủ như thế này:
const handleLoginAPI = (userEmail, userPassword) => {
    return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsersToDisplayInReact = (userInputId) => {
    //nếu truyền vào userInputId bằng ALL thì lấy hết không thì lấy một user có id = userInpiuId
    return axios.get(`/api/get-all-users-for-react?id=${userInputId}`);
};

const createNewUserService = (data) => {
    return axios.post("/api/create-new-user-in-react", data);
};

const checkUserEmailIsAlreadyExist = (inputType) => {
    return axios.get(`/api/check-user-email-already-exist?email=${inputType}`);
};

const deleteUserService = (userId) => {
    return axios.delete("/api/delete-user-in-react", {
        data: {
            id: userId,
        },
    });
};

const editUserService = (data) => {
    return axios.put("/api/edit-user-in-react", data);
};

const getAllCodesService = (inputType) => {
    return axios.get(`/api/getallcodesdata?type=${inputType}`);
};

const getEliteDoctorsForHomePageService = (limitEliteDoctor) => {
    return axios.get(`/api/get-elite-doctor-for-homepage?limitEliteDoctor=${limitEliteDoctor}`);
};

const getAllDoctorsForDoctorArticlePageService = () => {
    return axios.get("/api/get-all-doctors-for-doctor-article-page");
};

const saveInforAndArticleForADoctor = (data) => {
    return axios.post("/api/save-infor-and-article-of-a-doctor", data);
};

const getInforAndArticleForADoctor = (id) => {
    return axios.get(`/api/get-a-particular-doctor-infor-for-his-or-her-page?id=${id}`);
};

const createTimeframesForDoctorScheduleService = (data) => {
    return axios.post("/api/bulk-create-timeframes-for-doctor-appointment-schedule", data);
};

const getDoctorScheduleByDateService = (doctorId, date) => {
    return axios.get(`/api/get-doctor-schedule-by-date?doctorId=${doctorId}&date=${date}`);
};

const getExtraInforDoctorByIdService = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const patientInforWhenBookingAppointment = (data) => {
    return axios.post("/api/patient-infor-when-booking-time", data);
};

const patientInforWhenBookingExamPackage = (data) => {
    return axios.post("/api/patient-infor-when-booking-exam-package", data);
};

const confirmBookingAppointmentService = (data) => {
    return axios.post("/api/confirm-booking-appointment", data);
};

const createNewSpecialtyService = (data) => {
    return axios.post("/api/create-new-specialty", data);
};

const getSpecialtiesForHomePageService = () => {
    return axios.get(`/api/get-specialty-for-homepage`);
};

const getRemoteSpecialtiesForHomePageService = () => {
    return axios.get(`/api/get-remote-specialty-for-homepage`);
};

const getAllSpecialtyDetailsById = (data) => {
    return axios.get(`/api/get-specialty-by-id?id=${data.id}&location=${data.location}`);
};

const getAllRelativeInforsOfCurrentSystemUserService = (email) => {
    return axios.get(`/api/get-all-relative-infors-of-current-system-user?email=${email}`);
};

// const getAllRelativeBookingsOfCurrentSystemUserService = (email) => {
//     return axios.get(`/api/get-all-relative-bookings-of-current-system-user?email=${email}`);
// };

// const getAllRelativeBookingsOfCurrentSystemUser2Service = (email) => {
//     return axios.get(`/api/get-all-relative-bookings-of-current-system-user-2?email=${email}`);
// };

const getAllRelativeBookingsOfCurrentSystemUserService = (email, appointmentWithUser = false) => {
    const url = appointmentWithUser ? `/api/get-all-relative-bookings-of-current-system-user?email=${email}&appointmentWithUser=true` : `/api/get-all-relative-bookings-of-current-system-user?email=${email}`;
    return axios.get(url);
};

const saveAppointmentHistory = (appointmentHistory) => {
    return axios.post(`/api/save-appointment-history`, appointmentHistory);
};

const getAppointmentHistoriesByDoctorEmail = (doctorEmail) => {
    return axios.get(`/api/get-appointement-histories-by-doctor-email?doctorEmail=${doctorEmail}`);
};

const getAppointmentHistoriesByPatientEmail = (patientEmail) => {
    return axios.get(`/api/get-appointement-histories-by-patient-email?patientEmail=${patientEmail}`);
};

const getAllSpecialtyAndProvinceForMedicalFacilityManagePage = () => {
    return axios.get(`/api/get-specialty-and-province-for-medical-facility-manage-page`);
};

const createMedicalFacility = (inputData) => {
    return axios.post(`/api/create-medical-facility`, inputData);
};

const getInfoOfMedicalFacility = (facilityId) => {
    return axios.get(`/api/get-info-of-medical-facility?id=${facilityId}`);
};

const createPackageFacility = (inputData) => {
    return axios.post(`/api/create-exam-package`, inputData);
};

const getAllExamPackageService = (inputData) => {
    return axios.get(`/api/get-all-exam-package?id=${inputData}`);
};

const createTimeframeForPackage = (inputData) => {
    return axios.post(`/api/bulk-create-timeframes-for-exam-package-schedule`, inputData);
};

const getPackageScheduleByDateService = (packageId, date) => {
    return axios.get(`/api/get-package-schedule-by-date?packageId=${packageId}&date=${date}`);
};

const saveRateAndReviewAboutDoctorOrPackageService = (rateAndReviewData) => {
    return axios.post(`/api/save-rate-and-review-about-doctor`, rateAndReviewData);
};

const getRateAndReviewAboutDoctorService = (appointmentId) => {
    return axios.get(`/api/get-rate-and-review-about-doctor?appointmentId=${appointmentId}`);
};

const createPaymentUrlService = (data) => {
    return axios.post("/api/create_payment_url", data);
};

const postVisitPaymentService = (data) => {
    return axios.post("/api/handle-post-visit-payment-method", data);
};

export {
    handleLoginAPI,
    getAllUsersToDisplayInReact,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodesService,
    getEliteDoctorsForHomePageService,
    getAllDoctorsForDoctorArticlePageService,
    saveInforAndArticleForADoctor,
    getInforAndArticleForADoctor,
    createTimeframesForDoctorScheduleService,
    getDoctorScheduleByDateService,
    getExtraInforDoctorByIdService,
    patientInforWhenBookingAppointment,
    confirmBookingAppointmentService,
    createNewSpecialtyService,
    getSpecialtiesForHomePageService,
    getAllSpecialtyDetailsById,
    getRemoteSpecialtiesForHomePageService,
    getAllRelativeInforsOfCurrentSystemUserService,
    checkUserEmailIsAlreadyExist,
    saveAppointmentHistory,
    getAppointmentHistoriesByDoctorEmail,
    getAllRelativeBookingsOfCurrentSystemUserService,
    // getAllRelativeBookingsOfCurrentSystemUser2Service,
    getAllSpecialtyAndProvinceForMedicalFacilityManagePage,
    createMedicalFacility,
    getInfoOfMedicalFacility,
    createPackageFacility,
    getAllExamPackageService,
    createTimeframeForPackage,
    getPackageScheduleByDateService,
    patientInforWhenBookingExamPackage,
    getAppointmentHistoriesByPatientEmail,
    saveRateAndReviewAboutDoctorOrPackageService,
    getRateAndReviewAboutDoctorService,
    createPaymentUrlService,
    postVisitPaymentService,
};
