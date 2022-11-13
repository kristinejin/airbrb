import { getYoutubeCodeFromUrl } from "../util/youtubeCode";

const Youtube = ({ code }) => {
    // const { getters, setters } = useContext(Context);

    // const factor = isMobileWidth() ? 0.8 : isDesktopWidth() ? 0.91 : 0.88;
    // const width = window.innerWidth * factor - (getters.sidebarOpen ? 230 : 0);
    const width = "400";

    const codeShort = code.includes("https")
        ? getYoutubeCodeFromUrl(code)
        : code;

    return (
        <>
            <div style={{ margin: "0 auto", textAlign: "center" }}>
                <iframe
                    width={width}
                    height={Math.round((9 / 16) * width)}
                    src={`https://www.youtube.com/embed/${codeShort}`}
                    frameBorder="0"
                    allowFullScreen
                    style={{ margin: "25px 10px" }}
                ></iframe>
            </div>
        </>
    );
};

export default Youtube;
