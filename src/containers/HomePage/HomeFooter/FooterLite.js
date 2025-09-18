import React, { Component } from "react";
import { connect } from "react-redux";
import "./FooterLite.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {} from "@fortawesome/fontawesome-free-webfonts";
import {} from "@fortawesome/fontawesome-svg-core";
import {} from "@fortawesome/free-regular-svg-icons";
import {
  faTooth,
  faHeartPulse,
  faSuitcaseMedical,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { switchLanguageOfWebsite } from "../../../store/actions";

class FooterLite extends Component {
  render() {
    return (
      <div className="homepage-footer">
        <footer className="footer">
          <div className="home-footer">
            <p>&copy; 2024-Medical care.</p>
            <a href="#" target="_blank">
              &#8594; <FormattedMessage id="footer.check-out-me" />
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterLite);
