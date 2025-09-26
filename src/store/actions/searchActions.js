import actionTypes from "./actionTypes";
import { allMedicalServiceFilterSearch } from "../../services/searchService";

// ALL_MEDICAL_SERVICE_FILTER_SEARCH_SUCCESSFULLY

export const fetchDataForAllMedicalServiceFilterSearch = (searchterm, filter) => {
    return async (dispatch, getState) => {
        try {
            let res = await allMedicalServiceFilterSearch(searchterm, filter);

            // console.log("Check search data: ", res);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.ALL_MEDICAL_SERVICE_FILTER_SEARCH_SUCCESSFULLY,
                    data: res.data,
                });
            } else {
                dispatch({
                    type: actionTypes.ALL_MEDICAL_SERVICE_FILTER_SEARCH_FAILED,
                });
            }
        } catch (e) {
            console.log("Fetch all data for all service filter search fail: ", e);
            dispatch({
                type: actionTypes.ALL_MEDICAL_SERVICE_FILTER_SEARCH_FAILED,
            });
        }
    };
};
