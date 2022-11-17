import React from 'react'
import CustomDatePicker from '../component/DatePicker'
import { shallow } from 'enzyme'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

describe('<CreateDialog>', () => {
  it('should render a date range picker', () => {
    const mock = jest.fn()
    const dateRange = {
      start: new Date(),
      end: new Date(),
    }
    const wrapper = shallow(
      <CustomDatePicker
        dateRange={dateRange}
        handleOnChangeDateStart={mock}
        handleOnChangeDateEnd={mock}
        availability={[]}
      />
    )

    // check if date pickers are present
    const pickers = wrapper.find(DatePicker)
    expect(pickers).toHaveLength(2)

    // check start and end date to be the date range passed in
    const startPicker = pickers.at(0)
    const endPicker = pickers.at(1)
    expect(startPicker.prop('value')).toEqual(dateRange.start)
    expect(endPicker.prop('value')).toEqual(dateRange.end)

    const newDate = dateRange.end.setDate(32)
    startPicker.simulate('change', newDate)
    endPicker.simulate('change', newDate)

    const pickers2 = wrapper.find(DatePicker)
    const startPicker2 = pickers2.at(0)
    const endPicker2 = pickers2.at(1)
    expect(startPicker2.prop('value')).toEqual(newDate)
    expect(endPicker2.prop('value')).toEqual(newDate)
  })

  it('should change start and end date when new dates are selected', () => {
    const mock = jest.fn()
    const dateRange = {
      start: new Date(),
      end: new Date(),
    }
    const wrapper = shallow(
      <CustomDatePicker
        dateRange={dateRange}
        handleOnChangeDateStart={mock}
        handleOnChangeDateEnd={mock}
        availability={[]}
      />
    )

    const pickers = wrapper.find(DatePicker)
    const startPicker = pickers.at(0)
    const endPicker = pickers.at(1)

    const newDate = dateRange.end.setDate(32)
    startPicker.simulate('change', newDate)
    endPicker.simulate('change', newDate)

    const pickers2 = wrapper.find(DatePicker)
    const startPicker2 = pickers2.at(0)
    const endPicker2 = pickers2.at(1)
    expect(startPicker2.prop('value')).toEqual(newDate)
    expect(endPicker2.prop('value')).toEqual(newDate)
  })
})
