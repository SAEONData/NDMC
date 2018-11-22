//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import EventList from './EventList.jsx'
import EventFilters from '../Filters/EventFilters.jsx'

const mapStateToProps = (state, props) => {
  return { }
}

const mapDispatchToProps = (dispatch) => {
  return { }
}

class Events extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <>
        <EventFilters />
        <br/>
        <EventList />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)