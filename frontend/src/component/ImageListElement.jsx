import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

const ImageListElement = ({ image, i, removeImage }) => {
    return (
        <ImageListItem key={i}>
            <img
                id={`image-${i}`}
                src={image}
                // style={imageStyle}
                alt='listing images'
                loading="loading..."
            />
            <ImageListItemBar
                sx={{
                    background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                position="top"
                actionIcon={
                    <IconButton
                        sx={{ color: 'white' }}
                        aria-label={'star isisi'}
                        onClick={() => removeImage(i)}
                    >
                        <DeleteSharpIcon />
                    </IconButton>
                }
                actionPosition="right"
            />
        </ImageListItem>
    );
}

export default ImageListElement;
