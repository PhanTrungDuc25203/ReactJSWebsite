import React from 'react';
import './UserBackgroundContainer.scss'; // Đường dẫn đến file CSS
import CustomScrollbars from '../../../components/CustomScrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const UserBackgroundContainer = ({ width = 400, height = 200, riverWidth = 10, curveHeight = 50, imageUrl }) => {
    const riverPath = `
        M ${width / 2} 0 
        C ${width / 2 - 30} ${height / 4}, ${width / 2 + 30} ${height / 2}, ${width / 2} ${height} 
    `;

    return (
        <React.Fragment>
            <div className="background-and-avatar-container">
                <div className="background-section">

                </div>
                <div className="avatar-and-name">
                    <div className="avatar-section">

                    </div>
                    <div className="infor-section">
                        <div className="name">Phan Trung Duc</div>
                        <div className="email"><FontAwesomeIcon icon={faEnvelope} className="envelope-icon"/>phanpiscean@gmail.com</div>
                        <div className="edit-profile"><button><FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />Chỉnh sửa thông tin của bạn</button></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserBackgroundContainer;
