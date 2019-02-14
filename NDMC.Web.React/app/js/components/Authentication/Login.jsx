import React from 'react'
import { connect } from 'react-redux'
import { Button, Input } from 'mdbreact'
import userManager from '../Authentication/userManager'

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

class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    //Hide loading and redirect to IDS
    this.props.updateNav(location.hash)
    this.props.setLoading(false)
    userManager.signinRedirect()
  }

  render() {

    return (
      <>
        <br />
        <label style={{ marginLeft: "22px" }}>Redirecting...</label>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)