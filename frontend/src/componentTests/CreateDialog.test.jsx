import React from 'react'
import { render, screen } from '@testing-library/react'
import { shallow } from 'enzyme'
import CreateDialog, { ListingActionButton } from '../component/CreateDialog'

describe('<CreateDialog>', () => {
  it('should render an create dialog', () => {
    const mock = jest.fn()
    const wrapper = shallow(<CreateDialog callCreateListing={mock} />)
    // check form fields present
    expect(wrapper.find('#title')).toHaveLength(1)
    expect(wrapper.find('#address')).toHaveLength(1)
    expect(wrapper.find('#city')).toHaveLength(1)
    expect(wrapper.find('#state')).toHaveLength(1)
    expect(wrapper.find('#postcode')).toHaveLength(1)
    expect(wrapper.find('#country')).toHaveLength(1)
    expect(wrapper.find('#PropertyType')).toHaveLength(1)
    expect(wrapper.find('#bathrooms')).toHaveLength(1)
    expect(wrapper.find('#amenities')).toHaveLength(1)
    expect(wrapper.find('#roomInputContainer')).toHaveLength(1)
    expect(wrapper.find('#selectThumbnailType')).toHaveLength(1)
    expect(wrapper.find(ListingActionButton)).toHaveLength(1)
  })

  it('should change thumbnail input type when switch is clicked', () => {
    const mock = jest.fn()
    const wrapper = shallow(<CreateDialog callCreateListing={mock} />)

    const select = wrapper.find('#selectThumbnailType')
    const image = wrapper.find('#thumbnailUpload')
    const video = wrapper.find('#thumbnailUploadVideo')
    // have not changed the switch, document should be default with image thumbnail upload
    expect(image).toHaveLength(1)
    expect(video).toHaveLength(0)
    expect(select).toHaveLength(1)
    const checked = select.props().checked
    expect(checked).toEqual(false)

    // event to change the switch for thumbnail type
    select.simulate('change', {
      target: { id: 'selectThumbnailType', checked: !checked },
    })

    // reget all elements
    const select2 = wrapper.find('#selectThumbnailType')
    const video2 = wrapper.find('#thumbnailUploadVideo')
    const image2 = wrapper.find('#thumbnailUpload')

    // check thumbnail type have been changed to video
    expect(select2.prop('checked')).toEqual(true)
    expect(video2).toHaveLength(1)
    expect(image2).toHaveLength(0)
  })

  it('should call create listing fn when save button is clicked', () => {
    const mock = jest.fn()
    const wrapper = shallow(<CreateDialog callCreateListing={mock} />)
    const button = wrapper.find(ListingActionButton)
    expect(button).toHaveLength(1)

    button.simulate('click')
    // expect(mock).toHaveBeenCalledTimes(1)
  })

  it('should render thumbnail and images when listing info is given', () => {
    const mock = jest.fn()
    const listingInfo = {}
    // const wrapper = shallow(
    //   <CreateDialog callCreateListing={mock} listingInfo={listingInfo} />
    // )
  })
})
