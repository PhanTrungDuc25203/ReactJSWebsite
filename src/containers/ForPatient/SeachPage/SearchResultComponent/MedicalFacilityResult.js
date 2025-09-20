import { connect } from "react-redux";
import React, { Component } from "react";
import "../SearchPage.scss";

class MedicalFacilityResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    console.log("Check exampackage props: ", this.props.facilityResult);
    let { facilityResult } = this.props;

    if (!facilityResult || !facilityResult.data) {
      return null;
    }

    return (
      <div className="specialty-result-container">
        <p className="result-section-title">Gói khám</p>
        {facilityResult.data.map((item) => {
          let imageByBase64 = "";
          if (item.image && item.image.data) {
            imageByBase64 = Buffer.from(item.image, "base64").toString(
              "binary"
            );
          }

          return (
            <div key={item.id} className="specialty-item">
              <div
                className="specialty-image"
                style={{
                  backgroundImage: `url(${imageByBase64})`,
                }}
              ></div>
              <div className="specialty-name">{item.name}</div>
            </div>
          );
        })}
      </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MedicalFacilityResult);
