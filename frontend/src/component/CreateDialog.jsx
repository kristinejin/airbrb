import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/system';

import { useState } from 'react';

import { fileToDataUrl } from '../util/fileToUrl';


const CreateDialog = ({callCreateListing, listingInfo}) => {

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

    if (listingInfo) {
        setTitle(listingInfo.title);
        setPrice(listingInfo.price);
        //setThumbnail(listingInfo.thumbnail); // hmm
        setStreet(listingInfo.address.street);
        setCity(listingInfo.address.city);
        setState(listingInfo.address.state);
        setPostcode(listingInfo.address.postcode);
        setCountry(listingInfo.address.country)
        setType(listingInfo.metadata.propertyType);
        setAmenities(listingInfo.metadata.amenities);
        setBathrooms(listingInfo.metadata.numBaths);
        // loop to set bedrooms
    }

    

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
        // TODO: ensure each room element is not empty?
        // 1. get beds num
        // 2. get num rooms
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
                'bedrooms': roomList
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
                    <TextField fullWidth label="Title" helperText='Give your listing a title'
                        onChange={(e) => setTitle(e.target.value)}/>
                </Grid2>

                
                    
                <Grid2 xs={12}>
                    <Typography variant="overline">
                        Property Address
                    </Typography>
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

                

                <Grid2 xs={12}>
                    <Typography variant="overline">
                        Property Information
                    </Typography>
                </Grid2>
                
                <Grid2 xs={12} md={4}>
                    <FormControl fullWidth>
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
                    <TextField fullWidth label="Number of Bathrooms" onChange={(e) => setBathrooms(e.target.value)}/>
                </Grid2>

                <Grid2 xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="Price">Price (per night)</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="Price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Price per week"
                            // helperText='Price per week'
                        />
                    </FormControl>
                </Grid2>

                <Grid2 xs={12}>
                    <TextField fullWidth label="Amenities" multiline onChange = {handleAmenitiesChange}/>
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
                            <Grid2 container>
                                <Grid2 xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        onChange={(e) => {handleRoomTypeChange(e, i)}}
                                        value={room.roomType}
                                        id={i}
                                        label='Type of Room'
                                    ></TextField>
                                </Grid2>
                                <Grid2 xs={8} md={4}>
                                    <TextField
                                        fullWidth
                                        onChange={(e) => {handleNumsBedsChange(e, i)}}
                                        value={room.numBeds}
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

                
                <Grid2 xs={12} md={6}>
                    <Typography variant="overline">
                        Upload an image for the property
                    </Typography>
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