import React from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import PropTypes from 'prop-types';

const imageStyle = {
  width: '100%',
  height: 'auto'
}

const ImageListElement = ({ image, i }) => {
  return (
    <ImageListItem key={i}>
      <img
        id={ `image-${i}` }
        src={image}
        style={imageStyle}
        alt='listing images'
        loading='loading...'
      />
    </ImageListItem>
  );
}

ImageListElement.propTypes = {
  image: PropTypes.string,
  i: PropTypes.number
};

export default ImageListElement;
