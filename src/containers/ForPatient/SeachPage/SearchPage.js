import { connect } from "react-redux";
import React, { Component } from "react";
import "./SearchPage.scss";
import HomePageHeader from "../../HomePage/HomePageHeader/HomePageHeader";
import CustomScrollbars from "../../../components/CustomScrollbars";
import HomeFooter from "../../../containers/HomePage/HomeFooter/HomeFooter";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialtyList: [],
      medicalFacilityList: [],
      doctorList: [],
      packageList: [],
      searchTerm: "",
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    return (
      <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
        <HomePageHeader isShowBanner={false} />
        <div className="search-page-container">
          <div className="search-bar-container">
            <div className="search-bar">
              <input type="text" placeholder="Tìm kiếm..."></input>
              <select id="basic-select">
                <option value="all">Tất cả</option>
                <option value="name">Theo tên</option>
                <option value="category">Theo danh mục</option>
              </select>
            </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
