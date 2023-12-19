import { Button } from "reactstrap";
import styles from "./UpdateAlbumModal.module.css"
import Box from '@mui/material/Box';
import React from "react";

const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  const UpdateAlbumModal = React.forwardRef(({ onClose }, ref) => {

    const handleCancle = () => {
        onClose();
    }

    return (
        <Box sx={ModalStyle} ref={ref}>
            
            <Button onClick={handleCancle}>Close</Button>
        </Box>
    );
});

export default UpdateAlbumModal;