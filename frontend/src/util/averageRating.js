export const getAverageRating = (reviews) => {
  const numRatings = reviews.length;
  let ratingSum = 0;
  reviews.forEach((r) => {
    ratingSum += r.stars;
  });

  return numRatings === 0 ? 0 : (ratingSum / numRatings).toFixed(2);
};
