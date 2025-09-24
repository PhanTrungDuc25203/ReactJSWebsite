// Redux-getGender-(2): khai báo action cho admin
//để sử dụng được file này thì bào index để export
import actionTypes from "./actionTypes";
// Redux-getGender-(21): import để gọi api
import {
  getAllCodesService,
  createNewUserService,
  getAllUsersToDisplayInReact,
  deleteUserService,
  editUserService,
  getEliteDoctorsForHomePageService,
  getAllDoctorsForDoctorArticlePageService,
  saveInforAndArticleForADoctor,
  getInforAndArticleForADoctor,
  createTimeframesForDoctorScheduleService,
  getSpecialtiesForHomePageService,
  getRemoteSpecialtiesForHomePageService,
  getAllRelativeInforsOfCurrentSystemUserService,
  getInfoOfMedicalFacility,
  getAllExamPackageService,
} from "../../services/userService";
import { toast } from "react-toastify";

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
      let res = await getAllCodesService("gender");
      if (res && res.errCode === 0) {
        dispatch(fetchGenderValueSuccessfully(res.data));
      } else {
        dispatch(fetchGenderValueFailed());
      }
    } catch (e) {
      dispatch(fetchGenderValueFailed());
      console.log("fetchGenderValueStart function error: ", e);
    }
  };
  // Redux-getGender-(24): lấy được biến data rồi thì ra sẽ lưu nó vào redux, về file adminReducer
};

export const fetchGenderValueSuccessfully = (genderData) => ({
  type: actionTypes.FETCH_GENDER_VALUE_SUCCESSFULLY,
  data: genderData,
});
export const fetchGenderValueFailed = () => ({
  type: actionTypes.FETCH_GENDER_VALUE_FAILED,
});

//Redux-getGender-(5): qua actionTypes khai báo type

//position
export const fetchPositionValueStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_POSITION_VALUE_START });
      let res = await getAllCodesService("position");
      if (res && res.errCode === 0) {
        dispatch(fetchPositionValueSuccessfully(res.data));
      } else {
        dispatch(fetchPositionValueFailed());
      }
    } catch (e) {
      dispatch(fetchPositionValueFailed());
      console.log("fetchPositionValueStart function error: ", e);
    }
  };
};

export const fetchPositionValueSuccessfully = (positionData) => ({
  type: actionTypes.FETCH_POSITION_VALUE_SUCCESSFULLY,
  data: positionData,
});
export const fetchPositionValueFailed = () => ({
  type: actionTypes.FETCH_POSITION_VALUE_FAILED,
});
//role
export const fetchRoleValueStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_ROLE_VALUE_START });
      let res = await getAllCodesService("role");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleValueSuccessfully(res.data));
      } else {
        dispatch(fetchRoleValueFailed());
      }
    } catch (e) {
      dispatch(fetchRoleValueFailed());
      console.log("fetchRoleValueStart function error: ", e);
    }
  };
};

export const fetchRoleValueSuccessfully = (roleData) => ({
  type: actionTypes.FETCH_ROLE_VALUE_SUCCESSFULLY,
  data: roleData,
});
export const fetchRoleValueFailed = () => ({
  type: actionTypes.FETCH_ROLE_VALUE_FAILED,
});

export const addNewUserByRedux = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Add new user successfully!");
        dispatch(addNewUserSuccessfully());
        dispatch(fetchAllUsersValueStart());
      } else {
        toast.error("Add fail!");
        dispatch(addNewUserFailed());
      }
    } catch (e) {
      toast.error("Add fail!");
      dispatch(addNewUserFailed());
    }
  };
};

export const addNewUserSuccessfully = () => ({
  type: actionTypes.ADD_NEW_USER_SUCCESSFULLY,
});

export const addNewUserFailed = () => ({
  type: actionTypes.ADD_NEW_USER_FAILED,
});

