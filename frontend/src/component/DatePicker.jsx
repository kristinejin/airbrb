import { DateRangePicker } from 'react-date-range';
import React from 'react';
import {useState} from 'react';
import { DateRange } from 'react-date-range';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid2 from '@mui/material/Unstable_Grid2';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const DatePicker = ({dateRange, handleOnChangeDateStart, handleOnChangeDateEnd}) => {
    const [start, setStart] = React.useState(dateRange.start);
    const [end, setEnd] = React.useState(dateRange.end);
    return (
        <Grid2 
            sx={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px'
            }
        }>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DesktopDatePicker
                    label="CHECK IN"
                    inputFormat="MM/DD/YYYY"
                    value={start}
                    onChange={(newVal) => {
                        handleOnChangeDateStart(newVal);
                        // compare dates
                        setStart(newVal);
                        if (newVal > end) {
                            setEnd(newVal)
                            handleOnChangeDateEnd(newVal)
                        }
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Typography> - </Typography>
                <DesktopDatePicker
                    label="CHECK OUT"
                    inputFormat="MM/DD/YYYY"
                    value={end}
                    onChange={(newVal) => {
                        handleOnChangeDateEnd(newVal)
                        setEnd(newVal);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </Grid2>
    )
    
}



export default DatePicker;
