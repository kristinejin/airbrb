import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import FormControl from '@mui/material/FormControl';

import { useState, useEffect } from 'react';
import { Box, flexbox } from '@mui/system';
import { Grid } from '@mui/material';

import { fileToDataUrl } from '../util/fileToUrl';


const CreateDialog = ({callCreateListing, listingInfo}) => {
    const [title, setTitle] = useState(listingInfo ? listingInfo.title : '');
    const [price, setPrice] = useState(listingInfo ? listingInfo.price : '');
    const [thumbnail, setThumbnail] = useState('');

    const [street, setStreet] = useState(listingInfo ? listingInfo.address.street : '');
    const [city, setCity] = useState(listingInfo ? listingInfo.address.city : '');
    const [state, setState] = useState(listingInfo ? listingInfo.address.state : '');
    const [postcode, setPostcode] = useState(listingInfo ? listingInfo.address.postcode : '');
    const [country, setCountry] = useState(listingInfo ? listingInfo.address.country : '');
    
    const [type, setType] = useState(listingInfo ? listingInfo.metadata.propertyType : '');
    const [amenities, setAmenities] = useState(listingInfo ? listingInfo.metadata.amenities : '');
    const [bathrooms, setBathrooms] = useState(listingInfo ? listingInfo.metadata.numBaths : '');
    const [roomList, setRoomList] = useState(listingInfo ? listingInfo.metadata.bedrooms :[
        {
            numBeds: 0,
            roomType: '',
            index: 0
        }
    ]);


    const handleRoomAdd = () => {
        setRoomList([
            ...roomList,
            {
                numBeds: 0,
                roomType: '',
                index: null
            }
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
        setType(e.target.value);
    }

    const updateThumbnail = (e) => {
        //  convert data
        const image = fileToDataUrl(e.value.target)
        setThumbnail(image)

    }

    const handleAmenitiesChange = (e) => {
        setAmenities(e.target.value)
    }

    const setNewListingData = () => {
        const numBedrooms = roomList.length;
        let totalBeds = 0;
        roomList.forEach(room => {
            totalBeds += parseInt(room.numBeds)
        })
        const data = {
            "title": title,
            "address": {
                street: street,
                city: city,
                state: state,
                postcode: postcode,
                country: country
            },
            "price": price,
            "thumbnail": thumbnail,
            "metadata": {
                'propertyType': type,
                'numBaths': bathrooms,
                'numBedrooms': numBedrooms,
                'numBeds': totalBeds,
                'amenities': amenities,
                'bedrooms': roomList,
                'images': []
            },
        }
        callCreateListing(data);
    }

 
	return (
        <Box
            sx={{
                display: 'flex',
                alignSelf: 'center',
                width: '60%',
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
                    <Typography variant="overline">
                        Listing Information
                    </Typography>
                </Grid2>

                <Grid2 xs={12}>
                    <TextField fullWidth label="Title" defaultValue={ title }
                        onChange={(e) => setTitle(e.target.value)}/>
                </Grid2>

                
                    
                <Grid2 xs={12}>
                    <Typography variant="overline">
                        Property Address
                    </Typography>
                </Grid2>

                <Grid2 xs={12}>
                    <TextField fullWidth label="Address Line" defaultValue={ street } required
                        onChange={(e) => setStreet(e.target.value)}/>
                </Grid2>
                
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="City/Suburb" defaultValue={ city } required
                        onChange={(e) => setCity(e.target.value)}/>
                </Grid2>
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="State" defaultValue={ state } required
                        onChange={(e) => setState(e.target.value)}/>
                </Grid2>
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="Postcode" defaultValue={ postcode } required
                        onChange={(e) => setPostcode(e.target.value)}/>
                </Grid2>
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="Country" defaultValue={ country } required
                        onChange={(e) => setCountry(e.target.value)}/>
                </Grid2>

                

                <Grid2 xs={12}>
                    <Typography variant="overline">
                        Property Information
                    </Typography>
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
                            id="Price"
                            value={price.toString()}
                            onChange={e => setPrice(e.target.value)}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Price per week"
                            // helperText='Price per week'
                        />
                    </FormControl>
                </Grid2>

                <Grid2 xs={12} md={4}>
                    <TextField fullWidth label="Number of Bathrooms" defaultValue={ bathrooms } required
                        onChange={(e) => setBathrooms(parseInt(e.target.value))}/>
                </Grid2>

                

                <Grid2 xs={12}>
                    <TextField fullWidth label="Amenities" defaultValue={ amenities }
                        multiline onChange = {handleAmenitiesChange}/>
                </Grid2>

                {/* add bedrooms */}

                <Grid2 xs={12}>
                    <Typography variant="overline">
                        Bedrooms information
                    </Typography>
                </Grid2>

                <Grid2 xs={12}>
                    
                    {roomList.map((room, i) => {
                        return (
                            <Grid2 container key={i}>
                                <Grid2 xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        required
                                        onChange={(e) => {handleRoomTypeChange(e, i)}}
                                        value={room.roomType}
                                        defaultValue={ room.roomType }
                                        id={i}
                                        label='Type of Room'
                                    ></TextField>
                                </Grid2>
                                <Grid2 xs={8} md={4}>
                                    <TextField
                                        fullWidth
                                        required
                                        onChange={(e) => {handleNumsBedsChange(e, i)}}
                                        value={room.numBeds.toString()}
                                        defaultValue={ room.numBeds }
                                        id={i}
                                        label='Number of beds'
                                    ></TextField>
                                </Grid2>
                                <Grid2 xs={4}>
                                    <Button onClick={(e) => {handleRoomRemove(e, i)}}>
                                        Remove
                                    </Button>
                                </Grid2>
                            </Grid2>
                        )
                    })}
                    <Grid2>
                        <Button onClick={handleRoomAdd}>
                            Add
                        </Button>
                    </Grid2>
                    
                </Grid2>

                {() => {
                    if (!listingInfo) {
                        return (
                            <Grid2 xs={12} md={6}>
                                <Typography variant="overline" fullWidth>
                                    Upload an image for the property
                                </Typography>
                            </Grid2>
                        )
                    }
                }}
                {() => {
                    if (!listingInfo) {
                        return (
                            <Grid2 xs={12} md={6}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="contained-Button-file"
                                    onChange={updateThumbnail}
                                />
                                <label htmlFor="contained-Button-file">
                                    <Button color="primary" component="span">
                                        Upload
                                    </Button>
                                </label>
                            </Grid2>
                        )
                    }
                }}
                
                <Grid2 xs={12}>
                    <Button variant='outlined' fullWidth onClick={setNewListingData}>
                        Save
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
	)
}


export default CreateDialog;