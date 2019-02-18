import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import userManager from '../Authentication/userManager'
import { siteBaseURL } from "../../config/serviceURLs";

const _gf = require("../../globalFunctions")

const mapStateToProps = (state, props) => {
  let { globalData: { loading } } = state
  return { loading }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLoading: payload => {
      dispatch({ type: "SET_LOADING", payload })
    },
    updateNav: payload => {
      dispatch({ type: "NAV", payload })
    }
  }
}

class CallbackPage extends React.Component {

  constructor(props) {
    super(props);

    this.successCallbackHandler = this.successCallbackHandler.bind(this);
    this.errorCallbackHandler = this.errorCallbackHandler.bind(this);
  }

  componentDidMount(){
    this.props.updateNav(location.hash)
    
  }

  successCallbackHandler(user) {
    //Redirect
    let locHash = siteBaseURL
    let lastUrl = _gf.ReadLastUrl()
    

    if (!lastUrl.endsWith("logout")) {
      locHash = lastUrl
    }
    location = locHash
  }

  errorCallbackHandler(e) {
    console.log("Login failed!!", e)
    location = "#"
  }

  render() {

    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={this.successCallbackHandler}
        errorCallback={this.errorCallbackHandler}
      >
        <div>
          <br />
          <label style={{ marginLeft: "22px" }}>Logging in...</label>
        </div>

      </CallbackComponent>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage)
