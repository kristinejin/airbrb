import React from 'react'
import { shallow } from 'enzyme'
import CreateDialog, { ListingActionButton } from '../component/CreateDialog'
import { defaultThumbnail } from '../util/defaultThumbnail'

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

    // make sure the thumbnail image is not present when there is no listing info passed in as prop
    const thumbnail = wrapper.find('#listingEditThumbnail')
    expect(thumbnail).toHaveLength(0)

    // check thumbnail type have been changed to video
    expect(select2.prop('checked')).toEqual(true)
    expect(video2).toHaveLength(1)
    expect(image2).toHaveLength(0)
  })

  it('should render thumbnail and images when listing info is given', () => {
    const mock = jest.fn()
    const listingInfo = {
      title: 'title',
      address: {
        street: 'street',
        city: 'city',
        state: 'state',
        postcode: 2020,
        country: 'country',
      },
      price: 200,
      thumbnail: defaultThumbnail,
      metadata: {
        propertyType: 'type',
        numBaths: 2,
        numBedroom: 2,
        numBeds: 2,
        amenities: 'string',
        bedrooms: [],
        images: [],
        video: undefined,
      },
    }

    const wrapper = shallow(
      <CreateDialog callCreateListing={mock} listingInfo={listingInfo} />
    )

    // check thumbnail and images are present in edit mode
    const thumbnail = wrapper.find('#listingEditThumbnail')
    expect(thumbnail).toHaveLength(1)
    const imageTitle = wrapper.find('#listingEditImagesTitle')
    expect(imageTitle).toHaveLength(1)
    const imageUpload = wrapper.find('#listingEditUploadImage')
    expect(imageUpload).toHaveLength(1)
  })
})
