import React from 'react';
import '../HealthCheck.scss'
import HomePageHeader from '../../../src/containers/HomePage/HomePageHeader/HomePageHeader'; // Import Header
import HomeFooter from '../../../src/containers/HomePage/HomeFooter/HomeFooter'; // Import Footer
import CustomScrollbars from '../../components/CustomScrollbars'; // Import CustomScrollbars

// Dữ liệu các gói khám
const data = [
    {
        id: 1,
        title: 'Gói khám sức khỏe tổng quát cơ bản cho nam (PKYDIM)',
        location: 'Phòng khám Bệnh viện Đại học Y',
        price: '2.000.000đ',
        imageClass: 'image-1', // Lớp CSS để áp dụng hình ảnh
    },
    {
        id: 2,
        title: 'Gói khám sức khỏe tổng quát cơ bản cho nữ (PKYDIF)',
        location: 'Phòng khám Bệnh viện Đại học Y',
        price: '2.000.000đ',
        imageClass: 'image-2',
    },
    {
        id: 3,
        title: 'Gói khám sức khỏe cho Nữ (NHHM8F)',
        location: 'Bệnh viện Nam học và Hiếm muộn...',
        price: '1.400.000đ',
        imageClass: 'image-3',
    },
    {
        id: 4,
        title: 'Gói khám sức khỏe cho Nam (NHHM8M)',
        location: 'Bệnh viện Nam học và Hiếm muộn...',
        price: '1.500.000đ',
        imageClass: 'image-4',
    },
    {
        id: 5,
        title: 'Gói khám sức khỏe tiền hôn nhân cho Nam (NHHM8M)',
        location: 'Bệnh viện Nam học và Hiếm muộn...',
        price: '1.200.000đ',
        imageClass: 'image-5',
    },
    {
        id: 6,
        title: 'Gói khám tiết niệu cho Nam (NHHM9M)',
        location: 'Bệnh viện Nam học và Hiếm muộn...',
        price: '1.700.000đ',
        imageClass: 'image-6',
    },
];

const HealthCheck = () => {
    return (
        <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
            {/* Header */}
            <HomePageHeader isShowBanner={false} />
            {/* Nội dung chính */}
            <div className="container">
                <h2 className="highlighted-title">Gói Khám Nổi Bật</h2>
                {data.map((item) => (
                    <div key={item.id} className={`card ${item.imageClass}`}>
                        {/* Ảnh hiển thị qua lớp CSS */}
                        <div className="card-image"></div>
                        {/* Nội dung thông tin */}
                        <div className="card-content">
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-location">{item.location}</p>
                            <p className="card-price">
                                Giá: <strong>{item.price}</strong>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <HomeFooter />
        </CustomScrollbars>
    );
};

export default HealthCheck;
