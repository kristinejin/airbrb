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

import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

import { useState, useEffect } from 'react';
import { Box, flexbox } from '@mui/system';
import { Grid } from '@mui/material';

import { fileToDataUrl } from '../util/fileToUrl';


const CreateDialog = ({callCreateListing}) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postcode, setPostcode] = useState('');
    const [country, setCountry] = useState('');
    
    const [type, setType] = useState('Other');
    const [amenities, setAmenities] = useState('');
    const [bathrooms, setBathrooms] = useState(0);
    const [roomList, setRoomList] = useState([
        {
            numBeds: null,
            roomType: '',
            index: 0
        }
    ]);

    

    // const [isDisabled, setIsDisabled] = useState(false)

    // List of rooms in the property
    

    const handleRoomAdd = () => {
        setRoomList([
            ...roomList,
            {
                numBeds: null,
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
        console.log(newRoomList)
        setRoomList(newRoomList)
    }

    const handleNumsBedsChange = (event, index) => {
        const numBeds = event.target.value
        const newRoomList = [...roomList]
        console.log(index)
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
        // convert data
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
                'bedrooms': roomList,
            'amenities': amenities
        }
        }
        callCreateListing(data);
    }

 
	return (
        <Box
            sx={{
                alignSelf: 'center',
                width: '80%',
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
            >
            
                <Grid2 xs={6} md={8}>
                    <TextField fullWidth label="Title" onChange={(e) => setTitle(e.target.value)}/>
                </Grid2>

                <Grid2 xs={6} md={4}>
                    <OutlinedInput
                        fullWidth
                        id="outlined-adornment-amount"
                        // value={values.amount}
                        onChange={e => setPrice(e.target.value)}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label="Amount"
                    />
                </Grid2>
                    

                <Grid2 xs={12}>
                    <TextField fullWidth label="Address Line" onChange={(e) => setStreet(e.target.value)}/>
                </Grid2>
                
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="City/Suburb" onChange={(e) => setCity(e.target.value)}/>
                </Grid2>
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="State" onChange={(e) => setState(e.target.value)}/>
                </Grid2>
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="Postcode" onChange={(e) => setPostcode(e.target.value)}/>
                </Grid2>
                <Grid2 xs={6} md={3}>
                    <TextField fullWidth label="Country" onChange={(e) => setCountry(e.target.value)}/>
                </Grid2>

                <Grid2 xs={12} md={6}>
                    <InputLabel id="PropertyTypeLabel">Property Type</InputLabel>
                    <Select
                        fullWidth
                        labelId="PropertyTypeLabel"
                        id="PropertyType"
                        value={type}
                        label="Type"
                        onChange={handleTypeChange}
                    >
                        <MenuItem value={'House'}>House</MenuItem>
                        <MenuItem value={'Apartment'}>Apartment</MenuItem>
                        <MenuItem value={'Room'}>Single Room</MenuItem>
                        <MenuItem value={'Other'}>Other</MenuItem>
                    </Select>
                </Grid2>

                <Grid2 xs={12} md={6}>
                    <TextField fullWidth label="Number of Bathrooms" onChange={(e) => setBathrooms(e.target.value)}/>
                </Grid2>

                <Grid2 xs={12}>
                    <TextField fullWidth label="Amenities" onChange = {handleAmenitiesChange}/>
                </Grid2>

                {/* add bedrooms */}

                <div>
                    
                    {roomList.map((room, i) => {
                        console.log(room)
                        return (
                            <div>
                                <TextField
                                    onChange={(e) => {handleRoomTypeChange(e, i)}}
                                    value={room.roomType}
                                    id={i}
                                    label='Type of Room'
                                ></TextField>
                                <TextField
                                    onChange={(e) => {handleNumsBedsChange(e, i)}}
                                    value={room.numBeds}
                                    id={i}
                                    label='Number of beds'
                                ></TextField>
                                <Button onClick={(e) => {handleRoomRemove(e, i)}}>Remove</Button>
                            </div>
                        )
                    })}
                    <Button onClick={handleRoomAdd}>Add</Button>
                    
                </div>

                
                <Grid2 xs={12} md={6}>
                    Upload image for the property
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
            </Grid2>
            <Button fullWidth onClick={setNewListingData}>
                Save
            </Button>
        </Box>
	)
}


export default CreateDialog;