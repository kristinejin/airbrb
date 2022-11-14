import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListElement from './ImageListElement';
import PropTypes from 'prop-types';

const EditImageList = ({ images, saveImage, removeImage }) => {
  if (!images) {
    return null;
  }
  return (
    <ImageList
      sx={{
        width: 500,
        height: 'auto',
        transform: 'translateZ(0)',
      }}
      cols={3}
      rowHeight={164}
      gap={1}
      id="editImageListParent"
      >
      {images.map((image, i, index) => {
        return (
          <ImageListElement key={index} image={image} i={i} removeImage={removeImage}/>
        );
      })}
    </ImageList>
  );
}

EditImageList.propTypes = {
  images: PropTypes.array,
  saveImage: PropTypes.func,
  removeImage: PropTypes.func
};

export default EditImageList;
