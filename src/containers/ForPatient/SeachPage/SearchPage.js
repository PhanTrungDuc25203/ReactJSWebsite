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
import { MoonLoader } from "react-spinners";

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
      isLoading: true,
      color: "#123abc",
      size: 25,
    };
    this.typingTimeout = null;
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let searchterm = urlParams.get("searchterm") || "";
      let filter = urlParams.get("filter") || "";

      this.setState(
        {
          searchterm,
          filter,
          isLoading: true,
        },
        () => {
          this.props.search(this.state.searchterm, this.state.filter);
        }
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchResult !== this.props.searchResult) {
      this.setState({
        searchResult: this.props.searchResult,
        isLoading: false,
      });
    }
  }

  handleOnChangeSearchInput = (event) => {
    let value = event.target.value;
    this.setState({ searchterm: value });

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      // chỉ gọi API khi searchterm khác rỗng
      if (value.trim() !== "") {
        this.setState({ isLoading: true });

        this.props.history.push({
          pathname: this.props.location.pathname,
          search: `?searchterm=${value}&filter=${this.state.filter}`,
        });

        this.props.search(value, this.state.filter);
      }
    }, 1000);
  };

  handleOnChangeFilter = (event) => {
    let value = event.target.value;
    this.setState({ filter: value, isLoading: true }, () => {
      // update URL
      this.props.history.push({
        pathname: this.props.location.pathname,
        search: `?searchterm=${this.state.searchterm}&filter=${value}`,
      });

      this.props.search(this.state.searchterm, value);
    });
  };

  render() {
    // console.log("check search result: ", this.state.searchResult);
    let { filter, isLoading, color, size } = this.state;
    let {
      specialty = { tag: "none", data: [] },
      exam_package = { tag: "none", data: [] },
      doctor = { tag: "none", data: [] },
      complex_facility = { tag: "none", data: [] },
    } = this.state.searchResult || {};
    let { language } = this.props;

    const results = [specialty, exam_package, doctor, complex_facility];

    const allNone = results.every((r) => r.tag === "none");
    const hasExact = results.some((r) => r.tag === "exact");
    const hasResemble = results.some((r) => r.tag === "resemble");

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
                onChange={this.handleOnChangeSearchInput}
                id="search-term"
              />
              <select
                id="basic-select"
                value={filter}
                onChange={this.handleOnChangeFilter}
              >
                <option value="">Tất cả</option>
                <option value="doctor">Bác sĩ</option>
                <option value="exam_package">Gói khám</option>
                <option value="complex_facility">Cơ sở y tế</option>
                <option value="specialty">Chuyên khoa</option>
                {/* <option value="chatbot">Trợ lý AI</option> */}
              </select>
            </div>
          </div>

          <div className="search-result-container">
            {this.state.isLoading ? (
              <div className="spinner-container">
                <MoonLoader
                  color={color}
                  loading={isLoading}
                  size={size}
                  aria-label="Loading Spinner"
                />
              </div>
            ) : (
              <>
                {allNone && (
                  <p className="no-result-text">Không tìm thấy kết quả.</p>
                )}

                {/* TH2: Chỉ có resemble, không có exact */}
                {!hasExact && hasResemble && (
                  <p className="no-exact-text">
                    Không tìm thấy kết quả chính xác. Kết quả gần tương đồng:
                  </p>
                )}

                {/* Hiển thị kết quả theo filter */}
                {(filter === "" || filter === "specialty") &&
                  specialty.tag !== "none" && (
                    <SpecialtyResult specialtyResult={specialty} />
                  )}

                {(filter === "" || filter === "doctor") &&
                  doctor.tag !== "none" && (
                    <DoctorResult doctorResult={doctor} />
                  )}

                {(filter === "" || filter === "exam_package") &&
                  exam_package.tag !== "none" && (
                    <ExamPackageResult examPackageResult={exam_package} />
                  )}

                {(filter === "" || filter === "complex_facility") &&
                  complex_facility.tag !== "none" && (
                    <MedicalFacilityResult facilityResult={complex_facility} />
                  )}
              </>
            )}
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
