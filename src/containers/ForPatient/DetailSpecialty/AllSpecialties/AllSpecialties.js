import React, { Component } from "react";
import { connect } from "react-redux";
import HomePageHeader from "../../../HomePage/HomePageHeader/HomePageHeader";
import "./AllSpecialties.scss";
import HomeFooter from "../../../HomePage/HomeFooter/HomeFooter";
import { getSpecialtiesForHomePageService } from "../../../../services/userService";
import CustomScrollbars from "../../../../components/CustomScrollbars";
import { FormattedMessage } from "react-intl";

class AllSpecialties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSpecialty: [],
            filteredSpecialtyData: [],
            searchKeyword: "",
        };

        this.searchTimeout = null;
    }

    async componentDidMount() {
        const res = await getSpecialtiesForHomePageService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                allSpecialty: res.data,
                filteredSpecialtyData: res.data,
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
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    handleSearchChange = (event) => {
        const keyword = event.target.value;

        this.setState({ searchKeyword: keyword });

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.performSearch(keyword);
        }, 500);
    };

    performSearch = (keyword) => {
        const { allSpecialty } = this.state;

        if (!keyword || keyword.trim() === "") {
            this.setState({
                filteredSpecialtyData: allSpecialty,
            });
            return;
        }

        const normalizedKeyword = this.removeVietnameseTones(keyword.trim().toLowerCase());

        const filteredData = allSpecialty.filter((item) => {
            if (!item.name) return false;

            const normalizedName = this.removeVietnameseTones(item.name.toLowerCase());

            return normalizedName.includes(normalizedKeyword);
        });

        this.setState({
            filteredSpecialtyData: filteredData,
        });
    };

    handleViewDetailArticleOfASpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty-article/${specialty.id}`);
    };

    render() {
        const { filteredSpecialtyData, searchKeyword } = this.state;

        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                    <HomePageHeader isShowBanner={false} />

                    <div className="all-specialties-container">
                        <div className="all-specialties-container-header">
                            <div className="all-specialties-container-title">
                                <FormattedMessage id="specialty.all-specialty-page.title" />
                            </div>
                            <div className="all-specialties-search">
                                <FormattedMessage id="specialty.all-specialty-page.search-placeholder">{(text) => <input type="text" placeholder={text} value={searchKeyword} onChange={this.handleSearchChange} className="search-input" />}</FormattedMessage>
                            </div>
                        </div>

                        {filteredSpecialtyData &&
                            filteredSpecialtyData.length > 0 &&
                            filteredSpecialtyData.map((item, index) => {
                                let imageByBase64 = "";
                                if (item.specialtyImage) {
                                    imageByBase64 = Buffer.from(item.specialtyImage, "base64").toString("binary");
                                }

                                return (
                                    <div className="specialty-item-container" key={index} onClick={() => this.handleViewDetailArticleOfASpecialty(item)}>
                                        <div className="specialty-item">
                                            <div
                                                className="image image-css"
                                                style={{
                                                    backgroundImage: `url(${imageByBase64})`,
                                                }}
                                            ></div>
                                            <div className="medical-facility-name">{item.name}</div>
                                        </div>
                                    </div>
                                );
                            })}

                        {filteredSpecialtyData.length === 0 && (
                            <div className="no-result">
                                <FormattedMessage id="specialty.all-specialty-page.no-result-found" />
                            </div>
                        )}
                    </div>

                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(AllSpecialties);
