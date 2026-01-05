import React, { Component } from "react";
import { connect } from "react-redux";
import HomePageHeader from "../../../HomePage/HomePageHeader/HomePageHeader";
import "./AllMedicalFacilities.scss";
import HomeFooter from "../../../HomePage/HomeFooter/HomeFooter";
import { getInfoOfMedicalFacility } from "../../../../services/userService";
import CustomScrollbars from "../../../../components/CustomScrollbars";
import { FormattedMessage } from "react-intl";

class AllMedicalFacilities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allMedicalFacilityData: [],
            filteredMedicalFacilityData: [],
            currentPage: 1, // Trang hiện tại
            itemsPerPage: 8, // Số item tối đa trên mỗi trang
            searchKeyword: "",
        };

        this.searchTimeout = null;
    }

    async componentDidMount() {
        let res = await getInfoOfMedicalFacility("ALLANDIMAGEBUTSHORT");
        if (res.errCode === 0) {
            const expandedData = res.infor.concat(res.infor, res.infor, res.infor, res.infor);
            this.setState({
                allMedicalFacilityData: expandedData,
                filteredMedicalFacilityData: expandedData,
            });
        }
    }

    componentWillUnmount() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    removeVietnameseTones = (str) => {
        if (!str) return "";

        return str
            .normalize("NFD") // tách chữ + dấu
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    handleSearchChange = (event) => {
        const keyword = event.target.value;

        this.setState({
            searchKeyword: keyword,
        });

        // Clear debounce cũ
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce 2 giây
        this.searchTimeout = setTimeout(() => {
            this.performSearch(keyword);
        }, 500);
    };

    performSearch = (keyword) => {
        const { allMedicalFacilityData } = this.state;

        if (!keyword || keyword.trim() === "") {
            this.setState({
                filteredMedicalFacilityData: allMedicalFacilityData,
                currentPage: 1,
            });
            return;
        }

        const normalizedKeyword = this.removeVietnameseTones(keyword.trim().toLowerCase());

        const filteredData = allMedicalFacilityData.filter((item) => {
            if (!item.name) return false;

            const normalizedName = this.removeVietnameseTones(item.name.toLowerCase());

            return normalizedName.includes(normalizedKeyword);
        });

        this.setState({
            filteredMedicalFacilityData: filteredData,
            currentPage: 1,
        });
    };

    handleViewDetailArticleOfAFacility = (facility) => {
        this.props.history.push(`/detail-medical-facility/${facility}`);
    };

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    renderPagination = () => {
        const { filteredMedicalFacilityData, itemsPerPage, currentPage } = this.state;
        const totalPages = Math.ceil(filteredMedicalFacilityData.length / itemsPerPage);

        return (
            <div className="pagination-container">
                <button onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
                    <FormattedMessage id="medical-facility.all.previous-btn" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => this.handlePageChange(index + 1)} className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => this.handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
                    <FormattedMessage id="medical-facility.all.next-btn" />
                </button>
            </div>
        );
    };

    render() {
        const { filteredMedicalFacilityData, currentPage, itemsPerPage } = this.state;

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentData = filteredMedicalFacilityData.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="all-medical-facilities-container">
                        <div className="all-medical-facilities-container-header">
                            <div className="all-medical-facilities-container-title">
                                <FormattedMessage id="medical-facility.all.title" />
                            </div>
                            <div className="all-medical-facilities-search">
                                <FormattedMessage id="medical-facility.all.search-placeholder">{(item) => <input type="text" placeholder={item} value={this.state.searchKeyword} onChange={this.handleSearchChange} className="search-input" />}</FormattedMessage>
                            </div>
                        </div>
                        {currentData &&
                            currentData.length > 0 &&
                            currentData.map((item, index) => {
                                let imageByBase64 = "";
                                if (item.image) {
                                    imageByBase64 = Buffer.from(item.image, "base64").toString("binary");
                                }
                                return (
                                    <div className="medical-facility-item-container" key={index} onClick={() => this.handleViewDetailArticleOfAFacility(item.id)}>
                                        <div className="medical-facility-item">
                                            <div
                                                className="image-css"
                                                style={{
                                                    backgroundImage: `url(${imageByBase64})`,
                                                }}
                                            ></div>
                                            <div className="medical-facility-name">{item.name}</div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    {this.renderPagination()}
                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(AllMedicalFacilities);
