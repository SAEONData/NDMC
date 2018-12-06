'use strict'

//React
import React from 'react'
import { Button, Input } from 'mdbreact'
import { connect } from 'react-redux'
import { Table, TableBody, TableHead } from 'mdbreact';

//Local
import TextComponent from '../../Shared/TextComponent.jsx'
import TextAreaComponent from '../../Shared/TextAreaComponent.jsx'
import RangeComponent from '../../Shared/RangeComponent.jsx'

//Odata
import OData from 'react-odata'
import { apiBaseURL } from '../../../config/serviceURLs.cfg'

const mapStateToProps = (state, props) => {
  return {}
}

class EventResponseTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eventData: {}
    }
  }

  render() {
    const { eventId } = this.props
    let impactQuery = {
      filter: {
        EventId: parseInt(eventId),
      },
      expand: ['EventRegions/EventImpacts/TypeImpact',
        {
          EventRegions:
          {
            filter: { Region: { RegionTypeId: { ne: 5 } } },
            expand: ['Region']
          }
        },
      ]
    }

    const formatter = new Intl.NumberFormat('en-Za', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    })

    let impacts = []
    let agricultureImpacts = []
    let infrastrucutureImpacts = []
    let gameImpacts = []
    let peopleImpacts = []
    return (
      <>
        <div style={{
          backgroundColor: "white",
          borderBottom: "1px solid silver",
          borderLeft: "1px solid silver",
          borderRight: "1px solid silver",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          padding: "10px",
          marginTop: "-10px"
        }}>
          <OData baseUrl={apiBaseURL + 'Events'} query={impactQuery}>
            {({ loading, error, data }) => {

              if (loading) { return <div>Loading...</div> }

              if (error) { return <div>Error Loading Data From Server</div> }

              if (data && data.value) {
                data.value[0].EventRegions[0].EventImpacts.map(impact => {
                  let amountMeasure = ''
                  switch (impact.TypeImpact.UnitOfMeasure) {
                    case 'Hectare':
                      amountMeasure = '(Hectares)'
                      break
                    case 'Count':
                      amountMeasure = '(Count)'
                      break
                    case 'Meters':
                      amountMeasure = '(Meters)'
                      break
                    case 'Rands':
                      amountMeasure = formatter.format(impact.Measure)
                      break
                    default:
                      amountMeasure = '(Count)'
                  } 
                  //console.log(impact)
                  // Agriculture
                  if(impact.TypeImpact.ParentTypeImpactId === 36 || impact.TypeImpactId === 36 ){
                    agricultureImpacts.push({
                      impact: impact.TypeImpact.TypeImpactName,
                      amount: impact.Measure && impact.Measure !== 0 ?
                      `${impact.Measure} ${amountMeasure}`
                      : 'No amount recorded'
                    })
                  }
                  // Infrastrucutre
                  if(impact.TypeImpact.ParentTypeImpactId === 54 || impact.TypeImpactId === 54){
                    infrastrucutureImpacts.push({
                      impact: impact.TypeImpact.TypeImpactName,
                      amount: impact.Measure && impact.Measure !== 0 ?
                      `${impact.Measure} ${amountMeasure}`
                      : 'No amount recorded'
                    })
                  }
                  // People
                  if(impact.TypeImpact.ParentTypeImpactId === 60 || impact.TypeImpactId === 60){
                    peopleImpacts.push({
                      impact: impact.TypeImpact.TypeImpactName,
                      amount: impact.Measure && impact.Measure !== 0 ?
                      `${impact.Measure} ${amountMeasure}`
                      : 'No amount recorded'
                    })
                  }
                  // Game
                  if(impact.TypeImpact.ParentTypeImpactId === 14 || impact.TypeImpactId === 14){
                    gameImpacts.push({
                      impact: impact.TypeImpact.TypeImpactName,
                      amount: impact.Measure && impact.Measure !== 0 ?
                      `${impact.Measure} ${amountMeasure}`
                      : 'No amount recorded'
                    })
                  }
                })
                const tableData = {
                  columns: [
                    {
                      label: 'Impact',
                      field: 'impact'
                    },
                    {
                      label: 'Amount',
                      field: 'amount'
                    }
                  ]
                }

                return (<>
                  <br />
                  <div>
                    <div style={{ width: '500px' }}>
                      <h4>People Impacted</h4>
                      {peopleImpacts.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={peopleImpacts.sort((a,b) => (a.impact > b.impact) ? 1 : ((b.impact > a.impact) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <hr />
                    <div style={{ width: '500px' }}>
                      <h4>Agriculture Impacted</h4>
                      {agricultureImpacts.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={agricultureImpacts.sort((a,b) => (a.impact > b.impact) ? 1 : ((b.impact > a.impact) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <hr />
                    <div style={{ width: '500px' }}>
                      <h4>Infrastrucuture Impacted</h4>
                      {infrastrucutureImpacts.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={infrastrucutureImpacts.sort((a,b) => (a.impact > b.impact) ? 1 : ((b.impact > a.impact) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                    <hr />
                    <div style={{ width: '500px' }}>
                      <h4>Game Impacted</h4>
                      {gameImpacts.length > 0 ?
                        <Table small striped>
                          <TableHead color='grey' columns={tableData.columns} />
                          <TableBody rows={gameImpacts.sort((a,b) => (a.impact > b.impact) ? 1 : ((b.impact > a.impact) ? -1 : 0))} />
                        </Table> : <i>None recorded</i>}
                    </div>
                  </div>
                  <br />
                </>
                )
              }
            }}
          </OData>
        </div>
      </>
    )
  }
}

export default connect(mapStateToProps)(EventResponseTab)