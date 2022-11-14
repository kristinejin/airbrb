import ImageList from '@mui/material/ImageList';
import ImageListElement from './ImageListElement';

const EditImageList = ({ images, saveImage, removeImage }) => {
    if (!images) {
        return null;
    }
    return (
        <ImageList
            sx={{
                width: 500,
                height: 'auto',
                transform: 'translateZ(0)',
            }}
            cols={3}
            rowHeight={164}
            gap={1}
            id="editImageListParent"
        >
            {images.map((image, i) => {
                return (
                    <ImageListElement image={image} i={i} removeImage={removeImage}/>
                );
            })}
        </ImageList>
    );
}

export default EditImageList;
