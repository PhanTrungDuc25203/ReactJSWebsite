import React, { Component } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../../HomePage/HomePageHeader/HomePageHeader';
import './AllMedicalFacilities.scss';
import HomeFooter from '../../../HomePage/HomeFooter/HomeFooter';
import { getInfoOfMedicalFacility } from '../../../../services/userService';
import CustomScrollbars from '../../../../components/CustomScrollbars';

class AllMedicalFacilities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allMedicalFacilityData: [],
            currentPage: 1, // Trang hiện tại
            itemsPerPage: 8, // Số item tối đa trên mỗi trang
        };
    }

    async componentDidMount() {
        let res = await getInfoOfMedicalFacility('ALLANDIMAGEBUTSHORT');
        if (res.errCode === 0) {
            const expandedData = res.infor.concat(res.infor, res.infor, res.infor, res.infor); // Nhân rộng dữ liệu
            this.setState({
                allMedicalFacilityData: expandedData,
            });
        }
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    renderPagination = () => {
        const { allMedicalFacilityData, itemsPerPage, currentPage } = this.state;
        const totalPages = Math.ceil(allMedicalFacilityData.length / itemsPerPage);

        return (
            <div className="pagination-container">
                <button
                    onClick={() => this.handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Trang trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => this.handlePageChange(index + 1)}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => this.handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Trang sau
                </button>
            </div>
        );
    };

    render() {
        const { allMedicalFacilityData, currentPage, itemsPerPage } = this.state;

        // Tính toán dữ liệu cho trang hiện tại
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentData = allMedicalFacilityData.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="all-medical-facilities-container">
                        <div className="all-medical-facilities-container-title">
                            Bệnh viện & Cơ sở y tế
                        </div>
                        {currentData && currentData.length > 0 &&
                            currentData.map((item, index) => {
                                let imageByBase64 = '';
                                if (item.image) {
                                    imageByBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                }
                                return (
                                    <div className="medical-facility-item-container" key={index}>
                                        <div className="medical-facility-item">
                                            <div
                                                className="image-css"
                                                style={{
                                                    backgroundImage: `url(${imageByBase64})`,
                                                }}
                                            ></div>
                                            <div className="medical-facility-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
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
