import React, { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import FormControl from '@mui/material/FormControl'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import IconButton from '@mui/material/IconButton'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import { Box } from '@mui/system'

import { fileToDataUrl } from '../util/fileToUrl'
import EditImageList from './HostedListingImageList.jsx'
import { defaultThumbnail } from '../util/defaultThumbnail'
import PropTypes from 'prop-types'

const imageStyle = {
  width: '20vw',
  height: 'auto',
}

const CreateDialog = ({ callCreateListing, listingInfo }) => {
  const [title, setTitle] = useState(listingInfo ? listingInfo.title : '')
  const [price, setPrice] = useState(listingInfo ? listingInfo.price : '')
  const [thumbnail, setThumbnail] = useState(
    listingInfo ? listingInfo.thumbnail : defaultThumbnail
  )
  const [street, setStreet] = useState(
    listingInfo ? listingInfo.address.street : ''
  )
  const [city, setCity] = useState(listingInfo ? listingInfo.address.city : '')
  const [state, setState] = useState(
    listingInfo ? listingInfo.address.state : ''
  )
  const [postcode, setPostcode] = useState(
    listingInfo ? listingInfo.address.postcode : ''
  )
  const [country, setCountry] = useState(
    listingInfo ? listingInfo.address.country : ''
  )

  const [type, setType] = useState(
    listingInfo ? listingInfo.metadata.propertyType : ''
  )
  const [amenities, setAmenities] = useState(
    listingInfo ? listingInfo.metadata.amenities : ''
  )
  const [bathrooms, setBathrooms] = useState(
    listingInfo ? listingInfo.metadata.numBaths : ''
  )
  const [images, setImages] = useState(
    listingInfo ? listingInfo.metadata.images : []
  )
  const [roomList, setRoomList] = useState(
    listingInfo
      ? listingInfo.metadata.bedrooms
      : [
          {
            numBeds: 0,
            roomType: '',
            index: 0,
          },
        ]
  )

  const [videoURL, setVideoURL] = useState(
    listingInfo ? listingInfo.metadata.video : ''
  )

  const [isVideo, setIsVideo] = useState(false)

  useEffect(() => {
    if (listingInfo) {
      document.getElementById('thumbnail').src = thumbnail
    }
  }, [thumbnail])

  const handleRoomAdd = () => {
    setRoomList([
      ...roomList,
      {
        numBeds: 0,
        roomType: '',
        index: null,
      },
    ])
  }

  const handleRoomTypeChange = (event, index) => {
    const type = event.target.value
    const newRoomList = [...roomList]
    newRoomList[index].roomType = type
    newRoomList[index].index = index + 1
    setRoomList(newRoomList)
  }

  const handleNumsBedsChange = (event, index) => {
    const numBeds = event.target.value
    const newRoomList = [...roomList]
    newRoomList[index].numBeds = numBeds
    newRoomList[index].index = index + 1
    setRoomList(newRoomList)
  }

  const handleRoomRemove = (e, index) => {
    const newList = [...roomList]
    newList.splice(index, 1)
    setRoomList(newList)
  }

  const handleTypeChange = (e) => {
    setType(e.target.value)
  }

  const updateThumbnail = (e) => {
    //  convert data
    const upload = e.target.files[0]
    fileToDataUrl(upload).then((data) => {
      setThumbnail(data)
    })
  }

  const removeThumbnail = () => {
    setThumbnail(defaultThumbnail)
    document.getElementById('thumbnail').src = thumbnail
  }

  const handleAmenitiesChange = (e) => {
    setAmenities(e.target.value)
  }

  const updateImages = async (e) => {
    const imageData = await fileToDataUrl(e.target.files[0])
    const newImages = [...images, imageData]
    setImages(newImages)
  }

  const removeImage = (i) => {
    // const newImages = [...images]
    const img = images[i]
    setImages(images.filter((image) => image !== img))
  }

  const setNewListingData = () => {
    console.log('clickd')
    const numBedrooms = roomList.length
    let totalBeds = 0
    roomList.forEach((room) => {
      totalBeds += parseInt(room.numBeds)
    })
    const data = {
      title,
      address: {
        street,
        city,
        state,
        postcode,
        country,
      },
      price: parseInt(price),
      thumbnail,
      metadata: {
        propertyType: type,
        numBaths: bathrooms,
        numBedrooms,
        numBeds: totalBeds,
        amenities,
        bedrooms: roomList,
        images,
        video: videoURL,
      },
    }
    console.log(data)
    callCreateListing(data)
  }

  const ListingEditThumbnail = () => {
    if (listingInfo) {
      return (
        <Grid2>
          <Grid2 xs={12}>
            <Typography variant="overline">Listing Thumbnail</Typography>
          </Grid2>
          <ImageListItem key={listingInfo.thumbnail} style={imageStyle}>
            <img
              id="thumbnail"
              src={listingInfo.thumbnail}
              alt="listing thumbnail"
              loading="lazy"
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              title={'Thumbnail'}
              position="top"
              actionIcon={
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={'star isisi'}
                  onClick={removeThumbnail}
                >
                  <DeleteSharpIcon />
                </IconButton>
              }
              actionPosition="right"
            />
          </ImageListItem>
        </Grid2>
      )
    }
    return null
  }

  const ListingEditImagesTitle = () => {
    if (listingInfo) {
      return (
        <Grid2 xs={12}>
          <Typography variant="overline">Property Images</Typography>
        </Grid2>
      )
    }
    return null
  }

  const ListingEditImages = () => {
    if (listingInfo) {
      if (listingInfo.metadata.images.length === 0) {
        return null
      }
      return <EditImageList images={images} removeImage={removeImage} />
    }
    return null
  }

  const ListingEditUploadImage = () => {
    if (listingInfo) {
      return (
        <Grid2 xs={12} md={6}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="imageUpload"
            onChange={updateImages}
          />
          <label htmlFor="imageUpload">
            <Button color="primary" component="span">
              Upload
            </Button>
          </label>
        </Grid2>
      )
    }

    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignSelf: 'center',
        width: '68vw',
        height: 'auto',
      }}
    >
      <Grid2
        container
        spacing={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 'auto',
          height: 'auto',
        }}
        // xs={24}
      >
        <Grid2 xs={12}>
          <Typography variant="overline">Listing Information</Typography>
        </Grid2>

        <Grid2 xs={12}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid2>

        <Grid2 xs={12}>
          <Typography variant="overline">Property Address</Typography>
        </Grid2>

        <Grid2 xs={12}>
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Address Line"
            defaultValue={street}
            required
            onChange={(e) => setStreet(e.target.value)}
          />
        </Grid2>

        <Grid2 xs={6} md={3}>
          <TextField
            fullWidth
            id="city"
            name="city"
            label="City/Suburb"
            defaultValue={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid2>
        <Grid2 xs={6} md={3}>
          <TextField
            fullWidth
            id="state"
            name="state"
            label="State"
            defaultValue={state}
            required
            onChange={(e) => setState(e.target.value)}
          />
        </Grid2>
        <Grid2 xs={6} md={3}>
          <TextField
            fullWidth
            id="postcode"
            name="postcode"
            label="Postcode"
            defaultValue={postcode}
            required
            onChange={(e) => setPostcode(e.target.value)}
          />
        </Grid2>
        <Grid2 xs={6} md={3}>
          <TextField
            fullWidth
            id="country"
            name="country"
            label="Country"
            defaultValue={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          />
        </Grid2>

        <Grid2 xs={12}>
          <Typography variant="overline">Property Information</Typography>
        </Grid2>

        <Grid2 xs={12} md={4}>
          <FormControl fullWidth required>
            <InputLabel id="PropertyTypeLabel">Property Type</InputLabel>
            <Select
              fullWidth
              labelId="PropertyTypeLabel"
              id="PropertyType"
              value={type}
              label="Property Type"
              onChange={handleTypeChange}
            >
              <MenuItem value={'House'}>House</MenuItem>
              <MenuItem value={'Apartment'}>Apartment</MenuItem>
              <MenuItem value={'Room'}>Single Room</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 xs={12} md={4}>
          <FormControl fullWidth required>
            <InputLabel htmlFor="Price">Price (per night)</InputLabel>
            <OutlinedInput
              fullWidth
              name="price"
              id="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Price per week"
              // helperText='Price per week'
            />
          </FormControl>
        </Grid2>

        <Grid2 xs={12} md={4}>
          <TextField
            fullWidth
            id="bathrooms"
            name="bathrooms"
            label="Number of Bathrooms"
            defaultValue={bathrooms}
            required
            onChange={(e) => setBathrooms(parseInt(e.target.value))}
          />
        </Grid2>

        <Grid2 xs={12}>
          <TextField
            fullWidth
            id="amenities"
            name="amenities"
            label="Amenities"
            defaultValue={amenities}
            multiline
            onChange={handleAmenitiesChange}
          />
        </Grid2>

        {/* add bedrooms */}

        <Grid2 xs={12}>
          <Typography variant="overline">Bedrooms information</Typography>
        </Grid2>

        <Grid2 xs={12} id="roomInputContainer">
          {roomList.map((room, i) => {
            return (
              <Grid2 container key={i}>
                <Grid2 xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    onChange={(e) => {
                      handleRoomTypeChange(e, i)
                    }}
                    value={room.roomType}
                    defaultValue={room.roomType}
                    name="roomType"
                    label="Type of Room"
                  ></TextField>
                </Grid2>
                <Grid2 xs={8} md={4}>
                  <TextField
                    fullWidth
                    required
                    onChange={(e) => {
                      handleNumsBedsChange(e, i)
                    }}
                    value={room.numBeds}
                    defaultValue={room.numBeds}
                    name="beds"
                    label="Number of beds"
                  ></TextField>
                </Grid2>
                <Grid2 xs={4}>
                  <Button
                    onClick={(e) => {
                      handleRoomRemove(e, i)
                    }}
                  >
                    Remove
                  </Button>
                </Grid2>
              </Grid2>
            )
          })}
          <Grid2 xs={12}>
            <Button onClick={handleRoomAdd}>Add room</Button>
          </Grid2>
        </Grid2>

        {listingInfo && <ListingEditThumbnail id="listingEditThumbnail" />}
        <Grid2 xs={12}>
          <Typography variant="overline">Upload New Thumbnail</Typography>
        </Grid2>
        <Grid2 xs={12}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontSize={'small'}>Image</Typography>
            <Switch
              id="selectThumbnailType"
              name="hey"
              checked={isVideo}
              onChange={() => setIsVideo(!isVideo)}
            />
            <Typography fontSize={'small'}>Youtube Video</Typography>
          </Stack>
        </Grid2>

        {isVideo
          ? (
          <Grid2 xs={12}>
            <TextField
              size="small"
              variant="standard"
              label="Video URL"
              value={videoURL}
              id="thumbnailUploadVideo"
              onChange={(e) => setVideoURL(e.target.value)}
            />
          </Grid2>
            )
          : (
          <Grid2 xs={12}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="thumbnailUpload"
              onChange={updateThumbnail}
            />
            <label id="thumbnailUploadButton" htmlFor="thumbnailUpload">
              <Button color="primary" component="span">
                Upload Image
              </Button>
            </label>
          </Grid2>
            )}
        {listingInfo && <ListingEditImagesTitle id="listingEditImagesTitle" />}
        <Grid2>
          <ListingEditImages />
        </Grid2>
        {listingInfo && <ListingEditUploadImage id="listingEditUploadImage" />}
        <Grid2 xs={12}>
          <ListingActionButton setNewListingData={setNewListingData} />
        </Grid2>
      </Grid2>
    </Box>
  )
}

export const ListingActionButton = ({ setNewListingData }) => {
  return (
    <Button
      id="submitCreate"
      name="submit"
      variant="outlined"
      fullWidth
      onClick={setNewListingData}
    >
      Save
    </Button>
  )
}

ListingActionButton.propTypes = {
  setNewListingData: PropTypes.func,
}

CreateDialog.propTypes = {
  callCreateListing: PropTypes.func,
  listingInfo: PropTypes.object,
}

export default CreateDialog
