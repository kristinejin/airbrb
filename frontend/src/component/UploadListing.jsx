import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { parseJsonFile, validateJsonFile } from '../util/jsonFileReader';
import { listingSchema, addressSchema, bedroomSchema } from '../util/schema';
import { defaultThumbnail } from '../util/defaultThumbnail';
import PropTypes from 'prop-types';

const UploadListing = ({ open, handleClose, handleCreate }) => {
  const [file, setFile] = React.useState(false);

  const updateFile = (e) => {
    setFile(e.target.files[0]);
  };
  const validateListingFile = (l) => {
    // validate each compulsory field exist
    const isValid = validateJsonFile(listingSchema, l);
    if (isValid.isError) {
      console.log(isValid.errorMsg);
      return {
        error: true,
        msg: 'Missing required fields',
      };
    }
    // validate each fields
    // address
    const isValidAddress = validateJsonFile(addressSchema, l.address);
    if (isValidAddress.isError) {
      console.log(isValidAddress.errorMsg);
      return {
        error: true,
        msg: 'Invalid address',
      };
    }
    // bedrooms
    l.bedrooms.forEach((b) => {
      const isValidBedroom = validateJsonFile(bedroomSchema, b);
      if (isValidBedroom.isError) {
        console.log(isValidBedroom.errorMsg);
        return {
          error: true,
          msg: 'Invalid bedroom information',
        };
      }
    });
    // propertyType: check matching either House/Apartment/Single Room/Other
    const re = /^(House|Apartment|Single Room|Other)$/;
    if (!l.propertyType.match(re)) {
      return {
        error: true,
        msg: "Invalid property type, property type can be 'House', 'Apartment', 'Single Room', or 'Other'",
      };
    }
    // thumbnail
    const thumbnailObj = l.thumbnail;

    if (thumbnailObj.isVideo && !thumbnailObj.video) {
      // alert(
      //   'Please add a video url for your listing thumbnail, otherwise change thumbnail to be an image'
      // );
      return {
        error: true,
        msg: 'Video url not provided when thumbnail type is video',
      };
    }
    return { error: false };
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please provide a listing data file.');
      // setErrMsg('Please provide a listing data file.');
      return;
    }
    const newListing = await parseJsonFile(file);
    const validate = validateListingFile(newListing);
    if (validate.error) {
      alert(`${validate.msg}. Please use the sample JSON file as guide.`);
      // setErrMsg(
      //   `${validate.msg}. Please use the sample JSON file as guide.`
      // );
      return;
    }

    const getNumBeds = (bedrooms) => {
      let totalBeds = 0;
      bedrooms.forEach((room) => {
        totalBeds += parseInt(room.numBeds);
      });
      return totalBeds;
    };

    const thumbnailObj = newListing.thumbnail;

    newListing.thumbnail = thumbnailObj.isVideo
      ? thumbnailObj.video
      : thumbnailObj.image;
    if (!newListing.thumbnail) {
      newListing.thumbnail = defaultThumbnail;
    }

    const data = {
      title: newListing.title,
      address: {
        street: newListing.street,
        city: newListing.city,
        state: newListing.state,
        postcode: newListing.postcode,
        country: newListing.country,
      },
      price: newListing.price,
      thumbnail: newListing.thumbnail,
      metadata: {
        propertyType: newListing.propertyType,
        numBaths: newListing.bathrooms,
        numBedrooms: newListing.bedrooms.length,
        numBeds: getNumBeds(newListing.bedrooms),
        amenities: newListing.amenities,
        bedrooms: newListing.bedrooms,
        images: [],
        video: thumbnailObj.isVideo ? thumbnailObj.video : null,
      },
    };

    handleCreate(data);
    handleClose(false);
  };

  return (
    <>
      {/* {errMsg && <ErrorPopup errMsg={errMsg} />} */}
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          <IconButton onClick={() => handleClose(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography>Sample JSON listing file: </Typography>
              <a href='sample.json' download>
                Sample.json
              </a>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography>Upload a new listing:</Typography>
              <input type='file' onChange={updateFile} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              uploadFile();
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

UploadListing.propTypes = {
  open: PropTypes.open,
  handleClose: PropTypes.handleClose,
  handleCreate: PropTypes.handleCreate
};

export default UploadListing;
