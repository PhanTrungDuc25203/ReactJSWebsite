import axios from '../axios'

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
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsersToDisplayInReact = (userInputId) => {
    //nếu truyền vào userInputId bằng ALL thì lấy hết không thì lấy một user có id = userInpiuId
    return axios.get(`/api/get-all-users-for-react?id=${userInputId}`);
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user-in-react', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user-in-react', {
        data: {
            id: userId
        }
    });
}

const editUserService = (data) => {
    return axios.put('/api/edit-user-in-react', data);
}

const getAllCodesService = (inputType) => {
    return axios.get(`/api/getallcodesdata?type=${inputType}`);
}

const getEliteDoctorsForHomePageService = (limitEliteDoctor) => {
    return axios.get(`/api/get-elite-doctor-for-homepage?limitEliteDoctor=${limitEliteDoctor}`);
}

const getAllDoctorsForDoctorArticlePageService = () => {
    return axios.get('/api/get-all-doctors-for-doctor-article-page');
}

const saveInforAndArticleForADoctor = (data) => {
    return axios.post('/api/save-infor-and-article-of-a-doctor', data);
}

const getInforAndArticleForADoctor = (id) => {
    return axios.get(`/api/get-a-particular-doctor-infor-for-his-or-her-page?id=${id}`);
}

const createTimeframesForDoctorScheduleService = (data) => {
    return axios.post('/api/bulk-create-timeframes-for-doctor-appointment-schedule', data);
}

const getDoctorScheduleByDateService = (doctorId, date) => {
    return axios.get(`/api/get-doctor-schedule-by-date?doctorId=${doctorId}&date=${date}`);
}

const getExtraInforDoctorByIdService = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
}

const patientInforWhenBookingAppointment = (data) => {
    return axios.post('/api/patient-infor-when-booking-time', data);
}

const confirmBookingAppointmentService = (data) => {
    return axios.post('/api/confirm-booking-appointment', data);
}

const createNewSpecialtyService = (data) => {
    return axios.post('/api/create-new-specialty', data);
}

const getSpecialtiesForHomePageService = () => {
    return axios.get(`/api/get-specialty-for-homepage`);
}

const getAllSpecialtyDetailsById = (data) => {
    return axios.get(`/api/get-specialty-by-id?id=${data.id}&location=${data.location}`);
}

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
};