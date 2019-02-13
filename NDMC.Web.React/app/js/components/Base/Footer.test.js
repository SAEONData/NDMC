import React from 'react'
import { shallow } from 'enzyme'

import Footer from './Footer'

describe('Footer', () => {
  it('should always render at bottom of page', () => {
    const footer = shallow(<Footer />)

    expect(footer).toMatchSnapshot()
  })
})
