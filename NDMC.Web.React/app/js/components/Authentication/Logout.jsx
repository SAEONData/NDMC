import React from 'react'
import { connect } from 'react-redux'
import userManager from '../Authentication/userManager'

const _gf = require("../../globalFunctions")

const mapStateToProps = (state, props) => {
  let user = state.oidc.user
  return { user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNav: payload => {
      dispatch({ type: "NAV", payload })
    }
  }
}

class Logout extends React.Component {

  constructor(props) {
    super(props);
    this.userSignedOut = this.userSignedOut.bind(this)
    this.state = { signoutRequest: {} }
  }

  userSignedOut() {

    //Back to last page
    let locHash = "#"
    let lastUrl = _gf.ReadLastUrl()
    if (!lastUrl.endsWith("logout")) {
      locHash = lastUrl
    }
    location = locHash
  }

  componentDidMount() {

    let { user } = this.props
    this.props.updateNav(location.hash)

    if (user && !user.expired) {

      //Register signout event
      userManager.events.addUserSignedOut(this.userSignedOut)

      //Get signout url and push to state
      userManager.createSignoutRequest()
        .then(res => {
          if (res) {
            this.setState({ signoutRequest: res })
          }
        })
    }
  }

  componentWillUnmount() {
    //Unregister signout event
    userManager.events.removeUserSignedOut(this.userSignedOut)
  }

  render() {

    let { signoutRequest } = this.state

    return (
      <>
        <br />
        <div style={{ marginLeft: "22px" }}>
          <label>Logging out...</label>
        </div>

        {/* Handle signout in hidden iframe */}
        {signoutRequest !== "" &&
          <iframe hidden src={signoutRequest.url}/>
        }

      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)