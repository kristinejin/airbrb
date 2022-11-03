import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
const imageStyle = {
    width: '100%',
    height: 'auto'
}

const ImageListElement = ({image, i}) => {
	return (
		<ImageListItem key={i}>
            <img
                id={`image-${i}`}
                src={image}
                style={imageStyle}
                alt='listing images'
                loading="loading..."
            />
        </ImageListItem>
	);
}

export default ImageListElement;