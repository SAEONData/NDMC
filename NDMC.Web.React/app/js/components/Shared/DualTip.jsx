import React from 'react'
import { Button, Fa } from 'mdbreact'
import { Tooltip, Popover } from 'antd'
import { DEAGreen, DEAGreenDark } from '../../config/colours.js'

class DualTip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      clicked: false,
      hovered: false,
    };

    this.handleHoverChange = this.handleHoverChange.bind(this)
    this.handleClickChange = this.handleClickChange.bind(this)
  }

  handleHoverChange(visible) {
    this.setState({
      hovered: visible,
      clicked: false,
    });
  }

  handleClickChange(visible) {
    if (this.props.secondaryTip) {
      this.setState({
        clicked: visible,
        hovered: false,
      });
    }
  }

  render() {

    let { label, primaryTip, secondaryTip, required } = this.props
    let { secondaryVisible } = this.state

    label = label ? label : "label"
    primaryTip = primaryTip ? primaryTip : ""
    secondaryTip = secondaryTip ? secondaryTip : ""

    let color = required === true ? "red" : DEAGreen //"blue-text"

    const hoverContent = (
      <div>
        This is hover content.
      </div>
    );
    const clickContent = (
      <div>
        This is click content.
      </div>
    );

    return (
      <div style={{ marginBottom: 5 }}>
        <table>
          <tbody>
            <tr>
              <td valign="middle">
                {
                  primaryTip &&
                  <Popover
                    style={{ width: 500 }}
                    content={
                      <span>
                        {primaryTip}
                        {
                          required === true &&
                          <span>
                            <br />
                            <b>(REQUIRED)</b>
                          </span>
                        }
                        {
                          secondaryTip &&
                          <span>
                            <br />
                            <br />
                            <i>Click for more info</i>
                          </span>
                        }
                      </span>
                    }
                    trigger="hover"
                    visible={this.state.hovered}
                    onVisibleChange={this.handleHoverChange}
                  >
                    <Popover
                      content={secondaryTip}
                      title="More info"
                      trigger="click"
                      visible={this.state.clicked}
                      onVisibleChange={this.handleClickChange}
                    >
                      <Fa icon="info-circle" size="lg" style={{ marginRight: 5, color: color }} />
                    </Popover>
                  </Popover>
                }
              </td>
              <td valign="middle">
                <span style={{ marginTop: 0.5, fontWeight: "bold" }}>{label}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default DualTip