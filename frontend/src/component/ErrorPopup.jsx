import React from "react";
import { Alert } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
export const ErrorPopup = ({ errMsg, setMsg }) => {
    const [open, setOpen] = React.useState(true);

    return (
        <Dialog
            // severity="error"
            open={open}
            onClose={() => {
                setOpen(false);
                setMsg(false);
            }}
        >
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={setOpen(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography>Something Went Wrong</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography>{errMsg}</Typography>
            </DialogContent>
        </Dialog>
    );
};