export const fetchAllUsersValueStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsersToDisplayInReact("ALL");
      if (res && res.errCode === 0) {
        //đảo ngược lại để những user được thêm thì chèn lên trên đầu thay vì xuốngc cuối
        dispatch(fetchAllUsersValueSuccessfully(res.users.reverse()));
      } else {
        dispatch(fetchAllUsersValueFailed());
      }
    } catch (e) {
      dispatch(fetchAllUsersValueFailed());
      console.log("fetchAllUsersValueSuccessfully function error: ", e);
    }
  };
};

export const fetchAllUsersValueSuccessfully = (data) => ({
  type: actionTypes.FETCH_ALL_USERS_VALUE_SUCCESSFULLY,
  users: data,
});

export const fetchAllUsersValueFailed = () => ({
  type: actionTypes.FETCH_ALL_USERS_VALUE_FAILED,
});

export const deleteUserByRedux = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      if (res && res.errCode === 0) {
        toast.success("An user has been deleted!");
        dispatch(deleteUserSuccessfully());
        dispatch(fetchAllUsersValueStart());
      } else {
        toast.error("Delete fail!");
        dispatch(deleteUserFailed());
      }
    } catch (e) {
      toast.error("Delete fail");
      dispatch(deleteUserFailed());
    }
  };
};

export const deleteUserSuccessfully = () => ({
  type: actionTypes.DELETE_USER_SUCCESSFULLY,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

export const editUserByRedux = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      if (res && res.errCode === 0) {
        toast.success("An user has been editted!");
        dispatch(editUserSuccessfully());
        dispatch(fetchAllUsersValueStart());
      } else {
        toast.error("Edit fail!");
        dispatch(editUserFailed());
      }
    } catch (e) {
      toast.error("Edit fail");
      dispatch(editUserFailed());
    }
  };
};

export const editUserSuccessfully = () => ({
  type: actionTypes.EDIT_USER_SUCCESSFULLY,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});

// let res_for_doctor_fetching = await getEliteDoctorsForHomePageService('');
//             console.log("Check elitedoctor fetching: ", res_for_doctor_fetching);
export const fetchEliteDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getEliteDoctorsForHomePageService("");
      // console.log("Check res fetch elite doctors: ", res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ELITE_DOCTORS_VALUE_SUCCESSFULLY,
          eliteDoctorsData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ELITE_DOCTORS_VALUE_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch elite doctors data fail: ", e);
      dispatch({
        type: actionTypes.FETCH_ELITE_DOCTORS_VALUE_FAILED,
      });
    }
  };
};

export const fetchAllDoctorsForDoctorArticlePage = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctorsForDoctorArticlePageService();
      // console.log("Check res fetch all doctors: ", res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.GET_All_DOCTORS_FOR_DOCTOR_ARTICLE_PAGE_SUCCESSFULLY,
          allDoctorsData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.GET_All_DOCTORS_FOR_DOCTOR_ARTICLE_PAGE_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch all doctors data fail: ", e);
      dispatch({
        type: actionTypes.GET_All_DOCTORS_FOR_DOCTOR_ARTICLE_PAGE_FAILED,
      });
    }
  };
};

export const saveDoctorDetails = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveInforAndArticleForADoctor(data);
      // console.log("Check save doctor: ", res);
      if (res && res.errCode === 0) {
        toast.success("Doctor's article saved successfully!");
        dispatch({
          type: actionTypes.SAVE_INFOR_AND_ARTICLE_FOR_A_DOCTOR_SUCCESSFULLY,
        });
      } else {
        toast.error("Doctor's article saved fail!");
        dispatch({
          type: actionTypes.SAVE_INFOR_AND_ARTICLE_FOR_A_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      toast.error("Doctor's article saved fail!");
      console.log("Save doctor fail: ", e);
      dispatch({
        type: actionTypes.SAVE_INFOR_AND_ARTICLE_FOR_A_DOCTOR_FAILED,
      });
    }
  };
};

