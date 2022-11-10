import { getYoutubeCodeFromUrl } from "../util/youtubeCode";
import CardMedia from "@mui/material/CardMedia";
const Video = ({ url }) => {
    const codeShort = url.includes("https") ? getYoutubeCodeFromUrl(url) : url;
    return (
        <CardMedia
            component="iframe"
            src={`https://www.youtube.com/embed/${codeShort}`}
            alt="Listing thumbnail"
        />
    );
};

export default Video;
