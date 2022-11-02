import { DateRangePicker } from 'react-date-range';
import {useState} from 'react'
import { DateRange } from 'react-date-range';


const DatePicker = ({open, disabledDates}) => {
    const [state, setState] = useState([
        {
        startDate: new Date(),
        endDate: null,
        key: 'selection'
        }
    ]);
    console.log(open)
    if (!open) {
        console.log('ey')
        return null;
    }

    return (
        <DateRange
            editableDateInputs={true}
            onChange={item => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
        />
    )
    
}

export default DatePicker;
