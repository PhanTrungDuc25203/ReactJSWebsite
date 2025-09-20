import { connect } from "react-redux";
import React, { Component } from "react";
import "./SearchPage.scss";
import HomePageHeader from "../../HomePage/HomePageHeader/HomePageHeader";
import CustomScrollbars from "../../../components/CustomScrollbars";
import HomeFooter from "../../../containers/HomePage/HomeFooter/HomeFooter";
import * as actions from "../../../store/actions";
import SpecialtyResult from "./SearchResultComponent/SpecialtyResult";
import DoctorResult from "./SearchResultComponent/DoctorResult";
import ExamPackageResult from "./SearchResultComponent/ExamPackageResult";
import MedicalFacilityResult from "./SearchResultComponent/MedicalFacilityResult";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      specialtyList: [],
      medicalFacilityList: [],
      doctorList: [],
      packageList: [],
      searchterm: "",
      searchResult: {},
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let searchterm = urlParams.get("searchterm") || "";
      let filter = urlParams.get("filter") || "";

      this.setState({
        searchterm,
        filter,
      });
      this.props.search(searchterm, filter);
      // console.log("check props: ", this.props);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.searchResult !== this.props.searchResult) {
      this.setState({
        searchResult: this.props.searchResult,
      });
    }
  }

  handleOnChangeSearchInput = () => {};

  render() {
    // console.log("check search result home page: ", this.state.searchResult);
    let specialtyResult = this.state.searchResult.specialty;
    let examPackageResult = this.state.searchResult.exam_package;
    let doctorResult = this.state.searchResult.doctor;
    let facilityResult = this.state.searchResult.complex_facility;

    return (
      <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
        <HomePageHeader isShowBanner={false} />
        <div className="search-page-container">
          <div className="search-bar-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={this.state.searchterm}
                onChange={(event) => this.handleOnChangeSearchInput(event)}
                id="search-term"
              ></input>
              <select id="basic-select">
                <option value="">Tất cả</option>
                <option value="doctor">Bác sĩ</option>
                <option value="exam_package">Gói khám</option>
                <option value="complex_facility">Cơ sở y tế</option>
                <option value="specialty">Chuyên khoa</option>
              </select>
            </div>
          </div>
          <div className="search-result-container">
            <SpecialtyResult specialtyResult={specialtyResult} />
            <DoctorResult doctorResult={doctorResult} />
            <ExamPackageResult examPackageResult={examPackageResult} />
            <MedicalFacilityResult facilityResult={facilityResult} />
          </div>
        </div>
        <HomeFooter />
      </CustomScrollbars>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    searchResult: state.search.allServiceFilterSearchResult,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    search: (searchterm, filter) =>
      dispatch(
        actions.fetchDataForAllMedicalServiceFilterSearch(searchterm, filter)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
