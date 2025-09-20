import { connect } from "react-redux";
import React, { Component } from "react";
import "../SearchPage.scss";

class SpecialtyResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    // console.log("Check specialty props: ", this.props.specialtyResult);
    let { specialtyResult } = this.props;

    if (!specialtyResult || !specialtyResult.data) {
      return null;
    }

    return (
      <div className="specialty-result-container">
        <p className="result-section-title">Chuyên khoa</p>
        {specialtyResult.data.map((item) => {
          let imageByBase64 = "";
          if (item.specialtyImage && item.specialtyImage.data) {
            imageByBase64 = Buffer.from(item.specialtyImage, "base64").toString(
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyResult);
