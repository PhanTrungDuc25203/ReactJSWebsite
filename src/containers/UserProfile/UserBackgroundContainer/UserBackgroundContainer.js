import React from 'react';
import './UserBackgroundContainer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const UserBackgroundContainer = ({ currentUserEmail, currentUserName }) => {
    return (
        <React.Fragment>
            <div className="background-and-avatar-container">
                <div className="background-section">

                </div>
                <div className="avatar-and-name">
                    <div className="avatar-section">
                        {/* Avatar */}
                    </div>
                    <div className="infor-section">
                        <div className="name">
                            {currentUserName ? currentUserName : ''}
                        </div>
                        <div className="email">
                            <FontAwesomeIcon icon={faEnvelope} className="envelope-icon" />
                            {currentUserEmail ? currentUserEmail : ''}
                        </div>
                        <div className="edit-profile">
                            <button>
                                <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
                                Chỉnh sửa thông tin của bạn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserBackgroundContainer;
