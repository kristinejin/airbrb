import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewModal from '../component/ReviewModal';

describe('ReviewModal', () => {
  const noop = () => {};
  it('renders review modal with write review button', () => {
    render(<ReviewModal open={true} setOpen={noop} listingId={1} refresh={noop} reviewsToShow={[]}/>);
    expect(screen.getByText(/0 \| 0 reviews/i)).toBeInTheDocument();
    // Check the write review button exists
    expect(screen.queryByText(/write review/i)).toBeInTheDocument();
  });

  it('renders review modal with no write review button', () => {
    render(<ReviewModal open={true} setOpen={noop} listingId={1} refresh={null} reviewsToShow={[]}/>);
    expect(screen.getByText(/0 \| 0 reviews/i)).toBeInTheDocument();
    // Check that the write review button does not exist
    expect(screen.queryByText(/write review/i)).toBeNull();
  });

  it('renders multiple reviews', () => {
    const reviewsToShow = [
      { email: 'person1@gmail.com', message: 'terrible', stars: 1, postedOn: '2022-11-15T08:56:17.810Z' },
      { email: 'person2@gmail.com', message: 'bad', stars: 2, postedOn: '2022-11-15T08:56:17.810Z' },
      { email: 'person3@gmail.com', message: 'good', stars: 5, postedOn: '2022-11-15T08:56:17.810Z' }
    ];
    render(<ReviewModal open={true} setOpen={noop} listingId={1} refresh={noop} reviewsToShow={reviewsToShow}/>);
    // Check correct average rating and correct number of reviews
    expect(screen.getByText(/2\.67 \| 3 reviews/i)).toBeInTheDocument();
    // Check correct emails
    expect(screen.getByText(/person1@gmail\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/person2@gmail\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/person3@gmail\.com/i)).toBeInTheDocument();
    // Check correct messages
    expect(screen.getByText(/terrible/i)).toBeInTheDocument();
    expect(screen.getByText(/bad/i)).toBeInTheDocument();
    expect(screen.getByText(/good/i)).toBeInTheDocument();
  });
})
