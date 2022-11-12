import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import React from "react";

const UploadListing = ({ open, handleClose }) => {
    const [file, setFile] = React.useState(false);
    const updateFile = (e) => {};
    const uploadFile = () => {};
    return (
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <IconButton onClick={() => handleClose(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography>Sample JSON listing file: </Typography>
                        <a href="sample.json" download>
                            Sample.json
                        </a>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography>Upload a new listing:</Typography>
                        <input type="file" onChange={updateFile} />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        handleClose(false);
                        uploadFile();
                    }}
                >
                    Cancel
                </Button>
                <Button onClick={() => handleClose(false)}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadListing;
