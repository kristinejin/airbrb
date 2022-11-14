import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid2 from '@mui/material/Unstable_Grid2';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';

const CustomDatePicker = ({
  dateRange,
  handleOnChangeDateStart,
  handleOnChangeDateEnd,
  availability,
}) => {
  const [start, setStart] = React.useState(dateRange.start);
  const [end, setEnd] = React.useState(dateRange.end);
  const parseAvailability = () => {
    const list = [];
    if (!availability) {
      return [];
    }
    availability.forEach((a) => {
      let start = new Date(a.start);
      const end = new Date(a.end);
      while (start <= end) {
        const date = new Date(start);
        list.push(date.toISOString().split('T')[0]);
        start = date.getDate() + 1;
      }
    });
    return list;
  };

  const avaiList = parseAvailability();

  const getDisabledDates = (date) => {
    const ISODate = date.toISOString().split('T')[0];
    if (!availability) {
      return false;
    }

    if (avaiList.includes(ISODate)) {
      return false;
    }
    return true;
  };

  return (
    <Grid2
      fullWidth
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          fullWidth
          label='CHECK IN'
          inputFormat='MM/DD/YYYY'
          value={start}
          onChange={(newVal) => {
            handleOnChangeDateStart(newVal);
            // compare dates
            setStart(newVal);
            if (newVal > end) {
              setEnd(newVal);
              handleOnChangeDateEnd(newVal);
            }
          }}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) => getDisabledDates(date)}
          disablePast={true}
        />
        <Typography> - </Typography>
        <DatePicker
          fullWidth
          label='CHECK OUT'
          inputFormat='MM/DD/YYYY'
          value={end}
          onChange={(newVal) => {
            handleOnChangeDateEnd(newVal);
            setEnd(newVal);
          }}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={(date) => getDisabledDates(date)}
          disablePast={true}
        />
      </LocalizationProvider>
    </Grid2>
  );
};

CustomDatePicker.propTypes = {
  dateRange: PropTypes.images,
  handleOnChangeDateStart: PropTypes.saveImage,
  handleOnChangeDateEnd: PropTypes.removeImage,
  availability: PropTypes.removeImage
};

export default CustomDatePicker;
