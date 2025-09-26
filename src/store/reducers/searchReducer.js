import actionTypes from "../actions/actionTypes";

const initialState = {
    allServiceFilterSearchResult: {},
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ALL_MEDICAL_SERVICE_FILTER_SEARCH_SUCCESSFULLY:
            state.allServiceFilterSearchResult = action.data;
            // console.log("check search reducer: ", action.data);
            return {
                ...state,
            };
        case actionTypes.ALL_MEDICAL_SERVICE_FILTER_SEARCH_FAILED:
            state.isLoadingGendallServiceFilterSearchResulterValue = {};
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default searchReducer;
