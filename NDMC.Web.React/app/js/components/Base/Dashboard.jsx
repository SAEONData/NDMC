'use strict'

import React from 'react'

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <>
        <br />
        <div className="jumbotron">
          <h1>NDMC Data Service ##</h1>
          <p className="lead">
            Home of the NDMC Web site
            <br />
            A project by SAEON
          </p>
          <p>
            <a href="http://www.saeon.ac.za" className="btn btn-primary btn-sm" style={{ width: "150px" }}>SAEON</a>
            <a href="http://www.environment.gov.za/" className="btn btn-primary btn-sm" style={{ width: "150px" }}>DEA</a>
          </p>
        </div>
      </>
    )
  }
}

export default Dashboard