export const fetchDoctorDetailsForDoctorManagePage = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await getInforAndArticleForADoctor(id);
      // console.log("Check doctor details in redux: ", res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_DOCTOR_DETAILS_FOR_DOCTOR_MANAGE_PAGE_SUCCESSFULLY,
          detailsOfADoctor: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_DOCTOR_DETAILS_FOR_DOCTOR_MANAGE_PAGE_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch doctor details fail: ", e);
      dispatch({
        type: actionTypes.FETCH_DOCTOR_DETAILS_FOR_DOCTOR_MANAGE_PAGE_FAILED,
      });
    }
  };
};

export const fetchHoursInAllcodesForScheduleManagePage = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodesService("time");
      // console.log("Check hours in redux: ", res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_HOURS_IN_ALLCODES_FOR_SCHEDULE_MANAGE_PAGE_SUCCESSFULLY,
          examHoursData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_HOURS_IN_ALLCODES_FOR_SCHEDULE_MANAGE_PAGE_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch hours iin allcodes fail: ", e);
      dispatch({
        type: actionTypes.FETCH_HOURS_IN_ALLCODES_FOR_SCHEDULE_MANAGE_PAGE_FAILED,
      });
    }
  };
};

export const createTimeframesForDoctorSchedule = (timeframeForDoctor) => {
  return async (dispatch, getState) => {
    try {
      let res = await createTimeframesForDoctorScheduleService(
        timeframeForDoctor
      );
      // console.log("Check save doctor: ", res);
      if (res && res.errCode === 0) {
        toast.success("Doctor's article saved successfully!");
        dispatch({
          type: actionTypes.CREATE_TIMEFRAMES_FOR_DOCTOR_SCHEDULE_SUCCESSFULLY,
        });
      } else {
        toast.error("Doctor's article saved fail!");
        dispatch({
          type: actionTypes.CREATE_TIMEFRAMES_FOR_DOCTOR_SCHEDULE_FAILED,
        });
      }
    } catch (e) {
      toast.error("Doctor's article saved fail!");
      console.log("Save doctor fail: ", e);
      dispatch({
        type: actionTypes.CREATE_TIMEFRAMES_FOR_DOCTOR_SCHEDULE_FAILED,
      });
    }
  };
};

//lấy dữ liệu cho để chọn cho trang quản lý thông tin và bài báo bác sĩ
export const getRequiredDataForDoctorArticleManagePage = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.GET_REQUIRED_DATA_FOR_DOCTOR_MANAGE_PAGE_START,
      });

      let resPrice = await getAllCodesService("price");
      let resPaymentMethod = await getAllCodesService("payment");
      let resProvince = await getAllCodesService("province");
      let resSpecialty = await getSpecialtiesForHomePageService("");

      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPaymentMethod &&
        resPaymentMethod.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPaymentMethod: resPaymentMethod.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
        };

        dispatch(getRequiredDataForDoctorArticleManagePageSuccessfully(data));
      } else {
        dispatch(getRequiredDataForDoctorArticleManagePageFailed());
      }
    } catch (e) {
      dispatch(getRequiredDataForDoctorArticleManagePageFailed());
      console.log(
        "getDoctorPriceForDoctorArticleManagePage function error: ",
        e
      );
    }
  };
};

export const getRequiredDataForDoctorArticleManagePageSuccessfully = (
  allRequiredData
) => ({
  type: actionTypes.GET_REQUIRED_DATA_FOR_DOCTOR_MANAGE_PAGE_SUCCESSFULLY,
  data: allRequiredData,
});
export const getRequiredDataForDoctorArticleManagePageFailed = () => ({
  type: actionTypes.GET_REQUIRED_DATA_FOR_DOCTOR_MANAGE_PAGE_FAILED,
});

