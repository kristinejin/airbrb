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


const FilterDialog = ({handleClick, open, handleApply}) => {
    const [minBedroom, setMinBedroom] = React.useState(0);
    const [maxBedroom, setMaxBedroom] = React.useState(0);
    const [openCalender, setOpenCalender] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    console.log(fullScreen)
    if (!open) {
        return null;
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
                        - Order don't matter for the same rating listings
                */}
                
                <Grid2 container>
                    <Grid2 xs={12}>
                        <Button
                            onClick={() => {setOpenCalender(openCalender ? false : true)}}
                        >
                            <CalendarMonthIcon/>
                            <Typography>Dates</Typography>
                        </Button>

                    </Grid2>
                    <Grid2
                        xs={12}
                        sx={{
                            display:'flex',
                            flexDirection: 'column',
                            alignItems:'center'
                        }}
                    >
                        <DatePicker open={openCalender}/>
                        
                    </Grid2>
                </Grid2>  
                <Grid2 container spacing={1}>
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

                <Grid2>
                    {/* <DatePicker /> */}
                </Grid2>
                {/* <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={value1}
                    onChange={handleChange1}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    disableSwap
                /> */}
                
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClick}>
                Cancel
                </Button>
                <Button onClick={() => handleApply({minBed: minBedroom, maxBed: maxBedroom})}>Apply</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FilterDialog;