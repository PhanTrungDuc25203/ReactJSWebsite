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

export {
    handleLoginAPI,
    getAllUsersToDisplayInReact,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodesService,
    getEliteDoctorsForHomePageService,
    getAllDoctorsForDoctorArticlePageService,

};