export const fetchSpecialties = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getSpecialtiesForHomePageService("");
      // console.log("Check res fetch specialties: ", res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_SPECIALTIES_VALUE_SUCCESSFULLY,
          specialtiesData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_SPECIALTIES_VALUE_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch specialties data fail: ", e);
      dispatch({
        type: actionTypes.FETCH_SPECIALTIES_VALUE_FAILED,
      });
    }
  };
};

export const fetchRemoteSpecialties = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getRemoteSpecialtiesForHomePageService("");
      console.log("Check res fetch remote specialties: ", res);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_REMOTE_SPECIALTIES_VALUE_SUCCESSFULLY,
          remoteSpecialtiesData: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_REMOTE_SPECIALTIES_VALUE_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch remote specialties data fail: ", e);
      dispatch({
        type: actionTypes.FETCH_REMOTE_SPECIALTIES_VALUE_FAILED,
      });
    }
  };
};

export const getAllRelativeInfoOfCurrentSystemUserAction = (inputEmail) => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllRelativeInforsOfCurrentSystemUserService(
        inputEmail
      );
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.GET_ALL_RELATIVE_INFOR_OF_CURRENT_SYSTEM_USER_SUCCESSFULLY,
          currentSystemUser: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.GET_ALL_RELATIVE_INFOR_OF_CURRENT_SYSTEM_USER_FAILED,
        });
      }
    } catch (e) {
      console.log("Fetch specialties data fail: ", e);
      dispatch({
        type: actionTypes.GET_ALL_RELATIVE_INFOR_OF_CURRENT_SYSTEM_USER_FAILED,
      });
    }
  };
};

export const getBriefInfoOfMedicalFaclityAction = (facilityId) => {
  return async (dispatch, getState) => {
    try {
      let res = await getInfoOfMedicalFacility(facilityId);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.GET_BRIEF_INFO_OF_MEDICAL_FACILITY_SUCCESSFULLY,
          medicalFacilityInfo: res.infor,
        });
      } else {
        dispatch({
          type: actionTypes.GET_BRIEF_INFO_OF_MEDICAL_FACILITY_FAILED,
        });
      }
    } catch (e) {
      console.log("Get medical facility brief data fail: ", e);
      dispatch({
        type: actionTypes.GET_BRIEF_INFO_OF_MEDICAL_FACILITY_FAILED,
      });
    }
  };
};

export const getRequiredDataForExamPackageManagePage = () => {
  return async (dispatch, getState) => {
    try {
      let resPrice = await getAllCodesService("price");
      let resMedicalFacility = await getInfoOfMedicalFacility("ALL");
      let resSpecialty = await getSpecialtiesForHomePageService("");

      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPrice &&
        resPrice.errCode === 0 &&
        resMedicalFacility &&
        resMedicalFacility.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resMedicalFacility: resMedicalFacility.infor,
          resSpecialty: resSpecialty.data,
        };

        dispatch({
          type: actionTypes.GET_ALL_RELATIVE_INFOR_FOR_A_EXAM_PACKAGE_SUCCESSFULLY,
          data: data,
        });
      } else {
        dispatch({
          type: actionTypes.GET_ALL_RELATIVE_INFOR_FOR_A_EXAM_PACKAGE_FAIL,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.GET_ALL_RELATIVE_INFOR_FOR_A_EXAM_PACKAGE_FAIL,
      });
      console.log(
        "getRequiredDataForExamPackageManagePage function error: ",
        e
      );
    }
  };
};

export const getAllExamPackage = (inputId) => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllExamPackageService(inputId);
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.GET_ALL_EXAM_PACKAGE_SUCCESFULLY,
          data: res.infor,
        });
      } else {
        dispatch({
          type: actionTypes.GET_ALL_EXAM_PACKAGE_FAIL,
        });
      }
    } catch (e) {
      console.log("Get all package data fail: ", e);
      dispatch({
        type: actionTypes.GET_ALL_EXAM_PACKAGE_FAIL,
      });
    }
  };
};
