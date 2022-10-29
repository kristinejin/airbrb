import React from "react";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function FullScreenDialog() {
    // const [open, setOpen] = React.useState(true);
    // const handleClose = () => {
    //     setOpen(false);
    // }
    return (
        <div>
        <Dialog
            fullScreen
            open={true}
            // onClose={handleClose}
            TransitionComponent={Transition}
        >
        </Dialog>
        </div>
    );
}

// const ListingCreate = () =>{
//     console.log('helo')
//     const [open, setOpen] = React.useState(false);

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <div>
//       <Button variant="outlined" onClick={handleClickOpen}>
//         Open full-screen dialog
//       </Button>
//       <Dialog
//         fullScreen
//         open={open}
//         onClose={handleClose}
//         TransitionComponent={Transition}
//       >
//       </Dialog>
//     </div>
//     )
// }

// export default ListingCreate;