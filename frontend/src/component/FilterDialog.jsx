import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
// import { DatePicker } from '@atlaskit/datetime-picker';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import DatePicker from './DatePicker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { apiCall } from '../util/api';


const FilterDialog = ({handleClick, open, handleApply, priceInfo}) => {
    const [minBedroom, setMinBedroom] = React.useState(null);
    const [maxBedroom, setMaxBedroom] = React.useState(null);
    const [dateRange, setDateRange] = React.useState({"start": null, "end": null});
    const [minPrice, setMinPrice] = React.useState(priceInfo.min);
    const [maxPrice, setMaxPrice] = React.useState(priceInfo.max);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOnChangeDateStart = (newDate) => {
        const curr = dateRange;
        curr.start = newDate
		setDateRange(curr);
    }

    const handleOnChangeDateEnd = (newDate) => {
        const curr = dateRange;
        curr.end = newDate
		setDateRange(curr);
    }
    
    console.log(fullScreen)
    if (!open) {
        return null;
    }

    const cleanData = () => {
        const bedroom = {
            isFilter: false
        }
        if (minBedroom && maxBedroom) {
            bedroom.isFilter = true
            bedroom.min = minBedroom
            bedroom.max = maxBedroom
        }

        const date = {
            isFilter: false
        }
        if (dateRange.start && dateRange.end) {
            date.isFilter = true
            date.dateRange = dateRange;
        }

        const price = {
            isFilter: false
        }
        if (parseInt(minPrice) !== parseInt(priceInfo.min) || parseInt(maxPrice) !== parseInt(priceInfo.max)) {
            price.isFilter = true
            price.min = parseInt(minPrice)
            price.max = parseInt(maxPrice)
        }

        handleApply(bedroom, date, price)
    }
    const minDistance = 10;
    const handlePriceChange = (e, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
    
        if (activeThumb === 0) {
            setMinPrice(Math.min(newValue[0], maxPrice - minDistance))
            setMaxPrice(maxPrice)
            // setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
        } else {
            setMinPrice(minPrice)
            setMaxPrice(Math.max(newValue[1], minPrice + minDistance))
            // setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
        }
    }

    return (
        <Dialog
            // sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            // maxWidth="xs"
            fullScreen={fullScreen}
            // TransitionProps={{ onEntering: handleClick }}
            open={open}
        >
            <DialogTitle>Filters</DialogTitle>
            <DialogContent dividers>
                {/* 
                    Filter
                    1. Number of bedrooms (slider) (UI done)
                    2. Date range (two dates) - only display available listings

                    Sorting
                    1. Most relevant
                    2. Price (lowest - highest, slider)
                    3. Review Ratings
                        - Sort from height - lowerest and vice versa
                        - Order don't matter for the same rated listings
                */}
                
                <Grid2 container spacing={2}>
                    <Grid2 container>
                        <Grid2
                            xs={4}
                            sx={{
                                display: 'flex',
                                alignItems: "center"
                            }}
                        >
                            <Typography>Date Range:</Typography>
                        </Grid2>
                        <Grid2
                            xs={8}
                        >
                            <DatePicker 
                                dateRange={dateRange} 
                                handleOnChangeDateStart={handleOnChangeDateStart} 
                                handleOnChangeDateEnd={handleOnChangeDateEnd}
                            />
                        </Grid2>
                    </Grid2>
                    <Grid2 container spacing={1.5}>
                        <Grid2
                            xs={4}
                            sx={{
                                display: 'flex',
                                alignItems: "center"
                            }}
                        >
                            <Typography>
                                Bedrooms:
                            </Typography>
                        </Grid2>
                        <Grid2 xs={4}>
                            <TextField
                                size="small"
                                label='Min'
                                onChange={(e) => setMinBedroom(e.target.value)}
                            />
                        </Grid2>
                        <Grid2 xs={4}>
                            <TextField
                                size="small"
                                label='Max'
                                onChange={(e) => setMaxBedroom(e.target.value)}
                            />
                        </Grid2>
                    </Grid2>

                    <Grid2 container xs={12}>
                        <Grid2 xs={4}>
                            <Typography>
                                Price:
                            </Typography>
                        </Grid2>

                        <Grid2 xs={8}>
                            <Slider
                                getAriaLabel={() => 'Minimum distance'}
                                value={[minPrice, maxPrice]}
                                onChange={handlePriceChange}
                                valueLabelDisplay="auto"
                                max={priceInfo.max}
                                min={priceInfo.min}
                                // step={1}
                                // valueLabelDisplay="on"
                                disableSwap
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>
                
                
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClick}>
                    Cancel
                </Button>
                <Button onClick={handleClick}>
                    Clean Filters
                </Button>
                <Button onClick={cleanData}>Apply</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FilterDialog;