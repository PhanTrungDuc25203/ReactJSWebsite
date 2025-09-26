import axios from "../axios";

const allMedicalServiceFilterSearch = (searchterm, filter) => {
    return axios.get(`/api/all-medical-services-filter-search?searchterm=${searchterm}&filter=${filter}`);
};
export { allMedicalServiceFilterSearch };
