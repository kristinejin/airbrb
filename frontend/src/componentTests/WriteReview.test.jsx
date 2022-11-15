import React from 'react';
import { render, screen } from '@testing-library/react';
import WriteReviewModal, { SubmitButton } from '../component/WriteReviewModal';
import { shallow } from 'enzyme';

describe('WriteReview', () => {
  const noop = () => {};
  it('renders review dialog', () => {
    render(<WriteReviewModal open={true} setOpen={noop} reviews={[]} setReviews={noop} bookingId={1} listingId={1} refresh={noop}/>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/how was your trip\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
  });

  it('triggers submit onclick', () => {
    const click = jest.fn();
    const wrapper = shallow(<SubmitButton onClick={click}/>);
    wrapper.simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
  })
})
