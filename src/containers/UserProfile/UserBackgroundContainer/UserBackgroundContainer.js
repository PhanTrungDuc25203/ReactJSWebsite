import React from "react";
import "./UserBackgroundContainer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import { FormattedMessage } from "react-intl";

const UserBackgroundContainer = ({ currentUserEmail, currentUserName, currentUserAvatar }) => {
    let imageByBase64 = "";
    if (currentUserAvatar) {
        imageByBase64 = Buffer.from(currentUserAvatar, "base64").toString("binary");
    }

    return (
        <React.Fragment>
            <div className="background-and-avatar-container">
                <div className="background-section"></div>
                <div className="avatar-and-name">
                    <div
                        className="avatar-section"
                        style={{
                            backgroundImage: `url(${imageByBase64 ? imageByBase64 : defaultAvatar})`,
                        }}
                    ></div>
                    <div className="infor-section">
                        <div className="name">{currentUserName ? currentUserName : ""}</div>
                        <div className="email">
                            <FontAwesomeIcon icon={faEnvelope} className="envelope-icon" />
                            {currentUserEmail ? currentUserEmail : ""}
                        </div>
                        <div className="edit-profile">
                            <button>
                                <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
                                <FormattedMessage id="personal-info-page.edit-personal-info" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UserBackgroundContainer;
