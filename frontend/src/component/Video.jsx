import { getYoutubeCodeFromUrl } from "../util/youtubeCode";
import CardMedia from "@mui/material/CardMedia";
import AspectRatio from "@mui/joy/AspectRatio";
const Video = ({ url }) => {
    const codeShort = url.includes("https") ? getYoutubeCodeFromUrl(url) : url;
    return (
        <AspectRatio>
            <CardMedia
                component="iframe"
                src={`https://www.youtube.com/embed/${codeShort}`}
                alt="Listing thumbnail"
            />
        </AspectRatio>
    );
};

export default Video;
