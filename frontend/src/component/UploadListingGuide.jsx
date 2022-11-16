import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import PropTypes from 'prop-types'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogActions from '@mui/material/DialogActions'
// import IconButton from '@mui/material/IconButton'
// import Button from '@mui/material/Button'

const UploadGuide = ({ open, onClose }) => {
  return (
    <Dialog open={open}>
      <DialogContent>Hello</DialogContent>
    </Dialog>
  )
}

UploadGuide.propTypes = {
  open: PropTypes.boolean,
  onClose: PropTypes.func,
}

export default UploadGuide
