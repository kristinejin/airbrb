import React from 'react'
import { render, screen } from '@testing-library/react'
import { shallow } from 'enzyme'
import UploadListing, {
  CancelButton,
  CloseButton,
} from '../component/UploadListing'

describe('<UploadListing>', () => {
  it('should render an upload listing modal', () => {
    const mock = jest.fn()
    const wrapper = shallow(<UploadListing open={true} handleClose={mock} />)
    const input = wrapper.find('input')
    expect(input).toHaveLength(1)
    const file = input.find('[type="file"]')
    expect(file).toHaveLength(1)
    const sample = wrapper.find('a')
    expect(sample).toHaveLength(1)
    expect(sample.prop('href')).toBe('sample.json')
  })

  it('should close modal when close buttons are being clicked', () => {
    const mock = jest.fn()
    const wrapper = shallow(<UploadListing open={true} handleClose={mock} />)

    const close = wrapper.find(CloseButton)
    close.simulate('click')
    expect(mock).toHaveBeenCalledTimes(1)
    const cancel = wrapper.find(CancelButton)
    cancel.simulate('click')
    expect(mock).toHaveBeenCalledTimes(2)
  })
})
